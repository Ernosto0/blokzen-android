import { MUTE_KEY, N } from '../core/constants.js';
import { canUndo, doRevive, doUndo, mode } from '../modes/registry.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { $, cv } from '../ui/dom.js';
import { state } from '../core/state.js';
import { clamp01, lerp, outCubic } from '../core/util.js';
import { L } from '../render/layout.js';
import { newGame, placePiece } from './flow.js';
import { openLevels } from '../ui/levels.js';
import { syncSettings } from '../ui/settings.js';
import { tut, TUT, tutPlace } from '../ui/tutorial.js';
import { t } from '../i18n/index.js';

/* ---------- Input ---------- */
function pt(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
function slotAt(p) {
  if (p.y < L.trayY - L.cell * 0.4 || p.y > L.trayY + L.trayH + L.cell) return -1;
  const i = Math.floor((p.x - L.bx) / L.slotW);
  return i >= 0 && i < 3 ? i : -1;
}
export const liftFor = d => d.touch ? d.piece.shape.h * L.cell / 2 + L.cell * 1.1 : 0;
function computeTarget() {
  const d = state.drag, s = d.piece.shape, cs = L.cell;
  const cx = d.x, cy = d.y - liftFor(d);
  const c = Math.round((cx - s.w * cs / 2 - L.gx) / cs);
  const r = Math.round((cy - s.h * cs / 2 - L.gy) / cs);
  let valid = r >= 0 && c >= 0 && r + s.h <= N && c + s.w <= N;
  if (valid) for (const [dr, dc] of s.cells) if (state.grid[r + dr][c + dc]) { valid = false; break; }
  if (valid && tut && !TUT[tut.step].free) { const [tr, tc] = TUT[tut.step].target; if (r !== tr || c !== tc) valid = false; } // guided steps accept only the shown spot
  let hl = null;
  if (valid) {
    const g = state.grid.map(row => row.slice());
    for (const [dr, dc] of s.cells) g[r + dr][c + dc] = 1;
    hl = new Set();
    for (let r2 = 0; r2 < N; r2++) if (g[r2].every(Boolean)) for (let cc = 0; cc < N; cc++) hl.add(r2 * N + cc);
    for (let cc = 0; cc < N; cc++) if (g.every(row => row[cc])) for (let r2 = 0; r2 < N; r2++) hl.add(r2 * N + cc);
  }
  d.target = valid ? { r, c, hl } : null;
}

cv.addEventListener('pointerdown', e => {
  state.lastInput = performance.now();
  Sfx.unlock();
  if (state.over || state.drag || (tut && tut.next)) return;
  const p = pt(e), i = slotAt(p);
  if (i < 0) return;
  const t = state.tray[i];
  if (!t || t.ret) return;
  e.preventDefault();
  state.drag = { slot: i, piece: t.piece, x: p.x, y: p.y, touch: e.pointerType !== 'mouse', t0: performance.now(), target: null, id: e.pointerId };
  try { cv.setPointerCapture(e.pointerId); } catch (err) {}
  computeTarget();
  Sfx.pick(); buzz(6);
});
cv.addEventListener('pointermove', e => {
  if (!state.drag || e.pointerId !== state.drag.id) return;
  const p = pt(e); state.drag.x = p.x; state.drag.y = p.y;
  computeTarget();
});
function endDrag(e, cancelled) {
  if (!state.drag || e.pointerId !== state.drag.id) return;
  const d = state.drag; state.drag = null;
  if (!cancelled && d.target) { if (tut) tutPlace(d.slot, d.target.r, d.target.c); else placePiece(d.slot, d.target.r, d.target.c); return; }
  if (tut) tut.t0 = performance.now() + 450; // replay the hand after a missed drop
  const t = state.tray[d.slot];
  if (t) {
    const tl = clamp01((performance.now() - d.t0) / 110);
    t.ret = { x: d.x, y: d.y - liftFor(d) * outCubic(tl), cell: lerp(L.trayCell, L.cell, outCubic(tl)), t0: performance.now() };
  }
  if (!cancelled && d.y < L.trayY - L.cell * 0.5) Sfx.bad();
}
cv.addEventListener('pointerup', e => endDrag(e, false));
cv.addEventListener('pointercancel', e => endDrag(e, true));
cv.addEventListener('contextmenu', e => e.preventDefault());

export function toggleMute() {
  Sfx.unlock();
  Sfx.muted = !Sfx.muted;
  store.set(MUTE_KEY, Sfx.muted);
  syncMute();
  if (!Sfx.muted) Sfx.pick();
}
$('mute').addEventListener('click', toggleMute);
export function syncMute() {
  $('icoOn').hidden = Sfx.muted; $('icoOff').hidden = !Sfx.muted;
  $('mute').setAttribute('aria-label', Sfx.muted ? t('Sesi aç') : t('Sesi kapat'));
  syncSettings();
}
let confirmTimer = 0;
export function resetConfirm() {
  const b = $('restart');
  clearTimeout(confirmTimer); b.classList.remove('confirm');
  $('icoRestart').hidden = false; $('icoCheck').hidden = true;
  b.setAttribute('aria-label', restartLabel());
}
export const restartLabel = () => t(mode().restartLabel);
$('restart').addEventListener('click', () => {
  Sfx.unlock();
  const b = $('restart');
  if (state.over) { newGame(); return; }
  if (b.classList.contains('confirm')) { resetConfirm(); newGame(); return; }
  b.classList.add('confirm'); $('icoRestart').hidden = true; $('icoCheck').hidden = false;
  b.setAttribute('aria-label', t('Yeni oyunu onayla'));
  confirmTimer = setTimeout(resetConfirm, 2500);
});
$('again').addEventListener('click', () => {
  Sfx.unlock();
  if (!(mode().again && mode().again())) newGame();
});
$('puzRetry').addEventListener('click', () => { Sfx.unlock(); Sfx.pick(); newGame(); });
$('puzLevels').addEventListener('click', () => openLevels());
$('puzUndo').addEventListener('click', () => { Sfx.unlock(); doUndo(); });
$('undo').addEventListener('click', () => { Sfx.unlock(); if (canUndo()) doUndo(); else Sfx.bad(); });
$('revive').addEventListener('click', () => { Sfx.unlock(); doRevive(); });
$('puzTitle').addEventListener('click', () => openLevels());
