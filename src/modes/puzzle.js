import { N, SHAPES, TUT_KEY } from '../core/constants.js';
import { Sfx } from '../audio/sfx.js';
import { store } from '../core/store.js';
import { state, emptyGrid, pop, theme } from '../core/state.js';
import { checkUnlocks, playHeldUnlock, stats, STATS_KEY } from '../themes/progress.js';
import { GEM_COLOR, LEVELS, PUZ_KEY, PUZ_SAVE_KEY } from './puzzle-levels.js';
import { canUndo, defineMode, hudInfo, leaveGame, MODE_KEY, stopTimers } from './registry.js';
import { $ } from '../ui/dom.js';
import { checkOver, newGame, refreshFits, save, showOver, STAR_SVG } from '../game/flow.js';
import { updateHud, updateUndoBtn } from '../ui/hud.js';
import { closeMenu, fmtN, inProgress, prepCanvas, startMode } from '../ui/menu.js';
import { buzz } from '../platform/haptics.js';
import { L } from '../render/layout.js';
import { closeLevels, openLevels } from '../ui/levels.js';
import { startTutorial, tut } from '../ui/tutorial.js';
import { burst } from '../themes/switching.js';
import { readPrev } from './classic.js';
import { applyPrefs } from '../ui/settings.js';
import { drawGemOn, rr, sprite } from '../render/sprites.js';
import { t, lang } from '../i18n/index.js';

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
const comboWord = n => lang === 'tr' ? n + SUFFIX[n % 10] : n; // Turkish takes a suffix after the number
export const goalText = lv => { const g = lv.goal; return g.type === 'gems' ? t('Bütün taşları temizle') : g.type === 'clear' ? t('Tahtayı tamamen boşalt') : g.type === 'score' ? t('{n} puana ulaş', { n: fmtN(g.target) }) : t('{n} kombo yap', { n: comboWord(g.n) }); };
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
  if (g.type === 'gems') { const left = countGems(state.puz.gems); return out(!left, t('Taşlar') + ' ', `${state.puz.gemTotal - left} / ${state.puz.gemTotal}`); }
  if (g.type === 'clear') { const n = state.grid.reduce((k, row) => k + row.filter(Boolean).length, 0); return n ? out(false, t('Kalan') + ' ', t('{n} blok', { n })) : out(true, '', t('Tahta boş')); }
  if (g.type === 'score') return out(state.score >= g.target, t('Puan') + ' ', `${fmtN(state.score)} / ${fmtN(g.target)}`);
  return out(state.combo >= g.n, t('Kombo') + ' ', `${Math.min(state.combo, g.n)} / ${g.n}`);
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
  $('puzName').textContent = `${state.puz.li + 1} · ${t(lv.title)}`;
  $('puzTitle').setAttribute('aria-label', t('Bölüm {n}, {title}. Bölüm listesini aç', { n: state.puz.li + 1, title: t(lv.title) }));
  const goal = $('puzGoal');
  goal.innerHTML = GOAL_ICON[lv.goal.type] + `<span>${g.html}</span>`;
  goal.classList.toggle('done', g.done);
  goal.title = goalText(lv);
  goal.setAttribute('aria-label', t('Hedef: {g}. {l}', { g: goalText(lv), l: g.label }));
  const lf = $('puzLeft');
  lf.innerHTML = `<span>${t('{n} parça', { n: left })}</span><span class="pst">${[0, 1, 2].map(i => MINI_STAR(i < pot)).join('')}</span>`;
  lf.title = t('Kalan parça {n}. Şimdi bitirirsen {s} yıldız', { n: left, s: pot });
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
  state.texts.push({ text: t('Bölüm tamam!'), x: midX, y: L.gy + L.cell * 4.1, t0: now + 380, dur: 1500, size: L.cell * 0.9, role: 'accent' });
  setTimeout(() => { if (!state.puz.won) return; burst(performance.now()); Sfx.star(st); buzz([16, 40, 16, 40, 30]); }, 420);
  setTimeout(showOver, state.REDUCED ? 800 : 1500);
}

// Start a puzzle level from the level list, the menu or the win card. A half-played level of another number is dropped.
export function startLevel(li) {
  if (!levelOpen(li)) return;
  Sfx.unlock(); Sfx.pick(); buzz(10);
  const firstRun = !store.get(TUT_KEY);
  if (state.mode !== 'puzzle') {
    leaveGame();
    if (!state.over && state.grid) save();
    state.mode = 'puzzle'; store.set(MODE_KEY, 'puzzle');
    state.pendingTheme = null; state.banner = null; state.shake = null; state.flash = null; state.drag = null;
    stopTimers();
  }
  state.texts = []; state.over = false; $('over').hidden = true;
  state.puz.li = li;
  newGame();
  applyPrefs();
  closeLevels(); closeMenu();
  if (firstRun) startTutorial();
}

