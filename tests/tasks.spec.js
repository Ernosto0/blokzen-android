// Theme tasks: every theme except the first is locked behind a task. These tests check that each task opens exactly at its goal
// (one short of it stays locked), tells the player, and shows up in the gallery; and that a few tasks complete through real play.
import { test, expect } from '@playwright/test';
import { THEMES } from '../src/themes/catalog.js'; // pure data, like in helpers.js
import { N, nearClear, watchErrors, seed, geometry, drag } from './helpers.js';

const withTask = THEMES.map((th, i) => ({ th, i })).filter(({ th }) => th.unlock);
const META = 'blokzen.themes', STATS = 'blokzen.stats', DONE = 'blokzen.themesDone';
const today = () => { const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };
// no developer mode here: the unlocks must be earned
const fresh = (extra = {}) => ({ 'blokzen.tutorial': true, [META]: { v: 2, disc: [0], fresh: [], auto: false, fixed: 0, block: 'classic' }, ...extra });

// The stats that put a task exactly at its goal. val() is a function of the stats, so ask it which counter it reads
// (some read seconds as whole minutes) and take the smallest value that reaches the goal.
function statsAt(u, goal) {
  const keys = new Set();
  u.val(new Proxy({}, { get: (_, k) => { keys.add(k); return 0; } }));
  if (keys.size !== 1) throw new Error('task reads ' + keys.size + ' counters: ' + u.text);
  const [k] = keys;
  let v = goal;
  while (u.val({ [k]: v }) < goal) v++;
  return { [k]: v };
}
// What a save holds for one counter at value v. Opening the app starts a game, which counts today as a played day, so today is
// marked as already counted; the themes-played counter is rebuilt from the list of themes a game ended in.
const saveFor = (k, v) => k === 'themesDone'
  ? { [STATS]: { lastDay: today() }, [DONE]: THEMES.slice(0, v).map(t => t.id) }
  : { [STATS]: { [k]: v, lastDay: today() } };
const opened = page => page.evaluate(k => JSON.parse(localStorage.getItem(k)).disc.sort((a, b) => a - b), META);
// Every task that shares a counter opens together (25.000 points also covers the 2.500 task), and their toasts queue one after another.
// So: which themes a set of stats opens, and a recorder that notes each toast and taps it away to let the next one through.
const opensFor = stats => withTask.filter(({ th }) => th.unlock.val(stats) >= th.unlock.goal).map(({ i }) => i);
const recordToasts = page => page.addInitScript(() => {
  window.__toasts = [];
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
    if (!n.classList || !n.classList.contains('toast')) return;
    window.__toasts.push({ task: n.querySelector('.toast-task').textContent, theme: n.querySelector('.toast-theme').textContent });
    setTimeout(() => n.dispatchEvent(new PointerEvent('pointerdown')), 30);
  }))).observe(document, { childList: true, subtree: true });
});
const toasts = page => page.evaluate(() => window.__toasts);

test('every theme but the first has a task, and its counter can reach the goal', () => {
  expect(THEMES[0].unlock).toBeUndefined();
  expect(withTask.length).toBe(THEMES.length - 1);
  const ids = new Set();
  for (const { th, i } of withTask) {
    const u = th.unlock;
    expect(ids.has(th.id), 'duplicate id ' + th.id).toBe(false); ids.add(th.id);
    expect(u.goal, th.id).toBeGreaterThan(0);
    expect(typeof u.text, th.id).toBe('string');
    const at = statsAt(u, u.goal), k = Object.keys(at)[0];
    expect(u.val(at), th.id + ' reaches its goal').toBeGreaterThanOrEqual(u.goal);
    expect(u.val({ [k]: at[k] - 1 }), th.id + ' is locked one short').toBeLessThan(u.goal);
    expect(i).toBeGreaterThan(0);
  }
});

