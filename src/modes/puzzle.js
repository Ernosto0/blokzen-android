import { N, SHAPES } from '../core/constants.js';
import { Sfx } from '../audio/sfx.js';
import { store } from '../core/store.js';
import { state, emptyGrid, pop } from '../core/state.js';
import { checkUnlocks, stats, STATS_KEY } from '../themes/progress.js';
import { GEM_COLOR, LEVELS, PUZ_KEY, PUZ_SAVE_KEY } from './puzzle-levels.js';
import { canUndo, defineMode, hudInfo } from './registry.js';
import { $ } from '../ui/dom.js';
import { checkOver, refreshFits, save, showOver, STAR_SVG, startLevel } from '../game/flow.js';
import { updateHud, updateUndoBtn } from '../ui/hud.js';
import { fmtN } from '../ui/menu.js';
import { buzz } from '../platform/haptics.js';
import { L } from '../render/layout.js';
import { openLevels } from '../ui/levels.js';
import { tut } from '../ui/tutorial.js';
import { burst } from '../themes/switching.js';

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

// puzzle row: level name (opens the level list), goal progress, pieces left with the stars a win right now would give
export const MINI_STAR = on => STAR_SVG.replace('<svg ', `<svg class="${on ? 'on' : ''}" `);
function updatePuzzleHud() {
  const lv = puzLevel(), g = puzGoal(), left = piecesLeft(), pot = puzStarsFor(left, lv.stars);
  $('puzName').textContent = `${state.puz.li + 1} · ${lv.title}`;
  $('puzTitle').setAttribute('aria-label', `Bölüm ${state.puz.li + 1}, ${lv.title}. Bölüm listesini aç`);
  const goal = $('puzGoal');
  goal.innerHTML = GOAL_ICON[lv.goal.type] + `<span>${g.html}</span>`;
  goal.classList.toggle('done', g.done);
  goal.title = goalText(lv);
  goal.setAttribute('aria-label', `Hedef: ${goalText(lv)}. ${g.label}`);
  const lf = $('puzLeft');
  lf.innerHTML = `<span>${left} parça</span><span class="pst">${[0, 1, 2].map(i => MINI_STAR(i < pot)).join('')}</span>`;
  lf.title = `Kalan parça ${left}. Şimdi bitirirsen ${pot} yıldız`;
  lf.setAttribute('aria-label', lf.title);
  updateUndoBtn();
}

// The goal is reached: the level ends at once. Stars come from the pieces still unused.
function puzWin(now) {
  const lv = puzLevel(), left = Math.max(0, lv.pieces.length - state.moves), st = puzStarsFor(left, lv.stars), before = bestStars(lv.id);
  state.over = true; state.overT0 = now;
  Object.assign(state.puz, { won: true, prev: null, stars: st, left, newBest: before > 0 && st > before });
  if (st > before) puzProg.best[lv.id] = st;
  if (st === 3 && puzProg.lost[lv.id] && !state.puz.failed) puzProg.back[lv.id] = 1; // lost once, now solved cleanly on a fresh try (chalkboard theme)
  if (st === 3 && !state.puz.failed && !state.puz.undoUsed) puzProg.clean[lv.id] = 1; // cracked in one go: no fail, no undo (cipher theme)
  savePuzzle();
  stats.puzzleWins++;
  if (left === 0) stats.puzzleLast++; // the goal fell with the very last piece (detective theme)
  puzCollect();
  store.set(STATS_KEY, stats);
  checkUnlocks(now); // held for the next board; the card names what opened
  store.set(PUZ_SAVE_KEY, null);
  state.drag = null;
  refreshFits(); updateHud();
  const midX = L.gx + L.B / 2 - L.pad;
  state.texts.push({ text: 'Bölüm tamam!', x: midX, y: L.gy + L.cell * 4.1, t0: now + 380, dur: 1500, size: L.cell * 0.9, role: 'accent' });
  setTimeout(() => { if (!state.puz.won) return; burst(performance.now()); Sfx.star(st); buzz([16, 40, 16, 40, 30]); }, 420);
  setTimeout(showOver, state.REDUCED ? 800 : 1500);
}

defineMode({
  id: 'puzzle', saveKey: PUZ_SAVE_KEY, button: 'playPuzzle', restartLabel: 'Bölümü baştan al', levels: false, records: false, countsGame: false, themeLocked: true,
  hud: () => hudInfo({ best: `${state.puz.li + 1}/${LEVELS.length}`, bestTitle: 'Bölüm', icon: 'puz', puzRow: true, undo: true }),
  updateHud: updatePuzzleHud,
  undoInfo: { left: () => state.puz.undoUsed ? 0 : 1, spent: 'Geri alma hakkı kullanıldı' },
});

