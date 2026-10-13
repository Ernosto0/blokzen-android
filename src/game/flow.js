import { stageAt, T, THEMES } from '../themes/catalog.js';
import { BEST_KEY, N, OLD_COLORS, SAVE_KEY, SHAPES, TUT_KEY } from '../core/constants.js';
import { bitsOf, fitsAnywhere } from '../core/bitboard.js';
import { cellsOf, dealStream, generateSet } from '../core/dealer.js';
import { colorize, comboMult, fmtMult, levelMult, levelOf, scoreMove } from '../core/scoring.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { $ } from '../ui/dom.js';
import { state, discovered, emptyGrid, freshCls, pop, settings, theme } from '../core/state.js';
import { autoTheme, checkUnlocks, dayKey, DONE_KEY, playHeldUnlock, stats, STATS_KEY, themesDone, touchDay } from '../themes/progress.js';
import { curStreak, dailyProgress, dailySeed, dailyStart, dayBest, dayRec, fmtDay, saveDaily, starsFor } from '../modes/daily.js';
import { mode, MODE_KEY, MODES, saveKey } from '../modes/registry.js';
import { LEVELS, PUZ_SAVE_KEY } from '../modes/puzzle-levels.js';
import { bestStars, countGems, goalText, levelOpen, nextLevelIndex, puzCollect, puzDeal, puzGoal, puzLevel, puzLoad, puzProg, puzRemember, puzStarsFor, savePuzzle } from '../modes/puzzle.js';
import { canRevive, canUndo, clsRemember, readCls, readPrev, REC_KEYS } from '../modes/classic.js';
import { L } from '../render/layout.js';
import { burst, pickStartTheme, setTheme, snapTheme } from '../themes/switching.js';
import { bumpScore, updateHud } from '../ui/hud.js';
import { closeMenu, fmtN } from '../ui/menu.js';
import { closeLevels } from '../ui/levels.js';
import { applyPrefs } from '../ui/settings.js';
import { startTutorial, tut } from '../ui/tutorial.js';

