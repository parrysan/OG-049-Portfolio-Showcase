#!/usr/bin/env node
// Build one case study's HTML deck from its case file.
// Usage: node build.mjs cases/<slug>.json
// Output: the self-contained HTML named in case.output.html (relative to this folder). CSS and JS are inlined;
// images and fonts load from the assets folder next to the HTML.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { esc, renderSlide } from "./template/render-html.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const casePath = resolve(process.argv[2] ?? "cases/mabv.json");
const data = JSON.parse(readFileSync(casePath, "utf8"));
const c = data.case;
const out = resolve(here, c.output.html);

const FRAME_FONTS = [
  { family: "Open Sans", src: "assets/fonts/open-sans-latin-400-normal.woff2", weight: "400" },
  { family: "Open Sans", src: "assets/fonts/open-sans-latin-600-normal.woff2", weight: "600" },
  { family: "Open Sans", src: "assets/fonts/open-sans-latin-700-normal.woff2", weight: "700" },
];
const fontFace = (f) => `@font-face{font-family:"${f.family}";src:url("${f.src}") format("woff2");font-weight:${f.weight};font-display:swap}`;
const theme = Object.entries(c.theme).map(([k, v]) => `--w-${k}:${v}`).join(";");

const css = [
  ...FRAME_FONTS.map(fontFace),
  ...(c.fonts ?? []).map(fontFace),
  `:root{${theme}}`,
  readFileSync(resolve(here, "template/deck.css"), "utf8"),
].join("\n");
const js = readFileSync(resolve(here, "template/deck.js"), "utf8");

const n = data.slides.length;
const slides = data.slides.map((s, i) => renderSlide(c, s, i, n)).join("\n\n");
const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
const favicon = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="8 9 16 15"><path fill="#109200" d="M9 22c0-6 4-11 14-12-1 9-6 13-12 13-.7 0-1.4-.1-2-.3z"/></svg>');
const pdfName = c.output.pdf.split("/").pop();
const pptxName = c.output.pptx.split("/").pop();

const contract = `<!-- DIRECTION CONTRACT (design-impeccable)
THESIS: The work is the evidence. One idea per slide, the real artwork at full size; refuses the pitch-deck grid of small screenshots and generic gradients.
OWN-WORLD: OGANIKO frame (ODS Open Sans, black on white, hairlines, square corners, leaf rail) holding the client's own palette (${c.theme.accent} on ${c.theme.surface}), marks placed from vector files, never redrawn.
STORY: A visitor sees what was made, why each decision was taken, that it is installed in the world, and who to contact.
FIRST VIEWPORT: Cover. Vector lockup large on white, top left; descriptor line beneath; meta row (client, scope, year, role); office photo as a full-height panel on the right. Navigation sits bottom right; keys move slides.
FORM: Captain-pinned direction (Phase 1 plan approved 4 Nov 2026); no concept roll. Signature: the mark's anatomy draws its leader lines on slide 3.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

const html = `<!doctype html>
<html lang="${esc(c.lang ?? "en")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(c.pageTitle)}</title>
<meta name="description" content="${esc(c.description)}">
<meta name="robots" content="noindex">
<link rel="icon" href="${favicon}">
<style>
${css}
</style>
</head>
<body style="--w-accent:${c.theme.accent}">
${contract}
<header class="deck-header"><svg viewBox="8 9 16 15" width="18" height="17" aria-hidden="true"><path fill="#109200" d="M9 22c0-6 4-11 14-12-1 9-6 13-12 13-.7 0-1.4-.1-2-.3z"/></svg><span class="rail-brand">OGANIKO</span><span class="rail-text">${esc(c.rail)}</span></header>
<main class="viewport" id="deck">
${slides}
</main>
<nav class="deck-nav" aria-label="Slides">
<button type="button" data-prev aria-label="Previous slide">${icon("M15 18l-6-6 6-6")}</button>
<span class="count" aria-live="polite">1 / ${n}</span>
<button type="button" data-next aria-label="Next slide">${icon("M9 6l6 6-6 6")}</button>
<span class="sep" aria-hidden="true"></span>
<a href="${esc(pdfName)}" download>PDF</a>
</nav>
<footer class="deck-foot"><a href="${esc(pdfName)}" download>Download the PDF</a></footer>
<script>
${js}
</script>
</body>
</html>
`;

writeFileSync(out, html);
console.log(`Built ${out} (${n} slides, ${(html.length / 1024).toFixed(1)} KB)`);
