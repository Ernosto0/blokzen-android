// Smoke tests: boot, every mode, every theme (both block looks) with a line clear, every dialog.
// They don't compare pixels; they catch runtime errors and check that the game still plays.
import { test, expect } from '@playwright/test';
import { THEMES } from '../src/themes/catalog.js'; // pure data: the test follows the list

const THEME_COUNT = THEMES.length, N = 8;

// Collect uncaught errors and console errors for the whole test.
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 4).map(s => s.trim()).join(' < ')));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  return errors;
}

// Seed localStorage before the page scripts run.
async function seed(page, items) {
  await page.addInitScript(items => {
    if (sessionStorage.getItem('seeded')) return; // only on the first load
    localStorage.clear();
    for (const [k, v] of Object.entries(items)) localStorage.setItem(k, JSON.stringify(v));
    sessionStorage.setItem('seeded', '1');
  }, items);
}

const allThemes = [...Array(THEME_COUNT).keys()];
const baseSeed = (theme = 0, block = 'classic') => ({
  'blokzen.tutorial': true,
  'blokzen.dev': true,
  'blokzen.themes': { v: 2, disc: allThemes, fresh: [], auto: false, fixed: theme, block },
});

// A classic game whose top row misses only its first cell, with a single block in tray slot 0.
const nearClear = () => {
  const grid = [...Array(N)].map(() => Array(N).fill(0));
  for (let c = 1; c < N; c++) grid[0][c] = 1 + (c % 7);
  return { mode: 'classic', day: 0, rs: null, grid, score: 0, combo: 0, msc: 0, moves: 0, fulls: 0, tray: [{ s: 0, c: 3 }, null, null] };
};

// Board/tray geometry, mirroring layout() in the game.
async function geometry(page) {
  const r = await page.locator('#stage').boundingBox();
  const W = r.width, H = r.height, B = Math.min(W, H / 1.46);
  const trayH = B * 0.42, gap = B * 0.04, bx = (W - B) / 2, by = Math.max(0, (H - (B + gap + trayH)) / 2);
  const pad = B * 0.03, cell = (B - 2 * pad) / N;
  return {
    cell: (row, col) => ({ x: r.x + bx + pad + (col + 0.5) * cell, y: r.y + by + pad + (row + 0.5) * cell }),
    slot: i => ({ x: r.x + bx + (i + 0.5) * B / 3, y: r.y + by + B + gap + trayH / 2 }),
  };
}

async function drag(page, from, to) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 5 });
  await page.mouse.move(to.x, to.y, { steps: 5 });
  await page.mouse.up();
}

test('boots to the main menu without errors', async ({ page }) => {
  const errors = watchErrors(page);
  await seed(page, baseSeed());
  await page.goto('/');
  await expect(page.locator('#menu')).toBeVisible();
  await page.waitForTimeout(800);
  expect(errors).toEqual([]);
});

for (const [btn, label] of [['play', 'classic'], ['playDaily', 'daily'], ['playPuzzle', 'puzzle'], ['playZen', 'zen']]) {
  test(`mode ${label}: starts and accepts a move`, async ({ page }) => {
    const errors = watchErrors(page);
    await seed(page, baseSeed());
    await page.goto('/');
    await page.click('#' + btn);
    await expect(page.locator('#menu')).toBeHidden();
    await page.waitForTimeout(600);
    const g = await geometry(page);
    // try each slot onto a few spots; at least the attempt must not throw
    for (const [i, spot] of [[0, [3, 3]], [1, [0, 0]], [2, [5, 0]]]) await drag(page, g.slot(i), g.cell(...spot));
    await page.waitForTimeout(800);
    expect(errors).toEqual([]);
  });
}

for (const block of ['classic', 'soft']) {
  for (const t of allThemes) {
    test(`theme ${t} (${block}): renders and clears a line`, async ({ page }) => {
      const errors = watchErrors(page);
      await seed(page, { ...baseSeed(t, block), 'blokzen.mode': 'classic', 'blokzen.game.v2': nearClear() });
      await page.goto('/');
      await page.click('#play');
      await expect(page.locator('#menu')).toBeHidden();
      await page.waitForTimeout(500);
      const g = await geometry(page);
      await drag(page, g.slot(0), g.cell(0, 0));
      await page.waitForTimeout(1500); // let the clear effects and the ambient run
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('blokzen.game.v2')));
      expect(errors).toEqual([]);
      expect(saved.th.cur).toBe(t);
      expect(saved.score).toBeGreaterThan(0);
      expect(saved.grid[0].every(v => v === 0)).toBe(true);
    });
  }
}

// Puzzle mode draws each theme's own gem and plays its sound kit on a placement.
for (const t of allThemes) {
  test(`theme ${t}: puzzle level draws and takes a move`, async ({ page }) => {
    const errors = watchErrors(page);
    await seed(page, baseSeed(t));
    await page.goto('/');
    await page.click('#playPuzzle');
    await expect(page.locator('#menu')).toBeHidden();
    await page.waitForTimeout(500);
    const g = await geometry(page);
    for (const [i, spot] of [[0, [3, 3]], [1, [0, 0]], [2, [5, 0]]]) await drag(page, g.slot(i), g.cell(...spot));
    await page.waitForTimeout(700);
    expect(errors).toEqual([]);
  });
}

test('dialogs open and close', async ({ page }) => {
  const errors = watchErrors(page);
  await seed(page, baseSeed());
  await page.goto('/');
  for (const [open, dlg, close] of [['menuThemes', 'gallery', 'galClose'], ['menuHelp', 'info', 'infoClose'], ['menuStats', 'info', 'infoClose'], ['menuSettings', 'settings', 'setClose'], ['puzzleLevels', 'levels', 'lvClose']]) {
    await page.click('#' + open);
    await expect(page.locator('#' + dlg)).toBeVisible();
    await page.waitForTimeout(300);
    await page.click('#' + close);
    await expect(page.locator('#' + dlg)).toBeHidden();
  }
  await page.click('#play');
  for (const id of ['menuBtn']) { await page.click('#' + id); await expect(page.locator('#menu')).toBeVisible(); }
  expect(errors).toEqual([]);
});
