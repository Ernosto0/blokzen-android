// Shared by the Playwright tests: error watching, localStorage seeding, board geometry and mouse drags.
import { THEMES } from '../src/themes/catalog.js'; // pure data: the tests follow the list

export const THEME_COUNT = THEMES.length, N = 8;

// Collect uncaught errors and console errors for the whole test.
export function watchErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 4).map(s => s.trim()).join(' < ')));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  return errors;
}

// Seed localStorage before the page scripts run.
export async function seed(page, items) {
  await page.addInitScript(items => {
    if (sessionStorage.getItem('seeded')) return; // only on the first load
    localStorage.clear();
    for (const [k, v] of Object.entries(items)) localStorage.setItem(k, JSON.stringify(v));
    sessionStorage.setItem('seeded', '1');
  }, items);
}

export const allThemes = [...Array(THEME_COUNT).keys()];
export const baseSeed = (theme = 0, block = 'classic') => ({
  'blokzen.tutorial': true,
  'blokzen.dev': true,
  'blokzen.themes': { v: 2, disc: allThemes, fresh: [], auto: false, fixed: theme, block },
});

// A classic game whose top row misses only its first cell, with a single block in tray slot 0.
export const nearClear = () => {
  const grid = [...Array(N)].map(() => Array(N).fill(0));
  for (let c = 1; c < N; c++) grid[0][c] = 1 + (c % 7);
  return { mode: 'classic', day: 0, rs: null, grid, score: 0, combo: 0, msc: 0, moves: 0, fulls: 0, tray: [{ s: 0, c: 3 }, null, null] };
};

// Board/tray geometry, mirroring layout() in the game.
export async function geometry(page) {
  const r = await page.locator('#stage').boundingBox();
  const W = r.width, H = r.height, B = Math.min(W, H / 1.46);
  const trayH = B * 0.42, gap = B * 0.04, bx = (W - B) / 2, by = Math.max(0, (H - (B + gap + trayH)) / 2);
  const pad = B * 0.03, cell = (B - 2 * pad) / N;
  return {
    cell: (row, col) => ({ x: r.x + bx + pad + (col + 0.5) * cell, y: r.y + by + pad + (row + 0.5) * cell }),
    slot: i => ({ x: r.x + bx + (i + 0.5) * B / 3, y: r.y + by + B + gap + trayH / 2 }),
  };
}

export async function drag(page, from, to) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 5 });
  await page.mouse.move(to.x, to.y, { steps: 5 });
  await page.mouse.up();
}