const ART_PUZZLE = [[2, 2, 0, 4, 4], [9, 1, 0, 0, 4], [1, 1, 0, 3, 3], [0, 0, 0, 3, 9], [5, 5, 5, 0, 7]]; // 9: a gem
export function puzzleStatus() {
  if (state.mode === 'puzzle' && state.puz.gems) return { prog: inProgress() && !state.puz.won, li: state.puz.li };
  const d = store.get(PUZ_SAVE_KEY), li = d && d.puz ? LEVELS.findIndex(l => l.id === d.puz.id) : -1;
  return li >= 0 && d.mode === 'puzzle' ? { prog: (d.moves | 0) > 0, li } : { prog: false, li: -1 };
}
$('puzzleLevels').addEventListener('click', () => openLevels());

defineMode({
  id: 'puzzle', saveKey: PUZ_SAVE_KEY, button: 'playPuzzle', restartLabel: 'Bölümü baştan al', levels: false, records: false, countsGame: false, themeLocked: true,
  hud: () => hudInfo({ best: `${state.puz.li + 1}/${LEVELS.length}`, bestTitle: 'Bölüm', icon: 'puz', puzRow: true, undo: true }),
  updateHud: updatePuzzleHud,
  undoInfo: { left: () => state.puz.undoUsed ? 0 : 1, spent: 'Geri alma hakkı kullanıldı' },
});

// win: the level name, its stars and how to earn the next one; fail: what ran out, how far the goal got, and the undo if it is still there
function puzzleOverCard() {
  const lv = puzLevel(), won = state.puz.won, hasNext = state.puz.li + 1 < LEVELS.length;
  $('overTitle').textContent = won ? t('Bölüm tamam') : t('Bölüm {n}', { n: state.puz.li + 1 }) + ' · ' + t(lv.title);
  $('finalScore').textContent = won ? t(lv.title) : state.puz.fail === 'pieces' ? t('Parçalar bitti') : t('Yer kalmadı');
  $('overStars').hidden = !won; $('share').hidden = true;
  $('newRec').textContent = t('Yeni en iyi!'); $('newRec').hidden = !(won && state.puz.newBest);
  const note = $('overNote');
  if (won) {
    $('overStars').innerHTML = [0, 1, 2].map(i => `<span class="star${i < state.puz.stars ? ' on' : ''}">${STAR_SVG}</span>`).join('');
    $('overStars').setAttribute('aria-label', t('{n} / 3 yıldız', { n: state.puz.stars }));
    $('overSub').textContent = t('Kalan parça: {n}', { n: state.puz.left });
    const need = state.puz.stars < 3 ? lv.stars[state.puz.stars] - state.puz.left : 0;
    note.textContent = need > 0 ? t('{s}. yıldız için {n} parça daha az kullan.', { s: state.puz.stars + 1, n: need }) : hasNext ? '' : t('Bu grubun bütün bölümlerini bitirdin!');
    if (state.puz.opened.length) note.textContent = t('Yeni tema açıldı: {names}!', { names: state.puz.opened.join(', ') }) + (note.textContent ? ' ' + note.textContent : '');
    $('again').textContent = hasNext ? t('Sonraki bölüm') : t('Bölümler');
    $('puzLevels').hidden = !hasNext;
    $('puzRetry').hidden = false; $('puzUndo').hidden = true;
  } else {
    $('overSub').textContent = t('Hedef: {g}', { g: goalText(lv) }) + ' · ' + puzGoal().label.replace(/ /g, '\u00a0'); // the progress stays on one line
    const undo = canUndo();
    note.textContent = undo ? t('Son hamleni bir kez geri alabilirsin.') : '';
    if (state.puz.opened.length) note.textContent = t('Yeni tema açıldı: {names}!', { names: state.puz.opened.join(', ') }) + (note.textContent ? ' ' + note.textContent : '');
    $('again').textContent = t('Tekrar dene');
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
  state.clearing = []; state.beams = []; state.rings = []; state.texts = []; state.shake = null; state.flash = null;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) pop[r][c] = state.grid[r][c] ? now + (r + c) * 10 : 0;
  state.texts.push({ text: t('Geri alındı'), x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 60, dur: 1000, size: L.cell * 0.6, role: 'fg' });
  if (Sfx.ok()) { Sfx.hiss({ dur: 0.3, vol: 0.06, type: 'bandpass', freq: 3000, to: 600, q: 0.8 }); Sfx.pick(); }
  buzz(12);
  refreshFits(); updateHud(); save();
}

