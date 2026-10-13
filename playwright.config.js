import { defineConfig, devices } from '@playwright/test';

// SMOKE_CMD lets the suite run against another copy of the game (e.g. the old single-file www/).
const cmd = process.env.SMOKE_CMD || 'npm run build && npx vite preview --port 4173 --strictPort';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 6,
  timeout: 30_000,
  reporter: [['list']],
  use: {
    ...devices['Pixel 7'],
    hasTouch: false, // mouse drags: no finger lift offset
    isMobile: false,
    locale: 'tr-TR', // the suite checks the Turkish text; tests/i18n.spec.js covers the other languages
    baseURL: 'http://localhost:4173',
  },
  webServer: { command: cmd, url: 'http://localhost:4173', reuseExistingServer: false, timeout: 120_000 },
});
