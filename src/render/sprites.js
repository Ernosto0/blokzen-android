import { THEMES } from '../themes/catalog.js';
import { hexOf, mixHex, rgba, shade } from '../core/color.js';
import { GREY } from '../core/constants.js';
import { theme } from '../core/state.js';
import { DPR, L } from './layout.js';
import { seeded, STYLES } from './blocks.js';
import { TEX, texIn } from './textures.js';
import { GEM_LOOKS } from '../themes/collections/puzzle.js';

/* ---------- Block sprites (one look per theme style) ---------- */
export const sprites = new Map();
export function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
}
export function poly(g, pts, fill) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = fill; g.fill(); }
export function sparkle(g, x, y, r, a) {
  g.save(); g.globalAlpha = a; g.fillStyle = '#fff';
  g.beginPath();
  g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
  g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r);
  g.fill(); g.restore();
}
export function sprite(ti, v, px, mode) {
  px = px || Math.max(8, Math.ceil(L.cell * DPR));
  mode = mode || theme.mode;
  const key = ti + '|' + v + '|' + px + '|' + mode;
  if (sprites.has(key)) return sprites.get(key);
  const th = THEMES[ti], s = px;
  const c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d');
  if (v === 0 && mode === 'classic') {
    rr(g, s * 0.02, s * 0.02, s * 0.96, s * 0.96, s * 0.05);
    g.fillStyle = th.cell; g.fill();
    g.save(); g.clip();
    g.fillStyle = th.light ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.24)'; g.fillRect(0, 0, s, s * 0.09); g.fillRect(0, 0, s * 0.07, s);
    g.fillStyle = th.light ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.04)'; g.fillRect(0, s * 0.93, s, s * 0.07);
    g.restore();
  } else if (v === 0) {
    if (th.style === 'neon') {
      rr(g, s * 0.1, s * 0.1, s * 0.8, s * 0.8, s * 0.14);
      g.fillStyle = rgba(th.cell, 0.6); g.fill();
      g.lineWidth = Math.max(1, s * 0.03); g.strokeStyle = shade(th.cell, 0.12); g.stroke();
    } else {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.16);
      g.fillStyle = th.cell; g.fill();
      g.save(); g.clip();
      g.fillStyle = th.light ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.22)'; g.fillRect(0, 0, s, s * 0.14);
      g.restore();
    }
  } else {
    const col = v === GREY ? th.grey : th.blocks[v - 1];
    if (mode === 'classic') {
      // square bevelled tile, finished with the theme's own mark
      drawBlock(g, s, col, 'classic', th.style);
      if (v !== GREY) drawMotif(g, s, col, th.style);
    } else drawBlock(g, s, col, v === GREY && DULL.has(th.style) ? 'flat' : th.style);
  }
  sprites.set(key, c);
  return c;
}
// Puzzle gem: a cut stone in the theme's accent on a dark seat, so it reads on every block colour and theme
export const gemSprites = new Map();
function gemSprite(ti, px) {
  const key = ti + '|' + px;
  if (gemSprites.has(key)) return gemSprites.get(key);
  const th = THEMES[ti], s = px, c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d'), P = (x, y) => [s * x, s * y], col = th.accent;
  const seat = g.createRadialGradient(s / 2, s * 0.54, 0, s / 2, s * 0.54, s * 0.5);
  seat.addColorStop(0, 'rgba(0,0,0,.45)'); seat.addColorStop(0.6, 'rgba(0,0,0,.3)'); seat.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = seat; g.fillRect(0, 0, s, s);
  if (GEM_LOOKS[th.id]) { GEM_LOOKS[th.id](g, s, th); gemSprites.set(key, c); return c; } // the puzzle collection draws its own gem
  const OUT = [[0.31, 0.24], [0.69, 0.24], [0.85, 0.42], [0.5, 0.84], [0.15, 0.42]];
  const path = () => { g.beginPath(); OUT.forEach(([x, y], i) => i ? g.lineTo(s * x, s * y) : g.moveTo(s * x, s * y)); g.closePath(); };
  g.lineJoin = 'round';
  path(); g.lineWidth = s * 0.08; g.strokeStyle = 'rgba(0,0,0,.55)'; g.stroke();
  const gr = g.createLinearGradient(0, s * 0.24, 0, s * 0.84);
  gr.addColorStop(0, mixHex(col, '#ffffff', 0.55)); gr.addColorStop(0.4, col); gr.addColorStop(1, shade(col, -0.42));
  path(); g.fillStyle = gr; g.fill();
  poly(g, [P(0.31, 0.24), P(0.5, 0.24), P(0.38, 0.42), P(0.15, 0.42)], 'rgba(255,255,255,.4)');
  poly(g, [P(0.5, 0.24), P(0.69, 0.24), P(0.85, 0.42), P(0.62, 0.42)], 'rgba(255,255,255,.14)');
  poly(g, [P(0.15, 0.42), P(0.38, 0.42), P(0.5, 0.84)], 'rgba(255,255,255,.2)');
  poly(g, [P(0.62, 0.42), P(0.85, 0.42), P(0.5, 0.84)], 'rgba(0,0,0,.22)');
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = Math.max(1, s * 0.022); g.lineCap = 'round';
  g.beginPath();
  g.moveTo(...P(0.15, 0.42)); g.lineTo(...P(0.85, 0.42));
  g.moveTo(...P(0.38, 0.42)); g.lineTo(...P(0.5, 0.24)); g.lineTo(...P(0.62, 0.42));
  g.moveTo(...P(0.38, 0.42)); g.lineTo(...P(0.5, 0.84)); g.lineTo(...P(0.62, 0.42));
  g.stroke();
  path(); g.lineWidth = Math.max(1, s * 0.032); g.strokeStyle = 'rgba(255,255,255,.88)'; g.stroke();
  sparkle(g, s * 0.33, s * 0.3, s * 0.11, 0.95);
  gemSprites.set(key, c);
  return c;
}
export function drawGemOn(g, ti, x, y, cs, dpr, scale = 0.86) {
  const sz = cs * scale;
  g.drawImage(gemSprite(ti, Math.max(8, Math.ceil(cs * dpr))), x + (cs - sz) / 2, y + (cs - sz) / 2, sz, sz);
}
const DULL = new Set(['neon', 'lava', 'cosmic']); export function hexPath(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + Math.PI / 6; const px = x + r * Math.cos(a), py = y + r * Math.sin(a); i ? g.lineTo(px, py) : g.moveTo(px, py); }
  g.closePath();
}
// the theme's material laid over a classic tile
function drawMotif(g, s, c, style) {
  if (!TEX[style]) return;
  g.save(); rr(g, s * 0.012, s * 0.012, s * 0.976, s * 0.976, s * 0.05); g.clip();
  TEX[style](g, s, c, seeded(c), 0.85);
  g.restore();
}
function drawBlock(g, s, c, style, flavor) {
  if (STYLES[style]) { STYLES[style].block(g, s, c); return; }
  if (style === 'classic') {
    if (STYLES[flavor] && STYLES[flavor].tint) c = STYLES[flavor].tint(c);
    if (flavor === 'lava') c = hexOf(mixHex(c, '#2a0c06', 0.35));
    else if (flavor === 'cosmic') c = hexOf(mixHex(c, '#0a1030', 0.18));
    else if (flavor === 'frost') c = hexOf(mixHex(c, '#ffffff', 0.12));
    // square tile, near-zero gap, bevelled edges
    const o = s * 0.012, e = s - o, b = s * 0.135;
    g.save(); rr(g, o, o, e - o, e - o, s * 0.05); g.clip();
    poly(g, [[o, o], [e, o], [e - b, o + b], [o + b, o + b]], shade(c, 0.4));
    poly(g, [[o, o], [o + b, o + b], [o + b, e - b], [o, e]], shade(c, 0.18));
    poly(g, [[e, o], [e, e], [e - b, e - b], [e - b, o + b]], shade(c, -0.17));
    poly(g, [[o, e], [o + b, e - b], [e - b, e - b], [e, e]], shade(c, -0.36));
    const grad = g.createLinearGradient(0, o + b, 0, e - b);
    grad.addColorStop(0, shade(c, 0.1)); grad.addColorStop(1, shade(c, -0.05));
    g.fillStyle = grad; g.fillRect(o + b, o + b, e - o - 2 * b, e - o - 2 * b);
    g.restore();
    rr(g, o, o, e - o, e - o, s * 0.05);
    g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
  } else if (style === 'honey') {
    rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.2); g.fillStyle = shade(c, -0.5); g.fill();
    const gr = g.createRadialGradient(s * 0.42, s * 0.36, s * 0.04, s * 0.5, s * 0.55, s * 0.62);
    gr.addColorStop(0, shade(c, 0.45)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.32));
    rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.8, s * 0.17); g.fillStyle = gr; g.fill();
    g.save(); rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.8, s * 0.17); g.clip();
    TEX.honey(g, s, c, seeded(c), 1);
    g.restore();
  } else if (style === 'gloss') {
    const r = s * 0.18;
    rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, r); g.fillStyle = shade(c, -0.34); g.fill();
    const grad = g.createLinearGradient(0, 0, 0, s);
    grad.addColorStop(0, shade(c, 0.3)); grad.addColorStop(1, c);
    rr(g, s * 0.09, s * 0.08, s * 0.82, s * 0.76, r * 0.8); g.fillStyle = grad; g.fill();
    g.globalAlpha = 0.5; rr(g, s * 0.2, s * 0.13, s * 0.6, s * 0.1, s * 0.05); g.fillStyle = '#fff'; g.fill(); g.globalAlpha = 1;
  } else if (style === 'jelly') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.28); g.fillStyle = shade(c, -0.28); g.fill();
    const grad = g.createRadialGradient(s * 0.4, s * 0.35, s * 0.05, s * 0.5, s * 0.5, s * 0.6);
    grad.addColorStop(0, shade(c, 0.35)); grad.addColorStop(1, c);
    rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.8, s * 0.24); g.fillStyle = grad; g.fill();
    g.save(); g.translate(s * 0.37, s * 0.28); g.rotate(-0.45);
    g.beginPath(); g.ellipse(0, 0, s * 0.2, s * 0.09, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.6)'; g.fill(); g.restore();
    g.beginPath(); g.arc(s * 0.7, s * 0.68, s * 0.05, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.35)'; g.fill();
  } else if (style === 'flat' || style === 'leaf') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * (style === 'leaf' ? 0.2 : 0.13)); g.fillStyle = c; g.fill();
    g.save(); g.clip(); g.fillStyle = shade(c, -0.22); g.fillRect(0, s * 0.74, s, s * 0.26);
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(0, 0, s * 0.12, s); g.restore();
    if (style === 'leaf') texIn(g, s, c, 'leaf', 1, 0.05, 0.2);
    else { g.globalAlpha = 0.55; rr(g, s * 0.2, s * 0.18, s * 0.14, s * 0.14, s * 0.04); g.fillStyle = '#fff'; g.fill(); g.globalAlpha = 1; }
  } else if (style === 'lava') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.12); g.fillStyle = mixHex(c, '#120604', 0.6); g.fill();
    g.save(); g.clip();
    const gr = g.createRadialGradient(s * 0.5, s * 0.52, 0, s * 0.5, s * 0.52, s * 0.62);
    gr.addColorStop(0, rgba(c, 0.85)); gr.addColorStop(1, rgba(c, 0.05));
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
    g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(0, s * 0.8, s, s * 0.2);
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, 0, s, s * 0.1);
    g.restore();
    texIn(g, s, c, 'lava', 1, 0.05, 0.12);
  } else if (style === 'cosmic') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.22); g.fillStyle = shade(c, -0.5); g.fill();
    const gr = g.createRadialGradient(s * 0.34, s * 0.3, s * 0.02, s * 0.5, s * 0.5, s * 0.62);
    gr.addColorStop(0, shade(c, 0.4)); gr.addColorStop(0.5, c); gr.addColorStop(1, shade(c, -0.42));
    rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.82, s * 0.2); g.fillStyle = gr; g.fill();
    texIn(g, s, c, 'cosmic', 1, 0.08, 0.2);
  } else if (style === 'gem' || style === 'frost') {
    const o = s * 0.04, e = s * 0.96, b = s * 0.24, f = s - b;
    g.save(); rr(g, o, o, e - o, e - o, s * 0.09); g.clip();
    const k = style === 'frost' ? 0.28 : 0;
    poly(g, [[o, o], [e, o], [f, b], [b, b]], shade(c, 0.42 + k * 0.5));
    poly(g, [[o, o], [b, b], [b, f], [o, e]], shade(c, 0.18 + k));
    poly(g, [[e, o], [e, e], [f, f], [f, b]], shade(c, -0.18 + k * 0.4));
    poly(g, [[o, e], [b, f], [f, f], [e, e]], shade(c, -0.38 + k * 0.3));
    const grad = g.createLinearGradient(b, b, f, f);
    grad.addColorStop(0, shade(c, 0.12 + k)); grad.addColorStop(1, shade(c, -0.05 + k * 0.6));
    g.fillStyle = grad; g.fillRect(b, b, f - b, f - b);
    g.restore();
    if (style === 'frost') {
      rr(g, o + s * 0.02, o + s * 0.02, e - o - s * 0.04, e - o - s * 0.04, s * 0.08);
      g.strokeStyle = 'rgba(255,255,255,.65)'; g.lineWidth = Math.max(1, s * 0.035); g.stroke();
      texIn(g, s, c, 'frost', 1, 0.04, 0.09);
    } else {
      texIn(g, s, c, 'gem', 1, 0.04, 0.09);
    }
  } else if (style === 'neon') {
    rr(g, s * 0.15, s * 0.15, s * 0.7, s * 0.7, s * 0.14);
    g.fillStyle = rgba(c, 0.22); g.fill();
    g.shadowColor = c; g.shadowBlur = s * 0.16;
    g.lineWidth = s * 0.075; g.strokeStyle = c; g.stroke(); g.stroke();
    g.shadowBlur = 0; g.lineWidth = Math.max(1, s * 0.025); g.strokeStyle = shade(c, 0.6); g.stroke();
  } else if (style === 'candy') {
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.26); g.fillStyle = shade(c, -0.15); g.fill();
    rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.83, s * 0.26); g.fillStyle = c; g.fill();
    texIn(g, s, c, 'candy', 1, 0.05, 0.26);
    g.beginPath(); g.ellipse(s * 0.36, s * 0.2, s * 0.2, s * 0.05, -0.15, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.45)'; g.fill();
  }
}