// win: the level name, its stars and how to earn the next one; fail: what ran out, how far the goal got, and the undo if it is still there
function puzzleOverCard() {
  const lv = puzLevel(), won = state.puz.won, hasNext = state.puz.li + 1 < LEVELS.length;
  $('overTitle').textContent = won ? 'Bölüm tamam' : `Bölüm ${state.puz.li + 1} · ${lv.title}`;
  $('finalScore').textContent = won ? lv.title : state.puz.fail === 'pieces' ? 'Parçalar bitti' : 'Yer kalmadı';
  $('overStars').hidden = !won; $('share').hidden = true;
  $('newRec').textContent = 'Yeni en iyi!'; $('newRec').hidden = !(won && state.puz.newBest);
  const note = $('overNote');
  if (won) {
    $('overStars').innerHTML = [0, 1, 2].map(i => `<span class="star${i < state.puz.stars ? ' on' : ''}">${STAR_SVG}</span>`).join('');
    $('overStars').setAttribute('aria-label', `${state.puz.stars} / 3 yıldız`);
    $('overSub').textContent = `Kalan parça: ${state.puz.left}`;
    const need = state.puz.stars < 3 ? lv.stars[state.puz.stars] - state.puz.left : 0;
    note.textContent = need > 0 ? `${state.puz.stars + 1}. yıldız için ${need} parça daha az kullan.` : hasNext ? '' : 'Bu grubun bütün bölümlerini bitirdin!';
    if (state.puz.opened.length) note.textContent = `Yeni tema açıldı: ${state.puz.opened.join(', ')}!` + (note.textContent ? ' ' + note.textContent : '');
    $('again').textContent = hasNext ? 'Sonraki bölüm' : 'Bölümler';
    $('puzLevels').hidden = !hasNext;
    $('puzRetry').hidden = false; $('puzUndo').hidden = true;
  } else {
    $('overSub').textContent = `Hedef: ${goalText(lv)} · ` + puzGoal().label.replace(/ /g, '\u00a0'); // the progress stays on one line
    const undo = canUndo();
    note.textContent = undo ? 'Son hamleni bir kez geri alabilirsin.' : '';
    if (state.puz.opened.length) note.textContent = `Yeni tema açıldı: ${state.puz.opened.join(', ')}!` + (note.textContent ? ' ' + note.textContent : '');
    $('again').textContent = 'Tekrar dene';
    $('puzRetry').hidden = true; $('puzUndo').hidden = !undo; $('puzLevels').hidden = false;
  }
  note.hidden = !note.textContent;
}
// back one move: board, gems, tray, score, combo and the place in the piece list; once per attempt
function puzUndo() {
  if (!canUndo() || state.drag) return;
  const p = state.puz.prev, now = performance.now();
  state.grid = p.grid.map(r => r.slice()); state.puz.gems = p.gems.map(r => r.slice());
  state.tray = p.tray.map((t, i) => t ? { piece: { shape: SHAPES[t.s], color: t.c }, appear: now + i * 50, ret: null, fits: true } : null);
  state.score = p.score; state.displayScore = state.score; state.combo = p.combo; state.msc = p.msc; state.moves = p.moves; state.fulls = p.fulls; state.puz.seq = p.seq;
  state.puz.prev = null; state.puz.undoUsed = true; state.puz.fail = '';
  state.over = false; $('over').hidden = true;
  state.clearing = []; state.texts = []; state.shake = null; state.flash = null;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) pop[r][c] = state.grid[r][c] ? now + (r + c) * 10 : 0;
  state.texts.push({ text: 'Geri alındı', x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 60, dur: 1000, size: L.cell * 0.6, role: 'fg' });
  if (Sfx.ok()) { Sfx.hiss({ dur: 0.3, vol: 0.06, type: 'bandpass', freq: 3000, to: 600, q: 0.8 }); Sfx.pick(); }
  buzz(12);
  refreshFits(); updateHud(); save();
}

defineMode({
  id: 'puzzle', saveKey: PUZ_SAVE_KEY, button: 'playPuzzle', restartLabel: 'Bölümü baştan al', levels: false, records: false, countsGame: false, themeLocked: true,
  levelCard: true, bodyClass: 'puzzle',
  remember: puzRemember,
  // gems sit on board cells; a cleared gem comes off the list and counts
  cellCleared(r, c) { if (!state.puz.gems[r][c]) return 0; state.puz.gems[r][c] = 0; return 1; },
  cleared({ gemHit, rows, cols }) {
    stats.puzzleBestGems = Math.max(stats.puzzleBestGems, gemHit); // gems broken by one move (domino theme)
    stats.puzzleGemsTotal += gemHit; // every gem ever broken (alchemy theme)
    if (rows && cols) stats.puzzleCross++; // a row and a column in the same move (magic cube theme)
  },
  gemPraise(gemHit) { return !countGems(state.puz.gems) ? 'Son taş!' : gemHit > 1 ? `${gemHit} taş birden!` : 'Bir taş gitti!'; },
  afterMove({ lines }) { stats.puzzlePlaced++; stats.puzzleLines += lines; },
  // a level: its own counters only, no level-ups, theme steps or records; only the puzzle collection's tasks move
  finishMove(now) {
    store.set(STATS_KEY, stats);
    checkUnlocks(now);
    if (puzGoal().done) { puzWin(now); return true; }
    if (state.tray.every(t => !t)) puzDeal(now + 120);
    refreshFits();
    updateHud();
    save();
    checkOver(now);
    return true;
  },
  skipOver: () => state.puz.won,
  boardGems: () => state.puz.gems,
  playTime(dt) { stats.puzzleSec += dt; }, // kept apart: total play time drives a theme task
  // a failed level is not a finished game
  ended() {
    state.puz.fail = state.tray.some(Boolean) ? 'room' : 'pieces';
    state.puz.failed = true;
    if (!puzProg.lost[puzLevel().id]) { puzProg.lost[puzLevel().id] = 1; savePuzzle(); }
  },
  hud: () => hudInfo({ best: `${state.puz.li + 1}/${LEVELS.length}`, bestTitle: 'Bölüm', icon: 'puz', puzRow: true, undo: true }),
  updateHud: updatePuzzleHud,
  undoInfo: { left: () => state.puz.undoUsed ? 0 : 1, spent: 'Geri alma hakkı kullanıldı' },
  canUndo: () => !tut && !state.puz.won && !state.puz.undoUsed && !!state.puz.prev,
  undo: puzUndo,
  overCard: puzzleOverCard,
  // a won level moves on to the next one; otherwise the card's main button starts the level again
  again() {
    if (!state.puz.won) return false;
    if (state.puz.li + 1 < LEVELS.length) startLevel(state.puz.li + 1); else openLevels();
    return true;
  },
});
