# Blokzen Android

The Blokzen web game, built with Vite and wrapped as a native Android app with Capacitor 7.

## Layout

```
src/
  index.html       markup
  main.js          entry: styles, themes, screens, then boot
  boot.js          start(): load saves and settings, first frame
  core/            board, pieces, dealing, scoring, storage, shared state
  modes/           daily, puzzle (+ level data), classic
  game/            game flow, input
  render/          layout, block sprites, textures, backgrounds, frame loop
  themes/          one folder per theme, plus the shared pieces:
    <id>/          theme.js (colours, unlock task, clear effect), block.js, ambient.js,
                   particles.js, sound.js, gem.js (only what the theme has), index.js
    shared/        shapes, particles and sound helpers that several themes use
    catalog.js     the ordered theme list (the order is what saves refer to)
    registry.js    STYLES / TEX / AMBIENTS / PARTS / KITS / GEM_LOOKS, filled by the theme folders
    register.js    loads every theme folder
    progress.js, switching.js   unlocks, theme changes
  audio/           synthesized sound
  platform/        haptics
  ui/              HUD, menu, dialogs, gallery, tutorial
  styles/          CSS
  assets/fonts/    Baloo 2, self-hosted
tests/             Playwright smoke tests
android/           Capacitor Android project
```

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

Every push to `main` builds, tests and publishes `Blokzen.apk` with GitHub Actions (artifact `Blokzen-apk`, also on the **Releases** page).
