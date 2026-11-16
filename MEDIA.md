# Media manifest

Large binaries (video, audio) are **not in git**. They stay at the paths below, which are the live copies served at `https://snoops-mac-studio.tail970398.ts.net:8452/`. Check a file with `shasum -a 256 <path>`.

## Offer videos: UX review (rendered 2026-11-05)

| Live path | Size | sha256 |
|---|---|---|
| `~/OG/reports/offer-videos/ux-review/ux-review-offer-16x9.mp4` | 18 MB | `f215992cb786c17b06c33b7c644f4810ebe3cbf5071d641f91ea68721258f458` |
| `~/OG/reports/offer-videos/ux-review/ux-review-offer-9x16.mp4` | 13 MB | `b78063976f5925dd4a33b5dfe56012f336bc3c26d9907a6a94dad122fb0a6d32` |
| `~/OG/reports/offer-videos/ux-review/ux-review-broll-16x9.mp4` | 4.1 MB | `a8a0bf470781fa97de2ca1b57e67489698009b47727f6003f45e79598ed40efc` |
| `~/OG/reports/offer-videos/ux-review/ux-review-broll-9x16.mp4` | 3.2 MB | `b833c98aed2e8355e4195ba75c42053041955541e5c1d05ead18726dc3540fea` |

Scripts v1–v4 are in git at `offer-videos/ux-review/`.

**Source project** (referenced, not copied): `~/OG-Research/_global/videos/2026-11-05-ux-review-broll/` (160 MB). It holds the HyperFrames compositions (`edit-16x9/`, `edit-9x16/`, `comp-16x9/`, `comp-9x16/`), the music (`music/*.wav`), `aroll/`, `assets/`, and `renders/` (the same four mp4 files). Re-render there with the `og-vid-hyperframes` skill, then copy the renders into `~/OG/reports/offer-videos/ux-review/` and update this table.

## Showcase

| Live path | Size | sha256 |
|---|---|---|
| `~/OG/reports/showcase/assets/video/wp-brick-build-1080x1350.mp4` | 1.5 MB | `7530ae2e543ddd6d63d144d338edb47e7603e26310f03b19ce1e528c92bd3849` |

The poster frame `wp-brick-build-poster.jpg` is in git. The source project for this video was not found under `~/OG-Research/_global/videos/` on 2026-11-06, so its source is unknown.

## Rebuildable, not committed

- `portfolio-mabv/deck/node_modules/`: run `npm ci` in `portfolio-mabv/deck/`.
- `portfolio-mabv/deck/.cache/`: the image cache that `build.mjs` regenerates.
- `portfolio-mabv/.impeccable-review/`: transient design-review screenshots.
