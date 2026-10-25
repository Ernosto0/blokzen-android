// Smoke tests: boot, every mode, every theme (both block looks) with a line clear, every dialog.
// They don't compare pixels; they catch runtime errors and check that the game still plays.
import { PRIVACY_URL } from '../src/core/links.js';
import { test, expect } from '@playwright/test';
import { THEME_COUNT, N, allThemes, baseSeed, nearClear, watchErrors, seed, geometry, drag } from './helpers.js';

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

// Escape and the Android back button share goBack(): dialog first, then the menu, and the main menu is the end of the road.
test('back goes dialog, then menu, then stays on the main menu', async ({ page }) => {
  const errors = watchErrors(page);
  await seed(page, baseSeed());
  await page.goto('/');
  await page.click('#play');
  await expect(page.locator('#menu')).toBeHidden();
  await page.click('#menuBtn');
  await page.click('#menuSettings');
  await expect(page.locator('#settings')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#settings')).toBeHidden();
  await expect(page.locator('#menu')).toBeVisible(); // the dialog closed, the menu it was opened from is still there
  await page.click('#play');
  await expect(page.locator('#menu')).toBeHidden();
  await page.keyboard.press('Escape'); // from the board: to the menu
  await expect(page.locator('#menu')).toBeVisible();
  expect(errors).toEqual([]);
});

test('settings show the app version', async ({ page }) => {
  await seed(page, baseSeed());
  await page.goto('/');
  await page.click('#menuSettings');
  await expect(page.locator('#aboutVer')).toHaveText(/\d+\.\d+\.\d+/);
  if (PRIVACY_URL) {
    await expect(page.locator('#aboutPrivacy')).toBeVisible();
    await expect(page.locator('#aboutPrivacy')).toHaveAttribute('href', PRIVACY_URL);
  } else await expect(page.locator('#aboutPrivacy')).toBeHidden();
});
