---
title: "OG-049-Portfolio-Showcase — Portfolio Showcase"
type: project-bootstrap
created: "2026-11-06"
---

# OG-049-Portfolio-Showcase — Portfolio Showcase

> **Bootstrap order — read these in order before doing any work in this project:**
>
> 1. `~/.claude/CLAUDE.md` → `Open-Memory-Vault/system/identity/MASTER-PROMPT.md` — Phil's identity (auto-loaded via symlink in Claude Code; other tools should mirror this).
> 2. `~/AGENT.md` → `agent-config/AGENT.md` — global operating manual (work style, skills routing, secrets policy, layering rules in §2.10).
> 3. `Open-Memory-Vault/AGENTS.md` — vault operating contract (read **only** if you will write to the vault during this session).
> 4. `Open-Memory-Vault/projects/OG-049-Portfolio-Showcase/README.md` — durable project page (status, decisions, recent activity, vault-side context).
> 5. **This file (`AGENTS.md`)** — project-specific overrides and live operational references (below). `CLAUDE.md` in this folder is a one-line `@AGENTS.md` shim so Claude Code loads it too.
>
> **The project's `AGENTS.md` is a bootstrap manifest, not a knowledge dump.** It points at everything else. Durable knowledge lives in the vault project page. Do not duplicate.

---

## At a glance

- **Code**: `OG-049`
- **Name**: Portfolio Showcase
- **Stakeholder**: Phil (self)
- **Type**: `product`
- **Status**: `active`
- **Priority**: `medium`
- **Revenue lane**: `1-service`
- **Autonomy mode**: `co-pilot` — Phil drives, agent assists. See master prompt.
- **Purpose** (one sentence): OGANIKO's portfolio and showcase work — case-study decks (mAbV, STR), the services showcase pages and the offer videos, plus the playbook and template for making more.
- **Client dashboard**: _(not deployed yet — paste the Client Area URL here after deploying; the AIOS project card links it automatically)_
- **Last touched**: `2026-11-06`

---

## Where things live

| Resource | Location |
|---|---|
| **Code root** | this folder (`dev/OG-049-Portfolio-Showcase/`) |
| **Project docs** | `./docs/` |
| **Vault project page** | `Open-Memory-Vault/projects/OG-049-Portfolio-Showcase/README.md` |
| **GitHub repo** | https://github.com/parrysan/OG-049-Portfolio-Showcase (private) |
| **Research store** | OG-Research Drive `OG-049 Portfolio Showcase`: (pending) |
| **External systems** | none |

---

## Live references

- **GitHub**: https://github.com/parrysan/OG-049-Portfolio-Showcase (private)
- **Live pages (tailnet)**: served from `~/OG/reports/<dir>/` at https://snoops-mac-studio.tail970398.ts.net:8452/ — see README "Source → live mapping"
- **Production URL**: (tbd)
- **NotebookLM**: (not provisioned — add later via notebook_push.py provision)
- **Client area**: docs/client-area/ (Overview + Research seeded; ODS Project header/footer)
- **Credentials**: stored in global `.env` under `OG049_*` (none yet)

---

## Tech stack (overrides global defaults)

Overrides the OS-000 Next.js/Firebase default: static HTML pages styled with OS-000 tokens, plus small Node build scripts (the case-study deck builder in `portfolio-mabv/deck/`). No framework.

---

## Project-specific rules

- **Routing**: all portfolio, showcase, case-study and offer-video work lands here — never in OG-019-Phil-v2 (captain, 2026-11-06).
- **Live copies stay in `~/OG/reports/<dir>/`.** Edit in this repo, then republish with `rsync -a` (never `--delete`; live folders hold media the repo does not).
- **No large binaries in git** (mp4, wav): list them in `MEDIA.md` with path and sha256.
- **No private details in frame or in git**: emails other than the business address, invoices, tax IDs, bank details, addresses.
- Static HTML research/report pages: style from `~/OG/dev/OS-000-Design-System/DESIGN.md` tokens, no external CDN/CSS; master copies in Drive `03 HTML/`.

---

## Skills

- **Project-local skills**: none — uses global library
- **Most relevant global skills for this project**: `og-ods-case-showcase`, `og-product-story`, `og-reference-to-recipe` (all in `~/OG/shared-skills/`, not moved), `ods`, `og-vid-hyperframes`

---

## Notes for the next session

Last action: scaffolded 2026-11-06 and imported the existing portfolio work from `~/OG/reports`. Next action: Phil fills the start sheet and vision draft. Open: Miro index card is a follow-up (no Miro tool in the scaffolding session).
