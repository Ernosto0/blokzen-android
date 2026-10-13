import { N, SAVE_KEY, SHAPES } from '../core/constants.js';
import { defineMode, hudInfo } from './registry.js';
import { updateUndoBtn } from '../ui/hud.js';
import { fmtN } from '../ui/menu.js';
import { CLS_UNDOS, freshCls, state, theme } from '../core/state.js';
import { stats } from '../themes/progress.js';
import { trayIds } from './puzzle.js';
import { tut } from '../ui/tutorial.js';

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
export const canUndo = () => !tut && (state.mode === 'puzzle' ? !state.puz.won && !state.puz.undoUsed && !!state.puz.prev : state.mode === 'classic' && state.cls.undoLeft > 0 && state.cls.hist.length > 0);
export const canRevive = () => state.mode === 'classic' && !tut && !state.cls.contUsed;
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