for (const { th, i } of withTask) {
  test(`task ${i} ${th.id}: locked one short, opens at the goal`, async ({ page }) => {
    const errors = watchErrors(page);
    const at = statsAt(th.unlock, th.unlock.goal), k = Object.keys(at)[0], short = { [k]: at[k] - 1 };
    await recordToasts(page);
    await seed(page, fresh(saveFor(k, short[k])));
    await page.goto('/');
    await page.waitForTimeout(500);
    // one short: whatever the lower goals on the same counter opened, not this theme
    expect(await opened(page)).toEqual([0, ...opensFor(short)]);
    expect(opensFor(short)).not.toContain(i);
    expect((await toasts(page)).map(t => t.theme)).not.toContain('Yeni tema: ' + th.name);
    // the counter reaches the goal: the next boot opens the theme and says which task did it. The write runs before the page's own
    // scripts on the reload, after the old page has saved its stats on the way out.
    await page.addInitScript(items => { for (const [key, v] of Object.entries(items)) localStorage.setItem(key, JSON.stringify(v)); }, saveFor(k, at[k]));
    await page.reload();
    await expect.poll(() => opened(page), { timeout: 5000 }).toEqual([0, ...opensFor(at)]);
    expect(opensFor(at)).toContain(i);
    await expect.poll(async () => (await toasts(page)).length, { timeout: 15000 }).toBe(opensFor(at).length - opensFor(short).length);
    expect(await toasts(page)).toContainEqual({ task: th.unlock.text, theme: 'Yeni tema: ' + th.name });
    expect(errors.filter(e => !e.includes('navigator.vibrate'))).toEqual([]);
  });
}

test('gallery: locked themes hide names and show progress; tapping reveals the task', async ({ page }) => {
  const errors = watchErrors(page);
  const target = withTask.find(({ th }) => th.id === 'neon'), half = 75;
  await seed(page, fresh({ [STATS]: { totalLines: half }, [META]: { v: 2, disc: [0, target.i], fresh: [target.i], auto: false, fixed: 0, block: 'classic' } }));
  await page.goto('/');
  await page.click('#menuThemes');
  await expect(page.locator('#gallery')).toBeVisible();
  await expect(page.locator('#cards .tcard')).toHaveCount(THEMES.length);
  await expect(page.locator('#cards .tcard.locked')).toHaveCount(THEMES.length - 2); // the first theme and the opened one
  for (const { th } of withTask) {
    const card = page.locator('#tcard-' + th.id);
    if (th.id === 'neon') { await expect(card).not.toHaveClass(/locked/); await expect(card.locator('.tname')).toHaveText(th.name); continue; }
    await expect(card, th.id).toHaveClass(/locked/);
    await expect(card.locator('.tname'), th.id).toHaveText('???'); // a locked theme keeps its name a surprise
    await expect(card.locator('.tgoal'), th.id).toHaveCount(0);
    await expect(card.locator('.tprog'), th.id).toBeAttached();
  }
  await page.click('#tcard-ocean');
  await expect(page.locator('#detailName')).toHaveText('???');
  await expect(page.locator('#detailGoal')).toHaveText(THEMES.find(t => t.id === 'ocean').unlock.text);
  await expect(page.locator('#detailUse')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.locator('#themeDetail')).toBeHidden();
  // a half-done task shows its progress bar half full
  const gum = withTask.find(({ th }) => th.id === 'gum').th; // 400 lines: 75 done
  await expect(page.locator('#tcard-' + gum.id + ' .tbar i')).toHaveAttribute('style', /width:\s*18\.75%/);
  expect(errors.filter(e => !e.includes('navigator.vibrate'))).toEqual([]);
});

