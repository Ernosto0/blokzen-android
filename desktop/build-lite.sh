#!/usr/bin/env bash
# Builds the small Windows package (game files + Blokzen.bat launcher, ~1 MB): desktop/out/Blokzen-win-lite.zip
# It runs the game in the Edge/Chrome that Windows already has, so nothing else has to be installed.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=desktop/out/Blokzen-win-lite
npm run build
rm -rf "$OUT" && mkdir -p "$OUT/game"
cp -r dist/. "$OUT/game/"
cp desktop/lite/Blokzen.bat desktop/lite/README.txt "$OUT/"
(cd desktop/out && rm -f Blokzen-win-lite.zip && zip -qr Blokzen-win-lite.zip Blokzen-win-lite)
echo "Done: desktop/out/Blokzen-win-lite.zip"