/* ---------- Game flow ---------- */
function deal(now = performance.now()) {
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
  endClassic();
  if (state.grid && !state.over && !tut) countGame(); // the game on the board is given up: it counts if a piece was placed
  const now = performance.now();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (state.grid && state.grid[r][c]) state.clearing.push({ r, c, v: state.grid[r][c], t0: now, delay: (r + c) * 18, spawned: true });
  }
  state.grid = emptyGrid();
  const pz = state.mode === 'puzzle';
  if (pz) { puzLoad(now); state.dealRng = null; }
  else if (state.mode === 'daily') {
    state.gameDay = dayKey();
    const info = dailyStart(state.gameDay);
    state.dealRng = dealStream(dailySeed(state.gameDay));
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (info.grid[r][c]) { state.grid[r][c] = info.grid[r][c]; pop[r][c] = now + 260 + (r + c) * 24; }
    const rec = dayRec(state.gameDay);
    if (!rec.tries) stats.dailyDays++;
    rec.tries++; stats.dailyGames++;
    saveDaily();
  } else state.dealRng = null;
  state.score = 0; state.displayScore = 0; state.combo = 0; state.msc = 0; state.moves = 0; state.fulls = 0; state.over = false; state.newRecord = false; state.pendingTheme = null;
  state.cls = freshCls();
  $('over').hidden = true;
  cancelBreath();
  state.gs = { multi: 0, calm: 0, broke: false, stars: 0, lines: 0, zcalm: 0, zrun: 0 };
  if (pz) { // a level keeps the theme the player is in, and counts nowhere but in the puzzle stats
    theme.stage = 0;
    puzDeal(now + 200);
    stats.puzzleTries++;
    store.set(STATS_KEY, stats);
    playHeldUnlock(now + 200);
    updateHud();
    save();
    return;
  }
  const start = pickStartTheme();
  theme.start = start; theme.stage = 0;
  if (start !== theme.cur) setTheme(start, now + 150, { show: true, sound: false });
  deal(now + 200);
  touchDay();
  if (state.mode === 'zen') stats.zenSessions++; // a zen session never ends, so it does not count as a played game
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
    mode: state.mode, day: state.mode === 'daily' ? state.gameDay : 0, rs: state.dealRng ? state.dealRng.s : null,
    grid: state.grid, score: state.score, combo: state.combo, msc: state.msc, moves: state.moves, fulls: state.fulls, gs: state.gs,
    tray: state.tray.map(t => t ? { s: t.piece.shape.id, c: t.piece.color } : null),
    th: { cur: theme.cur, start: theme.start, stage: theme.stage },
    ...(state.mode === 'classic' ? { cls: { u: state.cls.undoLeft, c: state.cls.contUsed, h: state.cls.hist } } : {}),
    ...(state.mode === 'puzzle' && state.puz.gems ? { puz: { id: puzLevel().id, n: puzLevel().pieces.length, seq: state.puz.seq, gems: state.puz.gems, undoUsed: state.puz.undoUsed, prev: state.puz.prev, failed: state.puz.failed } } : {}),
  };
}
// keepTheme: entering puzzle from another mode keeps the theme on screen instead of the one saved with the level
export function restore(d, keepTheme = false) {
  if (!d || !Array.isArray(d.grid) || !Array.isArray(d.tray)) return false;
  if (d.mode === 'puzzle') {
    const p = d.puz, li = p ? LEVELS.findIndex(l => l.id === p.id) : -1;
    if (li < 0 || p.n !== LEVELS[li].pieces.length || !Array.isArray(p.gems) || p.gems.length !== N) return false; // a level that changed since the save starts fresh
    state.mode = 'puzzle'; state.dealRng = null;
    state.puz = { li, seq: Math.min(LEVELS[li].pieces.length, p.seq | 0), gems: p.gems.map(row => [...Array(N)].map((_, c) => row && row[c] ? 1 : 0)), gemTotal: 0,
      prev: null, undoUsed: !!p.undoUsed, won: false, fail: '', stars: 0, left: 0, newBest: false, failed: !!p.failed, opened: [] };
    state.puz.gemTotal = LEVELS[li].board.join('').split('G').length - 1;
    state.puz.prev = state.puz.undoUsed ? null : readPrev(p.prev, LEVELS[li]);
  } else if (d.mode === 'daily') {
    if (!(d.day > 20000000) || typeof d.rs !== 'number') return false;
    state.mode = 'daily'; state.gameDay = d.day | 0; state.dealRng = dealStream(d.rs);
  } else { state.mode = d.mode === 'zen' ? 'zen' : 'classic'; state.dealRng = null; }
  if (state.mode === 'classic') state.cls = readCls(d.cls);
  cancelBreath();
  state.goalShown = 0; // stars of a restored game light up without the pop
  // v1 saves stored hex colors; map them to color slots
  const conv = v => typeof v === 'string' ? (OLD_COLORS.indexOf(v) + 1 || 1) : (v | 0);
  state.grid = d.grid.map(row => row.map(v => v ? conv(v) : 0));
  state.score = d.score | 0; state.combo = d.combo | 0; state.msc = d.msc | 0; state.over = false; state.newRecord = false;
  state.moves = d.moves != null ? d.moves | 0 : Math.round(state.score / 18); state.fulls = d.fulls | 0;
  state.gs = d.gs && typeof d.gs === 'object' ? { multi: d.gs.multi | 0, calm: d.gs.calm | 0, broke: !!d.gs.broke, stars: d.gs.stars | 0, lines: d.gs.lines | 0, zcalm: d.gs.zcalm | 0, zrun: d.gs.zrun | 0 } : { multi: 0, calm: 0, broke: true, stars: 0, lines: 0, zcalm: 0, zrun: 0 };
  const now = performance.now();
  state.tray = [0, 1, 2].map(i => { const t = d.tray[i]; return t && SHAPES[t.s] ? { piece: { shape: SHAPES[t.s], color: conv(t.c) }, appear: now + i * 70, ret: null, fits: true } : null; });
  if (state.tray.every(t => !t)) { if (state.mode === 'puzzle') puzDeal(now); else deal(now); }
  const open = i => discovered.has(i) ? i : 0;
  if (mode().themeLocked && keepTheme) { if (!settings.auto && settings.fixed !== theme.cur) snapTheme(settings.fixed); }
  else if (d.th) { theme.start = open(d.th.start | 0); theme.stage = d.th.stage | 0; snapTheme(settings.auto ? open((d.th.cur | 0) % T) : settings.fixed); }
  else { theme.start = 0; theme.stage = stageAt(state.score); snapTheme(settings.auto ? autoTheme(theme.stage) : settings.fixed); }
  refreshFits();
  state.displayScore = state.score;
  return true;
}

