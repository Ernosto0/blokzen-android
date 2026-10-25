// Mode behaviour: what each mode shows, saves and scores. These pin the current behaviour so the mode code can be
// reorganised without changing it. Boards are seeded so every number is deterministic.
import { test, expect } from '@playwright/test';
import { N, baseSeed, nearClear, watchErrors, seed, geometry, drag } from './helpers.js';
import { THEMES } from '../src/themes/catalog.js';

const today = () => { const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };
const KEYS = { classic: 'blokzen.game.v2', daily: 'blokzen.daily.game', zen: 'blokzen.zen.game', puzzle: 'blokzen.puzzle.game' };
const BTN = { classic: 'play', daily: 'playDaily', zen: 'playZen', puzzle: 'playPuzzle' };

// Half the cells filled in a checkerboard: no full line, and a two-cell piece fits nowhere.
const checker = (mode, extra = {}) => {
  const grid = [...Array(N)].map((_, r) => Array(N).fill(0).map((_, c) => ((r + c) % 2 ? 0 : 1 + ((r + c) % 7))));
  return { mode, day: mode === 'daily' ? today() : 0, rs: mode === 'daily' ? 12345 : null, grid, score: 120, combo: 0, msc: 0, moves: 5, fulls: 0, tray: [{ s: 1, c: 3 }, null, null], ...extra };
};
// Puzzle level 1 ("İlk taş"): one gem at row 4, column 2, on the checkerboard so the pieces cannot be placed.
const stuckPuzzle = () => {
  const gems = [...Array(N)].map(() => Array(N).fill(0)); gems[4][2] = 1;
  return { ...checker('puzzle'), puz: { id: 'c1-01', n: 3, seq: 1, gems, undoUsed: false, prev: null, failed: false } };
};

// the DOM text, not what CSS makes of it (some titles are shown in capitals)
const text = (page, id) => page.locator('#' + id).textContent().then(s => s.trim());
const stored = (page, mode) => page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEYS[mode]);
const filled = s => s.grid.flat().filter(Boolean).length;
// a vibration blocked before the first tap is the browser, not the game
const real = errors => errors.filter(e => !e.includes('navigator.vibrate'));

// the main menu opens at boot over the card; a player would have closed it
const hideMenu = page => page.evaluate(() => { document.getElementById('menu').hidden = true; });

async function openLast(page, mode, save) {
  const errors = watchErrors(page);
  await seed(page, { ...baseSeed(), 'blokzen.mode': mode, [KEYS[mode]]: save });
  await page.goto('/'); // the last mode is picked up; a finished game shows its card behind the menu
  return errors;
}

