import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { seaChar } from './helpers.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  bubble(th) { // sunlit shallows: light rays, rising bubbles, swaying seaweed on a sandy floor, and the cast drifting by
    const B = [...Array(18)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.008, 0.026), vy: rand(0.03, 0.09), ph: rand(0, 6.3) }));
    const F = [...Array(3)].map((_, i) => ({ x: Math.random(), y: rand(0.2, 0.7), v: rand(0.012, 0.03) * (i % 2 ? -1 : 1), ch: [0, 1, 2, 3, 4, 6][(Math.random() * 6) | 0], ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const b of B) { b.y -= b.vy * dt; b.ph += dt * 1.6; if (b.y < -0.05) { b.y = 1.05; b.x = Math.random(); } }
        for (const f of F) { f.x += f.v * dt; if (f.x > 1.15) f.x = -0.15; if (f.x < -0.15) f.x = 1.15; }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        g.save(); g.fillStyle = rgba('#ffffff', 0.12 * a); // sun rays
        for (let i = 0; i < 4; i++) { const x = w * (0.1 + i * 0.27) + Math.sin(t * 0.4 + i) * u * 0.04; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + u * 0.16, 0); g.lineTo(x + u * 0.5, h); g.lineTo(x + u * 0.22, h); g.closePath(); g.fill(); }
        g.restore();
        const fy = h * 0.92; // sandy floor and seaweed
        g.fillStyle = rgba('#f3d58a', 0.55 * a); g.beginPath(); g.moveTo(0, h); g.lineTo(0, fy + u * 0.02); g.quadraticCurveTo(w * 0.5, fy - u * 0.04, w, fy + u * 0.02); g.lineTo(w, h); g.fill();
        g.strokeStyle = rgba('#37b86a', 0.6 * a); g.lineWidth = u * 0.014; g.lineCap = 'round';
        for (let i = 0; i < 7; i++) { const x = w * (0.04 + i * 0.15), sw = Math.sin(t * 1.2 + i * 1.7) * u * 0.03; g.beginPath(); g.moveTo(x, h); g.bezierCurveTo(x + sw, h - u * 0.08, x - sw, h - u * 0.14, x + sw * 1.3, h - u * (0.18 + (i % 3) * 0.04)); g.stroke(); }
        for (const f of F) { g.globalAlpha = 0.35 * a; seaChar(g, f.ch, f.x * w, f.y * h + Math.sin(t * 1.3 + f.ph) * u * 0.02, u * 0.07); }
        g.globalAlpha = 1;
        g.strokeStyle = rgba('#ffffff', 0.7 * a); g.lineWidth = Math.max(1, u * 0.004);
        for (const b of B) { const x = b.x * w + Math.sin(b.ph) * u * 0.015, y = b.y * h, r = b.r * u; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); g.fillStyle = rgba('#ffffff', 0.45 * a); g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.25, 0, Math.PI * 2); g.fill(); }
      },
    };
  },
});