defineMode({
  id: 'puzzle', saveKey: PUZ_SAVE_KEY, button: 'playPuzzle', restartLabel: 'Bölümü baştan al', levels: false, records: false, countsGame: false, themeLocked: true,
  levelCard: true, bodyClass: 'puzzle',
  drawArt(th) {
  const p = prepCanvas($('artPuzzle'), 'puzzle');
  if (p) { // a small board with two gems set into it
    const { g, w, dpr } = p, pad = w * 0.11, cs = (w - 2 * pad) / 5, px = Math.ceil(cs * dpr);
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    ART_PUZZLE.forEach((row, r) => row.forEach((v, cc) => {
      g.drawImage(sprite(theme.cur, v === 9 ? GEM_COLOR : v, px), pad + cc * cs, pad + r * cs, cs, cs);
      if (v === 9) drawGemOn(g, theme.cur, pad + cc * cs, pad + r * cs, cs, dpr);
    }));
  }
  },
  renderCard() {
  $('puzzleSub').textContent = t('{a} / {b} yıldız', { a: puzTotalStars(), b: LEVELS.length * 3 });
  },
  hero() {
    const ps = puzzleStatus(), nx = nextLevelIndex();
    return {
      label: ps.prog ? t('Devam et') : nx < 0 ? t('Bölümler') : t('Başla'),
      sub: t('Bulmaca') + ' · ' + (ps.prog ? t('Bölüm {n} yarım kaldı', { n: ps.li + 1 }) : nx < 0 ? t('{n} bölümün hepsi çözüldü', { n: puzSolved() }) : t('Bölüm {n}', { n: nx + 1 })),
    };
  },
  // carry on with a half-played level, else start the next unsolved one; with every level solved, show the list
  play() {
    const ps = puzzleStatus(), nx = nextLevelIndex();
    if (ps.prog) startMode('puzzle');
    else if (nx < 0) openLevels();
    else startLevel(nx);
  },
  setup(now) { puzLoad(now); state.dealRng = null; },
  // a level keeps the theme the player is in, and counts nowhere but in the puzzle stats
  start(now) {
    theme.stage = 0;
    puzDeal(now + 200);
    stats.puzzleTries++;
    store.set(STATS_KEY, stats);
    playHeldUnlock(now + 200);
    updateHud();
    save();
    return true;
  },
  snapshot: () => state.puz.gems ? { puz: { id: puzLevel().id, n: puzLevel().pieces.length, seq: state.puz.seq, gems: state.puz.gems, undoUsed: state.puz.undoUsed, prev: state.puz.prev, failed: state.puz.failed } } : {},
  restore(d) {
    const p = d.puz, li = p ? LEVELS.findIndex(l => l.id === p.id) : -1;
    if (li < 0 || p.n !== LEVELS[li].pieces.length || !Array.isArray(p.gems) || p.gems.length !== N) return false; // a level that changed since the save starts fresh
    state.mode = 'puzzle'; state.dealRng = null;
    state.puz = { li, seq: Math.min(LEVELS[li].pieces.length, p.seq | 0), gems: p.gems.map(row => [...Array(N)].map((_, c) => row && row[c] ? 1 : 0)), gemTotal: 0,
      prev: null, undoUsed: !!p.undoUsed, won: false, fail: '', stars: 0, left: 0, newBest: false, failed: !!p.failed, opened: [] };
    state.puz.gemTotal = LEVELS[li].board.join('').split('G').length - 1;
    state.puz.prev = state.puz.undoUsed ? null : readPrev(p.prev, LEVELS[li]);
    return true;
  },
  dealTray: puzDeal,
  beforeFresh() { const n = nextLevelIndex(); state.puz.li = n < 0 ? 0 : n; },
  remember: puzRemember,
  // gems sit on board cells; a cleared gem comes off the list and counts
  cellCleared(r, c) { if (!state.puz.gems[r][c]) return 0; state.puz.gems[r][c] = 0; return 1; },
  cleared({ gemHit, rows, cols }) {
    stats.puzzleBestGems = Math.max(stats.puzzleBestGems, gemHit); // gems broken by one move (domino theme)
    stats.puzzleGemsTotal += gemHit; // every gem ever broken (alchemy theme)
    if (rows && cols) stats.puzzleCross++; // a row and a column in the same move (magic cube theme)
  },
  gemPraise(gemHit) { return !countGems(state.puz.gems) ? t('Son taş!') : gemHit > 1 ? t('{n} taş birden!', { n: gemHit }) : t('Bir taş gitti!'); },
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
