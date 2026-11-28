import { THEMES } from '../themes/catalog.js';
import { mixHex, rgba, shade } from '../core/color.js';
import { GREY, N, SHAPES } from '../core/constants.js';
import { store } from '../core/store.js';
import { $, ctx, elScore } from '../ui/dom.js';
import { state, pop, theme, THEME_DUR } from '../core/state.js';
import { checkUnlocks, stats, STATS_KEY, TH } from '../themes/progress.js';
import { clamp01, inOut, lerp, outCubic } from '../core/util.js';
import { DPR, H, L, W } from './layout.js';
import { drawGemOn, rr, sprite } from './sprites.js';
import { drawBg } from './backgrounds.js';
import { applyDomColors, setTheme } from '../themes/switching.js';
import { save } from '../game/flow.js';
import { liftFor } from '../game/input.js';
import { drawLogo, menuOpen } from '../ui/menu.js';
import { drawTutHand, tut, TUT, tutFinish, tutGo } from '../ui/tutorial.js';
import { PARTS } from '../themes/registry.js';
import { mode } from '../modes/registry.js';
import { fmtNum } from '../i18n/index.js';
import { DRAW as GROUP_DRAW, SPAWN as GROUP_SPAWN } from './groupfx.js';
import { watchFrame } from './quality.js';

/* ---------- Rendering ---------- */
function drawSprite(spr, x, y, size, scale = 1) {
  const sz = size * scale;
  ctx.drawImage(spr, x + (size - sz) / 2, y + (size - sz) / 2, sz, sz);
}
// card-flip from old theme sprite to new one
function drawFlip(sOld, sNew, x, y, cs, t, scale = 1) {
  if (t >= 1) return drawSprite(sNew, x, y, cs, scale);
  if (t <= 0) return drawSprite(sOld, x, y, cs, scale);
  const k = Math.cos(t * Math.PI);
  ctx.save();
  ctx.translate(x + cs / 2, y + cs / 2);
  ctx.scale(Math.max(0.02, Math.abs(k)) * scale, scale * (1 + 0.14 * Math.sin(t * Math.PI)));
  ctx.drawImage(k > 0 ? sOld : sNew, -cs / 2, -cs / 2, cs, cs);
  ctx.restore();
}
const flipT = (now, delay) => state.REDUCED ? (now >= theme.t0 ? 1 : 0) : clamp01((now - theme.t0 - delay) / 280);

