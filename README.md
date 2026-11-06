# OG-049-Portfolio-Showcase

> OGANIKO's portfolio and showcase work — case-study decks (mAbV, STR), the services showcase pages and the offer videos, plus the playbook and template for making more.

## Where to start

- **For working on this project**: read `AGENTS.md` in this folder. It is the canonical bootstrap manifest — it tells any agent (or human) which files to read and in what order. `CLAUDE.md` is a one-line shim that imports it.
- **For project status, decisions, and history**: see the vault project page at `vault/projects/OG-049-Portfolio-Showcase/README.md`.

## Quick facts

- **Project code**: OG-049-Portfolio-Showcase
- **Created**: 2026-11-06
- **GitHub**: https://github.com/parrysan/OG-049-Portfolio-Showcase

## Structure

```
.
├── AGENTS.md    # canonical bootstrap manifest — read this first
├── CLAUDE.md    # one-line @AGENTS.md shim (Claude Code compatibility)
├── README.md    # this file
├── src/         # application code
├── tests/       # tests
└── docs/        # technical docs (code-adjacent only) + client-area portal
```

All durable knowledge — decisions, research, status narrative — lives in the vault project page, **not** in `docs/`. The code repo holds code, config, and build artefacts.

## Source → live mapping

The work was made before this project existed, under `~/OG/reports/`. It was copied in on 2026-11-06 (the copy, not a move). Each top-level folder here has the **same name** as its live folder, so relative links between them, such as the showcase home linking to `../portfolio-mabv/showcase/`, work both here and live.

| Repo folder | Live folder | Live URL (tailnet) |
|---|---|---|
| `portfolio-mabv/` | `~/OG/reports/portfolio-mabv/` | https://snoops-mac-studio.tail970398.ts.net:8452/portfolio-mabv/ |
| `portfolio-str/` | `~/OG/reports/portfolio-str/` | https://snoops-mac-studio.tail970398.ts.net:8452/portfolio-str/showcase/ |
| `showcase/` | `~/OG/reports/showcase/` | https://snoops-mac-studio.tail970398.ts.net:8452/showcase/ |
| `og-ods-case-showcase-demo/` | `~/OG/reports/og-ods-case-showcase-demo/` | https://snoops-mac-studio.tail970398.ts.net:8452/og-ods-case-showcase-demo/showcase/ |
| `offer-videos/` | `~/OG/reports/offer-videos/` | https://snoops-mac-studio.tail970398.ts.net:8452/offer-videos/ux-review/ |
| `docs/client-area/` | `~/OG/reports/og-049-portfolio-showcase/` | https://snoops-mac-studio.tail970398.ts.net:8452/og-049-portfolio-showcase/ (project portal) |

What is in each folder:

- **`portfolio-mabv/`**: the mAbV case study. `index.html` is the deck and `deck.pdf` the PDF. `PLAYBOOK.md` explains how to make the next case study. `plan.html` is the build plan, `case.json` the case data, and `deck/` the reusable builder: `template/` holds the layout, `cases/mabv.json` the data, and `build.mjs`, `pdf.sh` and `pptx.mjs` produce the outputs. `showcase/` is the scrolling case page.
- **`portfolio-str/`**: the STR Technologies case showcase.
- **`showcase/`**: the services showcase home plus four explorations: `wordpress-builds`, `shopify-stores`, `design-systems` and `amazon-listings`.
- **`og-ods-case-showcase-demo/`**: every stage type the `og-ods-case-showcase` skill can build.
- **`offer-videos/ux-review/`**: offer video scripts v1–v4. The videos themselves are listed in [`MEDIA.md`](MEDIA.md).

## Republish (repo → live)

Edit here, commit, then copy each changed folder to its live folder:

```bash
rsync -a --exclude .git ~/OG/dev/OG-049-Portfolio-Showcase/<folder>/ ~/OG/reports/<folder>/
# the portal:
rsync -a ~/OG/dev/OG-049-Portfolio-Showcase/docs/client-area/ ~/OG/reports/og-049-portfolio-showcase/
```

**Never use `--delete`.** The live folders also hold the videos and build caches that are not in git. Never move or delete anything under `~/OG/reports`, because the :8452 URLs are shared with people.

Rebuild the mAbV deck from `portfolio-mabv/deck/` (full steps in `PLAYBOOK.md`):

```bash
npm ci                                  # once (pptxgenjs, pinned)
node build.mjs cases/mabv.json          # HTML deck → ../index.html
./pdf.sh ../index.html ../deck.pdf      # PDF via headless Chrome
node pptx.mjs cases/mabv.json           # editable PPTX (not kept in git or live yet)
```

## Related skills (stay in `~/OG/shared-skills/`, not moved)

- `og-ods-case-showcase`: turns a finished project into a scroll-driven case-study page (`portfolio-*/showcase/`).
- `og-product-story`: builds a product or service page that demonstrates the offer (`showcase/explorations/`).
- `og-reference-to-recipe`: turns a reference site, screenshot or recording into a reusable design recipe.

## Routing

All future portfolio, showcase, case-study and offer-video work belongs in **this** project. None of it goes into OG-019-Phil-v2 (captain, 2026-11-06).
