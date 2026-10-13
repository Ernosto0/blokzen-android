import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  petals() {
    const cols = ['#fff3f6', '#ffd1de', '#ffb3c8'];
    const P = [...Array(30)].map(() => ({ x: rand(-0.2, 1), y: Math.random(), s: rand(0.008, 0.018), rot: rand(0, 6.3), vr: rand(-1.5, 1.5), vx: rand(0.01, 0.04), vy: rand(0.03, 0.07), ph: rand(0, 6.3), c: cols[(Math.random() * 3) | 0] }));
    return {
      step(dt) { for (const p of P) { p.ph += dt * 2.2; p.x += (p.vx + Math.sin(p.ph) * 0.02) * dt; p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y > 1.05 || p.x > 1.1) { p.y = -0.05; p.x = rand(-0.2, 1); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h) * 1.4;
        for (const p of P) {
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.ph)));
          g.beginPath(); g.ellipse(0, 0, p.s * u, p.s * u * 0.62, 0, 0, Math.PI * 2);
          g.fillStyle = rgba(p.c, 0.85 * a); g.fill(); g.restore();
        }
      },
    };
  },
});
