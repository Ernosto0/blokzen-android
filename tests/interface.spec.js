import { test, expect } from '@playwright/test';
import { THEMES } from '../src/themes/catalog.js';
import { seed, watchErrors, geometry, drag } from './helpers.js';

const fresh = { 'blokzen.tutorial': true, 'blokzen.themes': { v: 2, disc: [0], fresh: [], auto: true, fixed: 0, block: 'classic' } };
test('collection filters, empty views and appearance keep real unlocks intact', async ({ page }) => {
  test.setTimeout(60_000);
  const errors = watchErrors(page);
  await seed(page, fresh); await page.goto('/'); await page.click('#menuThemes');
  await page.click('#galFilters [data-value="open"]');
  await expect(page.locator('#cards .tcard')).toHaveCount(1);
  await page.click('#galCollections [data-value="zen"]');
  await expect(page.locator('#galEmpty')).toBeVisible();
  await page.click('#galFilters [data-value="locked"]');
  await expect(page.locator('#cards .tcard').first()).toHaveClass(/locked/);
  await page.locator('#cards .tcard').first().click();
  await expect(page.locator('#detailName')).toHaveText('???');
  await page.click('#detailClose');
  await page.click('#galAppearance'); await page.click('#modeSoft');
  await expect(page.locator('#gallery')).toBeVisible();
  await expect(page.locator('#autoTheme')).toBeChecked();
  const meta = await page.evaluate(() => JSON.parse(localStorage.getItem('blokzen.themes')));
  expect(meta.block).toBe('soft'); expect(meta.auto).toBe(true); expect(meta.disc).toEqual([0]);
  await page.reload(); await page.click('#menuThemes'); await page.click('#galAppearance');
  await expect(page.locator('#modeSoft')).toHaveAttribute('aria-checked', 'true');
  expect(errors).toEqual([]);
});

for (const viewport of [{ width: 320, height: 568 }, { width: 740, height: 360 }]) {
  test(`collection scrolls with a stationary close control at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize(viewport); await seed(page, fresh); await page.goto('/'); await page.click('#menuThemes');
    const close = await page.locator('#galClose').boundingBox();
    await page.locator('#galScroll').evaluate(el => { el.scrollTop = el.scrollHeight; });
    await expect(page.locator('#cards .tcard').last()).toBeInViewport();
    expect(await page.locator('#galClose').boundingBox()).toEqual(close);
    expect(await page.locator('#gallery').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.locator('#cards .tcard').last().click();
    await expect(page.locator('#detailGoal')).toHaveText(THEMES.at(-1).unlock.text);
    await page.keyboard.press('Escape'); await expect(page.locator('#gallery')).toBeVisible();
    await page.keyboard.press('Escape'); await expect(page.locator('#gallery')).toBeHidden();
  });
}

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

for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }]) {
  test(`featured reset controls fit the menu at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport); await seed(page, fresh); await page.goto('/');
    const markInProgress = async key => {
      await page.evaluate(key => {
        const game = JSON.parse(localStorage.getItem(key));
        game.moves = 1;
        localStorage.setItem(key, JSON.stringify(game));
      }, key);
      await page.reload();
    };
    const checkControl = async id => {
      const button = page.locator(id), card = page.locator('.mode.featured'), actions = page.locator('#featuredActions');
      await expect(button).toBeVisible();
      await expect(actions.locator(id)).toBeVisible();
      for (const label of ['normal', 'confirm']) {
        const b = await button.boundingBox(), c = await card.boundingBox(), a = await actions.boundingBox(), hero = await page.locator('#menuHero').boundingBox();
        expect(b.x).toBeGreaterThanOrEqual(c.x);
        expect(b.x + b.width).toBeLessThanOrEqual(c.x + c.width);
        expect(b.x + b.width).toBeLessThanOrEqual(viewport.width);
        expect(b.x).toBeGreaterThanOrEqual(hero.x + hero.width);
        expect(b.y).toBeGreaterThanOrEqual(a.y);
        expect(b.y + b.height).toBeLessThanOrEqual(a.y + a.height);
        if (label === 'normal') await button.click();
      }
      await expect(button).toHaveClass(/confirm/);
      await expect(button).toHaveText('Onayla');
      await expect(button).toHaveAttribute('aria-label', 'Silinecek · Onayla');
    };
    await markInProgress('blokzen.game.v2');
    await checkControl('#menuNew');
    await page.click('#menuNew'); await expect(page.locator('#menu')).toBeHidden();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('blokzen.game.v2')).moves)).toBe(0);
    await page.click('#menuBtn'); await page.click('#playZen');
    await markInProgress('blokzen.zen.game');
    await checkControl('#zenNew');
    await page.click('#menuHero'); await expect(page.locator('#menu')).toBeHidden();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('blokzen.zen.game')).moves)).toBe(1);
  });
}

