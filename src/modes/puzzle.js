import { SHAPES } from '../core/constants.js';
import { Sfx } from '../audio/sfx.js';
import { store } from '../core/store.js';
import { state, emptyGrid, pop } from '../core/state.js';
import { stats } from '../themes/progress.js';
import { GEM_COLOR, LEVELS, PUZ_KEY } from './puzzle-levels.js';
import { refreshFits } from '../game/flow.js';
import { fmtN } from '../ui/menu.js';

// best stars per level id; levels that have been lost once, and those later won with three stars (chalkboard theme) (saved)
// clean: levels solved with three stars in one attempt that never ran out and never used the undo (cipher theme)
export let puzProg = { best: {}, lost: {}, back: {}, clean: {} };
// failed: this attempt has already run out once (an undo does not wash it out); opened: theme names a win just unlocked

export const puzLevel = () => LEVELS[state.puz.li];
export const bestStars = id => puzProg.best[id] | 0;
export const levelOpen = i => i >= 0 && i < LEVELS.length && (i === 0 || bestStars(LEVELS[i - 1].id) > 0);
export const puzTotalStars = () => LEVELS.reduce((n, l) => n + bestStars(l.id), 0);
export const puzSolved = () => LEVELS.filter(l => bestStars(l.id) > 0).length;
export const nextLevelIndex = () => LEVELS.findIndex(l => !bestStars(l.id)); // first unsolved level, -1 when all are done
export const puzStarsFor = (left, th) => left >= th[2] ? 3 : left >= th[1] ? 2 : 1;
export const piecesLeft = () => puzLevel().pieces.length - state.moves;
export const countGems = g => g ? g.reduce((n, row) => n + row.filter(Boolean).length, 0) : 0;
const SUFFIX = ["'lu", "'li", "'li", "'lü", "'lü", "'li", "'lı", "'li", "'li", "'lu"];
const comboWord = n => n + SUFFIX[n % 10];
export const goalText = lv => { const g = lv.goal; return g.type === 'gems' ? 'Bütün taşları temizle' : g.type === 'clear' ? 'Tahtayı tamamen boşalt' : g.type === 'score' ? `${fmtN(g.target)} puana ulaş` : `${comboWord(g.n)} kombo yap`; };
export const GOAL_ICON = {
  gems: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6l4.6 5.1L12 21.4 7.4 7.7z" opacity=".55"/><path d="M7.4 7.7L12 2.6 3.4 7.7l8.6 13.7zM16.6 7.7L12 2.6l8.6 5.1L12 21.4z"/></svg>',
  clear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3.5" stroke-dasharray="3.4 3"/></svg>',
  score: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z"/></svg>',
  combo: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 2L4.5 13.6h6.3L9.6 22l9.9-12.4h-6.6z"/></svg>',
};
export function loadPuzzle() {
  const d = store.get(PUZ_KEY);
  if (d && d.best && typeof d.best === 'object') {
    for (const id in d.best) { const v = d.best[id] | 0; if (v > 0) puzProg.best[id] = Math.min(3, v); }
    for (const k of ['lost', 'back', 'clean']) if (d[k] && typeof d[k] === 'object') for (const id in d[k]) if (d[k][id]) puzProg[k][id] = 1;
  }
  puzCollect();
}
// the puzzle collection's counters that are read straight from the progress, so older saves count too
export function puzCollect() {
  stats.puzzleBack = Math.max(stats.puzzleBack, Object.keys(puzProg.back).length);
  stats.puzzleTypes3 = Math.max(stats.puzzleTypes3, new Set(LEVELS.filter(l => bestStars(l.id) === 3).map(l => l.goal.type)).size);
  stats.puzzleClean = Math.max(stats.puzzleClean, Object.keys(puzProg.clean).length);
  stats.puzzleClear3 = Math.max(stats.puzzleClear3, LEVELS.filter(l => l.goal.type === 'clear' && bestStars(l.id) === 3).length);
  stats.puzzleStars = Math.max(stats.puzzleStars, puzTotalStars());
}
export function savePuzzle() { store.set(PUZ_KEY, puzProg); }
// the level's start board, gems and an empty tray
export function puzLoad(now) {
  const lv = puzLevel();
  state.grid = emptyGrid(); state.puz.gems = emptyGrid();
  lv.board.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch === '.') return;
    state.grid[r][c] = ch === 'G' ? (lv.gemColor || GEM_COLOR) : +ch;
    if (ch === 'G') state.puz.gems[r][c] = 1;
    pop[r][c] = now + 260 + (r + c) * 24;
  }));
  state.puz.gemTotal = countGems(state.puz.gems);
  state.puz.seq = 0; state.puz.prev = null; state.puz.undoUsed = false; state.puz.won = false; state.puz.fail = ''; state.puz.newBest = false; state.puz.failed = false; state.puz.opened = [];
}
// the next (up to) three pieces of the list
export function puzDeal(now) {
  const list = puzLevel().pieces;
  state.tray = [0, 1, 2].map(i => {
    const k = state.puz.seq + i;
    return k < list.length ? { piece: { shape: SHAPES[list[k][0]], color: list[k][1] }, appear: now + i * 70, ret: null, fits: true } : null;
  });
  state.puz.seq = Math.min(list.length, state.puz.seq + 3);
  refreshFits();
  if (state.tray.some(Boolean)) Sfx.deal();
}
// where the goal stands: done, and a short label for the HUD
export function puzGoal() {
  const g = puzLevel().goal;
  // word: the leading word, dropped on narrow screens where the icon says it
  const out = (done, word, rest) => ({ done, label: word + rest, html: `<span class="pw">${word}</span>${rest}` });
  if (g.type === 'gems') { const left = countGems(state.puz.gems); return out(!left, 'Taşlar ', `${state.puz.gemTotal - left} / ${state.puz.gemTotal}`); }
  if (g.type === 'clear') { const n = state.grid.reduce((k, row) => k + row.filter(Boolean).length, 0); return n ? out(false, 'Kalan ', `${n} blok`) : out(true, '', 'Tahta boş'); }
  if (g.type === 'score') return out(state.score >= g.target, 'Puan ', `${fmtN(state.score)} / ${fmtN(g.target)}`);
  return out(state.combo >= g.n, 'Kombo ', `${Math.min(state.combo, g.n)} / ${g.n}`);
}
export const trayIds = () => state.tray.map(t => t ? { s: t.piece.shape.id, c: t.piece.color } : null);
// one undo per attempt: keep the state from before the latest move while it is still available
export function puzRemember() {
  state.puz.prev = state.puz.undoUsed ? null : { grid: state.grid.map(r => r.slice()), gems: state.puz.gems.map(r => r.slice()), tray: trayIds(), score: state.score, combo: state.combo, msc: state.msc, moves: state.moves, fulls: state.fulls, seq: state.puz.seq };
}
/* Classic second chances: three undos per game (up to three moves back) and one continue when the board locks up.
   pendingEnd: the game-over card is up but the player may still undo or continue, so the game is not counted as ended yet. */
