import { N, SAVE_KEY, SHAPES } from '../core/constants.js';
import { canRevive, canUndo, defineMode, hudInfo } from './registry.js';
import { updateHud, updateUndoBtn } from '../ui/hud.js';
import { fmtN } from '../ui/menu.js';
import { state, CLS_UNDOS, freshCls, pop, theme } from '../core/state.js';
import { stats, STATS_KEY } from '../themes/progress.js';
import { trayIds } from './puzzle.js';
import { tut } from '../ui/tutorial.js';
import { Sfx } from '../audio/sfx.js';
import { store } from '../core/store.js';
import { clearFullest, deal, refreshFits, save } from '../game/flow.js';
import { buzz } from '../platform/haptics.js';
import { L } from '../render/layout.js';
import { $ } from '../ui/dom.js';

export const REC_KEYS = ['bestScore', 'bestCombo', 'bestFulls', 'bestMoves', 'bestMulti', 'bestCalm']; // one-game records an undo takes back

export function clsRemember() {
  if (state.cls.undoLeft <= 0) { state.cls.hist = []; return; }
  state.cls.hist.push({
    grid: state.grid.map(r => r.slice()), tray: trayIds(), score: state.score, combo: state.combo, msc: state.msc, moves: state.moves, fulls: state.fulls, gs: { ...state.gs },
    stage: theme.stage, best: state.best, newRecord: state.newRecord, rec: Object.fromEntries(REC_KEYS.map(k => [k, stats[k]])),
  });
  while (state.cls.hist.length > state.cls.undoLeft) state.cls.hist.shift();
}
export function readCls(d) {
  const c = freshCls();
  if (!d || typeof d !== 'object') return c;
  c.undoLeft = Math.max(0, Math.min(CLS_UNDOS, d.u == null ? CLS_UNDOS : d.u | 0));
  c.contUsed = !!d.c;
  const okGrid = g => Array.isArray(g) && g.length === N && g.every(row => Array.isArray(row) && row.length === N);
  if (Array.isArray(d.h)) c.hist = d.h.filter(p => p && okGrid(p.grid) && Array.isArray(p.tray)).slice(-c.undoLeft).map(p => ({
    grid: p.grid.map(row => row.map(v => v | 0)),
    tray: [0, 1, 2].map(i => { const t = p.tray[i]; return t && SHAPES[t.s] ? { s: t.s | 0, c: t.c | 0 } : null; }),
    score: p.score | 0, combo: p.combo | 0, msc: p.msc | 0, moves: p.moves | 0, fulls: p.fulls | 0,
    gs: p.gs && typeof p.gs === 'object' ? { multi: p.gs.multi | 0, calm: p.gs.calm | 0, broke: !!p.gs.broke, stars: p.gs.stars | 0, lines: p.gs.lines | 0, zcalm: p.gs.zcalm | 0, zrun: p.gs.zrun | 0 } : { ...state.gs },
    stage: p.stage | 0, best: p.best | 0, newRecord: !!p.newRecord,
    rec: Object.fromEntries(REC_KEYS.map(k => [k, p.rec && p.rec[k] != null ? +p.rec[k] || 0 : stats[k]])),
  }));
  return c;
}
// a saved undo state from storage, checked cell by cell
export function readPrev(p, lv) {
  if (!p || typeof p !== 'object' || !Array.isArray(p.grid) || !Array.isArray(p.gems) || !Array.isArray(p.tray)) return null;
  const okGrid = g => g.length === N && g.every(row => Array.isArray(row) && row.length === N);
  if (!okGrid(p.grid) || !okGrid(p.gems)) return null;
  return {
    grid: p.grid.map(row => row.map(v => v | 0)), gems: p.gems.map(row => row.map(v => v ? 1 : 0)),
    tray: [0, 1, 2].map(i => { const t = p.tray[i]; return t && SHAPES[t.s] ? { s: t.s | 0, c: t.c | 0 } : null; }),
    score: p.score | 0, combo: p.combo | 0, msc: p.msc | 0, moves: p.moves | 0, fulls: p.fulls | 0, seq: Math.min(lv.pieces.length, p.seq | 0),
  };
}

defineMode({
  id: 'classic', saveKey: SAVE_KEY, button: 'play', restartLabel: 'Yeni oyun',
  hud: () => hudInfo({ best: fmtN(state.best), bestTitle: 'En iyi skor', undo: true }),
  updateHud: updateUndoBtn,
  undoInfo: { left: () => state.cls.undoLeft, spent: 'Geri alma hakların bitti' },
});

// Classic continue, once per game: the board breathes out like zen, the combo rests, and play goes on
function classicRevive() {
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

defineMode({
  id: 'classic', saveKey: SAVE_KEY, button: 'play', restartLabel: 'Yeni oyun',
  hud: () => hudInfo({ best: fmtN(state.best), bestTitle: 'En iyi skor', undo: true }),
  updateHud: updateUndoBtn,
  undoInfo: { left: () => state.cls.undoLeft, spent: 'Geri alma hakların bitti' },
  canUndo: () => !tut && state.cls.undoLeft > 0 && state.cls.hist.length > 0,
  canRevive: () => !tut && !state.cls.contUsed,
  undo: classicUndo,
  revive: classicRevive,
  overCard(rv) {
    $('finalScore').textContent = fmtN(state.score);
    $('overTitle').textContent = 'Yer kalmadı';
    $('newRec').textContent = 'Yeni rekor!';
    $('newRec').hidden = !state.newRecord;
    $('overStars').hidden = true; $('share').hidden = true;
    $('again').textContent = 'Tekrar oyna';
    $('overSub').textContent = `En iyi: ${fmtN(state.best)}`;
    const un = canUndo();
    $('puzUndo').hidden = !un;
    if (un) $('puzUndo').textContent = `Geri al · ${state.cls.undoLeft}`;
    const note = rv ? 'Devam edersen en dolu sıralar temizlenir. Oyun başına bir kez.' : un ? `${state.cls.undoLeft} geri alma hakkın kaldı.` : '';
    $('overNote').textContent = note;
    $('overNote').hidden = !note;
  },
});