export function drawPiece(ti, piece, cx, cy, cs, alpha = 1, flip = 1) {
  const s = piece.shape;
  const x0 = cx - s.w * cs / 2, y0 = cy - s.h * cs / 2;
  ctx.globalAlpha = alpha;
  const sNew = sprite(ti, piece.color), sOld = flip < 1 ? sprite(theme.prev, piece.color, 0, theme.prevMode) : sNew;
  for (const [r, c] of s.cells) drawFlip(sOld, sNew, x0 + c * cs, y0 + r * cs, cs, flip);
  ctx.globalAlpha = 1;
}
// stamp a particle with the theme's effect: shape, how it falls or floats, glow
export function fxParticle(fx, p) {
  p.kind = fx.p; p.g = fx.g; p.drag = fx.drag || 0; p.wob = fx.wobble || 0; p.glow = !!fx.glow; p.ph = Math.random() * 6.28;
  if (p.drag) p.max *= 1.5; // floaty kinds linger a little longer
  if (fx.p === 'bubble' || fx.p === 'firefly' || fx.p === 'ember' || fx.p === 'star') p.vr *= 0.3;
  return p;
}
// colour strings for particles, memoised so a big clear does not build thousands of strings a frame
const colorMemo = new Map();
function memo(tag, fn, a, b, c) {
  const key = tag + a + b + (c ?? '');
  let v = colorMemo.get(key);
  if (v === undefined) { if (colorMemo.size > 400) colorMemo.clear(); v = fn(a, b, c); colorMemo.set(key, v); }
  return v;
}
const cshade = (hex, amt) => memo('s', shade, hex, amt);
const crgba = (hex, a) => memo('r', rgba, hex, a);
const cmix = (a, b, t) => memo('m', mixHex, a, b, t);
const glowMax = () => state.perf >= 2 ? 0 : 60;
function spawnParticles(it) {
  const limit = state.perf >= 2 ? 16 : 36;
  if (state.REDUCED || state.particles.length >= limit) return;
  const odd = (it.r + it.c) % 2;
  if (odd && !it.gem) return;

  const th = TH(), fx = th.fx, cs = L.cell;
  const cx = L.gx + (it.c + 0.5) * cs, cy = L.gy + (it.r + 0.5) * cs;
  const color = th.blocks[(it.v - 1) % 7] || th.accent;
  const group = GROUP_SPAWN[th.snd.boom], first = state.particles.length;
  if (group) group(cx, cy, color, it.intensity || 1, it.few || state.perf >= 2, odd);
  for (let i = first; i < state.particles.length; i++) {
    const p = state.particles[i];
    p.vx *= 0.68; p.vy *= 0.68; p.max *= 0.64;
  }

  // A theme's own shape accents the material; a puzzle stone uses the theme accent instead.
  if (state.particles.length < limit && (it.gem || !group || (it.r + it.c) % 4 === 0)) {
    state.particles.push(fxParticle(it.gem ? { p: 'g-shard', g: 0.6, drag: 1.4 } : { ...fx, glow: false }, {
      x: cx, y: cy, vx: (Math.random() - 0.5) * cs * 3, vy: -cs * (1 + Math.random() * 2),
      life: 0, max: 0.34 + Math.random() * 0.16, size: cs * (0.12 + Math.random() * 0.08),
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 6, color: it.gem ? th.accent : color,
    }));
  }
  if (state.particles.length > limit) state.particles.length = limit;
}
// soft round glow, cached per color, drawn additively
const glows = new Map();
function glowSprite(color) {
  if (glows.has(color)) return glows.get(color);
  const c = document.createElement('canvas'); c.width = c.height = 48;
  const g = c.getContext('2d'), gr = g.createRadialGradient(24, 24, 0, 24, 24, 24);
  gr.addColorStop(0, rgba(color, 0.9)); gr.addColorStop(0.35, rgba(color, 0.4)); gr.addColorStop(1, rgba(color, 0));
  g.fillStyle = gr; g.fillRect(0, 0, 48, 48);
  glows.set(color, c);
  return c;
}
// clear-effect particles for the newer themes; drawn on ctx already moved to the particle
function drawParticle(p, k, light) {
  const s = p.size * (0.4 + 0.6 * k);
  const a = Math.min(1, k * 1.5);
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.glow && !light && state.particles.length <= glowMax()) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a * 0.8;
    const gs = s * (p.kind === 'streak' ? 2.4 : 3.2);
    ctx.drawImage(glowSprite(p.color), -gs / 2, -gs / 2, gs, gs);
  }
  ctx.globalAlpha = a;
  if (GROUP_DRAW[p.kind]) { ctx.globalCompositeOperation = 'source-over'; GROUP_DRAW[p.kind](ctx, p, s, k, light); ctx.restore(); return; }
  switch (p.kind) {
    case 'bubble': {
      const r = s * 0.7;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = crgba(p.color, 0.18); ctx.fill();
      ctx.lineWidth = Math.max(1, r * 0.22); ctx.strokeStyle = cshade(p.color, 0.35); ctx.stroke();
      ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.35, r * 0.22, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill();
      break;
    }
    case 'firefly': case 'ember': {
      ctx.beginPath(); ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = p.kind === 'ember' ? cshade(p.color, 0.55) : cshade(p.color, 0.7); ctx.fill();
      break;
    }
    case 'diamond': {
      ctx.rotate(p.rot);
      ctx.beginPath(); ctx.moveTo(0, -s * 0.75); ctx.lineTo(s * 0.4, 0); ctx.lineTo(0, s * 0.75); ctx.lineTo(-s * 0.4, 0); ctx.closePath();
      ctx.fillStyle = p.color; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, -s * 0.75); ctx.lineTo(s * 0.4, 0); ctx.lineTo(0, 0); ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fill();
      break;
    }
    case 'flake': {
      ctx.rotate(p.rot * 0.4);
      ctx.strokeStyle = cmix(p.color, '#ffffff', 0.6); ctx.lineWidth = Math.max(1, s * 0.16); ctx.lineCap = 'round';
      const r = s * 0.7;
      for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke(); }
      break;
    }
    case 'streak': {
      if (!light) ctx.globalCompositeOperation = 'lighter';
      const sp = Math.hypot(p.vx, p.vy) || 1, len = Math.min(s * 4, s * 0.8 + sp * 0.03);
      ctx.rotate(Math.atan2(p.vy, p.vx));
      ctx.lineCap = 'round';
      ctx.strokeStyle = p.color; ctx.lineWidth = Math.max(1, s * 0.4);
      ctx.beginPath(); ctx.moveTo(-len, 0); ctx.lineTo(0, 0); ctx.stroke();
      ctx.strokeStyle = cshade(p.color, 0.7); ctx.lineWidth = Math.max(1, s * 0.15); ctx.stroke();
      break;
    }
    case 'petal': {
      ctx.rotate(p.rot * 0.5);
      ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.sin(p.life * 5 + p.ph)));
      ctx.beginPath(); ctx.moveTo(0, -s * 0.7);
      ctx.quadraticCurveTo(s * 0.6, -s * 0.1, 0, s * 0.7); ctx.quadraticCurveTo(-s * 0.6, -s * 0.1, 0, -s * 0.7);
      ctx.fillStyle = cmix(p.color, '#ffffff', 0.35); ctx.fill();
      break;
    }
    case 'drop': { // honey drop, stretched along its fall
      const sp = Math.hypot(p.vx, p.vy) || 1, st = Math.min(1.8, 1 + sp * 0.002);
      ctx.rotate(Math.atan2(p.vy, p.vx) - Math.PI / 2);
      const r = s * 0.5;
      ctx.beginPath(); ctx.moveTo(0, -r * 1.6 * st);
      ctx.quadraticCurveTo(r * 1.05, r * 0.1, 0, r); ctx.quadraticCurveTo(-r * 1.05, r * 0.1, 0, -r * 1.6 * st);
      ctx.fillStyle = cshade(p.color, 0.1); ctx.fill();
      ctx.beginPath(); ctx.arc(-r * 0.3, r * 0.15, r * 0.25, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,250,225,.8)'; ctx.fill();
      break;
    }
    case 'blockShard': { // the clear's own shards; themes register their particle kinds by plain names
      ctx.rotate(p.rot);
      const q = p.pts, sc = 0.5 + 0.5 * k;
      ctx.beginPath(); ctx.moveTo(q[0] * sc, q[1] * sc); ctx.lineTo(q[2] * sc, q[3] * sc); ctx.lineTo(q[4] * sc, q[5] * sc); ctx.closePath();
      ctx.fillStyle = p.color; ctx.fill();
      ctx.beginPath(); ctx.moveTo(q[0] * sc, q[1] * sc); ctx.lineTo(q[2] * sc, q[3] * sc); ctx.lineTo(0, 0); ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fill();
      break;
    }
    case 'star': {
      ctx.rotate(p.rot * 0.3);
      const r = s * 0.8, q = r * 0.22;
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(q, -q, r, 0); ctx.quadraticCurveTo(q, q, 0, r);
      ctx.quadraticCurveTo(-q, q, -r, 0); ctx.quadraticCurveTo(-q, -q, 0, -r);
      ctx.fillStyle = cshade(p.color, 0.55); ctx.fill();
      break;
    }
    default:
      if (PARTS[p.kind]) { PARTS[p.kind](p, s, k); break; }
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-s / 2, -s / 2, s, s);
  }
  ctx.restore();
}

