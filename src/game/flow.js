import { stageAt, T, THEMES } from '../themes/catalog.js';
import { BEST_KEY, N, OLD_COLORS, SHAPES } from '../core/constants.js';
import { bitsOf, fitsAnywhere } from '../core/bitboard.js';
import { cellsOf, generateSet } from '../core/dealer.js';
import { colorize, comboMult, fmtMult, levelMult, levelOf, scoreMove } from '../core/scoring.js';
import { Sfx } from '../audio/sfx.js';
import { haptic } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { $ } from '../ui/dom.js';
import { state, discovered, emptyGrid, freshCls, pop, settings, theme } from '../core/state.js';
import { autoTheme, checkUnlocks, DONE_KEY, playHeldUnlock, TH, stats, STATS_KEY, themesDone, touchDay } from '../themes/progress.js';
import { curStreak, dailyStart, fmtDay, starsFor } from '../modes/daily.js';
import { canRevive, leaveGame, mode, MODE_KEY, modeFor, MODES, saveKey, stopTimers } from '../modes/registry.js';
import { L } from '../render/layout.js';
import { burst, edgeBurst, goldRain, lineBlast, pickStartTheme, scoreOrbs, setTheme, snapTheme } from '../themes/switching.js';
import { bumpScore, updateHud } from '../ui/hud.js';
import { fmtN } from '../ui/menu.js';
import { applyPrefs } from '../ui/settings.js';
import { tut } from '../ui/tutorial.js';
import { t, fmtNum } from '../i18n/index.js';
import { bowPraise, cleanPraise, praiseFor } from './praise.js';

