# UI review

The collection, level picker, menu, stats, help and settings follow the active theme tokens. Primary actions use flat theme colors, modest corner radii and a shorter width for Play and Use. The game-over screen is unchanged.

To reproduce the review screenshots:

```sh
npm ci
npx playwright install chromium
npm run dev -- --port 4174
# In another terminal:
npm run capture:ui
```

Screenshots go to `test-results/ui-review/`. `PREVIEW_URL` and `UI_PREVIEW_DIR` override the server URL and output directory. The capture uses isolated browser saves with sample progress, dismisses the initial unlock notifications and respects reduced motion for settled frames. It captures dark and light versions of every screen, the theme preview, locked task, appearance controls and landscape menu.

Validation:

```sh
npm run build
npm run check:i18n
npm test
npm run sync
cd android && ./gradlew assembleDebug --no-daemon
```

`tests/interface.spec.js` covers collection filters, hidden theme names, automatic-theme settings, saved block appearance, level stars and locks, resuming unfinished levels, featured mode actions, English mode rules, preference persistence, keyboard containment, touch scrolling, narrow and landscape screens, and reduced motion. Existing suites cover all theme tasks, both block looks, mode rules and saves.