test('English reset confirmation fits beside Continue on a narrow phone', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-US', viewport: { width: 320, height: 568 } });
  const page = await context.newPage(); await seed(page, fresh); await page.goto('/');
  await page.evaluate(() => {
    const key = 'blokzen.game.v2', game = JSON.parse(localStorage.getItem(key));
    game.moves = 1; localStorage.setItem(key, JSON.stringify(game));
  });
  await page.reload();
  await page.click('#menuNew');
  await expect(page.locator('#menuNew')).toHaveText('Confirm');
  const button = await page.locator('#menuNew').boundingBox(), actions = await page.locator('#featuredActions').boundingBox();
  expect(button.x + button.width).toBeLessThanOrEqual(actions.x + actions.width);
  await context.close();
});

for (const viewport of [{ width: 320, height: 568 }, { width: 740, height: 360 }]) {
  test(`all screens stay reachable with keyboard and reduced motion at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    test.setTimeout(60_000);
    const errors = watchErrors(page);
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize(viewport);
    await seed(page, fresh); await page.goto('/');
    expect(await page.locator('#menu').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    for (const [button, screen, close] of [['menuHelp', 'info', 'infoClose'], ['menuStats', 'info', 'infoClose'], ['menuSettings', 'settings', 'setClose'], ['puzzleLevels', 'levels', 'lvClose']]) {
      await page.click('#' + button);
      const dialog = page.locator('#' + screen);
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      const original = await page.locator('#' + close).boundingBox();
      await dialog.locator('.collection-scroll').evaluate(el => { el.scrollTop = el.scrollHeight; });
      expect(await page.locator('#' + close).boundingBox()).toEqual(original);
      await page.locator('#' + close).focus(); await page.keyboard.press('Shift+Tab');
      expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
      await page.keyboard.press('Escape'); await expect(dialog).toBeHidden();
    }
    expect(errors.filter(e => !e.includes('navigator.vibrate'))).toEqual([]);
  });
}

test('English help expands every mode and settings persist after reload', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-US', viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await seed(page, fresh); await page.goto('/'); await page.click('#menuHelp');
  await expect(page.locator('.visual-steps li')).toHaveCount(3);
  for (const details of await page.locator('.help-mode').all()) {
    await details.locator('summary').click();
    expect(await details.innerText()).not.toMatch(/[çğıöşüÇĞİÖŞÜ]/);
  }
  await page.click('#infoClose'); await page.click('#menuSettings');
  await page.locator('label[for="optLow"]').click();
  await expect(page.locator('body')).toHaveClass(/lowfx/);
  await page.reload(); await page.click('#menuSettings');
  await expect(page.locator('#optLow')).toBeChecked();
  await context.close();
});

test('a touch gesture scrolls the collection without moving its close control', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'tr-TR', reducedMotion: 'reduce' });
  const page = await context.newPage(); await seed(page, fresh); await page.goto('/');
  await page.locator('#menuThemes').tap();
  const box = await page.locator('#galScroll').boundingBox(), close = await page.locator('#galClose').boundingBox();
  const client = await context.newCDPSession(page);
  // Headless Chromium does not synthesize touch scroll gestures consistently.
  // Dispatch a real finger drag through the native touch input pipeline.
  const x = Math.round(box.x + box.width * .4), y = Math.round(box.y + box.height * .8);
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let i = 1; i <= 12; i++) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - i * 25 }] });
    await page.waitForTimeout(20);
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.locator('#galScroll').evaluate(el => el.scrollTop)).toBeGreaterThan(100);
  expect(await page.locator('#galClose').boundingBox()).toEqual(close);
  await page.locator('#galCollections [data-value="puzzle"]').tap();
  await expect(page.locator('#galCollections [data-value="puzzle"]')).toBeInViewport();
  await expect(page.locator('#galCollections [data-value="puzzle"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#galClose').tap(); await expect(page.locator('#gallery')).toBeHidden();
  await context.close();
});


test('the unfinished level action resumes the saved board without resetting moves', async ({ page }) => {
  await seed(page, fresh); await page.goto('/'); await page.click('#playPuzzle');
  // Let the puzzle HUD resize the canvas before reading the drag coordinates.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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
