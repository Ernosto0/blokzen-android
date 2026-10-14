import { THEMES } from '../themes/catalog.js';
import { mixHex, rgba, shade } from '../core/color.js';
import { GREY, N, SHAPES } from '../core/constants.js';
import { store } from '../core/store.js';
import { $, ctx, elScore, fctx, flyc } from '../ui/dom.js';
import { state, pop, theme, THEME_DUR } from '../core/state.js';
import { checkUnlocks, stats, STATS_KEY, TH } from '../themes/progress.js';
import { clamp01, inOut, lerp, outBack, outCubic } from '../core/util.js';
import { BDPR, BH, BW, DPR, H, L, W } from './layout.js';
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
import { Sfx } from '../audio/sfx.js';
import { bumpScore } from '../ui/hud.js';

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
const MAX_PARTS = 900;
function spawnParticles(it) {
  const th = TH(), fx = th.fx, k = it.k || 1;
  const crowd = state.particles.length > MAX_PARTS * 0.6; // a big clear on a slow phone: keep the count sane
  const n = state.REDUCED ? 1 : it.few || crowd ? 3 : Math.round(4 + k * 1.5);
  const cx = L.gx + (it.c + 0.5) * L.cell, cy = L.gy + (it.r + 0.5) * L.cell;
  const color = th.blocks[(it.v - 1) % 7] || th.accent;
  if (!state.REDUCED && state.particles.length < MAX_PARTS) {
    // the block breaks into a few shards of itself
    const ns = it.few || crowd ? 1 : Math.round(1 + (k - 1) * 1.5);
    for (let i = 0; i < ns; i++) {
      const a = Math.random() * Math.PI * 2, v = (0.8 + Math.random() * 1.2) * L.cell * 4 * Math.sqrt(k);
      const r = L.cell * (0.16 + Math.random() * 0.14), pts = [];
      for (let j = 0; j < 3; j++) { const aa = j * 2.1 + Math.random() * 0.8; pts.push(Math.cos(aa) * r * (0.6 + Math.random() * 0.5), Math.sin(aa) * r * (0.6 + Math.random() * 0.5)); }
      state.particles.push({ kind: 'blockShard', pts, x: cx + Math.cos(a) * L.cell * 0.2, y: cy + Math.sin(a) * L.cell * 0.2,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - L.cell * 5, g: 1.1, drag: 0.6, wob: 0, glow: false, ph: 0,
        life: 0, max: 0.6 + Math.random() * 0.35, size: r, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 18, color });
    }
    // and throws quick glowing sparks
    const nk = it.few || crowd || k < 1.4 ? 0 : 1;
    for (let i = 0; i < nk; i++) {
      const a = Math.random() * Math.PI * 2, v = (1.6 + Math.random() * 1.4) * L.cell * 4 * k;
      state.particles.push({ kind: 'streak', x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.25, drag: 3.2, wob: 0, glow: false, ph: 0,
        life: 0, max: 0.35 + Math.random() * 0.2, size: L.cell * (0.1 + Math.random() * 0.07), rot: 0, vr: 0, color: Math.random() < 0.5 ? hiCol(th) : th.accent });
    }
  }
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = (0.6 + Math.random()) * L.cell * 4 * Math.sqrt(k);
    state.particles.push(fxParticle(fx, {
      x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - L.cell * 4,
      life: 0, max: 0.55 + Math.random() * 0.35, size: L.cell * (0.14 + Math.random() * 0.14),
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 12, color,
    }));
  }
  if (it.gem) for (let i = 0; i < (state.REDUCED ? 2 : 7); i++) { // a breaking gem throws a few accent sparks
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = (0.8 + Math.random()) * L.cell * 4.5;
    state.particles.push(fxParticle({ p: 'star', g: 0.5, drag: 1.4, glow: true }, {
      x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 0.6 + Math.random() * 0.4,
      size: L.cell * (0.18 + Math.random() * 0.14), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 8, color: th.accent,
    }));
  }
}
// the theme's highlight color for light effects (glows need a hex color)
const hiCol = th => /^#[0-9a-f]{6}$/i.test(th.fx.flash || '') ? th.fx.flash : '#ffffff';
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
  if (p.glow && !light) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a * 0.8;
    const gs = s * (p.kind === 'streak' ? 2.4 : 3.2);
    ctx.drawImage(glowSprite(p.color), -gs / 2, -gs / 2, gs, gs);
  }
  ctx.globalAlpha = a;
  switch (p.kind) {
    case 'bubble': {
      const r = s * 0.7;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(p.color, 0.18); ctx.fill();
      ctx.lineWidth = Math.max(1, r * 0.22); ctx.strokeStyle = shade(p.color, 0.35); ctx.stroke();
      ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.35, r * 0.22, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill();
      break;
    }
    case 'firefly': case 'ember': {
      ctx.beginPath(); ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = p.kind === 'ember' ? shade(p.color, 0.55) : shade(p.color, 0.7); ctx.fill();
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
      ctx.strokeStyle = mixHex(p.color, '#ffffff', 0.6); ctx.lineWidth = Math.max(1, s * 0.16); ctx.lineCap = 'round';
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
      ctx.strokeStyle = shade(p.color, 0.7); ctx.lineWidth = Math.max(1, s * 0.15); ctx.stroke();
      break;
    }
    case 'petal': {
      ctx.rotate(p.rot * 0.5);
      ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.sin(p.life * 5 + p.ph)));
      ctx.beginPath(); ctx.moveTo(0, -s * 0.7);
      ctx.quadraticCurveTo(s * 0.6, -s * 0.1, 0, s * 0.7); ctx.quadraticCurveTo(-s * 0.6, -s * 0.1, 0, -s * 0.7);
      ctx.fillStyle = mixHex(p.color, '#ffffff', 0.35); ctx.fill();
      break;
    }
    case 'drop': { // honey drop, stretched along its fall
      const sp = Math.hypot(p.vx, p.vy) || 1, st = Math.min(1.8, 1 + sp * 0.002);
      ctx.rotate(Math.atan2(p.vy, p.vx) - Math.PI / 2);
      const r = s * 0.5;
      ctx.beginPath(); ctx.moveTo(0, -r * 1.6 * st);
      ctx.quadraticCurveTo(r * 1.05, r * 0.1, 0, r); ctx.quadraticCurveTo(-r * 1.05, r * 0.1, 0, -r * 1.6 * st);
      ctx.fillStyle = shade(p.color, 0.1); ctx.fill();
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
    case 'goldCoin': { // the clean-board shower: a coin spinning as it falls
      const r = s * 0.62, w = Math.max(0.12, Math.abs(Math.cos(p.life * 9 + p.ph)));
      ctx.rotate(p.rot * 0.15); ctx.scale(w, 1);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = '#c08a1c'; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2); ctx.lineWidth = Math.max(1, r * 0.14); ctx.strokeStyle = '#e0a82a'; ctx.stroke();
      ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fill();
      break;
    }
    case 'star': {
      ctx.rotate(p.rot * 0.3);
      const r = s * 0.8, q = r * 0.22;
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(q, -q, r, 0); ctx.quadraticCurveTo(q, q, 0, r);
      ctx.quadraticCurveTo(-q, q, -r, 0); ctx.quadraticCurveTo(-q, -q, 0, -r);
      ctx.fillStyle = shade(p.color, 0.55); ctx.fill();
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

// a four-pointed sparkle with a soft glow behind it
function sparkle(x, y, r, color, a, light) {
  if (!light) { ctx.globalAlpha = a * 0.7; const g = r * 3.4; ctx.drawImage(glowSprite(color), x - g / 2, y - g / 2, g, g); }
  ctx.globalAlpha = a;
  const q = r * 0.2;
  ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x + q, y - q, x + r, y); ctx.quadraticCurveTo(x + q, y + q, x, y + r);
  ctx.quadraticCurveTo(x - q, y + q, x - r, y); ctx.quadraticCurveTo(x - q, y - q, x, y - r);
  ctx.fillStyle = light ? color : '#ffffff'; ctx.fill();
}
const lineRect = (b, cs) => b.row !== undefined ? [L.gx, L.gy + b.row * cs, N * cs, cs, true] : [L.gx + b.col * cs, L.gy, cs, N * cs, false];
// while dragging: the lines this drop would clear glow, a band of light runs along them and sparkles twinkle on them
function drawPreview(now, d, th, cs, FR, pulse) {
  const tg = d.target, n = tg.rows.length + tg.cols.length;
  const light = !!th.light, hc = hiCol(th), lc = light ? th.accent : hc;
  const intro = outCubic(clamp01((now - d.hlT0) / 220)), k = Math.min(1 + (n - 1) * 0.25, 1.75);
  const rects = [...tg.rows.map(row => lineRect({ row }, cs)), ...tg.cols.map(col => lineRect({ col }, cs))];
  ctx.save();
  if (!light) ctx.globalCompositeOperation = 'lighter';
  // glowing frame around each line
  if (!state.REDUCED) { ctx.shadowColor = lc; ctx.shadowBlur = cs * 0.45 * k; }
  ctx.lineWidth = Math.max(2, cs * 0.07); ctx.strokeStyle = lc;
  for (const [x, y, w, h] of rects) {
    ctx.globalAlpha = intro * (0.5 + 0.3 * pulse);
    rr(ctx, x + 1, y + 1, w - 2, h - 2, cs * FR); ctx.stroke();
  }
  ctx.shadowBlur = 0;
  if (state.REDUCED) { ctx.restore(); return; }
  // a band of light sweeping along the lines
  const ph = ((now - d.hlT0) / 820) % 1;
  for (const [x, y, w, h, horiz] of rects) {
    const len = horiz ? w : h, bw = cs * 1.6, p = -bw + ph * (len + bw * 2);
    const g = horiz ? ctx.createLinearGradient(x + p - bw, 0, x + p + bw, 0) : ctx.createLinearGradient(0, y + p - bw, 0, y + p + bw);
    g.addColorStop(0, rgba(lc, 0)); g.addColorStop(0.5, rgba(lc, Math.min(0.75, 0.42 * k))); g.addColorStop(1, rgba(lc, 0));
    ctx.save(); rr(ctx, x, y, w, h, cs * FR); ctx.clip();
    ctx.globalAlpha = intro; ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.restore();
  }
  // twinkling sparkles, each cell on its own beat
  for (const key of tg.hl) {
    const hsh = ((key * 2654435761) >>> 0) / 4294967296, t = ((now / 1000) * (0.9 + 0.4 * k) + hsh * 7.3) % 1;
    if (t > 0.4) continue;
    const r = (key / N) | 0, c = key % N, hx = (hsh * 13.7) % 1, hy = (hsh * 29.3) % 1;
    sparkle(L.gx + (c + 0.2 + 0.6 * hx) * cs, L.gy + (r + 0.2 + 0.6 * hy) * cs, cs * 0.2 * k * Math.sin(t / 0.4 * Math.PI), hc, intro, light);
  }
  ctx.restore();
  // small motes of light drift up off the lines
  const every = 150 / k;
  if (!d.moteT || now - d.moteT > 500) d.moteT = now;
  while (now - d.moteT > every) {
    d.moteT += every;
    const keys = [...tg.hl], key = keys[(Math.random() * keys.length) | 0], r = (key / N) | 0, c = key % N;
    state.particles.push(fxParticle({ p: 'star', g: -0.12, drag: 2.2, glow: true }, {
      x: L.gx + (c + Math.random()) * cs, y: L.gy + (r + Math.random()) * cs, vx: (Math.random() - 0.5) * cs, vy: -cs * (0.8 + Math.random()),
      life: 0, max: 0.5 + Math.random() * 0.3, size: cs * (0.12 + Math.random() * 0.1), rot: Math.random() * 6, vr: 2, color: Math.random() < 0.6 ? hc : th.accent,
    }));
  }
}
// a clear: a beam of light flares along each line, shockwaves ring out from where the piece landed
function drawBlast(now, th, cs) {
  const light = !!th.light, hc = hiCol(th), lc = light ? th.accent : hc;
  ctx.save();
  for (const b of state.beams) {
    const t = (now - b.t0) / 380;
    if (t < 0 || t >= 1) continue;
    const [x, y, w, h, horiz] = lineRect(b, cs), e = outCubic(t);
    const grow = cs * 0.3 * e, wide = cs * (0.3 + 0.35 * e); // a beam reaches a little past the board's ends and widens as it fades
    const a = (1 - t) * (1 - t);
    const cx = x + w / 2, cy = y + h / 2;
    const g = horiz ? ctx.createLinearGradient(0, cy - wide, 0, cy + wide) : ctx.createLinearGradient(cx - wide, 0, cx + wide, 0);
    g.addColorStop(0, rgba(lc, 0)); g.addColorStop(0.5, rgba(lc, 0.38)); g.addColorStop(1, rgba(lc, 0));
    ctx.globalAlpha = a; ctx.fillStyle = g;
    if (horiz) ctx.fillRect(x - grow, cy - wide, w + grow * 2, wide * 2); else ctx.fillRect(cx - wide, y - grow, wide * 2, h + grow * 2);
    // bright core
    const core = cs * 0.05 * (1 - t);
    ctx.globalAlpha = a * 0.5; ctx.fillStyle = light ? th.accent : '#ffffff';
    if (horiz) ctx.fillRect(x - grow, cy - core / 2, w + grow * 2, core); else ctx.fillRect(cx - core / 2, y - grow, core, h + grow * 2);
  }
  state.beams = state.beams.filter(b => now - b.t0 < 380);
  ctx.strokeStyle = lc;
  for (const ring of state.rings) {
    const t = (now - ring.t0) / ring.dur;
    if (t < 0 || t >= 1) continue;
    ctx.globalAlpha = 0.4 * (1 - t);
    ctx.strokeStyle = ring.color || lc;
    ctx.lineWidth = Math.max(1, ring.w * (1 - t));
    ctx.beginPath(); ctx.arc(ring.x, ring.y, Math.max(1, ring.rad * outCubic(t)), 0, Math.PI * 2); ctx.stroke();
  }
  state.rings = state.rings.filter(ring => now - ring.t0 < ring.dur);
  ctx.restore();
}

