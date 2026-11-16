# Case-study playbook

**OGANIKO portfolio case studies, built from one template**
Version 1.0 · 4 Nov 2026 · first case: mAbV · next cases: STR, Orange, Tartak

The playbook does two jobs. It is the method for turning a finished project into a case study that shows the work and tells its story, and it is the manual for the template that builds the deck. The template takes one case file in and produces an HTML deck, a PDF and an editable PowerPoint. The same case file can later feed an oganiko.com case-study page (see section 11).

---

## 1. What you get per case

| Output | File | Use |
|---|---|---|
| HTML deck | `index.html` | Present it full screen (arrow keys, space, Home/End, swipe). On a phone it becomes a scrolling page. |
| PDF | `deck.pdf` | Send, attach, print. One 16:9 page per slide, fixed layout. |
| PowerPoint | `deck.pptx` | Edit or re-present. Text, pictures and shapes are native and editable. |
| Case file | `deck/cases/<slug>.json` | The only file you write per case. All copy, asset paths and the project palette. |

## 2. The method

1. **Inventory.** Collect every asset: live screens (capture fresh at 2×, 2880 px wide), vector logos, real-world photos, project records (vault decisions, worklog, lessons), the client's own brief. Sort what you find into three lists: **facts supplied** (with source), **visible in the assets**, and **missing**.
2. **Ask.** Turn the missing list into questions for Phil. Ask only the ones whose answers change the story, and give each a default so a quick "defaults are fine" unblocks the build. Use the checklist in section 9.
3. **Plan.** Write a one-paragraph art direction and a slide-by-slide outline with assets per slide. Get approval before building.
4. **Build.** Write the case file, build, export, check (section 10).
5. **Hand over.** Send the deck link, the PDF, the PPTX and the list of any placeholders still open.

## 3. Narrative structure

The spine runs need, then idea, then how the idea was found, then the decisions that make it a system, then the system, then the kit, then proof in the world, then what was delivered. Drop any beat the evidence cannot support rather than padding it.

| Beat | Question it answers | Slide type |
|---|---|---|
| 1. Cover | What is this, and what did I do? | `cover` |
| 2. Context | What did the client need? | `context` |
| 3. Idea | What is the central design idea? | `idea` |
| 4. Exploration | How was it found? What else was tried? | `strip` |
| 5–6. Key decisions | Which decisions make it hold together? | `colour`, `pair` |
| 7. The system | How is it kept consistent? | `system` |
| 8. Delivery | What did the client receive? | `kit` |
| 9. In the world | Is it real and in use? | `gallery` |
| 10. Delivered + contact | What exactly was delivered, and who do I call? | `close` |

Adapt by project type. **Brand work:** lead with identity, then applications. **Website or Shopify:** swap beats 3–6 for key journeys, page hierarchy, interface details and responsive views (`strip` and `pair` carry these well). **Design system:** put `system` earlier and use `strip` for component families.

## 4. Slide types

Every type sits on the same frame: white canvas, the OGANIKO rail bottom left, regions in canvas pixels from `deck/template/geometry.mjs`. A slide can move any region with `"regions": { "<name>": { "x":…, "y":…, "w":…, "h":… } }` in the case file.

| Type | Use when | Content fields | mAbV example |
|---|---|---|---|
| `cover` | Always first. The strongest artwork plus one real photo or screen. | `art`, `lead`, `meta[]` (k, v, column width `w`), `photo` | Vector lockup + office photo |
| `context` | Explaining the brief, with one graphic idea on a tinted panel. | `headline`, `body[]`, `role`, `decode.items[]` (glyph, word, accent), `decode.note` | m · Ab · V decoded |
| `idea` | One central artwork that needs labelled parts. | `headline`, `body[]`, `quote`, `art`, `callouts` (labelX, labelW, items: text, y, from, edge) | Mark anatomy, lines draw in |
| `strip` | A row of 3–7 comparable things: routes, variants, components, pages. | `headline`, `body[]`, `items[]` (src, alt, name, group, final), `caption` | 5 routes + final, on white and navy |
| `colour` | A colour or material decision with its spec. | `headline`, `body[]`, `swatch` (pantone, name, specs), `compare[]`, `palette[]` | Pantone 2728 C field |
| `pair` | One artwork and one real-world photo that echo each other. | `headline`, `body[]`, `art`, `specimen[]`, `caption`, `photo` | Bilingual lockup + reception sign |
| `system` | A live system screen plus a rule shown as a live demo. | `headline`, `body[]`, `shot`, `ladder` (items, splitAfter, labels), `link` | Logo page + size ladder |
| `kit` | What was handed over: a screen, a manifest, one quoted instruction. | `headline`, `body[]`, `shot`, `manifest[]`, `quote` | Brand kit page + 18-file manifest |
| `gallery` | Real photos of the work in use. Two to four portraits. | `headline`, `photos[]`, `caption[]`, `credit` | Three office photos |
| `close` | Always last. Delivered list, outcome, contact, a live screen. | `headline`, `list[]`, `outcome`, `contact`, `shot`, `phone`, `caption` | Holding page, desktop + phone |

