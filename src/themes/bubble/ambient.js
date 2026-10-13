import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { seaChar } from './helpers.js';
import { AMBIENTS } from '../registry.js';

// a five-petal flower cloud, the sky of a cartoon sea town
function flowerCloud(g, x, y, r, col) {
  g.fillStyle = col;
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; g.beginPath(); g.arc(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.46, 0, Math.PI * 2); g.fill(); }
  g.beginPath(); g.arc(x, y, r * 0.5, 0, Math.PI * 2); g.fill();
}
function shell(g, x, y, r, col) { // a ribbed scallop shell
  g.fillStyle = col; g.beginPath(); g.moveTo(x, y + r * 0.6);
  for (let i = 0; i <= 6; i++) { const a = Math.PI + i * Math.PI / 6; g.quadraticCurveTo(x + Math.cos(a - 0.26) * r * 1.35, y + Math.sin(a - 0.26) * r * 1.35 + r * 0.4, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.9 + r * 0.4); }
  g.closePath(); g.fill();
}

Object.assign(AMBIENTS, {
  bubble(th) { // a sunny sea town: flower clouds up top, a jellyfish field, a rippled sandy floor with shells and seaweed, bubbles everywhere
    const B = [...Array(18)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.008, 0.026), vy: rand(0.03, 0.09), ph: rand(0, 6.3) }));
    const C = [...Array(4)].map((_, i) => ({ x: (i + Math.random() * 0.6) / 4, y: rand(0.03, 0.2), r: rand(0.07, 0.11), v: rand(0.006, 0.014) }));
    const J = [...Array(6)].map((_, i) => ({ x: 0.08 + i * 0.17 + rand(-0.03, 0.03), y: rand(0.26, 0.62), r: rand(0.05, 0.075), ph: rand(0, 6.3), sp: rand(0.5, 0.9) }));
    const F = [...Array(2)].map((_, i) => ({ x: Math.random(), y: rand(0.3, 0.7), v: rand(0.014, 0.026) * (i ? -1 : 1), ch: [3, 4, 2][(Math.random() * 3) | 0], ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const b of B) { b.y -= b.vy * dt; b.ph += dt * 1.6; if (b.y < -0.05) { b.y = 1.05; b.x = Math.random(); } }
        for (const c of C) { c.x += c.v * dt; if (c.x > 1.15) c.x = -0.15; }
        for (const f of F) { f.x += f.v * dt; if (f.x > 1.15) f.x = -0.15; if (f.x < -0.15) f.x = 1.15; }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const wg = g.createLinearGradient(0, 0, 0, h); // lagoon water: light at the top, greener toward the sand
        wg.addColorStop(0, rgba('#d6fbff', 0.5 * a)); wg.addColorStop(0.5, rgba('#7fe3e0', 0.12 * a)); wg.addColorStop(1, rgba('#3cc4b0', 0.35 * a));
        g.fillStyle = wg; g.fillRect(0, 0, w, h);
        for (const c of C) flowerCloud(g, c.x * w, c.y * h, c.r * u, rgba('#ffffff', 0.55 * a));
        g.save(); g.fillStyle = rgba('#ffffff', 0.1 * a); // sun rays
        for (let i = 0; i < 4; i++) { const x = w * (0.1 + i * 0.27) + Math.sin(t * 0.4 + i) * u * 0.04; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + u * 0.16, 0); g.lineTo(x + u * 0.5, h); g.lineTo(x + u * 0.22, h); g.closePath(); g.fill(); }
        g.restore();
        for (const j of J) { // the jellyfish field: slow bobbing, pulsing
          const pulse = 1 + Math.sin(t * 2 * j.sp + j.ph) * 0.06;
          g.globalAlpha = 0.42 * a; seaChar(g, 1, j.x * w, j.y * h + Math.sin(t * j.sp + j.ph) * u * 0.03, j.r * u * pulse);
        }
        g.globalAlpha = 1;
        const fy = h * 0.9; // rippled sand
        const sg = g.createLinearGradient(0, fy - u * 0.04, 0, h); sg.addColorStop(0, rgba('#f8e3a0', 0.85 * a)); sg.addColorStop(1, rgba('#e8c46c', 0.9 * a));
        g.fillStyle = sg; g.beginPath(); g.moveTo(0, h); g.lineTo(0, fy + u * 0.025); g.quadraticCurveTo(w * 0.3, fy - u * 0.045, w * 0.6, fy); g.quadraticCurveTo(w * 0.85, fy + u * 0.03, w, fy - u * 0.01); g.lineTo(w, h); g.fill();
        g.strokeStyle = rgba('#c99a3a', 0.35 * a); g.lineWidth = Math.max(1, u * 0.004);
        for (let r = 1; r <= 3; r++) { g.beginPath(); for (let x = 0; x <= w; x += w / 24) g.lineTo(x, fy + r * (h - fy) / 4 + Math.sin(x / u * 14 + r) * u * 0.006); g.stroke(); }
        shell(g, w * 0.14, fy + u * 0.05, u * 0.03, rgba('#ff9ec4', 0.9 * a)); shell(g, w * 0.78, fy + u * 0.075, u * 0.026, rgba('#ffd29a', 0.95 * a));
        g.fillStyle = rgba('#ff8a5a', 0.9 * a); g.beginPath(); g.arc(w * 0.5, fy + u * 0.07, u * 0.016, 0, 7); g.fill();
        g.strokeStyle = rgba('#37b86a', 0.65 * a); g.lineWidth = u * 0.014; g.lineCap = 'round';
        for (let i = 0; i < 7; i++) { const x = w * (0.04 + i * 0.15), sw = Math.sin(t * 1.2 + i * 1.7) * u * 0.03; g.beginPath(); g.moveTo(x, h); g.bezierCurveTo(x + sw, h - u * 0.08, x - sw, h - u * 0.14, x + sw * 1.3, h - u * (0.17 + (i % 3) * 0.04)); g.stroke(); }
        for (const f of F) { g.globalAlpha = 0.4 * a; seaChar(g, f.ch, f.x * w, f.y * h + Math.sin(t * 1.3 + f.ph) * u * 0.02, u * 0.065); }
        g.globalAlpha = 1;
        g.strokeStyle = rgba('#ffffff', 0.7 * a); g.lineWidth = Math.max(1, u * 0.004);
        for (const b of B) { const x = b.x * w + Math.sin(b.ph) * u * 0.015, y = b.y * h, r = b.r * u; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); g.fillStyle = rgba('#ffffff', 0.45 * a); g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.25, 0, Math.PI * 2); g.fill(); }
      },
    };
  },
});