function lineOutline(line, cs) {
  const horizontal = line.row !== undefined;
  const x = L.gx + (horizontal ? 0 : line.col * cs);
  const y = L.gy + (horizontal ? line.row * cs : 0);
  rr(ctx, x + 2, y + 2, (horizontal ? N : 1) * cs - 4, (horizontal ? 1 : N) * cs - 4, cs * 0.12);
}
// Keep the existing block colors visible inside a stable target outline.
function drawPreview(now, drag, th, cs) {
  const alpha = state.REDUCED ? 1 : outCubic(clamp01((now - drag.hlT0) / 80));
  const { rows, cols } = drag.target;
  ctx.save();
  ctx.globalAlpha = alpha;
  for (const line of [...rows.map(row => ({ row })), ...cols.map(col => ({ col }))]) {
    lineOutline(line, cs);
    ctx.strokeStyle = th.board; ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = th.accent; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.restore();
}
function drawClearedLines(now, th, cs) {
  const duration = state.REDUCED ? 120 : 210;
  state.beams = state.beams.filter(line => now - line.t0 < duration);
  ctx.save();
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 2;
  for (const line of state.beams) {
    const t = (now - line.t0) / duration;
    if (t < 0) continue;
    ctx.globalAlpha = 0.75 * (1 - t);
    lineOutline(line, cs);
    ctx.stroke();
  }
  ctx.restore();
}
function drawClearText(tx, t, th, cs) {
  const maxWidth = L.B - cs * 0.75;
  const alpha = Math.min(1, t / 0.07, (1 - t) / 0.24);
  const entry = outCubic(clamp01(t / 0.18));
  const scale = state.REDUCED ? 1 : 0.82 + 0.18 * entry;
  const y = tx.y - (state.REDUCED ? 0 : cs * (0.38 * entry + 0.22 * t));
  const size = tx.size * scale;

  ctx.font = `800 ${size}px "Baloo 2", "Trebuchet MS", sans-serif`;
  const half = Math.min(maxWidth, ctx.measureText(tx.text).width) / 2 + cs * 0.25;
  const x = Math.max(L.bx + half, Math.min(L.bx + L.B - half, tx.x));
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = th.light ? th.stroke : th.board;
  ctx.lineWidth = Math.max(2, size * 0.13);
  ctx.strokeText(tx.text, x, y, maxWidth);
  ctx.fillStyle = tx.role === 'accent' ? th.accent : th.fg;
  ctx.fillText(tx.text, x, y, maxWidth);

  if (tx.sub) {
    ctx.globalAlpha = alpha * (state.REDUCED ? 1 : clamp01((t - 0.045) / 0.13));
    const subSize = cs * 0.52;
    ctx.font = `700 ${subSize}px "Baloo 2", "Trebuchet MS", sans-serif`;
    ctx.lineWidth = Math.max(2, subSize * 0.14);
    const subY = y + size * 0.5 + subSize * 0.58;
    ctx.strokeText(tx.sub, x, subY, maxWidth);
    ctx.fillStyle = th.fg;
    ctx.fillText(tx.sub, x, subY, maxWidth);
  }
  ctx.globalAlpha = 1;
}

let last = performance.now();
export function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;

  if (tut && tut.next && now >= tut.next) { tut.next = 0; if (tut.step + 1 < TUT.length) tutGo(tut.step + 1, now); else tutFinish(); }
  if (state.pendingTheme && now >= state.pendingTheme.at) { const p = state.pendingTheme; state.pendingTheme = null; setTheme(p.i, now, { unlocked: !!p.unlocked, finale: !!p.finale }); if (!state.over) save(); }
  applyDomColors(now);

  const shown = state.score;
  if (state.REDUCED || Math.abs(shown - state.displayScore) < 0.5) state.displayScore = shown;
  else state.displayScore += (shown - state.displayScore) * Math.min(1, dt * 15);
  const ds = Math.round(state.displayScore);
  if (ds !== state.shownScore) { state.shownScore = ds; elScore.textContent = fmtNum(ds); }

  const gravity = L.cell * 22;
  for (const p of state.particles) {
    p.life += dt; if (p.life < 0) continue;
    if (p.drag) { const d = Math.exp(-p.drag * dt); p.vx *= d; p.vy *= d; }
    p.vy += gravity * (p.g ?? 1) * dt;
    p.x += p.vx * dt + (p.wob ? Math.sin(p.life * 6 + p.ph) * L.cell * 1.2 * p.wob * dt : 0);
    p.y += p.vy * dt; p.rot += p.vr * dt;
  }
  state.particles = state.particles.filter(p => p.life < p.max);

  const playing = !menuOpen && !state.over && !tut && !document.hidden && now - state.lastInput < 45000 && $('gallery').hidden && $('info').hidden && $('settings').hidden && $('levels').hidden;
  watchFrame(dt, playing);
  if (playing) {
    const pt = mode().playTime;
    if (pt) pt(dt); else stats.playSec += dt;
    state.playAcc += dt;
    if (state.playAcc > 10) { state.playAcc = 0; store.set(STATS_KEY, stats); checkUnlocks(now); }
  }
  drawBg(now, dt);
  draw(now);
  if (menuOpen) drawLogo();
  requestAnimationFrame(frame);
}