Inline markup in any copy field: `{{cn:百卫信}}` sets Chinese characters in the case's CJK face. Add a font for it in `case.fonts`.

## 5. Grid, type and colour

**Canvas** 1920 × 1080 px. Side margins 96, top 96. Twelve columns, 32 px gutter (column 114.7 px). Rail on a 28 px band at y 1008. Text columns are 600–760 px wide. PowerPoint maps px / 144 to inches and px / 2 to points.

**Type** (Open Sans; the work's own faces appear only in specimens):

| Role | Size | Line height | Weight | Tracking |
|---|---|---|---|---|
| Display (spec numbers) | 176 | 0.95 | 700 | −0.03em |
| Headline | 72 | 1.06 | 700 | −0.02em |
| Lead | 40 | 1.3 | 400 | −0.01em |
| Body | 28 | 1.5 | 400 | 0 |
| Quote | 34 | 1.3 | 600 | −0.01em |
| Small / caption | 20 | 1.45 | 400 | 0 |
| Label | 16, uppercase | 1.3 | 600 | 0.08em |

On phones the same markup reflows: headline 32–48 px, body 18 px, small 15 px.

**Colour.** The frame never changes: ink `#0A0A0A`, secondary `#333333`, tertiary `#595959` (7:1 on white), hairline `#E0E0E0`, paper white, leaf `#109200` (mark only). Each case sets six work tokens in `case.theme`: `accent`, `deep`, `ink`, `muted`, `surface`, `line`. Work colour fills whole regions (panels, fields, cells), never thin stripes. mAbV: `#0047BB`, `#0A2540`, `#334155`, `#64748B`, `#F4F7FA`, `#E2E8F0`.

## 6. Image rules

- **Real before mock.** Show real installations and live screens. Label any proposal as "proposed, not launched". No device mockups, no stock imagery, no illustrative people.
- **Never stretch, recolour or redraw** a logo or screen. Place marks from the vector masters (SVG); the PPTX rasterises them at 3× automatically.
- **Capture fresh at 2×** (1440 × 900 @2 = 2880 px wide). Crop to the part that reads at presentation size; a whole page shrunk to a thumbnail does not count as evidence.
- **Keep box and image aspect the same** (portraits 9:16 at 608 × 1080 or 405 × 720; screens 1.6:1) so nothing is cropped by accident.
- **Credit and caption** every photo you did not take. Say who applied the work if it was not you.
- **No private details in frame**: emails, invoices, IDs, addresses.

## 7. Copy rules

- 25–50 words per slide body. One idea per slide. Headlines are specific statements ("One blue, specified for ink"), never slogans ("Elevating the experience"). No full stop on headlines.
- First person ("I set…", "I developed…") only for work Phil confirmed as his. Credit clients and collaborators plainly.
- Facts only from records or Phil's answers. No invented results, dates, quotes, team members or claims. Unknowns stay as visible placeholders: `[Confirm project objective]`.
- Public-copy rules: never mention AI; never "solo"; experience is "20+ years"; contact is phil.parry@oganiko.com.
- No confidentiality or stealth wording. No hype vocabulary. Curiosity over shouting: when in doubt, take 30% out.
- No orphaned last words (the template balances headings; check captions). Avoid hyphenated compounds where a plain phrase works.
- Before publishing on oganiko.com, copy goes through og-editorial, OS-007 Test Kitchen and meta-humanizer (OG-019 rule).

## 8. Building a new case

```
cd ~/OG/reports/<case-folder>/deck           # a copy of this deck/ folder
npm install                                   # once (pptxgenjs, pinned)
node build.mjs cases/<slug>.json              # writes the HTML deck
./pdf.sh ../index.html ../deck.pdf            # PDF via headless Chrome
node pptx.mjs cases/<slug>.json               # editable PPTX, measured from the HTML
./shoot.sh "<deck url>#3" out.png 1440 900    # QA screenshot of one slide in deck mode
```

Start a new case by copying `deck/` next to a fresh `assets/` folder (`fonts/` is shared: copy it as is), then write `cases/<slug>.json` from `cases/mabv.json`. Asset paths in the case file are relative to the built `index.html`.

**How the PPTX stays faithful.** `pptx.mjs` opens the deck in headless Chrome with `?print&measure`. `deck.js` records every text block (with runs, size, weight, colour, tracking, line height), image, fill, border and callout line at its rendered position. The PPTX recreates them as native objects. Any layout change in the HTML therefore carries into the PPTX on the next run.

**Fonts in the PPTX.** The PPTX names Open Sans, DM Sans and Noto Sans SC. PowerPoint does not embed them; install the free Google fonts on the presenting machine, or use the PDF. Without them PowerPoint substitutes a default face.

## 9. Question checklist for Phil

Ask only what changes the story. Give a default for each.

1. **Objective:** what did the client ask for, in their words, and what did a good result look like?
2. **Credit:** what exactly is Phil's, what came from the client or others? (mAbV: the mark grew from the founder's sketch.)
3. **Role and team:** who else contributed, and in what role?
4. **Timeline:** may dates or duration be shown?
5. **Real-world use:** who produced it, who took the photos, may they be published, do larger originals exist?
6. **Reaction or outcome:** a quote (name, title, permission) or any verified result?
7. **Unlaunched work:** show proposals labelled as such, or only what shipped?
8. **Names:** may partners, institutions or the client's people be named?
9. **Publication:** is everything cleared for public use? Anything confidential to keep out?
10. **Bio line:** anything beyond "20+ years in UX, brand and design systems"?