// the combo word: pops in with an elastic squash and stretch, bounces, wobbles, and gets hotter in colour as the combo climbs
const COMBO_COLS = ['#ffd23f', '#ffa630', '#ff6b4a', '#ff4fa3'];
const elastic = x => x >= 1 ? 1 : 1 - Math.pow(2, -9 * x) * Math.cos(x * 9.5);
function drawCombo(tx, t, now, th, cs) {
  const lv = tx.combo, rainbow = lv >= 7, light = !!th.light;
  const col = rainbow ? `hsl(${(now * 0.25) % 360},95%,60%)` : lv === 2 ? th.accent : COMBO_COLS[lv - 3];
  const top = rainbow ? `hsl(${(now * 0.25 + 50) % 360},100%,82%)` : mixHex(col, '#ffffff', 0.55);
  const pop = Math.max(0.01, elastic(Math.min(1, t / 0.32)));
  const wob = Math.sin(t * 30) * Math.exp(-t * 7) * 0.24; // squash and stretch
  const bounce = Math.abs(Math.sin(t * Math.PI * 2.4)) * Math.exp(-t * 3.6) * cs * 0.4;
  const y = tx.y - bounce - outCubic(t) * cs * 1.1, size = tx.size; // rises like the other texts so the stack keeps its spacing
  ctx.font = `800 ${size}px "Baloo 2", "Trebuchet MS", sans-serif`;
  const half = ctx.measureText(tx.text).width / 2 * 1.2 + size * 0.15;
  const x = Math.max(L.bx + half, Math.min(L.bx + L.B - half, tx.x));
  ctx.save();
  ctx.globalAlpha = t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;
  ctx.translate(x, y);
  ctx.rotate(Math.sin(t * 16) * Math.exp(-t * 5) * 0.03 * Math.min(lv, 7));
  ctx.scale(pop * (1 + wob), pop * (1 - wob));
  ctx.lineWidth = size * 0.26; ctx.strokeStyle = light ? 'rgba(60,30,10,.85)' : 'rgba(20,10,4,.82)';
  if (lv >= 4 && !light) { ctx.shadowColor = col; ctx.shadowBlur = size * 0.3; }
  ctx.strokeText(tx.text, 0, 0);
  ctx.shadowBlur = 0;
  const g = ctx.createLinearGradient(0, -size * 0.45, 0, size * 0.4);
  g.addColorStop(0, top); g.addColorStop(0.55, col); g.addColorStop(1, rainbow ? col : shade(col, -0.12));
  ctx.fillStyle = g; ctx.fillText(tx.text, 0, 0);
  ctx.restore();
  if (tx.sub) { // the multiplier rides under the word, steady, fading in after the pop
    const ss = size * 0.55, sy = y + size * 0.5 + ss * 0.7;
    ctx.globalAlpha = clamp01((t - 0.08) / 0.15) * (t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1);
    ctx.font = `800 ${ss}px "Baloo 2", "Trebuchet MS", sans-serif`;
    ctx.lineWidth = ss * 0.22; ctx.strokeStyle = rgba(th.stroke, 0.88);
    ctx.strokeText(tx.sub, x, sy); ctx.fillStyle = th.fg; ctx.fillText(tx.sub, x, sy);
    ctx.globalAlpha = 1;
  }
}
// score sparks, drawn on the canvas over the HUD: each one curves up to the counter, leaves a short trail and flashes as it lands
let flyDirty = false;
function drawOrbs(now, th) {
  if (!state.orbs.length && !flyDirty) return;
  fctx.setTransform(BDPR, 0, 0, BDPR, 0, 0);
  fctx.clearRect(0, 0, BW, BH);
  flyDirty = state.orbs.length > 0;
  const light = !!th.light;
  if (!light) fctx.globalCompositeOperation = 'lighter';
  const at = (o, u) => { const e = u * u * (3 - 2 * u), a = 1 - e; return [a * a * o.sx + 2 * a * e * o.mx + e * e * o.tx, a * a * o.sy + 2 * a * e * o.my + e * e * o.ty]; };
  for (const o of state.orbs) {
    const u = (now - o.t0) / o.dur;
    if (u < 0) continue;
    if (u >= 1) {
      if (!o.done) { o.done = true; bumpScore(); Sfx.orb(o.i); }
      const f = (now - o.t0 - o.dur) / 260; // the landing flash
      if (f < 1) { fctx.globalAlpha = 1 - f; const r = o.size * (1.5 + f * 4); fctx.drawImage(glowSprite(o.color), o.tx - r, o.ty - r, r * 2, r * 2); }
      continue;
    }
    for (let j = 4; j >= 0; j--) { // trail
      const [x, y] = at(o, Math.max(0, u - j * 0.035)), r = o.size * (1 - j * 0.16) * (j ? 1.6 : 2.6);
      fctx.globalAlpha = j ? 0.5 * (1 - j / 5) : 1;
      fctx.drawImage(glowSprite(o.color), x - r, y - r, r * 2, r * 2);
    }
    const [x, y] = at(o, u);
    fctx.globalAlpha = 1; fctx.fillStyle = '#ffffff';
    fctx.beginPath(); fctx.arc(x, y, o.size * 0.42, 0, Math.PI * 2); fctx.fill();
  }
  fctx.globalAlpha = 1; fctx.globalCompositeOperation = 'source-over';
  state.orbs = state.orbs.filter(o => now - o.t0 - o.dur < 260);
}