/* ---------- Game flow ---------- */
export function deal(now = performance.now()) {
  const set = colorize(generateSet(state.grid, state.moves));
  state.tray = set.map((piece, i) => ({ piece, appear: now + i * 70, ret: null, fits: true }));
  refreshFits();
  Sfx.deal();
}
export function refreshFits() {
  const [lo, hi] = bitsOf(state.grid);
  for (const t of state.tray) if (t) t.fits = fitsAnywhere(lo, hi, t.piece.shape);
}
// One played game, counted once when a classic or daily game ends with at least one piece placed.
// Counting at the start let empty games (new game spam, in and out of the menu) open the "play N games" themes.
function countGame() {
  if (!mode().countsGame || state.moves < 1) return;
  touchDay();
  stats.todayGames++; stats.bestDayGames = Math.max(stats.bestDayGames, stats.todayGames); stats.games++;
}
export function newGame() {
  leaveGame();
  if (state.grid && !state.over && !tut) countGame(); // the game on the board is given up: it counts if a piece was placed
  const now = performance.now();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (state.grid && state.grid[r][c]) state.clearing.push({ r, c, v: state.grid[r][c], t0: now, delay: (r + c) * 18, spawned: true });
  }
  state.grid = emptyGrid();
  const m = mode();
  m.setup(now);
  state.score = 0; state.displayScore = 0; state.orbs = []; state.combo = 0; state.msc = 0; state.moves = 0; state.fulls = 0; state.over = false; state.newRecord = false; state.pendingTheme = null;
  state.cls = freshCls();
  $('over').hidden = true;
  stopTimers();
  state.gs = { multi: 0, calm: 0, broke: false, stars: 0, lines: 0, zcalm: 0, zrun: 0 };
  if (m.start && m.start(now)) return;
  const start = pickStartTheme();
  theme.start = start; theme.stage = 0;
  if (start !== theme.cur) setTheme(start, now + 150, { show: true, sound: false });
  deal(now + 200);
  touchDay();
  if (m.started) m.started(); // zen counts a session here: it never ends, so it is not a played game
  // classic and daily games are counted when they end (countGame), not here
  store.set(STATS_KEY, stats);
  checkUnlocks(now + 400);
  playHeldUnlock(now + 600);
  updateHud();
  save();
}
export function save() {
  store.set(saveKey(), snapshot());
  store.set(BEST_KEY, state.best);
}
export function snapshot() {
  return {
    mode: state.mode, day: 0, rs: state.dealRng ? state.dealRng.s : null,
    grid: state.grid, score: state.score, combo: state.combo, msc: state.msc, moves: state.moves, fulls: state.fulls, gs: state.gs,
    tray: state.tray.map(t => t ? { s: t.piece.shape.id, c: t.piece.color } : null),
    th: { cur: theme.cur, start: theme.start, stage: theme.stage },
    ...(mode().snapshot ? mode().snapshot() : {}), // the mode's own part: the day, the undo history, the puzzle level
  };
}
// keepTheme: entering puzzle from another mode keeps the theme on screen instead of the one saved with the level
export function restore(d, keepTheme = false) {
  if (!d || !Array.isArray(d.grid) || !Array.isArray(d.tray)) return false;
  const m = modeFor(d.mode); // anything unknown is a classic game
  if (m.restore(d) === false) return false; // the mode checks its own part and takes over
  stopTimers();
  state.goalShown = 0; // stars of a restored game light up without the pop
  // v1 saves stored hex colors; map them to color slots
  const conv = v => typeof v === 'string' ? (OLD_COLORS.indexOf(v) + 1 || 1) : (v | 0);
  state.grid = d.grid.map(row => row.map(v => v ? conv(v) : 0));
  state.score = d.score | 0; state.combo = d.combo | 0; state.msc = d.msc | 0; state.over = false; state.newRecord = false;
  state.moves = d.moves != null ? d.moves | 0 : Math.round(state.score / 18); state.fulls = d.fulls | 0;
  state.gs = d.gs && typeof d.gs === 'object' ? { multi: d.gs.multi | 0, calm: d.gs.calm | 0, broke: !!d.gs.broke, stars: d.gs.stars | 0, lines: d.gs.lines | 0, zcalm: d.gs.zcalm | 0, zrun: d.gs.zrun | 0 } : { multi: 0, calm: 0, broke: true, stars: 0, lines: 0, zcalm: 0, zrun: 0 };
  const now = performance.now();
  state.tray = [0, 1, 2].map(i => { const t = d.tray[i]; return t && SHAPES[t.s] ? { piece: { shape: SHAPES[t.s], color: conv(t.c) }, appear: now + i * 70, ret: null, fits: true } : null; });
  if (state.tray.every(t => !t)) { if (m.dealTray) m.dealTray(now); else deal(now); }
  const open = i => discovered.has(i) ? i : 0;
  if (mode().themeLocked && keepTheme) { if (!settings.auto && settings.fixed !== theme.cur) snapTheme(settings.fixed); }
  else if (d.th) { theme.start = open(d.th.start | 0); theme.stage = d.th.stage | 0; snapTheme(settings.auto ? open((d.th.cur | 0) % T) : settings.fixed); }
  else { theme.start = 0; theme.stage = stageAt(state.score); snapTheme(settings.auto ? autoTheme(theme.stage) : settings.fixed); }
  refreshFits();
  state.displayScore = state.score; state.orbs = [];
  return true;
}

