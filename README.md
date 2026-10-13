# Blokzen Android

The Blokzen web game, built with Vite and wrapped as a native Android app with Capacitor 7.

## Layout

```
src/
  index.html       markup
  main.js          entry: styles, theme collections, screens, then boot
  boot.js          start(): load saves and settings, first frame
  core/            board, pieces, dealing, scoring, storage, shared state
  modes/           daily, puzzle (+ level data), classic
  game/            game flow, input
  render/          layout, block sprites, textures, backgrounds, frame loop
  themes/          theme list, effects, unlocks, switching, collections/
  audio/           synthesized sound
  platform/        haptics
  ui/              HUD, menu, dialogs, gallery, tutorial
  styles/          CSS
  assets/fonts/    Baloo 2, self-hosted
tests/             Playwright smoke tests
android/           Capacitor Android project
```

Shared mutable game state lives in `core/state.js` as `state.x`; a variable with a single writer is exported from the module that writes it.

## Commands

- `npm run dev` — dev server with live reload (also reachable from a phone on the same network)
- `npm run build` — production build into `dist/`
- `npm test` — smoke tests: boot, every mode, every theme with a line clear, dialogs
- `npm run sync` — build and copy into the Android project

Every push to `main` builds, tests and publishes `Blokzen.apk` with GitHub Actions (artifact `Blokzen-apk`, also on the **Releases** page).