test('gallery: an opened theme can be picked and is kept', async ({ page }) => {
  const errors = watchErrors(page);
  const sunset = THEMES.findIndex(t => t.id === 'sunset');
  await seed(page, fresh({ [META]: { v: 2, disc: [0, sunset], fresh: [sunset], auto: true, fixed: 0, block: 'classic' } }));
  await page.goto('/');
  await page.click('#menuThemes');
  await page.click('#tcard-sunset');
  await expect(page.locator('#detailPreview')).toBeVisible();
  expect((await page.evaluate(k => JSON.parse(localStorage.getItem(k)), META)).auto).toBe(true);
  await page.click('#detailUse');
  await expect(page.locator('#gallery')).toBeHidden();
  const meta = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), META);
  expect(meta.fixed).toBe(sunset);
  expect(meta.auto).toBe(false);
  expect(meta.fresh).toEqual([]);
  // a locked card opens its task without changing the selected theme
  await page.click('#menuThemes');
  await page.click('#tcard-ocean', { force: true });
  await expect(page.locator('#gallery')).toBeVisible();
  expect((await page.evaluate(k => JSON.parse(localStorage.getItem(k)), META)).fixed).toBe(sunset);
  expect(errors.filter(e => !e.includes('navigator.vibrate'))).toEqual([]);
});

/* ---------- Tasks completed by playing ---------- */
const saved = (page, k) => page.evaluate(k => JSON.parse(localStorage.getItem(k)), k);

test('play: clearing the 150th line opens the neon theme', async ({ page }) => {
  const errors = watchErrors(page);
  const neon = THEMES.findIndex(t => t.id === 'neon');
  await recordToasts(page);
  await seed(page, fresh({ [STATS]: { totalLines: 149 }, 'blokzen.mode': 'classic', 'blokzen.game.v2': nearClear() }));
  await page.goto('/');
  await page.click('#play');
  await page.waitForTimeout(500);
  expect(await opened(page)).not.toContain(neon);
  const g = await geometry(page);
  await drag(page, g.slot(0), g.cell(0, 0)); // the last cell of the top row: the 150th line, and a clean board (snow's task) with it
  await expect.poll(() => opened(page), { timeout: 5000 }).toContain(neon);
  expect(await opened(page)).toEqual([0, THEMES.findIndex(t => t.id === 'snow'), neon].sort((a, b) => a - b));
  await expect.poll(async () => (await toasts(page)).length, { timeout: 5000 }).toBe(2);
  expect(await toasts(page)).toContainEqual({ task: THEMES[neon].unlock.text, theme: 'Yeni tema: ' + THEMES[neon].name });
  expect((await saved(page, STATS)).totalLines).toBe(150);
  expect(errors.filter(e => !e.includes('navigator.vibrate'))).toEqual([]);
});

test('play: the first puzzle level opens the jigsaw theme, named on the win card', async ({ page }) => {
  const errors = watchErrors(page);
  const jigsaw = THEMES.findIndex(t => t.id === 'jigsaw');
  await recordToasts(page);
  await seed(page, fresh());
  await page.goto('/');
  await page.click('#playPuzzle');
  await page.waitForTimeout(600);
  const g = await geometry(page);
  await drag(page, g.slot(0), g.cell(4, 6));
  await expect(page.locator('#over')).toBeVisible({ timeout: 5000 });
  expect(await toasts(page)).toEqual([{ task: THEMES[jigsaw].unlock.text, theme: 'Yeni tema: ' + THEMES[jigsaw].name }]);
  expect(await opened(page)).toEqual([0, jigsaw]);
  expect(errors.filter(e => !e.includes('navigator.vibrate'))).toEqual([]);
});

test('play: a stuck zen board breathes and counts the breath', async ({ page }) => {
  const errors = watchErrors(page);
  const grid = [...Array(N)].map((_, r) => Array(N).fill(0).map((_, c) => ((r + c) % 2 ? 0 : 1 + ((r + c) % 7))));
  const zen = { mode: 'zen', day: 0, rs: null, grid, score: 0, combo: 0, msc: 0, moves: 5, fulls: 0, tray: [{ s: 1, c: 3 }, null, null] };
  await seed(page, fresh({ 'blokzen.mode': 'zen', 'blokzen.zen.game': zen }));
  await page.goto('/');
  await page.click('#playZen');
  await expect.poll(async () => (await saved(page, STATS))?.zenBreaths ?? 0, { timeout: 8000 }).toBeGreaterThanOrEqual(1);
  expect(errors.filter(e => !e.includes('navigator.vibrate'))).toEqual([]);
});