test.describe('game over', () => {
  for (const [theme, width, height] of [['sunset', 393, 852], ['gelato', 320, 568], ['dusk', 740, 360]]) {
    test(`results stay usable in ${theme} at ${width}×${height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      const errors = watchErrors(page);
      const save = checker('classic', { score: 123456789, cls: { u: 3, c: false, h: [nearClear()] } });
      await seed(page, { ...baseSeed(THEMES.findIndex(t => t.id === theme)), 'blokzen.mode': 'classic', [KEYS.classic]: save });
      await page.goto('/');
      await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
      await hideMenu(page);
      // Large scores and all four actions must fit horizontally, even on a narrow phone.
      for (const id of ['finalScore', 'revive', 'again', 'puzUndo', 'toMenu']) {
        const el = page.locator('#' + id);
        await expect(el).toBeVisible();
        const box = await el.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        if (id !== 'finalScore') expect(box.height).toBeGreaterThanOrEqual(44);
      }
      // A short landscape screen may scroll, but the menu action must remain reachable.
      await page.locator('#toMenu').scrollIntoViewIfNeeded();
      await expect(page.locator('#toMenu')).toBeInViewport();
      await page.screenshot({ path: testInfo.outputPath('results.png') });
      await page.click('#toMenu');
      await expect(page.locator('#menu')).toBeVisible();
      expect(real(errors)).toEqual([]);
    });
  }

  test('classic: card with a second chance', async ({ page }) => {
    const errors = await openLast(page, 'classic', checker('classic'));
    await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
    expect(await text(page, 'overTitle')).toBe('Yer kalmadı');
    expect(await text(page, 'finalScore')).toBe('120');
    expect(await text(page, 'overSub')).toBe('En iyi: 0');
    expect(await text(page, 'overNote')).toBe('En dolu sıraları temizle');
    await expect(page.locator('#overLimit')).toBeVisible();
    expect(await text(page, 'again')).toBe('Tekrar oyna');
    await expect(page.locator('#revive')).toBeVisible();
    await expect(page.locator('#puzUndo')).toBeHidden();
    await expect(page.locator('#share')).toBeHidden();
    await expect(page.locator('#overStars')).toBeHidden();
    expect(await page.evaluate(() => document.body.className)).toBe('');
    expect(await page.locator('#bestBox').getAttribute('title')).toBe('En iyi skor');
    await expect(page.locator('#undo')).toBeVisible();
    expect(filled(await stored(page, 'classic'))).toBe(32); // kept: the second chance is still open
    expect(real(errors)).toEqual([]);
  });

  test('daily: stars, share and the day', async ({ page }) => {
    const errors = await openLast(page, 'daily', checker('daily'));
    await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
    expect(await text(page, 'overTitle')).toMatch(/^Günlük · \d+ \p{L}+$/u);
    expect(await text(page, 'finalScore')).toBe('120');
    // the star targets are the base 5.000 / 25.000 / 100.000 with the day's own twist of up to ±15%, so they change every day
    const targets = (await page.locator('#overStars .star small').allTextContents()).map(s => +s.replace(/\./g, ''));
    expect(targets).toHaveLength(3);
    [5000, 25000, 100000].forEach((base, i) => { expect(targets[i]).toBeGreaterThanOrEqual(base * 0.85 - 500); expect(targets[i]).toBeLessThanOrEqual(base * 1.15 + 500); });
    const first = (await page.locator('#overStars .star small').first().textContent()).trim();
    expect(await text(page, 'overSub')).toBe('Bugünün en iyisi: 0');
    expect(await text(page, 'overNote')).toBe(`Sonraki yıldız ${first} puanda.`);
    expect(await text(page, 'again')).toBe('Tekrar dene');
    await expect(page.locator('#share')).toBeVisible();
    await expect(page.locator('#revive')).toBeHidden();
    await expect(page.locator('#goalRow')).toBeVisible();
    expect(await page.evaluate(() => document.body.className)).toBe('daily');
    expect(await page.locator('#bestBox').getAttribute('title')).toBe('Bugünün en iyisi');
    await expect(page.locator('#undo')).toBeHidden();
    expect(await stored(page, 'daily')).toBeNull(); // a finished daily is not kept
    expect(real(errors)).toEqual([]);
  });

  test('zen: never ends, the board breathes out instead', async ({ page }) => {
    const errors = await openLast(page, 'zen', checker('zen'));
    await page.waitForTimeout(3000);
    await expect(page.locator('#over')).toBeHidden();
    expect(await page.evaluate(() => document.body.className)).toBe('zen');
    expect(await page.locator('#bestBox').getAttribute('title')).toBe('Bu oturumda temizlenen sıra');
    await expect(page.locator('#undo')).toBeHidden();
    const s = await stored(page, 'zen');
    expect(filled(s)).toBe(24); // two of the fullest lines drifted away
    expect(s.mode).toBe('zen');
    expect(real(errors)).toEqual([]);
  });

  test('puzzle: a failed level names what ran out', async ({ page }) => {
    const errors = await openLast(page, 'puzzle', stuckPuzzle());
    await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
    expect(await text(page, 'overTitle')).toBe('Bölüm 1 · İlk taş');
    expect(await text(page, 'finalScore')).toBe('Yer kalmadı');
    expect((await text(page, 'overSub')).replace(/\s+/g, ' ')).toBe('Hedef: Bütün taşları temizle · Taşlar 0 / 1'); // kept on one line with no-break spaces
    expect(await text(page, 'again')).toBe('Tekrar dene');
    await expect(page.locator('#puzLevels')).toBeVisible();
    await expect(page.locator('#puzRetry')).toBeHidden();
    await expect(page.locator('#toMenu')).toBeHidden();
    expect(await page.evaluate(() => document.body.className)).toBe('puzzle');
    await expect(page.locator('#puzRow')).toBeVisible();
    expect(await stored(page, 'puzzle')).toBeNull();
    expect(real(errors)).toEqual([]);
  });
});

test('classic: a cleared row scores and records', async ({ page }) => {
  const errors = watchErrors(page);
  await seed(page, { ...baseSeed(), 'blokzen.mode': 'classic', [KEYS.classic]: nearClear() });
  await page.goto('/');
  await page.click('#play');
  await page.waitForTimeout(500);
  const g = await geometry(page);
  await drag(page, g.slot(0), g.cell(0, 0));
  await page.waitForTimeout(1200);
  const s = await stored(page, 'classic');
  expect(s.score).toBe(511);
  expect(s.combo).toBe(1);
  expect(s.moves).toBe(1);
  expect(s.grid[0].every(v => v === 0)).toBe(true);
  expect(await text(page, 'score')).toBe('511');
  expect(await text(page, 'best')).toBe('511');
  expect(real(errors)).toEqual([]);
});

test('puzzle: the last gem wins the level with three stars', async ({ page }) => {
  const errors = watchErrors(page);
  await seed(page, baseSeed());
  await page.goto('/');
  await page.click('#playPuzzle');
  await page.waitForTimeout(600);
  expect(await text(page, 'puzRow')).toContain('Taşlar 0 / 1');
  const g = await geometry(page);
  await drag(page, g.slot(0), g.cell(4, 6)); // the three-cell bar completes row 4, which holds the gem
  await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
  expect(await text(page, 'overTitle')).toBe('Bölüm tamam');
  expect(await text(page, 'finalScore')).toBe('İlk taş');
  expect(await text(page, 'overSub')).toBe('Kalan parça: 2');
  expect(await text(page, 'again')).toBe('Sonraki bölüm');
  expect(await page.locator('#overStars .star.on').count()).toBe(3);
  await expect(page.locator('#puzRetry')).toBeVisible();
  await expect(page.locator('#toMenu')).toBeHidden();
  expect(await text(page, 'puzRow')).toContain('Taşlar 1 / 1');
  expect(await stored(page, 'puzzle')).toBeNull();
  const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('blokzen.puzzle')));
  expect(prog.best['c1-01']).toBe(3);
  expect(real(errors)).toEqual([]);
});

for (const mode of ['classic', 'zen', 'puzzle']) {
  test(`${mode}: the game resumes after a reload`, async ({ page }) => {
    const errors = watchErrors(page);
    await seed(page, baseSeed());
    await page.goto('/');
    await page.click('#' + BTN[mode]);
    await page.waitForTimeout(600);
    const g = await geometry(page);
    await drag(page, g.slot(0), mode === 'puzzle' ? g.cell(1, 1) : g.cell(3, 3));
    await page.waitForTimeout(500);
    const before = await stored(page, mode);
    expect(before.moves).toBe(1);
    await page.reload();
    await page.click('#' + BTN[mode]);
    await page.waitForTimeout(600);
    const after = await stored(page, mode);
    expect(after.moves).toBe(1); // resumed, not restarted
    expect(after.grid).toEqual(before.grid);
    expect(await text(page, 'score')).toBe(String(before.score));
    expect(await page.evaluate(() => document.body.className)).toBe(mode === 'classic' ? '' : mode);
    expect(real(errors)).toEqual([]);
  });
}

test('each mode keeps its own game when you switch', async ({ page }) => {
  const errors = watchErrors(page);
  await seed(page, baseSeed());
  await page.goto('/');
  await page.click('#play');
  await page.waitForTimeout(600);
  let g = await geometry(page);
  await drag(page, g.slot(0), g.cell(3, 3));
  await page.waitForTimeout(400);
  const classic = await stored(page, 'classic');
  await page.click('#menuBtn');
  await page.click('#playZen');
  await page.waitForTimeout(600);
  g = await geometry(page);
  await drag(page, g.slot(0), g.cell(3, 3));
  await page.waitForTimeout(400);
  expect((await stored(page, 'zen')).moves).toBe(1);
  expect(await page.evaluate(() => document.body.className)).toBe('zen');
  await page.click('#menuBtn');
  await page.click('#play');
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => document.body.className)).toBe('');
  const back = await stored(page, 'classic');
  expect(back.moves).toBe(1);
  expect(back.grid).toEqual(classic.grid);
  expect(await text(page, 'score')).toBe(String(classic.score));
  expect(real(errors)).toEqual([]);
});

test.describe('actions', () => {
  test('classic: the second chance clears the fullest lines and is used up', async ({ page }) => {
    const errors = await openLast(page, 'classic', checker('classic'));
    await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
    await hideMenu(page);
    await page.click('#revive');
    await expect(page.locator('#over')).toBeHidden();
    await page.waitForTimeout(500);
    const s = await stored(page, 'classic');
    expect(filled(s)).toBeLessThan(32);
    expect(s.cls.c).toBe(true); // once per game
    expect(real(errors)).toEqual([]);
  });

  test('classic: undo takes the move and its points back', async ({ page }) => {
    const errors = watchErrors(page);
    await seed(page, { ...baseSeed(), 'blokzen.mode': 'classic', [KEYS.classic]: nearClear() });
    await page.goto('/');
    await page.click('#play');
    await page.waitForTimeout(500);
    const g = await geometry(page);
    await drag(page, g.slot(0), g.cell(0, 0));
    await page.waitForTimeout(800);
    expect((await stored(page, 'classic')).score).toBe(511);
    await page.click('#undo');
    await page.waitForTimeout(500);
    const s = await stored(page, 'classic');
    expect(s.score).toBe(0);
    expect(s.moves).toBe(0);
    expect(s.grid[0].filter(Boolean).length).toBe(7);
    expect(s.cls.u).toBe(2); // one of three used
    expect(real(errors)).toEqual([]);
  });

  test('classic: play again starts a fresh game', async ({ page }) => {
    const errors = await openLast(page, 'classic', checker('classic', { cls: { u: 0, c: true, h: [] } }));
    await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#revive')).toBeHidden(); // already used
    await hideMenu(page);
    await page.click('#again');
    await expect(page.locator('#over')).toBeHidden();
    const s = await stored(page, 'classic');
    expect(s.moves).toBe(0);
    expect(s.score).toBe(0);
    expect(filled(s)).toBe(0);
    expect(real(errors)).toEqual([]);
  });

  test('daily: a fresh day starts a prepared board with its goals', async ({ page }) => {
    const errors = watchErrors(page);
    await seed(page, baseSeed());
    await page.goto('/');
    await page.click('#playDaily');
    await page.waitForTimeout(700);
    await expect(page.locator('#goalRow')).toBeVisible();
    expect(await page.evaluate(() => document.body.className)).toBe('daily');
    const s = await stored(page, 'daily');
    expect(s.mode).toBe('daily');
    expect(s.day).toBe(today());
    expect(s.tray.filter(Boolean).length).toBe(3);
    expect(typeof s.rs).toBe('number');
    const again = await page.evaluate(() => JSON.parse(localStorage.getItem('blokzen.daily')));
    expect(again.days[String(today())].tries).toBe(1);
    expect(real(errors)).toEqual([]);
  });

  test('daily: try again counts a new try on the same board', async ({ page }) => {
    const errors = await openLast(page, 'daily', checker('daily'));
    await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
    await hideMenu(page);
    await page.click('#again');
    await expect(page.locator('#over')).toBeHidden();
    const s = await stored(page, 'daily');
    expect(s.moves).toBe(0);
    expect(s.day).toBe(today());
    expect(real(errors)).toEqual([]);
  });

  test('puzzle: undo takes back the move, once', async ({ page }) => {
    const errors = watchErrors(page);
    await seed(page, baseSeed());
    await page.goto('/');
    await page.click('#playPuzzle');
    await page.waitForTimeout(600);
    const start = await stored(page, 'puzzle');
    const g = await geometry(page);
    await drag(page, g.slot(0), g.cell(1, 1));
    await page.waitForTimeout(500);
    expect((await stored(page, 'puzzle')).moves).toBe(1);
    await page.click('#undo');
    await page.waitForTimeout(500);
    const s = await stored(page, 'puzzle');
    expect(s.moves).toBe(0);
    expect(s.grid).toEqual(start.grid);
    expect(s.puz.undoUsed).toBe(true);
    expect(s.puz.seq).toBe(start.puz.seq);
    await expect(page.locator('#undo')).toBeDisabled();
    expect(real(errors)).toEqual([]);
  });

  test('puzzle: try again restarts the same level', async ({ page }) => {
    const errors = await openLast(page, 'puzzle', stuckPuzzle());
    await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
    await hideMenu(page);
    await page.click('#again');
    await expect(page.locator('#over')).toBeHidden();
    const s = await stored(page, 'puzzle');
    expect(s.puz.id).toBe('c1-01');
    expect(s.moves).toBe(0);
    expect(s.puz.seq).toBe(3); // all three pieces of level 1 are dealt
    expect(real(errors)).toEqual([]);
  });
});
