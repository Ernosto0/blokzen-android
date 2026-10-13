import { N, SHAPES, TUT_KEY } from '../core/constants.js';
import { Sfx } from '../audio/sfx.js';
import { buzz } from '../platform/haptics.js';
import { store } from '../core/store.js';
import { $, ctx } from './dom.js';
import { state, emptyGrid, pop, theme } from '../core/state.js';
import { TH } from '../themes/progress.js';
import { clamp01, inOut, lerp } from '../core/util.js';
import { L } from '../render/layout.js';
import { rr } from '../render/sprites.js';
import { burst } from '../themes/switching.js';
import { checkOver, newGame, refreshFits, restore, snapshot } from '../game/flow.js';
import { updateHud } from './hud.js';
import { resetConfirm } from '../game/input.js';
import { closeMenu } from './menu.js';
import { closeInfo } from './info.js';
import { drawPiece } from '../render/render.js';
import { t } from '../i18n/index.js';

/* ---------- First-run guide: three scripted boards, a hand shows each move ---------- */
const tutCol = (r, c) => 1 + ((r * 3 + c * 2) % 7);
export const TUT = [
  { title: 'Sürükle ve bırak', text: 'Alttaki parçayı parmağınla tut, tahtada boş bir yere sürükle ve bırak.',
    piece: 9, color: 4, target: [3, 3], free: true, fill: [] },
  { title: 'Satırı tamamla', text: 'Bir satır baştan sona dolunca temizlenir ve puan kazanırsın. Parçayı parlayan boşluğa koy.',
    piece: 3, color: 2, target: [4, 5],
    fill: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [5, 0], [5, 1], [6, 0], [7, 0], [7, 1], [7, 2], [5, 6], [6, 7], [2, 1], [3, 0]] },
  { title: 'Sütunlar da temizlenir', text: 'Bu boşluğu doldurursan iki satır ve iki sütun birden gider. Dene!',
    piece: 9, color: 6, target: [6, 6],
    fill: (() => { const f = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if ((r >= 6) !== (c >= 6)) f.push([r, c]); return f; })() },
];
export let tut = null;
export function startTutorial() {
  if (state.drag) return;
  const now = performance.now();
  tut = { step: -1, stash: snapshot(), stashOver: state.over, next: 0, t0: 0 };
  state.over = false; $('over').hidden = true; state.combo = 0; state.msc = 0;
  state.pendingTheme = null; state.banner = null; state.shake = null;
  resetConfirm();
  document.body.classList.add('tut-on');
  $('tutDone').hidden = true;
  tutGo(0, now);
}
export function tutGo(i, now) {
  const st = TUT[i];
  tut.step = i; tut.next = 0; tut.t0 = now + 750;
  // sweep away what is left, then pop the new board in
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (state.grid[r][c]) state.clearing.push({ r, c, v: state.grid[r][c], t0: now, delay: (r + c) * 14, spawned: true });
  state.grid = emptyGrid();
  for (const [r, c] of st.fill) { state.grid[r][c] = tutCol(r, c); pop[r][c] = now + 220 + (r + c) * 22; }
  state.tray = [null, { piece: { shape: SHAPES[st.piece], color: st.color }, appear: now + 420, ret: null, fits: true }, null];
  $('tutStep').textContent = `${i + 1}/${TUT.length}`;
  $('tutTitle').textContent = t(st.title);
  $('tutText').textContent = t(st.text);
  const tip = $('tutTip'); tip.hidden = false; tip.style.animation = 'none'; void tip.offsetWidth; tip.style.animation = '';
}
export function tutPlace(slot, r0, c0) {
  const now = performance.now();
  const { shape, color } = state.tray[slot].piece;
  state.tray[slot] = null;
  for (const [dr, dc] of shape.cells) { state.grid[r0 + dr][c0 + dc] = color; pop[r0 + dr][c0 + dc] = now + (dr + dc) * 16; }
  const rows = [], cols = [];
  for (let r = 0; r < N; r++) if (state.grid[r].every(Boolean)) rows.push(r);
  for (let c = 0; c < N; c++) if (state.grid.every(row => row[c])) cols.push(c);
  const lines = rows.length + cols.length;
  if (lines) {
    const centerR = r0 + shape.h / 2, centerC = c0 + shape.w / 2, hit = new Map();
    for (const r of rows) for (let c = 0; c < N; c++) hit.set(r * N + c, Math.abs(c + 0.5 - centerC));
    for (const c of cols) for (let r = 0; r < N; r++) { const k = r * N + c, d = Math.abs(r + 0.5 - centerR); hit.set(k, hit.has(k) ? Math.min(hit.get(k), d) : d); }
    for (const [k, d] of hit) {
      const r = (k / N) | 0, c = k % N;
      state.clearing.push({ r, c, v: state.grid[r][c], t0: now + 60, delay: d * 26, spawned: false, few: hit.size > 16 });
      state.grid[r][c] = 0; pop[r][c] = 0;
    }
    const clean = state.grid.every(row => row.every(v => !v));
    const midX = L.gx + L.B / 2 - L.pad;
    state.texts.push({ text: clean ? t('Tahta tertemiz!') : lines >= 2 ? t('Harika!') : t('Güzel!'), x: midX, y: L.gy + L.cell * 2.6, t0: now + 120, dur: 1300, size: L.cell * (clean ? 0.95 : 0.82), role: 'accent' });
    if (clean) { state.flash = { t0: now + 80 }; burst(now + 60); Sfx.fullClear(); buzz([30, 40, 30, 40, 60]); }
    if (!state.REDUCED) state.shake = { amp: Math.min(3 + lines * 3 + (clean ? 8 : 0), 20), t0: now + 60 };
    Sfx.clear(lines, 1);
    buzz(lines >= 2 ? [18, 30, 24] : 20);
  } else { Sfx.place(); buzz(10); }
  tut.next = now + (lines ? 1500 : 800);
}
export function tutFinish() {
  state.tray = [null, null, null];
  $('tutTip').hidden = true;
  $('tutDone').hidden = false;
  $('tutStart').focus({ preventScroll: true });
}
export function endTutorial() {
  if (!tut) return;
  const t = tut; tut = null; state.drag = null;
  store.set(TUT_KEY, true);
  document.body.classList.remove('tut-on');
  $('tutTip').hidden = true; $('tutDone').hidden = true;
  const now = performance.now();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (state.grid[r][c]) state.clearing.push({ r, c, v: state.grid[r][c], t0: now, delay: (r + c) * 18, spawned: true });
  state.grid = emptyGrid();
  if (t.stashOver || !restore(t.stash)) { state.grid = null; newGame(); }
  else { refreshFits(); updateHud(); checkOver(performance.now()); }
}
$('tutSkip').addEventListener('click', () => { Sfx.unlock(); Sfx.pick(); endTutorial(); });
$('tutStart').addEventListener('click', () => { Sfx.unlock(); Sfx.pick(); buzz(10); endTutorial(); });
$('helpTut').addEventListener('click', () => { closeInfo(); closeMenu(); startTutorial(); });

