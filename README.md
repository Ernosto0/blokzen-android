# Blokzen Android

The Blokzen web game, built with Vite and wrapped as a native Android app with Capacitor 7.

## Layout

```
src/             the game (Vite root)
  index.html     markup
  main.js        entry: styles + game
  game.js        game code (being split into modules)
  styles/        CSS
  assets/fonts/  Baloo 2, self-hosted
tests/           Playwright smoke tests
android/         Capacitor Android project
```

## Commands

- `npm run dev` — dev server with live reload (also reachable from a phone on the same network)
- `npm run build` — production build into `dist/`
- `npm test` — smoke tests: boot, every mode, every theme with a line clear, dialogs
- `npm run sync` — build and copy into the Android project

Every push to `main` builds, tests and publishes `Blokzen.apk` with GitHub Actions (artifact `Blokzen-apk`, also on the **Releases** page).
