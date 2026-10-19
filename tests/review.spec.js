// In-app review: Google's rating sheet is asked for only after a good classic game by a player who has been around a while,
// and Settings → About has a plain link to the Play page. The browser has no Play, so a stand-in counts the requests.
import { test, expect } from '@playwright/test';
import { N, baseSeed, watchErrors, seed } from './helpers.js';

const checker = () => {
  const grid = [...Array(N)].map((_, r) => Array(N).fill(0).map((_, c) => ((r + c) % 2 ? 0 : 1 + ((r + c) % 7))));
  return { mode: 'classic', day: 0, rs: null, grid, score: 120, combo: 0, msc: 0, moves: 5, fulls: 0, tray: [{ s: 1, c: 3 }, null, null], cls: { u: 3, c: true, h: [] } };
};
const today = () => { const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };
// Opening a finished game counts it as played (games + 1), so 4 games here means 5 on the card. Average 50: the seeded 120 is above it.
const veteran = { games: 4, daysPlayed: 3, lastDay: today(), totalScore: 200 };
const open = async (page, stats, extra = {}) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => { window.__asked = 0; window.__blokzenReview = () => { window.__asked++; }; });
  await seed(page, { ...baseSeed(), 'blokzen.mode': 'classic', 'blokzen.game.v2': checker(), 'blokzen.stats': stats, ...extra });
  await page.goto('/');
  await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(2600);
  return errors;
};
const asked = page => page.evaluate(() => window.__asked);

test('a good game from a returning player asks once, and not again for 90 days', async ({ page }) => {
  const errors = await open(page, veteran);
  expect(await asked(page)).toBe(1);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('blokzen.review')).at)).toBeGreaterThan(Date.now() - 60000);
  await page.evaluate(g => localStorage.setItem('blokzen.game.v2', JSON.stringify(g)), checker()); // the finished game was cleared
  await page.reload();
  await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(2600);
  expect(await asked(page)).toBe(0); // the new page load starts at 0 and the stored time blocks it
  expect(errors.filter(e => !e.includes('navigator.vibrate') && !e.includes('Failed to load resource'))).toEqual([]);
});

test('asks again after 90 days', async ({ page }) => {
  await open(page, veteran, { 'blokzen.review': { at: Date.now() - 91 * 864e5 } });
  expect(await asked(page)).toBe(1);
});

test('too few games, too few days, or a below-average game: no request', async ({ page, browser }) => {
  await open(page, { ...veteran, games: 3 });
  expect(await asked(page)).toBe(0);
  const p2 = await browser.newPage();
  await open(p2, { ...veteran, daysPlayed: 1 });
  expect(await asked(p2)).toBe(0);
  const p3 = await browser.newPage();
  await open(p3, { ...veteran, totalScore: 6000 }); // average 1200: 120 is below it
  expect(await asked(p3)).toBe(0);
});

test('Settings → About: a rate row linking to the Play page', async ({ page }) => {
  await seed(page, baseSeed());
  await page.goto('/');
  await page.click('#menuSettings');
  const row = page.locator('#aboutRate');
  await expect(row).toBeVisible();
  await expect(row).toContainText('Blokzen');
  expect(await row.getAttribute('href')).toBe('https://play.google.com/store/apps/details?id=com.cinaraksoy.blokzen');
});