// a pointing hand, fingertip at 0,0; outline pass first so overlapping parts read as one shape
function drawHand(x, y, u, a, press) {
  const parts = [
    () => rr(ctx, -0.15 * u, 0, 0.3 * u, 1.0 * u, 0.15 * u),            // index finger
    () => rr(ctx, 0.12 * u, 0.42 * u, 0.27 * u, 0.55 * u, 0.135 * u),   // middle knuckle
    () => rr(ctx, 0.36 * u, 0.52 * u, 0.26 * u, 0.48 * u, 0.13 * u),    // ring knuckle
    () => rr(ctx, -0.2 * u, 0.6 * u, 0.84 * u, 0.82 * u, 0.26 * u),     // palm
    () => { ctx.beginPath(); ctx.ellipse(-0.27 * u, 0.98 * u, 0.14 * u, 0.3 * u, -0.6, 0, Math.PI * 2); }, // thumb
  ];
  ctx.save();
  ctx.translate(x, y); ctx.rotate(-0.3);
  const sc = 1 - 0.1 * press; ctx.scale(sc, sc);
  ctx.globalAlpha = a;
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = u * 0.25; ctx.shadowOffsetY = u * 0.12;
  ctx.lineWidth = u * 0.13; ctx.strokeStyle = '#1d1630'; ctx.lineJoin = 'round';
  for (const p of parts) { p(); ctx.stroke(); }
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#ffffff';
  for (const p of parts) { p(); ctx.fill(); }
  rr(ctx, -0.085 * u, 0.06 * u, 0.17 * u, 0.2 * u, 0.08 * u); ctx.fillStyle = 'rgba(255,170,170,.45)'; ctx.fill(); // nail
  ctx.restore();
}
function ripple(x, y, e, cs, a) {
  if (e <= 0 || e >= 1) return;
  ctx.save(); ctx.globalAlpha = (1 - e) * a;
  ctx.beginPath(); ctx.arc(x, y, cs * (0.25 + 0.75 * e), 0, Math.PI * 2);
  ctx.lineWidth = Math.max(2, cs * 0.08); ctx.strokeStyle = TH().accent; ctx.stroke();
  ctx.restore();
}
export function drawTutHand(now) {
  const slot = state.tray.findIndex(Boolean);
  if (slot < 0 || now < tut.t0) return;
  const t = state.tray[slot]; if (t.ret) return;
  const st = TUT[tut.step], s = t.piece.shape, cs = L.cell;
  const k = ((now - tut.t0) % 2900) / 2900;
  const lift = s.h * cs / 2 + cs * 1.1;
  const sx = L.bx + L.slotW * (slot + 0.5), sy = L.trayY + L.trayH / 2;
  const [tr, tc] = st.target;
  const tx = L.gx + (tc + s.w / 2) * cs, ty = L.gy + (tr + s.h / 2) * cs; // where the piece's centre lands
  let fx, fy, carry = 0, press = 0, a = 1, ghost = 0, gx = tx, gy = ty;
  if (k < 0.16) { const e = k / 0.16; fx = sx + cs * 0.7 * (1 - e); fy = sy + cs * 0.9 * (1 - e); a = Math.min(1, e * 1.6); press = e > 0.75 ? (e - 0.75) / 0.25 : 0; }
  else if (k < 0.62) { const e = inOut((k - 0.16) / 0.46); fx = lerp(sx, tx, e); fy = lerp(sy, ty + lift, e); carry = clamp01((k - 0.16) / 0.08); press = 1; ghost = 0.7; gx = fx; gy = fy - lift * carry; }
  else if (k < 0.7) { fx = tx; fy = ty + lift; press = 1 - (k - 0.62) / 0.08; carry = 1; ghost = 0.7; }
  else { const e = (k - 0.7) / 0.3; fx = tx + cs * 0.6 * e; fy = ty + lift + cs * 0.7 * e; a = 1 - e; ghost = 0.7 * Math.max(0, 1 - e * 2.5); }
  if (ghost > 0) drawPiece(theme.cur, t.piece, gx, gy, lerp(L.trayCell, cs, carry), ghost);
  ripple(sx, sy, (k - 0.12) / 0.14, cs, 0.9);
  ripple(tx, ty + lift, (k - 0.66) / 0.14, cs, 0.9);
  drawHand(fx, fy, cs * 1.25, a, press);
}
