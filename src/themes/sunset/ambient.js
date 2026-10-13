import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  dust(th) {
    const P = [...Array(34)].map(() => ({ x: Math.random(), y: Math.random(), vx: rand(-0.01, 0.01), vy: rand(-0.025, -0.008), r: rand(0.6, 2), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.x += p.vx * dt; p.y += p.vy * dt; p.ph += dt; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const sx = w / 2, sy = h * 0.98, R = Math.max(w, h) * 0.55;
        g.save(); g.translate(sx, sy);
        for (let i = 0; i < 9; i++) {
          const ang = -Math.PI / 2 + (i - 4) * 0.28 + Math.sin(t * 0.25 + i) * 0.04;
          g.save(); g.rotate(ang);
          const gr = g.createLinearGradient(0, 0, R, 0);
          gr.addColorStop(0, rgba(th.accent, 0.14 * a)); gr.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(R, -R * 0.06); g.lineTo(R, R * 0.06); g.fill();
          g.restore();
        }
        const sun = g.createRadialGradient(0, 0, 0, 0, 0, R * 0.45);
        sun.addColorStop(0, rgba(th.accent, 0.55 * a)); sun.addColorStop(0.35, rgba('#ff9a62', 0.28 * a)); sun.addColorStop(1, rgba('#ff9a62', 0));
        g.fillStyle = sun; g.fillRect(-R, -R, 2 * R, 2 * R);
        g.restore();
        for (const p of P) {
          g.beginPath(); g.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
          g.fillStyle = `rgba(255,224,176,${(0.35 + 0.35 * Math.sin(p.ph * 2)) * a})`; g.fill();
        }
      },
    };
  },
});
