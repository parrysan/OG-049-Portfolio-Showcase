#!/bin/bash
# QA screenshots of a built deck with headless Chrome (no browser automation needed).
# Usage: ./shoot.sh <url> <out.png> <width> <height> [scale]
set -euo pipefail
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor="${5:-1}" \
  --virtual-time-budget=6000 --window-size="$3,$4" --screenshot="$2" "$1" 2>/dev/null
echo "shot: $2"
