import { mixHex, rgba, shade } from '../core/color.js';
import { rand } from '../core/util.js';
import { state } from '../core/state.js';
import { L } from './layout.js';

/* ---------- Clear effects by material ----------
   Each cleared block breaks the way the theme's material would: wood splinters, glass shatters, stone crumbles into dust
   and gravel, metal throws a few sparks, paper tears into scraps, soft things puff, water splashes, electronics break into
   pixels, magic scatters stars, drums send out soft rings. The group of a theme is th.snd.boom (see audio/booms.js);
   the theme's own particles (fx.p) still fly on top. Everything here is calm on purpose: few particles, no additive glow. */

// a particle: x, y, velocity (in cells per second), gravity factor, drag, life, size (in cells), spin
const P = (kind, x, y, o) => ({ kind, x, y, vx: 0, vy: 0, g: 1, drag: 0, wob: 0, glow: false, ph: Math.random() * 6.28, life: 0, max: 0.7, size: L.cell * 0.2, rot: Math.random() * 6.28, vr: 0, color: '#fff', ...o });
const cellV = (a, speed) => ({ vx: Math.cos(a) * speed * L.cell, vy: Math.sin(a) * speed * L.cell });
const out = (cx, cy, kind, n, f) => { for (let i = 0; i < n; i++) state.particles.push(f(i, Math.random() * 6.28, P)); }; // n particles of one kind

