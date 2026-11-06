#!/usr/bin/env node
// Build an editable PPTX from a built HTML deck, placing everything where the browser rendered it.
// Usage: node pptx.mjs cases/<slug>.json      (run build.mjs first)
// How: headless Chrome opens the deck with ?print&measure, deck.js records every text block, image, fill and line
// per slide, and this script recreates them as native PowerPoint text boxes, pictures and shapes (canvas px / 144 = inches).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import pptxgen from "pptxgenjs";

const here = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(resolve(process.argv[2] ?? "cases/mabv.json"), "utf8"));
const c = data.case;
const htmlPath = resolve(here, c.output.html);
const htmlDir = dirname(htmlPath);
const outPath = resolve(here, c.output.pptx);
const cache = resolve(here, ".cache", c.slug);
mkdirSync(cache, { recursive: true });
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// 1. Measure the rendered deck.
const dom = execFileSync(chrome, ["--headless=new", "--disable-gpu", "--virtual-time-budget=12000", "--window-size=1920,1080", "--dump-dom", `${pathToFileURL(htmlPath).href}?print=1&measure=1`], { encoding: "utf8", maxBuffer: 128 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
const found = dom.match(/<script type="application\/json" id="deck-measure">([\s\S]*?)<\/script>/);
if (!found) throw new Error("No measurement found: is the deck built, and does deck.js include the ?measure mode?");
const slides = JSON.parse(found[1]);

// 2. Helpers.
const IN = (px) => +(px / 144).toFixed(4);
const PT = (px) => +(px / 2).toFixed(2);
function colour(css) {
  const m = css?.match(/rgba?\(([^)]+)\)/);
  if (!m) return { hex: "000000", alpha: 1 };
  const [r, g, b, a = 1] = m[1].split(",").map((v) => parseFloat(v));
  return { hex: [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase(), alpha: +a };
}
const transparency = (alpha) => Math.round((1 - alpha) * 100);
const size = (file) => execFileSync("magick", ["identify", "-format", "%w %h", `${file}[0]`], { encoding: "utf8" }).split(" ").map(Number);
function svgAspect(file) {
  const vb = readFileSync(file, "utf8").match(/viewBox="([^"]+)"/)?.[1].split(/[\s,]+/).map(Number);
  return vb ? vb[2] / vb[3] : 1;
}
function raster(svgFile, pxWidth, tag) {
  const out = resolve(cache, `${basename(svgFile, ".svg")}-${tag}-${pxWidth}.png`);
  if (!existsSync(out)) execFileSync("rsvg-convert", ["-w", String(pxWidth), "-o", out, svgFile]);
  return out;
}
function contain(box, aspect) {
  const boxAspect = box.w / box.h;
  if (aspect > boxAspect) { const h = box.w / aspect; return { x: box.x, y: box.y + (box.h - h) / 2, w: box.w, h }; }
  const w = box.h * aspect;
  return { x: box.x + (box.w - w) / 2, y: box.y, w, h: box.h };
}

// 3. Build.
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = c.pageTitle;
pres.author = "Phil Parry";
pres.company = "OGANIKO";
pres.subject = c.description;
pres.theme = { headFontFace: "Open Sans", bodyFontFace: "Open Sans" };
pres.defineSlideMaster({ title: "OGANIKO case slide", background: { color: "FFFFFF" } });
pres.addSection({ title: `${c.title} case study` });

let n = 0;
for (const s of slides) {
  const slide = pres.addSlide({ masterName: "OGANIKO case slide", sectionTitle: `${c.title} case study` });
  const alts = [];
  for (const it of s.items) {
    const at = { x: IN(it.x), y: IN(it.y), w: IN(it.w), h: IN(it.h) };
    if (it.t === "rect") {
      const f = colour(it.fill);
      slide.addShape(pres.shapes.RECTANGLE, { ...at, fill: { color: f.hex, transparency: transparency(f.alpha) }, line: { type: "none" } });
    } else if (it.t === "line") {
      const l = colour(it.color);
      slide.addShape(pres.shapes.LINE, { ...at, line: { color: l.hex, width: PT(it.weight), transparency: transparency(l.alpha) } });
    } else if (it.t === "dot") {
      const f = colour(it.fill), l = colour(it.stroke);
      slide.addShape(pres.shapes.OVAL, { ...at, fill: { color: f.hex }, line: { color: l.hex, width: PT(it.weight) } });
    } else if (it.t === "svg") {
      const file = resolve(cache, `inline-${n++}.svg`);
      writeFileSync(file, it.markup);
      slide.addImage({ path: raster(file, Math.round(it.w * 4), "inline"), ...at });
    } else if (it.t === "img") {
      const src = resolve(htmlDir, it.src);
      let path = src;
      let aspect;
      if (extname(src) === ".svg") {
        aspect = svgAspect(src);
        const fit = it.fit === "contain" ? contain(it, aspect) : it;
        path = raster(src, Math.max(Math.round(fit.w * 3), 240), "img");
        Object.assign(at, { x: IN(fit.x), y: IN(fit.y), w: IN(fit.w), h: IN(fit.h) });
      } else {
        const [w, h] = size(src);
        aspect = w / h;
        if (it.fit === "contain") { const fit = contain(it, aspect); Object.assign(at, { x: IN(fit.x), y: IN(fit.y), w: IN(fit.w), h: IN(fit.h) }); }
        else if (it.fit === "cover" && Math.abs(aspect - it.w / it.h) > 0.01) at.sizing = { type: "cover", w: at.w, h: at.h };
      }
      slide.addImage({ path, ...at, altText: it.alt || "" });
      if (it.alt) alts.push(it.alt);
      if (it.outline) {
        const o = colour(it.outline.color);
        slide.addShape(pres.shapes.RECTANGLE, { x: IN(it.outline.x - it.outline.weight), y: IN(it.outline.y - it.outline.weight), w: IN(it.outline.w + 2 * it.outline.weight), h: IN(it.outline.h + 2 * it.outline.weight), fill: { type: "none" }, line: { color: o.hex, width: PT(it.outline.weight) } });
      }
    } else if (it.t === "text") {
      const runs = it.runs.map((r) => {
        const col = colour(r.color);
        const o = { fontFace: r.font, fontSize: PT(r.size), bold: r.weight >= 600, color: col.hex };
        if (r.tracking) o.charSpacing = PT(r.tracking);
        if (r.href) o.hyperlink = { url: r.href.startsWith("file:") ? `https://${c.slug}` : r.href };
        if (r.font === "Noto Sans SC") o.lang = "zh-CN";
        return { text: r.text, options: o };
      });
      const slack = 8 + it.w * 0.02;
      slide.addText(runs, {
        x: IN(it.x), y: IN(it.y), w: IN(it.w + slack), h: IN(Math.max(it.h, it.lineHeight) + 4),
        margin: 0, valign: "top", isTextBox: true, fit: "none", wrap: true,
        lineSpacing: PT(it.lineHeight), paraSpaceBefore: 0, paraSpaceAfter: 0,
        align: ["center", "right"].includes(it.align) ? it.align : "left",
        objectName: /^h[12]$/.test(it.tag) ? "Title" : undefined,
      });
    }
  }
  slide.addNotes(`${s.label}${alts.length ? `\n\nImages: ${alts.join(" | ")}` : ""}`);
}

await pres.writeFile({ fileName: outPath });
console.log(`PPTX: ${outPath} (${slides.length} slides)`);
