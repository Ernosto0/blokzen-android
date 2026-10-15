import { THEMES } from './catalog.js';
import { mode } from '../modes/registry.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { state, discovered, earned, fresh, settings, theme } from '../core/state.js';
import { LEVELS } from '../modes/puzzle-levels.js';
import { burst, saveMeta } from './switching.js';
import { t } from '../i18n/index.js';
import { taskToast } from '../ui/toast.js';

/* ---------- Theme unlocks: every theme except the first has a task and stays locked until it is done.
   Tasks are spaced so a new theme opens every game or two at first, then every few sessions; the running totals
   (games, total score, blocks, lines) mean steady play always moves some bar forward. ---------- */
export const STATS_KEY = 'blokzen.stats';
export const UNLOCKS = Object.fromEntries(THEMES.filter(t => t.unlock).map(t => [t.id, t.unlock]));
// which collection a theme belongs to: the mode its task is played in (the first theme has no task and is classic)
export const collectionOf = th => th.unlock?.daily ? 'daily' : th.unlock?.zen ? 'zen' : th.unlock?.puzzle ? 'puzzle' : 'classic';
// the last theme of a collection gets a bigger moment when it opens
export const FINALES = Object.fromEntries(THEMES.filter(t => t.finale).map(t => [t.id, t.finale]));
// themes that were open from the start before version 2 of the theme meta; older saves lose them until the task is done
export const META_V = 2;
export const NEW_TASKS = THEMES.filter(t => t.newTask).map(t => t.id);
export let stats = { bestScore: 0, bestCombo: 0, bestLines: 0, totalFulls: 0, totalLines: 0, bestFulls: 0, games: 0, totalScore: 0, totalPlaced: 0, bestMoves: 0,
  daysPlayed: 0, lastDay: 0, todayGames: 0, bestDayGames: 0, bestMulti: 0, total3: 0, morningGames: 0, themesDone: 0, playSec: 0, bestCalm: 0, streak10k: 0, bestStreak10k: 0,
  dailyGames: 0, dailyDays: 0, dailyStars: 0, dailyThree: 0, dailyBestStreak: 0, dailyMorning: 0, dailyFirst3: 0, dailyBeat: 0, dailyWeekend: 0, dailyNight: 0, dailyBestFulls: 0,
  zenMoves: 0, zenLines: 0, zenBreaths: 0, zenSec: 0, zenSessions: 0, zenFulls: 0, zenMorningSec: 0, zenEveningSec: 0, zenBestCalm: 0, zenBestRun: 0, zenNightSec: 0,
  puzzlePlaced: 0, puzzleLines: 0, puzzleSec: 0, puzzleWins: 0, puzzleTries: 0, // puzzle keeps its own counters: they move only the puzzle collection's tasks
  puzzleBack: 0, puzzleBestGems: 0, puzzleTypes3: 0, puzzleLast: 0, puzzleClean: 0, puzzleCross: 0, puzzleClear3: 0, puzzleGemsTotal: 0, puzzleStars: 0,
  crossMoves: 0, // moves that cleared a row and a column at once (the kawaii theme's bow)
  pops: 0, // moves that cleared two or more lines (the bubble theme's task)
  duskGames: 0 }; // games finished between 18:00 and 21:00 (the dunes theme's task)
// per-game counters for tasks measured inside one game (saved with the game). Zen only: lines cleared this session,
// zcalm: moves in a row with the board at most half full, zrun: moves since the board last took a breath

export const DONE_KEY = 'blokzen.themesDone';
export let themesDone = new Set(); // themes a game has been finished in

export const dayKey = () => { const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };
let hourAt = -1e9, hourVal = 0; // the hour of day, looked up at most every few seconds (time-of-day zen tasks)
export const hourNow = () => { const n = performance.now(); if (n - hourAt > 5000) { hourAt = n; hourVal = new Date().getHours(); } return hourVal; };
export function touchDay() { const k = dayKey(); if (stats.lastDay !== k) { stats.lastDay = k; stats.daysPlayed++; stats.todayGames = 0; } }
export const fmtDur = sec => { const m = Math.floor(sec / 60); return m >= 60 ? t('{h} sa {m} dk', { h: Math.floor(m / 60), m: m % 60 }) : t('{m} dk', { m }); };
const isLocked = i => !earned.has(i);
// a theme opened on a puzzle win card waits there and is celebrated on the next board
let heldUnlock = null;
export function playHeldUnlock(now) {
  if (!heldUnlock) return;
  const { i, finale } = heldUnlock; heldUnlock = null;
  celebrateUnlock(i, finale, now);
}
// unlock every theme whose task is done; celebrate the first new one
export function checkUnlocks(now) {
  const got = [];
  THEMES.forEach((th, i) => {
    const u = UNLOCKS[th.id];
    if (u && isLocked(i) && u.val(stats) >= u.goal) { earned.add(i); fresh.add(i); got.push(i); }
  });
  if (!got.length) return;
  saveMeta();
  for (const j of got) taskToast(t(UNLOCKS[THEMES[j].id].text), t(THEMES[j].name)); // say which task opened which theme, right when it is done
  const fin = got.find(j => FINALES[THEMES[j].id]), finale = fin !== undefined; // a collection's last theme gets a bigger moment
  const i = finale ? fin : got[0];
  if (mode().themeLocked) { // a level never changes theme halfway: the end card names it and the next board celebrates it
    heldUnlock = { i, finale };
    if (state.puz.gems) state.puz.opened.push(...got.map(j => t(THEMES[j].name)));
    return;
  }
  celebrateUnlock(i, finale, now);
}
function celebrateUnlock(i, finale, now) {
  if (settings.auto) state.pendingTheme = { i, at: now + 700, unlocked: true, finale }; // auto mode moves straight to the new theme
  else {
    state.banner = { name: t(THEMES[i].name), sub: finale ? t(FINALES[THEMES[i].id]) : t('YENİ TEMA AÇILDI'), t0: now + 700, dur: finale ? 3600 : 2300 };
    setTimeout(() => { burst(performance.now()); Sfx.themeChange(); buzz([12, 50, 12]); }, 650);
  }
  if (finale) setTimeout(() => {
    for (let k = 0; k < 4; k++) setTimeout(() => burst(performance.now()), k * 380);
    state.flash = { t0: performance.now() };
    Sfx.fullClear(); buzz([30, 40, 30, 40, 80]);
  }, 1100);
}
// in auto mode the theme steps through the open themes as the score passes each milestone
export function autoTheme(st) {
  const order = [...discovered].sort((a, b) => a - b);
  const k = Math.max(0, order.indexOf(theme.start));
  return order[(k + st) % order.length];
}

// the start theme that makes the auto order land on the current theme at this stage
export function anchorStart(stage) {
  const order = [...discovered].sort((a, b) => a - b), k = Math.max(0, order.indexOf(theme.cur));
  return order[(((k - stage) % order.length) + order.length) % order.length];
}

export const TH = () => THEMES[theme.cur];

// two puzzle tasks are measured against the level list itself, so they follow it if levels are added
UNLOCKS.blueprint.goal = LEVELS.filter(l => l.goal.type === 'clear').length;
UNLOCKS.chess.goal = LEVELS.length * 3;