// Move between classic and daily. Each mode has its own save, so the game being left is kept and the other one is picked up.
export function switchMode(m) {
  if (m === state.mode) {
    if (m === 'daily' && state.gameDay !== dayKey()) newGame(); // a daily from an earlier day: today's board instead
    return;
  }
  endClassic();
  if (!state.over && state.grid) save();
  state.mode = m; store.set(MODE_KEY, m);
  state.pendingTheme = null; state.banner = null; state.texts = []; state.shake = null; state.flash = null; state.drag = null;
  state.over = false; $('over').hidden = true;
  cancelBreath();
  const d = store.get(saveKey());
  if (d && (d.mode || 'classic') === m && (m !== 'daily' || d.day === dayKey()) && restore(d, MODES[m].themeLocked)) { refreshFits(); updateHud(); checkOver(performance.now()); }
  else {
    state.mode = m;
    state.moves = 0; // the board still in memory is the game of the mode just left: it was saved, not given up, so newGame must not count it
    if (m === 'puzzle') { const n = nextLevelIndex(); state.puz.li = n < 0 ? 0 : n; }
    newGame();
  }
  if (!state.over) playHeldUnlock(performance.now() + 300);
  applyPrefs(); // zen plays a little quieter
}
// Start a puzzle level from the level list, the menu or the win card. A half-played level of another number is dropped.
export function startLevel(li) {
  if (!levelOpen(li)) return;
  Sfx.unlock(); Sfx.pick(); buzz(10);
  const firstRun = !store.get(TUT_KEY);
  if (state.mode !== 'puzzle') {
    endClassic();
    if (!state.over && state.grid) save();
    state.mode = 'puzzle'; store.set(MODE_KEY, 'puzzle');
    state.pendingTheme = null; state.banner = null; state.shake = null; state.flash = null; state.drag = null;
    cancelBreath();
  }
  state.texts = []; state.over = false; $('over').hidden = true;
  state.puz.li = li;
  newGame();
  applyPrefs();
  closeLevels(); closeMenu();
  if (firstRun) startTutorial();
}

