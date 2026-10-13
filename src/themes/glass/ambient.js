import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { sparkle } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  prism(th) { // two rainbow beams through glass, glinting sparkles
    const RB = ['#ff5a6e', '#ffa64d', '#ffe45c', '#5cf08a', '#5cd6ff', '#7a7dff', '#d47aff'];
    const P = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(-0.02, -0.006), ph: rand(0, 6.3), f: rand(0.6, 1.6) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y += p.vy * dt; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), len = Math.hypot(w, h);
        g.save(); g.globalCompositeOperation = 'lighter';
        for (let b = 0; b < 2; b++) {
          g.save(); g.translate(b ? w * 0.95 : w * 0.05, -h * 0.02); g.rotate((b ? 2.2 : 0.95) + Math.sin(t * 0.15 + b) * 0.05);
          RB.forEach((c, i) => {
            const gr = g.createLinearGradient(0, 0, len, 0); gr.addColorStop(0, rgba(c, 0.13 * a)); gr.addColorStop(1, rgba(c, 0));
            g.fillStyle = gr; g.fillRect(0, (i - 3.5) * u * 0.02, len, u * 0.02);
          });
          g.restore();
        }
        g.restore();
        for (const p of P) { const k = 0.5 + 0.5 * Math.sin(t * p.f * 2 + p.ph); sparkle(g, p.x * w, p.y * h, u * (0.006 + 0.01 * k), (0.25 + 0.6 * k) * a); }
      },
    };
  },
});