// Move between classic and daily. Each mode has its own save, so the game being left is kept and the other one is picked up.
export function switchMode(m) {
  const target = MODES[m];
  if (m === state.mode) {
    if (target.stale && target.stale()) newGame(); // a daily from an earlier day: today's board instead
    return;
  }
  leaveGame();
  if (!state.over && state.grid) save();
  state.mode = m; store.set(MODE_KEY, m);
  state.pendingTheme = null; state.banner = null; state.texts = []; state.orbs = []; state.shake = null; state.flash = null; state.drag = null;
  state.over = false; $('over').hidden = true;
  stopTimers();
  const d = store.get(saveKey());
  if (d && target.canResume(d) && restore(d, target.themeLocked)) { refreshFits(); updateHud(); checkOver(performance.now()); }
  else {
    state.mode = m;
    state.moves = 0; // the board still in memory is the game of the mode just left: it was saved, not given up, so newGame must not count it
    if (target.beforeFresh) target.beforeFresh();
    newGame();
  }
  if (!state.over) playHeldUnlock(performance.now() + 300);
  applyPrefs(); // zen plays a little quieter
}
export function placePiece(slot, r0, c0) {
  const now = performance.now();
  const m = mode();
  if (m.remember) m.remember();
  const { shape, color } = state.tray[slot].piece;
  state.tray[slot] = null;
  for (const [dr, dc] of shape.cells) {
    state.grid[r0 + dr][c0 + dc] = color;
    pop[r0 + dr][c0 + dc] = now + (dr + dc) * 16;
  }
  let gained = 0; state.moves++;
  const lvlBefore = levelOf(state.score);

  const rows = [], cols = [];
  for (let r = 0; r < N; r++) if (state.grid[r].every(Boolean)) rows.push(r);
  for (let c = 0; c < N; c++) if (state.grid.every(row => row[c])) cols.push(c);
  const lines = rows.length + cols.length;
  const pcx = L.gx + (c0 + shape.w / 2) * L.cell, pcy = L.gy + (r0 + shape.h / 2) * L.cell;
  const midX = L.gx + L.B / 2 - L.pad;

  if (lines) {
    state.combo += 1; state.msc = 0;
    const k = Math.min(1 + (lines - 1) * 0.2 + Math.max(0, state.combo - 1) * 0.1, 2); // how hard this clear hits
    const centerR = r0 + shape.h / 2, centerC = c0 + shape.w / 2;
    const hit = new Map();
    for (const r of rows) for (let c = 0; c < N; c++) hit.set(r * N + c, Math.abs(c + 0.5 - centerC));
    for (const c of cols) for (let r = 0; r < N; r++) {
      const k = r * N + c, d = Math.abs(r + 0.5 - centerR);
      hit.set(k, hit.has(k) ? Math.min(hit.get(k), d) : d);
    }
    let gemHit = 0;
    for (const [k, d] of hit) {
      const r = (k / N) | 0, c = k % N, gem = m.cellCleared ? m.cellCleared(r, c) : 0; // 1 for a gem: the puzzle takes it off its board
      state.clearing.push({ r, c, v: state.grid[r][c], t0: now + 60, delay: d * 26, spawned: false, few: hit.size > 16, gem, k });
      state.grid[r][c] = 0; pop[r][c] = 0;
      gemHit += gem;
    }
    lineBlast(rows, cols, pcx, pcy, k, now);
    edgeBurst(rows, cols);
    if (m.cleared) m.cleared({ gemHit, rows: rows.length, cols: cols.length });
    const boardClean = state.grid.every(row => row.every(v => !v));
    const sc = scoreMove(shape.size, lines, state.combo, boardClean, state.fulls, state.score);
    gained = sc.place + sc.clear + sc.full;
    const pts = sc.clear + sc.full;
    const grow = Math.min(1.7, 1 + pts / 2500);

    state.texts.push({ text: '+' + fmtNum(pts), x: pcx, y: pcy, t0: now + 80, dur: 950, size: L.cell * 0.62 * grow, role: pts >= 400 ? 'accent' : 'fg' });
    let praise = boardClean ? (state.fulls ? t('Tertemiz ×{n}!', { n: state.fulls + 1 }) : cleanPraise()) : praiseFor(lines, state.combo);
    if (gemHit && !boardClean && m.gemPraise) praise = m.gemPraise(gemHit);
    if (praise) state.texts.push({ text: praise, x: midX, y: L.gy + L.cell * 2.6, t0: now + 120, dur: boardClean ? 1500 : 1100, size: L.cell * (boardClean ? 1.0 : 0.82), role: 'accent' });
    if (rows.length && cols.length && TH().fx.edge) state.texts.push({ text: bowPraise(), x: pcx, y: pcy - L.cell * 0.9, t0: now + 160, dur: 1000, size: L.cell * 0.7, role: 'accent' });
    if (state.combo >= 2) { // a big bouncy combo word that grows and changes colour as the combo climbs, the multiplier under it
      const cy = L.gy + L.cell * (praise ? (boardClean ? 3.9 : 3.7) : 2.8), size = L.cell * 0.7 * Math.min(1.7, 1 + (state.combo - 2) * 0.1);
      state.texts.push({ text: t('Kombo ×{c}', { c: state.combo }), sub: t('Puan {m}', { m: fmtMult(comboMult(state.combo)) }), x: midX, y: cy, t0: now + 200, dur: 1300, size, combo: state.combo });
    }
    scoreOrbs([...hit.keys()].map(k => [(k / N) | 0, k % N]), pts, TH().accent, now);
    if (boardClean) {
      state.fulls++;
      state.texts.push({ text: t('+{n} bonus', { n: fmtNum(sc.full) }), x: midX, y: L.gy + L.cell * (state.combo >= 2 ? 6 : 5.2), t0: now + 320, dur: 1400, size: L.cell * 0.6, role: 'accent' });
      state.flash = { t0: now + 80, a: 0.12, dur: 600 };
      burst(now + 60);
      goldRain(now);
      Sfx.fullClear();
      haptic.clean();
    }

    if (!state.REDUCED && mode().shake) state.shake = { amp: Math.min(2 + lines * 1.5 + state.combo * 0.5 + (boardClean ? 3 : 0), 8), t0: now + 60 };
    Sfx.clear(lines, state.combo);
    if (!boardClean) haptic.clear(lines, state.combo);
  } else {
    gained = scoreMove(shape.size, 0, 0, false, 0, state.score).place;
    state.msc += 1;
    if (state.msc >= 3) state.combo = 0;
    Sfx.place();
    haptic.place();
  }

  state.score += gained;
  if (m.afterMove) m.afterMove({ now, midX, lines });
  bumpScore();
  if (m.finishMove && m.finishMove(now)) return; // the puzzle ends or continues a move its own way
  const lvl = levelOf(state.score);
  if (lvl > lvlBefore && mode().levels) {
    state.texts.push({ text: t('Seviye {n} · Puan {m}', { n: lvl, m: fmtMult(levelMult(lvl)) }), x: midX, y: L.gy + L.cell * 6.4, t0: now + (lines ? 900 : 400), dur: 1800, size: L.cell * 0.52, role: 'accent' });
    $('lvl').classList.add('up'); setTimeout(() => $('lvl').classList.remove('up'), 900);
  }

  if (settings.auto) {
    const st = stageAt(state.score);
    if (st > theme.stage) { theme.stage = st; state.pendingTheme = { i: autoTheme(st), at: now + (lines ? 650 : 250) }; }
  }
  // single-game records (best score, longest combo, most moves...) only count outside zen, where a game can end;
  // totals count in every mode
  const oneGame = mode().records;
  if (oneGame) {
    stats.bestScore = Math.max(stats.bestScore, state.score);
    stats.bestCombo = Math.max(stats.bestCombo, state.combo);
    stats.bestFulls = Math.max(stats.bestFulls, state.fulls);
    stats.bestMoves = Math.max(stats.bestMoves, state.moves);
  }
  stats.bestLines = Math.max(stats.bestLines, lines);
  stats.totalLines += lines;
  if (lines && state.grid.every(row => row.every(v => !v))) stats.totalFulls++;
  stats.totalScore += gained;
  stats.totalPlaced++;
  touchDay();
  if (lines >= 2 && oneGame) { state.gs.multi++; stats.bestMulti = Math.max(stats.bestMulti, state.gs.multi); }
  if (lines >= 2) stats.pops++;
  if (lines >= 3) stats.total3++;
  if (rows.length && cols.length) stats.crossMoves++;
  if (!state.gs.broke && oneGame) { if (cellsOf(...bitsOf(state.grid)) > 32) state.gs.broke = true; else { state.gs.calm = state.moves; stats.bestCalm = Math.max(stats.bestCalm, state.gs.calm); } }
  store.set(STATS_KEY, stats);
  checkUnlocks(now);

  if (state.tray.every(t => !t)) deal(now + 120);
  refreshFits();
  updateHud();
  save();
  checkOver(now);
}
// a finished game: time of day, which theme it ended in, scoring streak
export function gameEnded() {
  countGame();
  const hr = new Date().getHours();
  if (hr >= 5 && hr < 9) stats.morningGames++;
  if (hr >= 18 && hr < 21) stats.duskGames++;
  themesDone.add(THEMES[theme.cur].id); store.set(DONE_KEY, [...themesDone]); stats.themesDone = themesDone.size;
  stats.streak10k = state.score >= 10000 ? stats.streak10k + 1 : 0;
  stats.bestStreak10k = Math.max(stats.bestStreak10k, stats.streak10k);
  store.set(STATS_KEY, stats);
  checkUnlocks(performance.now() + 900);
}
// The fullest rows and columns drift away, one by one (at least two, at most five), until a waiting piece fits again. No points.
export function clearFullest(now) {
  const g = state.grid.map(row => row.slice());
  const lines = [];
  for (let r = 0; r < N; r++) lines.push({ cells: [...Array(N)].map((_, c) => [r, c]) });
  for (let c = 0; c < N; c++) lines.push({ cells: [...Array(N)].map((_, r) => [r, c]) });
  const anyFits = () => { const [lo, hi] = bitsOf(g); return state.tray.some(t => t && fitsAnywhere(lo, hi, t.piece.shape)); };
  const picked = [];
  while (picked.length < 5) {
    let bestL = null, bestN = 0;
    for (const L2 of lines) {
      if (picked.includes(L2)) continue;
      const n = L2.cells.filter(([r, c]) => g[r][c]).length;
      if (n > bestN || (n === bestN && bestL && Math.random() < 0.5)) { bestN = n; bestL = L2; }
    }
    if (!bestL || !bestN) break;
    picked.push(bestL);
    for (const [r, c] of bestL.cells) g[r][c] = 0;
    if (picked.length >= 2 && anyFits()) break;
  }
  const seen = new Set();
  picked.forEach((L2, k) => L2.cells.forEach(([r, c], j) => {
    const key = r * N + c;
    if (seen.has(key) || !state.grid[r][c]) return;
    seen.add(key);
    state.clearing.push({ r, c, v: state.grid[r][c], t0: now + 80, delay: k * 140 + Math.abs(j + 0.5 - N / 2) * 55, spawned: false, few: true });
    state.grid[r][c] = 0; pop[r][c] = 0;
  }));
}
export function checkOver(now) {
  const m = mode();
  if (m.skipOver && m.skipOver()) return; // a won level has nothing left to check
  if (state.tray.some(t => t && t.fits)) return;
  if (m.stuck && m.stuck()) return; // zen never ends: the board breathes out instead
  state.over = true; state.overT0 = now + 450;
  if (m.ended) m.ended(now); else gameEnded();
  setTimeout(() => Sfx.over(), 400);
  if (state.newRecord) Sfx.record();
  setTimeout(showOver, 450 + N * 70 + 350);
  if (!(m.keepSave && m.keepSave())) store.set(saveKey(), null); // classic keeps the game while a second chance is on offer
  store.set(BEST_KEY, state.best);
}
export function showOver() {
  if (!state.over) return; // a new game started meanwhile
  const m = mode(), lvl = !!m.levelCard;
  $('finalScore').classList.toggle('txt', lvl);
  $('overStars').classList.toggle('big', lvl);
  $('puzRetry').hidden = $('puzLevels').hidden = $('puzUndo').hidden = !lvl;
  $('toMenu').hidden = lvl;
  $('puzUndo').textContent = t('Geri al');
  const rv = canRevive();
  $('revive').hidden = !rv;
  $('again').className = rv ? 'ghost' : 'cta'; // with a continue on offer, a new game is the quieter choice
  m.overCard(rv); // the mode fills in its own card
  $('over').hidden = false;
  $(rv ? 'revive' : 'again').focus({ preventScroll: true });
}

// three stars, each labelled with its target score; filled up to n
export const STAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.9 6.45.75-4.78 4.4 1.3 6.37L12 17.05l-5.72 3.17 1.3-6.37L2.8 9.45l6.45-.75z"/></svg>';
export function paintStars(el, n, tg) {
  el.innerHTML = tg.map((t, i) => `<span class="star${i < n ? ' on' : ''}">${STAR_SVG}<small>${fmtN(t)}</small></span>`).join('');
  el.setAttribute('aria-label', t('{n} / 3 yıldız', { n }));
}
export function shareText() {
  const tg = dailyStart(state.gameDay).targets, st = starsFor(state.score, tg), sk = curStreak();
  return `${t('Blokzen Günlük')} · ${fmtDay(state.gameDay)}\n${'★'.repeat(st)}${'☆'.repeat(3 - st)}  ${t('{n} puan', { n: fmtN(state.score) })}` + (sk ? `\n${t('Seri: {n} gün', { n: sk })}` : '');
}

export function resetShare() { clearTimeout(state.shareTimer); $('share').textContent = t('Sonucu kopyala'); }
export async function copyText(text) {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; } } catch (e) {}
  try {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (e) { return false; }
}
