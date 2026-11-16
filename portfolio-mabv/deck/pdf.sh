#!/bin/bash
# Export a built deck to PDF (one 1920×1080 page per slide) with headless Chrome, using the deck's ?print mode.
# Usage: ./pdf.sh <deck.html> <out.pdf>
set -euo pipefail
html="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
out="$2"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$chrome" --headless=new --disable-gpu --no-pdf-header-footer --hide-scrollbars \
  --run-all-compositor-stages-before-draw --virtual-time-budget=8000 \
  --window-size=1920,1080 --print-to-pdf="$out" "file://${html}?print=1" 2>/dev/null
echo "PDF: $out ($(pdfinfo "$out" 2>/dev/null | awk '/^Pages/{print $2}') pages)"
