// Slide renderers: case JSON -> HTML. One function per slide type; geometry comes from geometry.mjs.
import { RAIL, regionsFor } from "./geometry.mjs";

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Inline markup in copy: {{cn:百卫信}} sets Chinese characters in the case's CJK face.
export const rich = (s = "") => esc(s).replace(/\{\{cn:([^}]+)\}\}/g, '<span class="cn" lang="zh-Hans">$1</span>');

const pos = (b) => `--x:${b.x};--y:${b.y};--w:${b.w};--h:${b.h}`;
const region = (name, box, inner, cls = "") => `<div class="r r-${name}${cls ? " " + cls : ""}" style="${pos(box)}">${inner}</div>`;
const img = (o, extra = "") => `<img src="${esc(o.src)}" alt="${esc(o.alt ?? "")}"${extra}>`;
const deco = (src, extra = "") => `<img src="${esc(src)}" alt=""${extra}>`;
const body = (paras = []) => `<div class="body">${paras.map((p) => `<p>${rich(p)}</p>`).join("")}</div>`;
const h2 = (t) => `<h2 class="h1">${rich(t)}</h2>`;

const LEAF = '<svg viewBox="8 9 16 15" aria-hidden="true"><path d="M9 22c0-6 4-11 14-12-1 9-6 13-12 13-.7 0-1.4-.1-2-.3z"/></svg>';

function rail(c, i, n) {
  const num = (x) => String(x).padStart(2, "0");
  return `<div class="rail r" style="${pos(RAIL)}" aria-hidden="true">${LEAF}<span class="rail-brand">OGANIKO</span><span class="rail-sep"></span><span>${esc(c.rail)}</span><span class="rail-sep"></span><span class="rail-count">${num(i + 1)} / ${num(n)}</span></div>`;
}

