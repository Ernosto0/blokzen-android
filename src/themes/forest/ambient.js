import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  fireflies(th) {
    const P = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, ph: rand(0, 6.3), f: rand(0.5, 1.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt; const damp = Math.pow(0.4, dt);
        for (const p of P) {
          p.vx = (p.vx + (Math.random() - 0.5) * 0.12 * dt) * damp; p.vy = (p.vy + (Math.random() - 0.5) * 0.12 * dt) * damp;
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < -0.05) p.x = 1.05; if (p.x > 1.05) p.x = -0.05; if (p.y < -0.05) p.y = 1.05; if (p.y > 1.05) p.y = -0.05;
        }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const fog = g.createLinearGradient(0, h * 0.6, 0, h);
        fog.addColorStop(0, rgba(th.glow, 0)); fog.addColorStop(1, rgba(th.glow, 0.45 * a));
        g.fillStyle = fog; g.fillRect(0, h * 0.6, w, h * 0.4);
        g.globalCompositeOperation = 'lighter';
        for (const p of P) {
          let b = Math.max(0, Math.sin(t * p.f * 2 + p.ph)); b = b * b * b * a;
          if (b < 0.01) continue;
          const x = p.x * w, y = p.y * h, r = u * 0.05;
          const gr = g.createRadialGradient(x, y, 0, x, y, r);
          gr.addColorStop(0, rgba(th.accent, 0.5 * b)); gr.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
          g.beginPath(); g.arc(x, y, Math.max(1, u * 0.005), 0, Math.PI * 2); g.fillStyle = `rgba(255,252,210,${b})`; g.fill();
        }
        g.globalCompositeOperation = 'source-over';
      },
    };
  },
});
