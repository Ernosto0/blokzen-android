#!/usr/bin/env bash
# Builds a portable Windows x64 folder + zip: desktop/out/Blokzen-win32-x64(.zip). Works from Linux/macOS, no Wine needed.
# Usage: desktop/build-win.sh [electron-version]
set -euo pipefail
cd "$(dirname "$0")/.."
EV="${1:-39.2.7}"
OUT=desktop/out
APP="$OUT/Blokzen-win32-x64"
CACHE="$OUT/cache"

npm run build
mkdir -p "$CACHE"
ZIP="$CACHE/electron-v$EV-win32-x64.zip"
[ -f "$ZIP" ] || curl -fSL -o "$ZIP" "https://github.com/electron/electron/releases/download/v$EV/electron-v$EV-win32-x64.zip"

rm -rf "$APP" && mkdir -p "$APP"
unzip -q "$ZIP" -d "$APP"
mv "$APP/electron.exe" "$APP/Blokzen.exe"
rm -f "$APP/resources/default_app.asar"
mkdir -p "$APP/resources/app/game"
cp desktop/main.js desktop/package.json desktop/icon.png "$APP/resources/app/"
cp -r dist/. "$APP/resources/app/game/"

(cd "$OUT" && rm -f Blokzen-win32-x64.zip && zip -qr Blokzen-win32-x64.zip Blokzen-win32-x64)
echo "Done: $OUT/Blokzen-win32-x64.zip"
