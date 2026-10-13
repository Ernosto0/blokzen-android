import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { sparkle } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  coins(th) { // gold coins tumbling down, a glowing treasure pile below
    const P = [...Array(22)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.012, 0.024), vy: rand(0.05, 0.13), ph: rand(0, 6.3), sp: rand(2, 5) }));
    const G = [...Array(14)].map(() => ({ x: Math.random(), y: rand(0.75, 1), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y += p.vy * dt; p.ph += p.sp * dt; if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const pile = g.createRadialGradient(w / 2, h * 1.05, 0, w / 2, h * 1.05, Math.max(w, h) * 0.6);
        pile.addColorStop(0, rgba(th.accent, 0.38 * a)); pile.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = pile; g.fillRect(0, h * 0.4, w, h * 0.6);
        for (const s of G) { const k = Math.max(0, Math.sin(t * 1.7 + s.ph)); if (k > 0.6) sparkle(g, s.x * w, s.y * h, u * 0.02 * k, (k - 0.6) * 2.5 * a); }
        for (const p of P) {
          const x = p.x * w, y = p.y * h, r = p.r * u, sx = Math.abs(Math.cos(p.ph));
          g.beginPath(); g.ellipse(x, y, Math.max(0.8, r * sx), r, 0, 0, Math.PI * 2);
          g.fillStyle = rgba(sx > 0.3 ? '#f5c542' : '#b88a1c', 0.85 * a); g.fill();
          if (sx > 0.4) { g.beginPath(); g.ellipse(x, y, r * sx * 0.62, r * 0.62, 0, 0, Math.PI * 2); g.strokeStyle = rgba('#fff2b0', 0.6 * a); g.lineWidth = 1; g.stroke(); }
        }
      },
    };
  },
});
