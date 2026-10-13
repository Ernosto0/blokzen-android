import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { seaChar } from './helpers.js';
import { AMBIENTS } from '../registry.js';

const LINE = '#0b2e45';
// a five-petal flower cloud with a cartoon outline: every petal is stroked first, then all are filled on top,
// so only the outer edge keeps the line
function flowerCloud(g, x, y, r, col, a, rot = 0) {
  const petals = [...Array(5)].map((_, i) => { const t = rot - Math.PI / 2 + i * Math.PI * 2 / 5; return [x + Math.cos(t) * r * 0.6, y + Math.sin(t) * r * 0.6]; });
  g.globalAlpha = a;
  g.strokeStyle = LINE; g.lineWidth = r * 0.12;
  for (const [px, py] of petals) { g.beginPath(); g.arc(px, py, r * 0.46, 0, Math.PI * 2); g.stroke(); }
  g.fillStyle = col;
  for (const [px, py] of petals) { g.beginPath(); g.arc(px, py, r * 0.46, 0, Math.PI * 2); g.fill(); }
  g.beginPath(); g.arc(x, y, r * 0.5, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(x, y, r * 0.2, 0, Math.PI * 2); g.fill();
  g.globalAlpha = 1;
}
function shellHouse(g, x, y, r, col, a) { // a spiral-shell cottage with a round door and a porthole
  g.globalAlpha = a; g.lineJoin = 'round'; g.lineWidth = r * 0.07; g.strokeStyle = LINE;
  g.beginPath(); g.moveTo(x - r, y); g.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r, y); g.closePath(); g.fillStyle = col; g.fill(); g.stroke();
  for (const k of [-0.5, 0, 0.5]) { g.beginPath(); g.moveTo(x + k * r * 0.4, y - r * 1.1); g.quadraticCurveTo(x + k * r * 1.4, y - r * 0.6, x + k * r * 1.6, y); g.stroke(); }
  g.beginPath(); g.moveTo(x - r * 0.22, y); g.lineTo(x - r * 0.22, y - r * 0.35); g.arc(x, y - r * 0.35, r * 0.22, Math.PI, 0); g.lineTo(x + r * 0.22, y); g.closePath(); g.fillStyle = '#8a5a2b'; g.fill(); g.stroke();
  g.beginPath(); g.arc(x + r * 0.55, y - r * 0.55, r * 0.14, 0, Math.PI * 2); g.fillStyle = '#bff2ff'; g.fill(); g.stroke();
  g.globalAlpha = 1;
}
function anchor(g, x, y, r, a) {
  g.globalAlpha = a; g.strokeStyle = '#5b6b78'; g.lineWidth = r * 0.16; g.lineCap = 'round';
  g.beginPath(); g.arc(x, y - r, r * 0.18, 0, Math.PI * 2); g.moveTo(x, y - r * 0.82); g.lineTo(x, y + r * 0.5); g.moveTo(x - r * 0.4, y - r * 0.5); g.lineTo(x + r * 0.4, y - r * 0.5);
  g.moveTo(x - r * 0.6, y + r * 0.1); g.quadraticCurveTo(x - r * 0.55, y + r * 0.6, x, y + r * 0.6); g.quadraticCurveTo(x + r * 0.55, y + r * 0.6, x + r * 0.6, y + r * 0.1); g.stroke();
  g.globalAlpha = 1;
}
Object.assign(AMBIENTS, {
  bubble(th) { // a cartoon sea town: flower clouds overhead, a busy sandy floor, jellyfish and bubbles drifting through
    const B = [...Array(16)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.008, 0.024), vy: rand(0.03, 0.09), ph: rand(0, 6.3) }));
    const FL = ['#ffe14a', '#ff7cc8', '#b8f05a', '#c79bff', '#ffffff', '#ffa94d'];
    const C = [...Array(9)].map((_, i) => ({ x: (i + Math.random() * 0.7) / 9, y: rand(0.02, 0.42), r: rand(0.045, 0.08), v: rand(0.004, 0.012), col: FL[i % FL.length], rot: rand(0, 6.3), vr: rand(-0.15, 0.15) }));
    const J = [...Array(4)].map((_, i) => ({ x: [0.06, 0.94, 0.12, 0.88][i], y: [0.3, 0.38, 0.74, 0.7][i], r: rand(0.04, 0.055), ph: rand(0, 6.3), sp: rand(0.5, 0.9) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const b of B) { b.y -= b.vy * dt; b.ph += dt * 1.6; if (b.y < -0.05) { b.y = 1.05; b.x = Math.random(); } }
        for (const c of C) { c.x += c.v * dt; c.rot += c.vr * dt; if (c.x > 1.12) c.x = -0.12; }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const c of C) flowerCloud(g, c.x * w, c.y * h, c.r * u, c.col, 0.85 * a, c.rot);
        for (const j of J) { g.globalAlpha = 0.75 * a; seaChar(g, 1, j.x * w, j.y * h + Math.sin(t * j.sp + j.ph) * u * 0.03, j.r * u * (1 + Math.sin(t * 2 * j.sp + j.ph) * 0.06)); }
        g.globalAlpha = 1;
        // the sandy floor with a bold outline
        const fy = h * 0.86;
        const sand = () => { g.beginPath(); g.moveTo(-10, h + 10); g.lineTo(-10, fy + u * 0.03); g.quadraticCurveTo(w * 0.3, fy - u * 0.05, w * 0.6, fy); g.quadraticCurveTo(w * 0.85, fy + u * 0.04, w + 10, fy - u * 0.01); g.lineTo(w + 10, h + 10); g.closePath(); };
        const sg = g.createLinearGradient(0, fy - u * 0.05, 0, h); sg.addColorStop(0, rgba('#ffe9a3', a)); sg.addColorStop(1, rgba('#f0c35e', a));
        sand(); g.fillStyle = sg; g.fill(); g.globalAlpha = a; g.lineWidth = u * 0.008; g.strokeStyle = LINE; g.stroke(); g.globalAlpha = 1;
        g.fillStyle = rgba('#d9a443', 0.6 * a);
        for (let i = 0; i < 22; i++) { const x = ((i * 0.37) % 1) * w, y = fy + u * 0.05 + ((i * 0.61) % 1) * (h - fy - u * 0.05); g.beginPath(); g.arc(x, y, u * 0.006, 0, Math.PI * 2); g.fill(); }
        shellHouse(g, w * 0.17, fy + u * 0.09, u * 0.1, '#ff9ec4', a);
        shellHouse(g, w * 0.83, fy + u * 0.1, u * 0.085, '#c79bff', a);
        anchor(g, w * 0.5, fy + u * 0.08, u * 0.06, 0.9 * a);
        g.strokeStyle = rgba('#2fae5a', a); g.lineCap = 'round';
        for (const [x, hh] of [[0.33, 0.16], [0.38, 0.12], [0.64, 0.15], [0.68, 0.11], [0.97, 0.14]]) { const sw = Math.sin(t * 1.2 + x * 10) * u * 0.025, X = x * w; g.lineWidth = u * 0.016; g.beginPath(); g.moveTo(X, h); g.bezierCurveTo(X + sw, h - u * hh * 0.4, X - sw, h - u * hh * 0.7, X + sw * 1.3, fy - u * hh * 0.4); g.stroke(); }
        g.strokeStyle = rgba('#ffffff', 0.8 * a); g.lineWidth = Math.max(1, u * 0.004);
        for (const b of B) { const x = b.x * w + Math.sin(b.ph) * u * 0.015, y = b.y * h, r = b.r * u; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); g.fillStyle = rgba('#ffffff', 0.5 * a); g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.25, 0, Math.PI * 2); g.fill(); }
      },
    };
  },
});