let last = performance.now();
export function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;

  if (tut && tut.next && now >= tut.next) { tut.next = 0; if (tut.step + 1 < TUT.length) tutGo(tut.step + 1, now); else tutFinish(); }
  if (state.pendingTheme && now >= state.pendingTheme.at) { const p = state.pendingTheme; state.pendingTheme = null; setTheme(p.i, now, { unlocked: !!p.unlocked, finale: !!p.finale }); if (!state.over) save(); }
  applyDomColors(now);

  let held = 0; // points still flying up as sparks: the counter adds them as they land
  for (const o of state.orbs) if (!o.done) held += o.val;
  const shown = state.score - held;
  if (state.orbs.length) state.displayScore = shown; // while sparks fly the counter steps up with each one that lands
  else state.displayScore += (shown - state.displayScore) * Math.min(1, dt * 9);
  if (Math.abs(shown - state.displayScore) < 0.5) state.displayScore = shown;
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

  if (!menuOpen && !state.over && !tut && !document.hidden && now - state.lastInput < 45000 && $('gallery').hidden && $('info').hidden && $('settings').hidden && $('levels').hidden) {
    const pt = mode().playTime;
    if (pt) pt(dt); else stats.playSec += dt;
    state.playAcc += dt;
    if (state.playAcc > 10) { state.playAcc = 0; store.set(STATS_KEY, stats); checkUnlocks(now); }
  }
  drawBg(now, dt);
  draw(now);
  drawOrbs(now, TH());
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

  let sx = 0, sy = 0;
  if (state.shake) {
    const t = (now - state.shake.t0) / 280;
    if (t >= 1) state.shake = null;
    else if (t > 0) { const a = state.shake.amp * Math.pow(1 - t, 2); sx = (Math.random() * 2 - 1) * a; sy = (Math.random() * 2 - 1) * a; }
  }
  ctx.save(); ctx.translate(sx, sy);

  // board
  rr(ctx, L.bx, L.by, L.B, L.B, L.B * (theme.mode === 'classic' ? 0.022 : 0.035));
  ctx.fillStyle = flipping ? mixHex(THEMES[tp].board, th.board, bm) : th.board; ctx.fill();
  ctx.strokeStyle = th.light ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.07)'; ctx.lineWidth = 2; ctx.stroke();

  const tgt = state.drag && state.drag.target;
  const dragColor = state.drag && state.drag.piece.color;
  const pzg = !tut && mode().boardGems ? mode().boardGems() : null; // gems on the board
  const greyRows = state.over && !(pzg && state.puz.won) ? Math.floor((now - state.overT0) / 70) : -1; // a won level does not grey out
  const pulse = 0.5 + 0.5 * Math.sin(now / 90);

  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = L.gx + c * cs, y = L.gy + r * cs;
    const ft = flipping ? flipT(now, 150 + (r + c) * 45) : 1;
    drawFlip(sprite(tp, 0, 0, pm), sprite(ti, 0), x, y, cs, ft);
    let v = state.grid[r][c];
    if (!v) continue;
    let s = 1;
    const a = pop[r][c];
    if (a) {
      const t = clamp01((now - a) / 240);
      s = 0.6 + 0.4 * outBack(t);
      if (t >= 1) pop[r][c] = 0;
    }
    if (state.over && r < greyRows) v = GREY;
    const lit = tgt && tgt.hl && tgt.hl.has(r * N + c);
    if (lit) { v = dragColor; if (!state.REDUCED) s *= 1 + 0.035 * pulse; }
    drawFlip(sprite(tp, v, 0, pm), sprite(ti, v), x, y, cs, ft, s);
    if (pzg && pzg[r][c]) drawGemOn(ctx, ti, x, y, cs, DPR, 0.86 * s);
    if (lit) {
      ctx.globalAlpha = 0.12 + 0.12 * pulse;
      rr(ctx, x + cs * FI, y + cs * FI, cs * (1 - 2 * FI), cs * (1 - 2 * FI), cs * FR);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.globalAlpha = 1;
    }
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
      ctx.globalAlpha = clears ? 0.72 : 0.38;
      ctx.drawImage(spr, x, y, cs, cs);
      if (clears) {
        ctx.globalAlpha = 0.12 + 0.12 * pulse;
        rr(ctx, x + cs * FI, y + cs * FI, cs * (1 - 2 * FI), cs * (1 - 2 * FI), cs * FR);
        ctx.fillStyle = '#fff'; ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (clears) drawPreview(now, state.drag, th, cs, FR, pulse);
  }

  for (const it of state.clearing) {
    const t = (now - it.t0 - it.delay) / 300;
    const x = L.gx + it.c * cs, y = L.gy + it.r * cs;
    if (t >= 0 && !it.spawned) { it.spawned = true; spawnParticles(it); }
    const spr = sprite(ti, it.v);
    const fl = th.fx.flash || shade(th.blocks[(it.v - 1) % 7] || th.accent, 0.45);
    if (t < 0) {
      drawSprite(spr, x, y, cs, 1);
      if (now > it.t0) {
        ctx.globalAlpha = 0.35;
        rr(ctx, x + cs * FI, y + cs * FI, cs * (1 - 2 * FI), cs * (1 - 2 * FI), cs * FR);
        ctx.fillStyle = fl; ctx.fill(); ctx.globalAlpha = 1;
      }
    } else if (t < 1) {
      const s = 1 - t * t;
      ctx.globalAlpha = 1 - t * 0.4;
      drawSprite(spr, x, y, cs, s * (1 + 0.15 * Math.sin(t * Math.PI)));
      ctx.globalAlpha = (1 - t) * 0.35;
      const w = cs * (1 - 2 * FI) * s;
      rr(ctx, x + (cs - w) / 2, y + (cs - w) / 2, w, w, cs * FR * s);
      ctx.fillStyle = fl; ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (it.gem && t < 1) { // the gem lifts off its block and fades as the line clears
      const k = clamp01(t);
      ctx.globalAlpha = 1 - k;
      drawGemOn(ctx, ti, x, y - cs * 0.5 * outCubic(k), cs, DPR, 0.86 * (1 + 0.5 * k));
      ctx.globalAlpha = 1;
    }
  }
  state.clearing = state.clearing.filter(it => (now - it.t0 - it.delay) / 300 < 1);
  if (state.beams.length || state.rings.length) drawBlast(now, th, cs);
  if (state.flash) {
    const t = (now - state.flash.t0) / (state.flash.dur || 700);
    if (t >= 1) state.flash = null;
    else if (t > 0) {
      rr(ctx, L.bx, L.by, L.B, L.B, L.B * 0.03);
      ctx.fillStyle = rgba(th.accent, (state.flash.a ?? 0.35) * (1 - t) * (1 - t)); ctx.fill();
    }
  }
  ctx.restore();

  // tray
  for (let i = 0; i < 3; i++) {
    const t = state.tray[i];
    if (!t || (state.drag && state.drag.slot === i)) continue;
    let cx = L.bx + L.slotW * (i + 0.5), cy = L.trayY + L.trayH / 2, c2 = L.trayCell;
    let alpha = t.fits ? 1 : 0.32;
    const ta = (now - t.appear) / 340;
    if (ta < 1) {
      if (ta <= 0) continue;
      c2 *= Math.max(0.01, outBack(ta));
      cy += (1 - outCubic(ta)) * L.trayH * 0.3;
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
    if (tx.combo) { drawCombo(tx, t, now, th, cs); continue; }
    const sc = t < 0.18 ? outBack(t / 0.18) : 1;
    const y = tx.y - outCubic(t) * cs * 1.1;
    ctx.globalAlpha = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
    ctx.font = `800 ${Math.max(1, tx.size * sc)}px "Baloo 2", "Trebuchet MS", sans-serif`;
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
      const fs = cs * 0.86 * (0.85 + 0.15 * outBack(inT));
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
