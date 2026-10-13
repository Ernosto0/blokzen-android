import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  sky(th) { // a faint rainbow, drifting clouds, a few birds
    const CL = [...Array(7)].map(() => ({ x: Math.random() * 1.4 - 0.2, y: rand(0.05, 0.85), s: rand(0.5, 1.2), v: rand(0.006, 0.018), P: [...Array(5)].map((_, i) => [(i - 2) * 0.3 + rand(-0.06, 0.06), (i % 2 ? rand(-0.14, -0.04) : rand(-0.02, 0.04)), rand(0.22, 0.34)]) }));
    const BD = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.1, 0.45), v: rand(0.02, 0.04), ph: rand(0, 6.3), s: rand(0.7, 1.2) }));
    const RB = ['#ff6a6a', '#ffb04a', '#ffe46a', '#7ae08a', '#6ab8ff', '#a88aff'];
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const c of CL) { c.x += c.v * dt; if (c.x > 1.4) c.x = -0.4; }
        for (const b of BD) { b.x += b.v * dt; b.ph += dt * 8; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.1, 0.45); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h);
        g.lineWidth = M * 0.025;
        RB.forEach((c, i) => { g.beginPath(); g.arc(w * 0.5, h * 1.05, M * (0.75 - i * 0.025), Math.PI, Math.PI * 2); g.strokeStyle = rgba(c, 0.1 * a); g.stroke(); });
        for (const c of CL) {
          const cx = c.x * w, cy = c.y * h, base = u * 0.12 * c.s;
          g.beginPath(); for (const [px, py, pr] of c.P) { const x = cx + px * base * 2, y = cy + py * base * 2; g.moveTo(x + pr * base * 2, y); g.arc(x, y, pr * base * 2, 0, Math.PI * 2); }
          g.fillStyle = `rgba(255,255,255,${0.6 * a})`; g.fill();
        }
        g.strokeStyle = `rgba(40,60,90,${0.45 * a})`; g.lineWidth = 1.6;
        for (const b of BD) {
          const x = b.x * w, y = b.y * h, bs = u * 0.018 * b.s, f = Math.sin(b.ph) * 0.5 + 0.5;
          g.beginPath(); g.moveTo(x - bs, y - bs * 0.3 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.6 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.6 * f, x + bs, y - bs * 0.3 * f); g.stroke();
        }
      },
    };
  },
});