const R = {
  cover(s, r) {
    return [
      region("art", r.art, `<h1 class="cover-title">${img(s.art)}</h1>`),
      region("lead", r.lead, `<p class="lead">${rich(s.lead)}</p>`),
      region("meta", r.meta, `<dl class="meta">${s.meta.map((m) => `<div style="--cw:${m.w ?? 240}"><dt class="label">${esc(m.k)}</dt><dd>${esc(m.v)}</dd></div>`).join("")}</dl>`),
      region("photo", r.photo, img(s.photo, ' class="photo"')),
    ];
  },

  context(s, r) {
    const d = s.decode;
    return [
      region("panel", r.panel, ""),
      region("text", r.text, `${h2(s.headline)}${body(s.body)}<p class="role push-end"><span class="label">${esc(s.role.label)}</span>${rich(s.role.text)}</p>`, "text-col"),
      region("feature", r.feature, `<dl class="decode">${d.items.map((it) => `<dt${it.accent ? ' class="is-accent"' : ""}>${esc(it.glyph)}</dt><dd>${esc(it.word)}</dd>`).join("")}</dl><p class="decode-note">${rich(d.note)}</p>`),
    ];
  },

  idea(s, r) {
    const c = s.callouts;
    const box = r.callouts;
    const lines = [];
    const labels = [];
    for (const it of c.items) {
      const y = it.y - box.y;
      const from = it.from - box.x;
      const edge = Math.max(it.edge, it.from) - box.x;
      const end = c.labelX - 20 - box.x;
      if (edge > from) lines.push(`<line class="callout-line on-art" x1="${from}" y1="${y}" x2="${edge}" y2="${y}" style="--len:${edge - from}"/>`);
      lines.push(`<line class="callout-line off-art" x1="${edge}" y1="${y}" x2="${end}" y2="${y}" style="--len:${end - edge}"/>`);
      lines.push(`<circle class="callout-dot" cx="${from}" cy="${y}" r="7"/>`);
      labels.push(`<li style="--lx:${c.labelX - box.x};--ly:${y - 15};--lw:${c.labelW}">${rich(it.text)}</li>`);
    }
    const svg = `<svg class="callout-lines" width="${box.w}" height="${box.h}" viewBox="0 0 ${box.w} ${box.h}" aria-hidden="true">${lines.join("")}</svg>`;
    return [
      region("panel", r.panel, ""),
      region("text", r.text, `${h2(s.headline)}${body(s.body)}<blockquote class="quote push-end"><p>${rich(s.quote.text)}</p><cite>${rich(s.quote.cite)}</cite></blockquote>`, "text-col"),
      region("art", r.art, img(s.art)),
      region("callouts", r.callouts, `${svg}<ul class="callout-list" aria-label="Parts of the mark">${labels.join("")}</ul>`),
    ];
  },

  strip(s, r) {
    const items = s.items
      .map((it) => `<li class="spec${it.final ? " is-final" : ""}"><div class="spec-light"><div class="mark">${img(it)}</div><div><p class="spec-name">${rich(it.name)}</p><p class="spec-group">${rich(it.group)}</p></div></div><div class="spec-dark">${deco(it.src)}</div></li>`)
      .join("");
    return [
      region("head", r.head, h2(s.headline)),
      region("text", r.text, body(s.body)),
      region("grid", r.grid, `<ul class="specimens" style="--n:${s.items.length}">${items}</ul>`),
      region("caption", r.caption, `<p class="small">${rich(s.caption)}</p>`),
    ];
  },

  colour(s, r) {
    const w = s.swatch;
    const [label, number] = (() => { const m = w.pantone.match(/^(\S+)\s+(.*)$/); return m ? [m[1], m[2]] : ["", w.pantone]; })();
    return [
      region("field", r.field, ""),
      region("spec", r.spec, `<div class="swatch-spec"><p class="pantone">${esc(label)}</p><p class="number">${esc(number)}</p><p class="name">${esc(w.name)}</p><dl>${w.specs.map((x) => `<div><dt>${esc(x.k)}</dt><dd>${esc(x.v)}</dd></div>`).join("")}</dl></div>`),
      region("text", r.text, `${h2(s.headline)}${body(s.body)}`),
      region("compare", r.compare, `<ul class="compare">${s.compare.map((x) => `<li><span class="chip" style="background:${esc(x.color)}"></span><div><strong>${esc(x.label)}</strong><span>${esc(x.value)}</span></div></li>`).join("")}</ul>`),
      region("palette", r.palette, `<ul class="palette" aria-label="Companion colours">${s.palette.map((p) => `<li><div class="chip" style="background:${esc(p.hex)}"></div><strong>${esc(p.name)}</strong><span>${esc(p.hex)}</span></li>`).join("")}</ul>`),
    ];
  },

  pair(s, r) {
    return [
      region("text", r.text, `${h2(s.headline)}${body(s.body)}`),
      region("art", r.art, img(s.art)),
      region("specimen", r.specimen, `<ul class="specimen">${s.specimen.map((x) => `<li><span class="sample" style="font-family:'${esc(x.font)}',sans-serif;font-weight:${x.weight ?? 700}"${/[㐀-鿿]/.test(x.sample) ? ' lang="zh-Hans"' : ""}>${esc(x.sample)}</span><span class="small">${esc(x.label)}</span></li>`).join("")}</ul>`),
      region("caption", r.caption, `<p class="small">${rich(s.caption)}</p>`),
      region("photo", r.photo, img(s.photo, ' class="photo"')),
    ];
  },

  system(s, r) {
    const L = s.ladder;
    const fig = (it) => `<figure>${deco(it.src, ` style="height:${it.size}px"`)}<figcaption>${it.size}</figcaption></figure>`;
    const groups = [L.items.slice(0, L.splitAfter), L.items.slice(L.splitAfter)];
    const ladder = `<div class="ladder" role="img" aria-label="The mark at 16, 24, 32, 48 and 96 pixels: the simple V below 32 pixels, the full mark from 32 pixels up">${groups.map((g, i) => `<div class="ladder-group"><div class="ladder-row">${g.map(fig).join("")}</div><p class="ladder-label">${esc(L.labels[i])}</p></div>`).join("")}</div>`;
    return [
      region("shot", r.shot, img(s.shot), "shot"),
      region("text", r.text, `${h2(s.headline)}${body(s.body)}`),
      region("ladder", r.ladder, ladder),
      region("link", r.link, `<a href="${esc(s.link.href)}">${esc(s.link.text)}</a>`),
    ];
  },

  kit(s, r) {
    return [
      region("text", r.text, `${h2(s.headline)}${body(s.body)}`),
      region("shot", r.shot, img(s.shot), "shot"),
      region("manifest", r.manifest, `<dl class="manifest">${s.manifest.map((m) => `<div><dt class="label">${esc(m.group)}</dt>${m.items.map((x) => `<dd>${esc(x)}</dd>`).join("")}</div>`).join("")}</dl>`),
      region("quote", r.quote, `<blockquote class="quote"><p>${rich(s.quote.text)}</p><cite>${rich(s.quote.cite)}</cite></blockquote>`),
    ];
  },

  gallery(s, r) {
    return [
      region("head", r.head, h2(s.headline)),
      region("photos", r.photos, `<ul class="gallery">${s.photos.map((p) => `<li>${img(p)}</li>`).join("")}</ul>`),
      region("caption", r.caption, `<div class="gallery-caption">${s.caption.map((p) => `<p>${rich(p)}</p>`).join("")}<p class="credit">${rich(s.credit)}</p></div>`),
    ];
  },

  close(s, r) {
    const c = s.contact;
    return [
      region("panel", r.panel, ""),
      region("text", r.text, `${h2(s.headline)}<ul class="delivered">${s.list.map((x) => `<li>${rich(x)}</li>`).join("")}</ul><p class="outcome">${rich(s.outcome)}</p><div class="contact push-end"><p class="name">${esc(c.name)}</p><p>${esc(c.line)}</p><p><a href="mailto:${esc(c.email)}">${esc(c.email)}</a> · <a href="https://${esc(c.site)}">${esc(c.site)}</a></p></div>`, "text-col"),
      ...(s.art ? [region("art", r.art, img(s.art))] : []),
      region("shot", r.shot, img(s.shot), "shot"),
      region("phone", r.phone, img(s.phone)),
      region("caption", r.caption, `<p class="small">${rich(s.caption)}</p>`),
    ];
  },
};

export function renderSlide(c, s, i, n) {
  const fn = R[s.type];
  if (!fn) throw new Error(`No renderer for slide type ${s.type}`);
  const parts = fn(s, regionsFor(s));
  const railTone = s.rail ?? (s.type === "colour" ? "dark" : "light");
  return `<section class="slide s-${s.type}" id="slide-${i + 1}" data-rail="${railTone}" aria-label="${i + 1} of ${n}: ${esc(s.label ?? s.headline ?? "")}">\n${parts.join("\n")}\n${rail(c, i, n)}\n</section>`;
}