## 10. QA checklist (run before calling it done)

From the brief's own pre-final checks:
- [ ] All text legible at presentation size (nothing under 20 px on the canvas; screenshots cropped to read).
- [ ] Nothing overlaps or is clipped, in the HTML deck, the PDF pages and the PPTX.
- [ ] Image fidelity and aspect ratios intact; marks from vector; no recolouring.
- [ ] Margins, type and colour consistent; rail present on every slide.
- [ ] Every factual claim traced to a record or Phil's answer; list of open placeholders written down.
- [ ] Publication permissions confirmed; no private details in any image.

Technical:
- [ ] Deck mode at 1440 × 900 and 1920 × 1080; reading mode at 390 px with no sideways scroll (capture phones through a 390 px iframe: headless Chrome will not open a window narrower than about 500 px).
- [ ] Keyboard: arrows, space, Home/End, visible focus on nav buttons; hidden slides are inert.
- [ ] `prefers-reduced-motion` stops the slide fade and the line draw.
- [ ] PPTX passes the pptx skill validator (`scripts/office/validate.py`).
- [ ] design-impeccable detector run once; findings triaged; a fresh reviewer has signed off or listed fixes.

## 11. Mapping to an oganiko.com case-study page

The site's `work` collection (`src/content.config.ts`, `workSchema`) can be filled from the same case file:

| Case file | oganiko.com `work` field |
|---|---|
| `cover.lead` | `summary` |
| `cover.meta` Scope / Role | `kicker`, `role` |
| `cover.photo` or best screen | `leadImage` |
| `context.headline` + `context.body` | `brief` |
| slides 3–8: `headline`, `body`, main visual, `caption` | `workBlocks[]`: `heading`, `paras`, `figure`, `caption` |
| `gallery.photos` | `galleryPortrait[]` |
| `system.shot`, `kit.shot` | `galleryLandscape[]` |
| `close.outcome` | `outcome` |
| `system.link`, live site | `links[]` |

Gaps in the current schema: no meta row (client, year, scope), no delivered list, no quote with attribution, no callout/anatomy figure. Proposed later as optional fields; the page can render the HTML deck's slide types as section components.

When the mAbV section is integrated, also fix the current `/work/mabv/` copy (no repo change was made in this task):
- `src/content/work/en/mabv.json:4,8` and `src/content/site/en.json:15` say "built in stealth"; drop it.
- `src/content/site/en.json:127` names the client "mAbV Biotherapeutics"; it is **mAbV**.
- `src/content/work/en/mabv.json:49` links "See it live" to `mabvbio.com/b2`, an unlaunched proposal.
- `src/content/work/en/mabv.json:68` says "the first landing pages are live"; only the holding page is.

## 12. Next cases: starting points

Assets already captured in `~/OG/reports/portfolio-key-screens/img/` (approved in that review on 4 Nov 2026).

| Case | Likely spine | Assets on hand | Ask Phil first |
|---|---|---|---|
| **STR** (Shopify storefront) | cover → context (technical buyers) → idea (custom theme) → strip (home, products, PDP) → pair (desktop vs phone) → system (ODS tokens, brand pages) → kit (Shopify admin / theme) → close | home, products, PDP (desktop + phone), Shopify themes and products admin, brand colours/logo/styleguide, design and research portals, writing style, ODS tokens | client objective; what was built from scratch vs configured; launch date and any outcome since the World Vaccine Congress; may the admin screens be shown |
| **Orange** (design system) | cover → context → idea → strip (colour, type, buttons, icons) → system (getting started, web) → close | design.orange.com home (desktop + phone), getting started, colour, buttons, icons, typography, web | Phil's exact role and years (public copy says "20+ years" overall); which parts were his; permission to show Orange material; any public credit |
| **Tartak** (bilingual industrial site) | cover → context → strip (key pages) → pair (Polish and English) → close | none captured yet: capture the live site at 2× | client objective; what the business gained; may the owner be named |

## 13. Files

```
portfolio-mabv/
  index.html           built deck (HTML)
  deck.pdf, deck.pptx  exports
  PLAYBOOK.md          this file
  plan.html            phase 1 plan (ODS report)
  assets/              img/, vector/, exploration/, fonts/, supplied/
  captures/            fresh 2× captures of the live site, crops, thumbs
  source/              local copy of the logo comparison page
  deck/
    build.mjs          case JSON -> HTML
    pptx.mjs           built HTML -> PPTX (measured)
    pdf.sh, shoot.sh   PDF export, QA screenshots
    package.json       pptxgenjs 4.0.1, pinned
    cases/mabv.json    the mAbV case
    template/          geometry.mjs, render-html.mjs, deck.css, deck.js
```