export function placePiece(slot, r0, c0) {
  const now = performance.now();
  const pz = state.mode === 'puzzle';
  if (pz) puzRemember();
  else if (state.mode === 'classic') clsRemember();
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
    const centerR = r0 + shape.h / 2, centerC = c0 + shape.w / 2;
    const hit = new Map();
    for (const r of rows) for (let c = 0; c < N; c++) hit.set(r * N + c, Math.abs(c + 0.5 - centerC));
    for (const c of cols) for (let r = 0; r < N; r++) {
      const k = r * N + c, d = Math.abs(r + 0.5 - centerR);
      hit.set(k, hit.has(k) ? Math.min(hit.get(k), d) : d);
    }
    let gemHit = 0;
    for (const [k, d] of hit) {
      const r = (k / N) | 0, c = k % N, gem = pz && state.puz.gems[r][c] ? 1 : 0;
      state.clearing.push({ r, c, v: state.grid[r][c], t0: now + 60, delay: d * 26, spawned: false, few: hit.size > 16, gem });
      state.grid[r][c] = 0; pop[r][c] = 0;
      if (gem) { state.puz.gems[r][c] = 0; gemHit++; }
    }
    if (pz) {
      stats.puzzleBestGems = Math.max(stats.puzzleBestGems, gemHit); // gems broken by one move (domino theme)
      stats.puzzleGemsTotal += gemHit; // every gem ever broken (alchemy theme)
      if (rows.length && cols.length) stats.puzzleCross++; // a row and a column in the same move (magic cube theme)
    }
    const boardClean = state.grid.every(row => row.every(v => !v));
    const sc = scoreMove(shape.size, lines, state.combo, boardClean, state.fulls, state.score);
    gained = sc.place + sc.clear + sc.full;
    const pts = sc.clear + sc.full;
    const grow = Math.min(1.7, 1 + pts / 2500);

    state.texts.push({ text: '+' + pts.toLocaleString('tr-TR'), x: pcx, y: pcy, t0: now + 80, dur: 950, size: L.cell * 0.62 * grow, role: pts >= 400 ? 'accent' : 'fg' });
    let praise = boardClean ? (state.fulls ? `Tertemiz ×${state.fulls + 1}!` : 'Tahta tertemiz!') : lines >= 4 ? 'Muhteşem!' : lines === 3 ? 'Harika!' : lines === 2 ? 'Güzel!' : null;
    if (gemHit && !boardClean) { const gl = countGems(state.puz.gems); praise = !gl ? 'Son taş!' : gemHit > 1 ? `${gemHit} taş birden!` : 'Bir taş gitti!'; }
    if (praise) state.texts.push({ text: praise, x: midX, y: L.gy + L.cell * 2.6, t0: now + 120, dur: boardClean ? 1500 : 1100, size: L.cell * (boardClean ? 1.0 : 0.82), role: 'accent' });
    if (state.combo >= 2) state.texts.push({ text: `Kombo ${state.combo} · Puan ${fmtMult(comboMult(state.combo))}`, x: midX, y: L.gy + L.cell * (praise ? (boardClean ? 3.8 : 3.6) : 2.8), t0: now + 200, dur: 1050, size: L.cell * 0.5 * Math.min(1.45, 1 + state.combo * 0.05), role: 'fg' });
    if (boardClean) {
      state.fulls++;
      state.texts.push({ text: '+' + sc.full.toLocaleString('tr-TR') + ' bonus', x: midX, y: L.gy + L.cell * 5.2, t0: now + 320, dur: 1400, size: L.cell * 0.6, role: 'accent' });
      state.flash = { t0: now + 80 };
      burst(now + 60);
      Sfx.fullClear();
      buzz([30, 40, 30, 40, 60]);
    }

    if (!state.REDUCED && mode().shake) state.shake = { amp: Math.min(3 + lines * 3 + state.combo + (boardClean ? 8 : 0), 20), t0: now + 60 };
    Sfx.clear(lines, state.combo);
    buzz(lines >= 2 ? [18, 30, 24] : 20);
  } else {
    gained = scoreMove(shape.size, 0, 0, false, 0, state.score).place;
    state.msc += 1;
    if (state.msc >= 3) state.combo = 0;
    Sfx.place();
    buzz(10);
  }

  state.score += gained;
  if (state.mode === 'daily') {
    const db = dayBest(state.gameDay);
    if (state.score > db && !state.newRecord && db > 0) state.newRecord = true;
    dailyProgress(now, midX);
  } else if (state.mode === 'zen') {
    state.gs.lines += lines; stats.zenLines += lines; stats.zenMoves++;
    if (lines && state.grid.every(row => row.every(v => !v))) stats.zenFulls++;
    state.gs.zrun++; stats.zenBestRun = Math.max(stats.zenBestRun, state.gs.zrun); // moves since the last breath (batik theme)
    if (cellsOf(...bitsOf(state.grid)) > 32) state.gs.zcalm = 0; // moves in a row with the board at most half full (andes theme)
    else { state.gs.zcalm++; stats.zenBestCalm = Math.max(stats.zenBestCalm, state.gs.zcalm); }
  }
  else if (pz) { stats.puzzlePlaced++; stats.puzzleLines += lines; }
  else if (state.score > state.best) { if (!state.newRecord && state.best > 0) state.newRecord = true; state.best = state.score; }
  bumpScore();
  if (pz) { // a level: its own counters only, no level-ups, theme steps or records; only the puzzle collection's tasks move
    store.set(STATS_KEY, stats);
    checkUnlocks(now);
    if (puzGoal().done) { puzWin(now); return; }
    if (state.tray.every(t => !t)) puzDeal(now + 120);
    refreshFits();
    updateHud();
    save();
    checkOver(now);
    return;
  }
  const lvl = levelOf(state.score);
  if (lvl > lvlBefore && mode().levels) {
    state.texts.push({ text: `Seviye ${lvl} · Puan ${fmtMult(levelMult(lvl))}`, x: midX, y: L.gy + L.cell * 6.4, t0: now + (lines ? 900 : 400), dur: 1800, size: L.cell * 0.52, role: 'accent' });
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
  if (lines >= 3) stats.total3++;
  if (!state.gs.broke && oneGame) { if (cellsOf(...bitsOf(state.grid)) > 32) state.gs.broke = true; else { state.gs.calm = state.moves; stats.bestCalm = Math.max(stats.bestCalm, state.gs.calm); } }
  store.set(STATS_KEY, stats);
  checkUnlocks(now);

  if (state.tray.every(t => !t)) deal(now + 120);
  refreshFits();
  updateHud();
  save();
  checkOver(now);
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
// a finished game: time of day, which theme it ended in, scoring streak
function gameEnded() {
  countGame();
  const hr = new Date().getHours();
  if (hr >= 5 && hr < 9) stats.morningGames++;
  themesDone.add(THEMES[theme.cur].id); store.set(DONE_KEY, [...themesDone]); stats.themesDone = themesDone.size;
  stats.streak10k = state.score >= 10000 ? stats.streak10k + 1 : 0;
  stats.bestStreak10k = Math.max(stats.bestStreak10k, stats.streak10k);
  store.set(STATS_KEY, stats);
  checkUnlocks(performance.now() + 900);
}
// Zen breath: clear the fullest rows and columns one by one (at least two, at most five) until a waiting piece fits again.
// Cells drift away in a slow wave from the line's middle; no points, the combo rests.
let breathTimer = 0;
function cancelBreath() { clearTimeout(breathTimer); breathTimer = 0; }
// The fullest rows and columns drift away, one by one (at least two, at most five), until a waiting piece fits again. No points.
function clearFullest(now) {
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
function zenBreath(now) {
  clearFullest(now);
  state.combo = 0; state.msc = 0; state.gs.zrun = 0;
  stats.zenBreaths++; store.set(STATS_KEY, stats);
  checkUnlocks(now);
  state.texts.push({ text: 'Nefes al, devam et', x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 160, dur: 1900, size: L.cell * 0.66, role: 'accent' });
  Sfx.breath(); buzz([8, 60, 8]);
  refreshFits();
  if (!state.tray.some(t => t && t.fits)) deal(now + 500); // the cleared board still has no room for these pieces: new ones
  updateHud();
  save();
}
export function checkOver(now) {
  if (state.mode === 'puzzle' && state.puz.won) return;
  if (state.tray.some(t => t && t.fits)) return;
  if (state.mode === 'zen') { // zen never ends: after a short pause, the board breathes out
    if (!breathTimer) breathTimer = setTimeout(() => {
      breathTimer = 0;
      if (state.mode === 'zen' && !tut && !state.over && state.grid && !state.tray.some(t => t && t.fits)) zenBreath(performance.now());
    }, 650);
    return;
  }
  state.over = true; state.overT0 = now + 450;
  if (state.mode === 'puzzle') { // a failed level is not a finished game
    state.puz.fail = state.tray.some(Boolean) ? 'room' : 'pieces';
    state.puz.failed = true;
    if (!puzProg.lost[puzLevel().id]) { puzProg.lost[puzLevel().id] = 1; savePuzzle(); }
  }
  else if (state.mode === 'classic' && (canRevive() || canUndo())) state.cls.pendingEnd = true; // a second chance is still there: the game stays saved
  else gameEnded();
  setTimeout(() => Sfx.over(), 400);
  if (state.newRecord) Sfx.record();
  setTimeout(showOver, 450 + N * 70 + 350);
  if (!(state.mode === 'classic' && state.cls.pendingEnd)) store.set(saveKey(), null);
  store.set(BEST_KEY, state.best);
}
// A classic game whose game-over card offered a second chance is counted as finished once the player moves on without it
function endClassic() {
  if (!state.cls.pendingEnd) return;
  state.cls.pendingEnd = false;
  gameEnded();
  store.set(SAVE_KEY, null);
}
// Classic continue, once per game: the board breathes out like zen, the combo rests, and play goes on
export function classicRevive() {
  if (!state.over || !canRevive() || state.drag) return;
  const now = performance.now();
  state.cls.contUsed = true; state.cls.pendingEnd = false; state.cls.hist = []; // the moves before the continue cannot be undone any more
  state.over = false; $('over').hidden = true;
  state.texts = []; state.shake = null; state.flash = null;
  clearFullest(now);
  state.combo = 0; state.msc = 0;
  state.texts.push({ text: 'İkinci şans!', x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 160, dur: 1700, size: L.cell * 0.8, role: 'accent' });
  Sfx.breath(); buzz([8, 60, 8]);
  refreshFits();
  if (!state.tray.some(t => t && t.fits)) deal(now + 500); // the cleared board still has no room for these pieces: new ones
  updateHud(); save();
}
// Classic undo: back one move (board, tray, score, combo, level step and the records it set); three per game
function classicUndo() {
  if (!canUndo() || state.drag) return;
  const p = state.cls.hist.pop(), now = performance.now();
  state.cls.undoLeft--;
  while (state.cls.hist.length > state.cls.undoLeft) state.cls.hist.shift();
  state.grid = p.grid.map(r => r.slice());
  state.tray = p.tray.map((t, i) => t ? { piece: { shape: SHAPES[t.s], color: t.c }, appear: now + i * 50, ret: null, fits: true } : null);
  state.score = p.score; state.displayScore = state.score; state.combo = p.combo; state.msc = p.msc; state.moves = p.moves; state.fulls = p.fulls; state.gs = { ...p.gs };
  theme.stage = p.stage; state.pendingTheme = null;
  state.best = Math.min(state.best, p.best); state.newRecord = p.newRecord;
  for (const k of REC_KEYS) stats[k] = Math.min(stats[k], p.rec[k]);
  store.set(STATS_KEY, stats);
  state.cls.pendingEnd = false;
  state.over = false; $('over').hidden = true;
  state.clearing = []; state.texts = []; state.shake = null; state.flash = null;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) pop[r][c] = state.grid[r][c] ? now + (r + c) * 10 : 0;
  state.texts.push({ text: state.cls.undoLeft ? `Geri alındı · ${state.cls.undoLeft} hak kaldı` : 'Geri alındı · son hak', x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 60, dur: 1100, size: L.cell * 0.56, role: 'fg' });
  if (Sfx.ok()) { Sfx.hiss({ dur: 0.3, vol: 0.06, type: 'bandpass', freq: 3000, to: 600, q: 0.8 }); Sfx.pick(); }
  buzz(12);
  refreshFits(); updateHud(); save();
}
export const doUndo = () => state.mode === 'puzzle' ? puzUndo() : classicUndo();
function showOver() {
  if (!state.over) return; // a new game started meanwhile
  const pz = state.mode === 'puzzle';
  $('finalScore').classList.toggle('txt', pz);
  $('overStars').classList.toggle('big', pz);
  $('puzRetry').hidden = $('puzLevels').hidden = $('puzUndo').hidden = !pz;
  $('toMenu').hidden = pz;
  $('puzUndo').textContent = 'Geri al';
  const rv = canRevive();
  $('revive').hidden = !rv;
  $('again').className = rv ? 'ghost' : 'cta'; // with a continue on offer, a new game is the quieter choice
  if (pz) { showPuzzleOver(); return; }
  const dl = state.mode === 'daily';
  $('finalScore').textContent = fmtN(state.score);
  $('overTitle').textContent = dl ? 'Günlük · ' + fmtDay(state.gameDay) : 'Yer kalmadı';
  $('newRec').textContent = dl ? 'Bugünün rekoru!' : 'Yeni rekor!';
  $('newRec').hidden = !state.newRecord;
  $('overStars').hidden = !dl; $('share').hidden = !dl;
  $('again').textContent = dl ? 'Tekrar dene' : 'Tekrar oyna';
  if (dl) {
    const tg = dailyStart(state.gameDay).targets, st = starsFor(state.score, tg), dayStars = dayRec(state.gameDay).stars;
    paintStars($('overStars'), st, tg);
    const next = tg.find(t => t > state.score);
    $('overSub').textContent = `Bugünün en iyisi: ${fmtN(dayBest(state.gameDay))}` + (dayStars > st ? ` · ${dayStars} yıldız` : '');
    const sk = curStreak();
    $('overNote').textContent = next ? `Sonraki yıldız ${fmtN(next)} puanda.` + (sk ? ` Seri: ${sk} gün.` : '') : (sk ? `Seri: ${sk} gün. Yarın yeni tahta!` : 'Yarın yeni tahta!');
    $('overNote').hidden = false;
    resetShare();
  } else {
    $('overSub').textContent = `En iyi: ${fmtN(state.best)}`;
    const un = canUndo();
    $('puzUndo').hidden = !un;
    if (un) $('puzUndo').textContent = `Geri al · ${state.cls.undoLeft}`;
    const note = rv ? 'Devam edersen en dolu sıralar temizlenir. Oyun başına bir kez.' : un ? `${state.cls.undoLeft} geri alma hakkın kaldı.` : '';
    $('overNote').textContent = note;
    $('overNote').hidden = !note;
  }
  $('over').hidden = false;
  $(rv ? 'revive' : 'again').focus({ preventScroll: true });
}
// win: the level name, its stars and how to earn the next one; fail: what ran out, how far the goal got, and the undo if it is still there
function showPuzzleOver() {
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
  $('over').hidden = false;
  $('again').focus({ preventScroll: true });
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

// three stars, each labelled with its target score; filled up to n
export const STAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.9 6.45.75-4.78 4.4 1.3 6.37L12 17.05l-5.72 3.17 1.3-6.37L2.8 9.45l6.45-.75z"/></svg>';
export function paintStars(el, n, tg) {
  el.innerHTML = tg.map((t, i) => `<span class="star${i < n ? ' on' : ''}">${STAR_SVG}<small>${fmtN(t)}</small></span>`).join('');
  el.setAttribute('aria-label', `${n} / 3 yıldız`);
}
export function shareText() {
  const tg = dailyStart(state.gameDay).targets, st = starsFor(state.score, tg), sk = curStreak();
  return `Blokzen Günlük · ${fmtDay(state.gameDay)}\n${'★'.repeat(st)}${'☆'.repeat(3 - st)}  ${fmtN(state.score)} puan` + (sk ? `\nSeri: ${sk} gün` : '');
}

export function resetShare() { clearTimeout(state.shareTimer); $('share').textContent = 'Sonucu kopyala'; }
export async function copyText(text) {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; } } catch (e) {}
  try {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (e) { return false; }
}