function draw(now) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const cs = L.cell, th = TH(), ti = theme.cur, tp = theme.prev;
  const pm = theme.prevMode;
  const FI = theme.mode === 'classic' ? 0.015 : 0.06, FR = theme.mode === 'classic' ? 0.05 : 0.16;
  const flipping = now - theme.t0 < THEME_DUR + 200 && (tp !== ti || pm !== theme.mode);
  const bm = inOut(clamp01((now - theme.t0) / THEME_DUR));

  let offset = 0;
  if (state.shake) {
    const t = (now - state.shake.t0) / 150;
    if (t >= 1 || state.REDUCED) state.shake = null;
    else if (t > 0) offset = state.shake.amp * Math.sin(t * Math.PI) * (1 - t);
  }
  ctx.save(); ctx.translate(0, offset);

  // board
  rr(ctx, L.bx, L.by, L.B, L.B, L.B * (theme.mode === 'classic' ? 0.022 : 0.035));
  ctx.fillStyle = flipping ? mixHex(THEMES[tp].board, th.board, bm) : th.board; ctx.fill();
  ctx.strokeStyle = th.light ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.07)'; ctx.lineWidth = 2; ctx.stroke();

  const tgt = state.drag && state.drag.target;
  const dragColor = state.drag && state.drag.piece.color;
  const pzg = !tut && mode().boardGems ? mode().boardGems() : null; // gems on the board
  const greyRows = state.over && !(pzg && state.puz.won) ? Math.floor((now - state.overT0) / 70) : -1; // a won level does not grey out

  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = L.gx + c * cs, y = L.gy + r * cs;
    const ft = flipping ? flipT(now, 150 + (r + c) * 45) : 1;
    drawFlip(sprite(tp, 0, 0, pm), sprite(ti, 0), x, y, cs, ft);
    let v = state.grid[r][c];
    if (!v) continue;
    let s = 1;
    const a = pop[r][c];
    if (a) {
      const t = state.REDUCED ? 1 : clamp01((now - a) / 115);
      s = 0.9 + 0.1 * outCubic(t);
      if (t >= 1) pop[r][c] = 0;
    }
    if (state.over && r < greyRows) v = GREY;
    drawFlip(sprite(tp, v, 0, pm), sprite(ti, v), x, y, cs, ft, s);
    if (pzg && pzg[r][c]) drawGemOn(ctx, ti, x, y, cs, DPR, 0.86 * s);
  }

  if (tut && !tut.next && !state.drag && state.tray.some(Boolean) && !TUT[tut.step].free) {
    const st = TUT[tut.step], k = 0.5 + 0.5 * Math.sin(now / 240);
    ctx.globalAlpha = 0.16 + 0.22 * k; ctx.fillStyle = th.accent;
    for (const [dr, dc] of SHAPES[st.piece].cells) { rr(ctx, L.gx + (st.target[1] + dc) * cs + cs * FI, L.gy + (st.target[0] + dr) * cs + cs * FI, cs * (1 - 2 * FI), cs * (1 - 2 * FI), cs * FR); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  if (tgt) {
    const spr = sprite(ti, dragColor), clears = tgt.hl && tgt.hl.size;
    for (const [dr, dc] of state.drag.piece.shape.cells) {
      const x = L.gx + (tgt.c + dc) * cs, y = L.gy + (tgt.r + dr) * cs;
      ctx.globalAlpha = clears ? 0.74 : 0.44;
      ctx.drawImage(spr, x, y, cs, cs);
    }
    ctx.globalAlpha = 1;
    if (clears) drawPreview(now, state.drag, th, cs);
  }

  const clearDuration = state.REDUCED ? 90 : 170;
  for (const it of state.clearing) {
    const t = (now - it.t0 - (state.REDUCED ? 0 : it.delay)) / clearDuration;
    if (t >= 1) continue;
    const x = L.gx + it.c * cs, y = L.gy + it.r * cs, k = clamp01(t);
    if (t >= 0 && !it.spawned) { it.spawned = true; spawnParticles(it); }
    ctx.globalAlpha = 1 - k;
    drawSprite(sprite(ti, it.v), x, y, cs, state.REDUCED ? 1 : 1 - 0.18 * outCubic(k));
    if (it.gem) drawGemOn(ctx, ti, x, y - (state.REDUCED ? 0 : cs * 0.22 * k), cs, DPR, 0.86);
    ctx.globalAlpha = 1;
  }
  state.clearing = state.clearing.filter(it => now - it.t0 - (state.REDUCED ? 0 : it.delay) < clearDuration);
  if (state.beams.length) drawClearedLines(now, th, cs);
  if (state.flash) {
    const t = (now - state.flash.t0) / (state.flash.dur || 380);
    if (t >= 1) state.flash = null;
    else if (t > 0) {
      const sweep = state.flash.sweep && !state.REDUCED;
      const inset = sweep ? 2 + L.B * 0.39 * (1 - outCubic(t)) : 2;
      const size = L.B - inset * 2;
      rr(ctx, L.bx + inset, L.by + inset, size, size, Math.min(size * 0.15, cs * 0.23));
      ctx.strokeStyle = rgba(th.accent, (state.flash.a ?? 0.65) * (1 - t));
      ctx.lineWidth = sweep ? Math.max(2, cs * 0.09 * (1 - t)) : 2;
      ctx.stroke();
    }
  }
  ctx.restore();

  // tray
  for (let i = 0; i < 3; i++) {
    const t = state.tray[i];
    if (!t || (state.drag && state.drag.slot === i)) continue;
    let cx = L.bx + L.slotW * (i + 0.5), cy = L.trayY + L.trayH / 2, c2 = L.trayCell;
    let alpha = t.fits ? 1 : 0.32;
    const ta = (now - t.appear) / 160;
    if (ta < 1) {
      if (ta <= 0) continue;
      if (!state.REDUCED) {
        const e = outCubic(ta);
        c2 *= 0.93 + 0.07 * e;
        cy += (1 - e) * L.cell * 0.2;
        alpha *= e;
      }
    }
    if (t.ret) {
      const tr = clamp01((now - t.ret.t0) / 180), e = outCubic(tr);
      cx = lerp(t.ret.x, cx, e); cy = lerp(t.ret.y, cy, e); c2 = lerp(t.ret.cell, L.trayCell, e);
      alpha = 1;
      if (tr >= 1) t.ret = null;
    }
    drawPiece(ti, t.piece, cx, cy, c2, alpha, flipping ? flipT(now, 380 + i * 90) : 1);
  }

  // particles
  for (const p of state.particles) {
    if (p.life < 0) continue;
    drawParticle(p, 1 - p.life / p.max, !!th.light);
  }
  ctx.globalAlpha = 1;

  // floating texts
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  for (const tx of state.texts) {
    const t = (now - tx.t0) / tx.dur;
    if (t < 0 || t >= 1) continue;
    if (tx.clear) { drawClearText(tx, t, th, cs); continue; }
    const y = tx.y - (state.REDUCED ? 0 : outCubic(t) * cs * 0.35);
    ctx.globalAlpha = Math.min(1, t / 0.10, (1 - t) / 0.25);
    ctx.font = `700 ${tx.size}px "Baloo 2", "Trebuchet MS", sans-serif`;
    ctx.lineWidth = tx.size * 0.22;
    ctx.strokeStyle = rgba(th.stroke, 0.88);
    const half = ctx.measureText(tx.text).width / 2 + tx.size * 0.15;
    const x = Math.max(L.bx + half, Math.min(L.bx + L.B - half, tx.x)); // keep the text on the board
    ctx.strokeText(tx.text, x, y);
    ctx.fillStyle = tx.role === 'accent' ? th.accent : th.fg;
    ctx.fillText(tx.text, x, y);
  }
  ctx.globalAlpha = 1;
  state.texts = state.texts.filter(tx => (now - tx.t0) / tx.dur < 1);

  // theme banner
  if (state.banner) {
    const t = (now - state.banner.t0) / state.banner.dur;
    if (t >= 1) state.banner = null;
    else if (t > 0) {
      const inT = clamp01(t / 0.16), outT = clamp01((t - 0.78) / 0.22);
      const a = inT * (1 - outT), cx = L.bx + L.B / 2, cy = L.by + L.B / 2;
      const bh = cs * 2.5 * outCubic(inT);
      ctx.globalAlpha = a;
      ctx.fillStyle = rgba(th.light ? th.stroke : th.board, 0.78);
      ctx.fillRect(L.bx, cy - bh / 2, L.B, bh);
      ctx.fillStyle = th.accent;
      ctx.fillRect(L.bx + L.B * (0.5 - 0.3 * outCubic(inT)), cy - bh / 2, L.B * 0.6 * outCubic(inT), 2);
      ctx.fillRect(L.bx + L.B * (0.5 - 0.3 * outCubic(inT)), cy + bh / 2 - 2, L.B * 0.6 * outCubic(inT), 2);
      const slide = (1 - outCubic(inT)) * cs * 0.8 - outT * cs * 0.5;
      try { ctx.letterSpacing = Math.round(cs * 0.08) + 'px'; } catch (e) {}
      ctx.font = `700 ${cs * 0.3}px "Baloo 2", "Trebuchet MS", sans-serif`;
      ctx.fillStyle = th.accent;
      ctx.fillText(state.banner.sub, cx + slide, cy - cs * 0.55);
      try { ctx.letterSpacing = '0px'; } catch (e) {}
      const fs = cs * 0.86;
      ctx.font = `800 ${fs}px "Baloo 2", "Trebuchet MS", sans-serif`;
      ctx.lineWidth = fs * 0.16; ctx.strokeStyle = rgba(th.stroke, 0.9);
      ctx.strokeText(state.banner.name, cx - slide, cy + cs * 0.22);
      ctx.fillStyle = th.fg;
      ctx.fillText(state.banner.name, cx - slide, cy + cs * 0.22);
      ctx.globalAlpha = 1;
    }
  }

  // dragged piece
  if (state.drag) {
    const tl = outCubic(clamp01((now - state.drag.t0) / 110));
    const c2 = lerp(L.trayCell, cs, tl);
    const cy = state.drag.y - liftFor(state.drag) * tl;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8;
    drawPiece(ti, state.drag.piece, state.drag.x, cy, c2 * 1.02, 1);
    ctx.restore();
  }

  if (tut && !state.drag && !tut.next && state.tray.some(Boolean)) drawTutHand(now);
}
