import { test, expect } from '@playwright/test';
import { THEMES } from '../src/themes/catalog.js';
import { seed, watchErrors, geometry, drag } from './helpers.js';

const fresh = { 'blokzen.tutorial': true, 'blokzen.themes': { v: 2, disc: [0], fresh: [], auto: true, fixed: 0, block: 'classic' } };
test('levels keep earned stars and locks; the next action starts the first unsolved level', async ({ page }) => {
  await seed(page, { ...fresh, 'blokzen.puzzle': { best: { 'c1-01': 3, 'c1-02': 2 } } });
  await page.goto('/'); await page.click('#puzzleLevels');
  await expect(page.locator('#lvCount')).toHaveText('5 / 60 yıldız');
  await expect(page.locator('#lv-c1-01 .lvs svg.on')).toHaveCount(3);
  await expect(page.locator('#lv-c1-02 .lvs svg.on')).toHaveCount(2);
  await expect(page.locator('#lv-c1-03')).toHaveAttribute('aria-current', 'step');
  await page.click('#lv-c1-04', { force: true }); await expect(page.locator('#levels')).toBeVisible();
  await page.click('#lvNext'); await expect(page.locator('#levels')).toBeHidden();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('blokzen.puzzle.game')));
  expect(save.puz.id).toBe('c1-03');
});

test('the play action follows the featured mode after switching', async ({ page }) => {
  await seed(page, fresh); await page.goto('/');
  await expect(page.locator('#modeClassicCard #menuHero')).toBeVisible();
  await page.click('#playZen'); await page.click('#menuBtn');
  await expect(page.locator('#modeZenCard #menuHero')).toBeVisible();
  await expect(page.locator('.mode.featured')).toHaveCount(1);
  await page.click('#menuHero'); await expect(page.locator('#menu')).toBeHidden();
  await expect(page.locator('body')).toHaveClass(/zen/);
});


test('the unfinished level action resumes the saved board without resetting moves', async ({ page }) => {
  await seed(page, fresh); await page.goto('/'); await page.click('#playPuzzle');
  const g = await geometry(page); await drag(page, g.slot(0), g.cell(0, 0));
  const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('blokzen.puzzle.game')));
  await expect.poll(async () => (await read()).moves).toBe(1);
  const before = await read();
  await page.click('#menuBtn'); await page.click('#puzzleLevels');
  await expect(page.locator('#lvNext')).toContainText('Yarım kalan:');
  await page.click('#lvNext');
  await expect(page.locator('#levels')).toBeHidden(); await expect(page.locator('#menu')).toBeHidden();
  const after = await read();
  expect(after.moves).toBe(before.moves); expect(after.grid).toEqual(before.grid); expect(after.tray).toEqual(before.tray);
});
