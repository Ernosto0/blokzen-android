# Blokzen Android

The Blokzen web game, built with Vite and wrapped as a native Android app with Capacitor 8.

## Layout

```
src/
  index.html       markup
  main.js          entry: styles, themes, screens, then boot
  boot.js          start(): load saves and settings, first frame
  core/            board, pieces, dealing, scoring, storage, shared state
  modes/           one file per mode (classic, daily, puzzle, zen), registry.js, register.js
  game/            game flow (new game, placing a piece, saves), input
  render/          layout, block sprites, textures, backgrounds, frame loop
  themes/          one folder per theme, plus the shared pieces:
    <id>/          theme.js (colours, unlock task, clear effect), block.js, ambient.js,
                   particles.js, sound.js, gem.js (only what the theme has), index.js
    shared/        shapes, particles and sound helpers that several themes use
    catalog.js     the ordered theme list (the order is what saves refer to)
    registry.js    STYLES / TEX / AMBIENTS / PARTS / KITS / GEM_LOOKS, filled by the theme folders
    register.js    loads every theme folder
    progress.js, switching.js   unlocks, theme changes
  audio/           synthesized sound, plus the shared clear-sound samples it layers in (assets/sfx)
  platform/        haptics
  ui/              HUD, menu, dialogs, gallery, tutorial
  styles/          CSS
  assets/fonts/    Baloo 2, self-hosted
tests/             Playwright smoke tests
android/           Capacitor Android project
```

## Game modes

A mode is an object registered with `defineMode({ id, ... })` in its own file under `src/modes/`. The game never checks
`state.mode`: it asks the active mode, `mode()`, for flags (save key, volume, levels, shake, records, theme lock...) and
calls its hooks: the HUD, the game-over card, undo, how a game starts, saves and restores, what a move does, the menu card.
The full list of flags and hooks is documented at the top of `modes/registry.js`. To add a mode: write `modes/<id>.js`,
import it in `modes/register.js`, and add its card to `index.html`.

## Adding a theme

1. Create `src/themes/<id>/theme.js` (copy an existing one) and add it to the end of the list in `themes/catalog.js`.
2. Add `block.js`, `ambient.js`, `sound.js`… next to it; each one registers itself with `Object.assign(STYLES, { ... })` and so on.
3. Add `import './<id>/index.js'` to `themes/register.js`, then run `npm test`: it plays every theme.

Shared mutable game state lives in `core/state.js` as `state.x`; a variable with a single writer is exported from the module that writes it.

## Commands

- `npm run dev` — dev server with live reload (also reachable from a phone on the same network)
- `npm run build` — production build into `dist/`
- `npm test` — smoke tests: boot, every mode, every theme with a line clear, dialogs
- `npm run sync` — build and copy into the Android project
- `npm run build:test` — the same build with the developer mode switched on (`.env.test`), into `dist-test/`; the tests use it
- `node assets/make-sfx.mjs` — re-synthesize the clear bursts (one per material group, see `src/audio/booms.js`), the clean-board coins and the score tick into `src/assets/sfx/*.ogg` (needs ffmpeg with libvorbis)
- `node assets/make-assets.mjs` — redraw the app icon, splash and Play Store graphics from the game logo, then `npx capacitor-assets generate --android --iconBackgroundColor "#1a1330" --splashBackgroundColor "#1a1330"`

Every push to `main` builds, tests and publishes `Blokzen.apk` with GitHub Actions (artifact `Blokzen-apk`, also on the **Releases** page). That test APK keeps the developer mode (7 taps on the menu title); the Play build does not have it.

The Google Play bundle is built by `release.yml` when a `v<version>` tag is pushed. Setup, signing secrets and the rest of the checklist are in [PLAY_RELEASE.md](PLAY_RELEASE.md).