// what each group throws when one block of its line clears; c = the block's colour, k (1..2) = how hard the clear hits
export const SPAWN = {
  wood(cx, cy, c, k, lite, odd) { // splinters of the block's own wood, a pinch of sawdust
    out(cx, cy, 'g-chip', lite || odd ? 1 : 2, (i, a) => P('g-chip', cx, cy, { ...cellV(a, rand(2, 4.5) * Math.sqrt(k)), vy: Math.sin(a) * L.cell * rand(2, 4.5) - L.cell * 3, g: 1, drag: 0.5, max: rand(0.6, 0.9), size: L.cell * rand(0.12, 0.2), vr: rand(-12, 12), color: i % 2 ? shade(c, 0.12) : shade(c, -0.12) }));
    if (!lite && !odd) out(cx, cy, 'g-dust', 1, (i, a) => P('g-dust', cx, cy, { ...cellV(a, rand(0.5, 1.4)), g: 0.1, drag: 2, max: rand(0.5, 0.8), size: L.cell * 0.14, color: '#d8b88a' }));
  },
  glass(cx, cy, c, k, lite, odd) { // thin shards with a glint, and one clear twinkle
    out(cx, cy, 'g-shard', lite || odd ? 1 : 2, (i, a) => P('g-shard', cx, cy, { ...cellV(a, rand(2, 4.5) * Math.sqrt(k)), vy: Math.sin(a) * L.cell * rand(2, 4.5) - L.cell * 2.5, g: 0.9, drag: 0.6, max: rand(0.6, 0.9), size: L.cell * rand(0.18, 0.3), vr: rand(-10, 10), color: mixHex(c, '#ffffff', 0.55) }));
    if (!lite && !odd) out(cx, cy, 'g-star', 1, () => P('g-star', cx, cy, { ...cellV(-1.57, 1.2), g: 0, drag: 2, max: 0.6, size: L.cell * 0.16, color: '#ffffff' }));
  },
  stone(cx, cy, c, k, lite, odd) { // a puff of dust that spreads and fades, and heavy gravel that drops
    if (!odd) out(cx, cy, 'g-dust', 1, () => P('g-dust', cx, cy, { vx: 0, vy: -L.cell * 0.5, g: 0, drag: 1.5, max: rand(0.7, 1), size: L.cell * 0.3, color: mixHex(c, '#b8aea0', 0.6) }));
    out(cx, cy, 'g-gravel', 1, (i, a) => P('g-gravel', cx, cy, { ...cellV(a, rand(1, 3)), vy: Math.sin(a) * L.cell * rand(1, 3) - L.cell * 2, g: 1.5, drag: 0.4, max: rand(0.5, 0.8), size: L.cell * rand(0.1, 0.17), vr: rand(-8, 8), color: shade(mixHex(c, '#8a8278', 0.55), -0.15) }));
  },
  metal(cx, cy, c, k, lite, odd) { // a couple of short sparks that fall and a glint
    if (!odd) out(cx, cy, 'g-spark', 1, (i, a) => P('g-spark', cx, cy, { ...cellV(a, rand(3, 6) * Math.sqrt(k)), g: 0.8, drag: 2.2, max: rand(0.3, 0.5), size: L.cell * rand(0.08, 0.12), color: i % 2 ? '#ffc76a' : '#ffe9b8' }));
    if (!lite && !odd) out(cx, cy, 'g-star', 1, () => P('g-star', cx, cy, { vx: 0, vy: 0, g: 0, max: 0.4, size: L.cell * 0.14, color: '#fff4d0' }));
  },
  paper(cx, cy, c, k, lite, odd) { // scraps that flutter down, turning over as they go
    out(cx, cy, 'g-scrap', lite || odd ? 1 : 2, (i, a) => P('g-scrap', cx, cy, { ...cellV(a, rand(1, 2.8)), vy: Math.sin(a) * L.cell * rand(1, 2.8) - L.cell * 1.5, g: 0.18, drag: 1.8, wob: 1.2, max: rand(0.9, 1.3), size: L.cell * rand(0.14, 0.22), vr: rand(-4, 4), color: i % 2 ? c : mixHex(c, '#ffffff', 0.5) }));
  },
  soft(cx, cy, c, k, lite, odd) { // round puffs that swell and drift up
    if (!odd) out(cx, cy, 'g-puff', 1, () => P('g-puff', cx + rand(-0.15, 0.15) * L.cell, cy, { vx: rand(-0.6, 0.6) * L.cell, vy: -L.cell * rand(0.7, 1.5), g: -0.05, drag: 1.2, max: rand(0.8, 1.1), size: L.cell * rand(0.2, 0.3), color: mixHex(c, '#ffffff', 0.45) }));
  },
  water(cx, cy, c, k, lite, odd) { // droplets that arc out, and a bubble that rises
    out(cx, cy, 'g-drop', lite || odd ? 1 : 2, (i, a) => P('g-drop', cx, cy, { ...cellV(a, rand(2, 4.5) * Math.sqrt(k)), vy: Math.sin(a) * L.cell * rand(2, 4.5) - L.cell * 3.5, g: 1, drag: 0.4, max: rand(0.6, 0.9), size: L.cell * rand(0.1, 0.16), color: mixHex(c, '#bfe6ff', 0.5) }));
    if (!lite && !odd && Math.random() < 0.5) out(cx, cy, 'g-bubble', 1, () => P('g-bubble', cx, cy, { vx: rand(-0.4, 0.4) * L.cell, vy: -L.cell * rand(1, 1.8), g: -0.1, drag: 0.8, wob: 1, max: rand(0.8, 1.2), size: L.cell * rand(0.1, 0.16), color: '#cfeaff' }));
  },
  electro(cx, cy, c, k, lite, odd) { // square pixels that fly straight out and blink away
    out(cx, cy, 'g-pixel', lite || odd ? 2 : 3, (i, a) => { const q = Math.round(a / (Math.PI / 4)) * (Math.PI / 4); return P('g-pixel', cx, cy, { ...cellV(q, rand(2.5, 5)), g: 0, drag: 2.2, max: rand(0.4, 0.6), size: L.cell * 0.13, color: i % 2 ? shade(c, 0.3) : '#ffffff' }); });
  },
  magic(cx, cy, c, k, lite, odd) { // little stars that rise and twinkle
    if (!odd) out(cx, cy, 'g-star', 1, () => P('g-star', cx + rand(-0.3, 0.3) * L.cell, cy, { vx: rand(-0.5, 0.5) * L.cell, vy: -L.cell * rand(1, 2.2), g: -0.08, drag: 1.5, max: rand(0.8, 1.2), size: L.cell * rand(0.12, 0.2), vr: rand(-1, 1), glow: false, color: mixHex(c, '#fff3c4', 0.6) }));
  },
  drum(cx, cy, c, k, lite, odd) { // a soft ring from every other block, like a skin still humming
    if (odd) return;
    out(cx, cy, 'g-ring', 1, () => P('g-ring', cx, cy, { g: 0, max: 0.55, size: L.cell * 0.32, color: shade(c, 0.2) }));
  },
};

