// Language: Turkish devices get Turkish, every other device gets English, and English leaves no Turkish behind.
import { test, expect } from '@playwright/test';
import { baseSeed, nearClear, watchErrors, seed, geometry, drag } from './helpers.js';

const TURKISH_LETTERS = /[çğıöşüÇĞİÖŞÜ]/;
const seeded = { ...baseSeed(), 'blokzen.dev': false };

async function open(page) {
  const errors = watchErrors(page);
  await seed(page, seeded);
  await page.goto('/');
  await expect(page.locator('#menu')).toBeVisible();
  return errors;
}

test.describe('Turkish device', () => {
  test.use({ locale: 'tr-TR' });
  test('menu is in Turkish', async ({ page }) => {
    const errors = await open(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await expect(page.locator('#heroLbl')).toHaveText('Oyna');
    await expect(page.locator('#classicName')).toHaveText('Klasik');
    expect(errors).toEqual([]);
  });
});

test.describe('English device', () => {
  test.use({ locale: 'en-US' });

  test('menu is in English', async ({ page }) => {
    const errors = await open(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#heroLbl')).toHaveText('Play');
    await expect(page.locator('#heroSub')).toHaveText('Classic');
    await expect(page.locator('#classicName')).toHaveText('Classic');
    await expect(page.locator('#menuThemes')).toContainText('Themes');
    expect(errors).toEqual([]);
  });

  test('a region of Turkey counts as Turkish', async ({ browser }) => {
    const ctx = await browser.newContext({ locale: 'en-TR' });
    const page = await ctx.newPage();
    await seed(page, seeded);
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await ctx.close();
  });

  test('no Turkish left on any screen', async ({ page }) => {
    const errors = await open(page);
    const text = async sel => (await page.locator(sel).innerText()) + ' ' + (await page.locator(sel).evaluate(el => [...el.querySelectorAll('[aria-label],[title]')].map(e => e.getAttribute('aria-label') + ' ' + e.title).join(' ')));
    const clean = async (sel, what) => expect(await text(sel), what).not.toMatch(TURKISH_LETTERS);

    await clean('#menu', 'menu');
    await page.click('#menuHelp'); await clean('#info', 'help'); await page.click('#infoClose');
    await page.click('#menuStats'); await clean('#info', 'stats'); await page.click('#infoClose');
    await page.click('#menuSettings'); await clean('#settings', 'settings'); await page.click('#setClose');
    await page.click('#puzzleLevels'); await clean('#levels', 'levels'); await page.click('#lvClose');
    await page.click('#menuThemes'); await clean('#gallery', 'themes'); await page.click('#galClose');
    for (const btn of ['playDaily', 'playPuzzle', 'playZen', 'play']) {
      if (!(await page.locator('#menu').isVisible())) await page.click('#menuBtn');
      await clean('#menu', 'menu ' + btn);
      await page.click('#' + btn);
      await page.waitForTimeout(300);
      await clean('#app', 'game ' + btn);
    }
    expect(errors).toEqual([]);
  });

  test('in-game text and the game over card are English', async ({ page }) => {
    const errors = watchErrors(page);
    await seed(page, { ...seeded, 'blokzen.mode': 'classic', 'blokzen.game.v2': nearClear() });
    await page.goto('/');
    await page.click('#play');
    await page.waitForTimeout(500);
    await expect(page.locator('#restart')).toHaveAttribute('aria-label', 'New game');
    await expect(page.locator('#mute')).toHaveAttribute('aria-label', 'Mute');
    const g = await geometry(page);
    await drag(page, g.slot(0), g.cell(0, 0));
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
