import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  orbs(th) {
    const P = [...Array(7)].map((_, i) => ({ x: Math.random(), y: Math.random(), r: rand(0.18, 0.34), vx: rand(-0.014, 0.014), vy: rand(-0.012, 0.012), c: th.blocks[i % 7] }));
    return {
      step(dt) { for (const p of P) { p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < -0.15 || p.x > 1.15) p.vx *= -1; if (p.y < -0.15 || p.y > 1.15) p.vy *= -1; } },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const p of P) {
          const x = p.x * w, y = p.y * h, r = p.r * u;
          const gr = g.createRadialGradient(x, y, 0, x, y, r);
          gr.addColorStop(0, rgba(p.c, 0.17 * a)); gr.addColorStop(1, rgba(p.c, 0));
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
});