// drawing: ctx is already moved to the particle; s is its size (it shrinks as it ages), k its remaining life (1..0), a = alpha already set
const star = (g, r, q) => { g.beginPath(); g.moveTo(0, -r); g.quadraticCurveTo(q, -q, r, 0); g.quadraticCurveTo(q, q, 0, r); g.quadraticCurveTo(-q, q, -r, 0); g.quadraticCurveTo(-q, -q, 0, -r); };
export const DRAW = {
  'g-chip'(g, p, s) { g.rotate(p.rot); g.fillStyle = p.color; g.fillRect(-s * 0.6, -s * 0.22, s * 1.2, s * 0.44); g.fillStyle = 'rgba(255,240,210,.35)'; g.fillRect(-s * 0.6, -s * 0.22, s * 1.2, s * 0.12); },
  'g-dust'(g, p, s, k) { const r = s * (0.8 + (1 - k) * 1.6), gr = g.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, rgba(p.color, 0.5)); gr.addColorStop(1, rgba(p.color, 0)); g.fillStyle = gr; g.fillRect(-r, -r, r * 2, r * 2); },
  'g-shard'(g, p, s) {
    g.rotate(p.rot); g.beginPath(); g.moveTo(0, -s); g.lineTo(s * 0.32, s * 0.55); g.lineTo(-s * 0.28, s * 0.4); g.closePath();
    g.fillStyle = rgba(p.color, 0.38); g.fill(); g.lineWidth = Math.max(1, s * 0.09); g.strokeStyle = 'rgba(255,255,255,.85)'; g.stroke();
    g.beginPath(); g.moveTo(-s * 0.05, -s * 0.5); g.lineTo(s * 0.06, s * 0.1); g.strokeStyle = 'rgba(255,255,255,.9)'; g.stroke();
  },
  'g-gravel'(g, p, s) {
    g.rotate(p.rot); g.beginPath(); g.moveTo(-s, -s * 0.2); g.lineTo(-s * 0.3, -s * 0.8); g.lineTo(s * 0.7, -s * 0.5); g.lineTo(s * 0.9, s * 0.4); g.lineTo(-s * 0.2, s * 0.8); g.closePath();
    g.fillStyle = p.color; g.fill(); g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(-s, -s * 0.2); g.lineTo(-s * 0.3, -s * 0.8); g.lineTo(s * 0.7, -s * 0.5); g.lineTo(0, -s * 0.2); g.fill();
  },
  'g-spark'(g, p, s) {
    const sp = Math.hypot(p.vx, p.vy) || 1, len = Math.min(s * 5, s * 1.5 + sp * 0.04);
    g.rotate(Math.atan2(p.vy, p.vx)); g.lineCap = 'round'; g.strokeStyle = p.color; g.lineWidth = Math.max(1, s * 0.6);
    g.beginPath(); g.moveTo(-len, 0); g.lineTo(0, 0); g.stroke();
  },
  'g-scrap'(g, p, s) {
    const f = Math.cos(p.life * 7 + p.ph); g.rotate(p.rot); g.scale(1, Math.max(0.12, Math.abs(f)));
    g.fillStyle = p.color; g.fillRect(-s * 0.7, -s * 0.5, s * 1.4, s); g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1; g.strokeRect(-s * 0.7, -s * 0.5, s * 1.4, s);
  },
  'g-puff'(g, p, s, k) { const r = s * (0.9 + (1 - k) * 1.2); g.globalAlpha *= 0.65; g.fillStyle = p.color; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(-r * 0.3, -r * 0.3, r * 0.4, 0, Math.PI * 2); g.fill(); },
  'g-drop'(g, p, s) {
    g.rotate(Math.atan2(p.vy, p.vx) - Math.PI / 2); const r = s * 0.55;
    g.beginPath(); g.moveTo(0, -r * 1.7); g.quadraticCurveTo(r * 1.05, r * 0.1, 0, r); g.quadraticCurveTo(-r * 1.05, r * 0.1, 0, -r * 1.7);
    g.fillStyle = rgba(p.color, 0.85); g.fill(); g.beginPath(); g.arc(-r * 0.3, 0, r * 0.22, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.8)'; g.fill();
  },
  'g-bubble'(g, p, s) {
    const r = s * 0.8; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fillStyle = 'rgba(220,240,255,.18)'; g.fill();
    g.lineWidth = Math.max(1, r * 0.2); g.strokeStyle = 'rgba(255,255,255,.8)'; g.stroke(); g.beginPath(); g.arc(-r * 0.35, -r * 0.35, r * 0.2, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.9)'; g.fill();
  },
  'g-pixel'(g, p, s, k) { if (k < 0.5 && Math.floor(p.life * 18) % 2) return; const q = Math.max(2, Math.round(s)); g.fillStyle = p.color; g.fillRect(-q / 2, -q / 2, q, q); },
  'g-star'(g, p, s, k, light) {
    const tw = 0.55 + 0.45 * Math.sin(p.life * 14 + p.ph), r = s * 0.9 * tw;
    g.rotate(p.rot * 0.3); star(g, r, r * 0.2); g.fillStyle = light ? shade(p.color, -0.25) : p.color; g.fill();
  },
  'g-ring'(g, p, s, k) { g.globalAlpha *= 0.55; g.lineWidth = Math.max(1, s * 0.22 * k); g.strokeStyle = p.color; g.beginPath(); g.arc(0, 0, s * (1 + (1 - k) * 4), 0, Math.PI * 2); g.stroke(); },
};
