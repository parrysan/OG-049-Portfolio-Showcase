// Shared geometry and type for the OGANIKO case-study deck.
// One source for the HTML deck (build.mjs) and the PPTX (pptx.mjs), so both place every region identically.
// Canvas: 1920 × 1080 px. PPTX conversion: inches = px / 144, points = px / 2.

export const CANVAS = { w: 1920, h: 1080, margin: 96, gutter: 32 };

// Frame tokens: identical for every case study (ODS: Open Sans, black on white, hairlines, square corners).
export const FRAME = {
  font: "Open Sans",
  ink: "#0A0A0A",
  ink2: "#333333",
  ink3: "#595959",
  line: "#E0E0E0",
  paper: "#FFFFFF",
  letterbox: "#E9E9E7",
  leaf: "#109200",
};

// Type scale in canvas px. Line height is unitless.
export const TYPE = {
  display: { size: 176, lh: 0.95, weight: 700, track: -0.03 },
  h1: { size: 72, lh: 1.06, weight: 700, track: -0.02 },
  lead: { size: 40, lh: 1.3, weight: 400, track: -0.01 },
  body: { size: 28, lh: 1.5, weight: 400, track: 0 },
  small: { size: 20, lh: 1.45, weight: 400, track: 0 },
  label: { size: 16, lh: 1.3, weight: 600, track: 0.08 },
  rail: { size: 16, lh: 1.3, weight: 400, track: 0 },
};

// Regions per slide type, in canvas px. A slide may override any region with `regions` in the case file.
export const LAYOUTS = {
  cover: {
    art: { x: 96, y: 176, w: 880, h: 328 },
    lead: { x: 96, y: 576, w: 1120, h: 150 },
    meta: { x: 96, y: 800, w: 1120, h: 150 },
    photo: { x: 1312, y: 0, w: 608, h: 1080 },
  },
  context: {
    text: { x: 96, y: 96, w: 760, h: 880 },
    panel: { x: 1008, y: 0, w: 912, h: 1080 },
    feature: { x: 1104, y: 150, w: 720, h: 780 },
  },
  idea: {
    text: { x: 96, y: 96, w: 720, h: 880 },
    panel: { x: 912, y: 0, w: 1008, h: 1080 },
    art: { x: 1010, y: 160, w: 566, h: 760 },
    callouts: { x: 912, y: 0, w: 1008, h: 1080 },
  },
  strip: {
    head: { x: 96, y: 96, w: 880, h: 260 },
    text: { x: 1104, y: 104, w: 720, h: 250 },
    grid: { x: 96, y: 376, w: 1728, h: 520 },
    caption: { x: 96, y: 916, w: 1728, h: 40 },
  },
  colour: {
    field: { x: 0, y: 0, w: 1008, h: 1080 },
    spec: { x: 96, y: 176, w: 816, h: 720 },
    text: { x: 1104, y: 96, w: 720, h: 470 },
    compare: { x: 1104, y: 600, w: 720, h: 150 },
    palette: { x: 1104, y: 790, w: 720, h: 170 },
  },
  pair: {
    text: { x: 96, y: 96, w: 1000, h: 400 },
    art: { x: 96, y: 532, w: 1000, h: 233 },
    specimen: { x: 96, y: 812, w: 1100, h: 80 },
    caption: { x: 96, y: 924, w: 1100, h: 40 },
    photo: { x: 1312, y: 0, w: 608, h: 1080 },
  },
  system: {
    shot: { x: 96, y: 96, w: 1040, h: 650 },
    text: { x: 1232, y: 96, w: 592, h: 700 },
    ladder: { x: 96, y: 790, w: 1040, h: 180 },
    link: { x: 1232, y: 916, w: 592, h: 40 },
  },
  kit: {
    text: { x: 96, y: 96, w: 624, h: 560 },
    shot: { x: 784, y: 96, w: 1040, h: 650 },
    manifest: { x: 784, y: 800, w: 1040, h: 160 },
    quote: { x: 96, y: 696, w: 624, h: 264 },
  },
  gallery: {
    head: { x: 96, y: 96, w: 1300, h: 100 },
    photos: { x: 96, y: 232, w: 1263, h: 720 },
    caption: { x: 1424, y: 232, w: 400, h: 720 },
  },
  close: {
    text: { x: 96, y: 96, w: 720, h: 880 },
    panel: { x: 880, y: 0, w: 1040, h: 1080 },
    art: { x: 976, y: 160, w: 848, h: 198 },
    shot: { x: 960, y: 144, w: 816, h: 510 },
    phone: { x: 1576, y: 420, w: 216, h: 467 },
    caption: { x: 960, y: 690, w: 560, h: 120 },
  },
};

export const RAIL = { x: 96, y: 1008, w: 1728, h: 28 };

export function regionsFor(slide) {
  const base = LAYOUTS[slide.type];
  if (!base) throw new Error(`Unknown slide type: ${slide.type}`);
  const out = {};
  for (const [name, box] of Object.entries(base)) out[name] = { ...box, ...(slide.regions?.[name] ?? {}) };
  return out;
}
