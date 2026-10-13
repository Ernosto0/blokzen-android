import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { poly } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  cranes(th) { // paper planes gliding over lined paper
    const mk = () => ({ x: rand(-0.3, 0), y: rand(0.05, 0.85), vx: rand(0.04, 0.08), vy: rand(-0.01, 0.015), s: rand(0.7, 1.4), ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0] });
    const P = [...Array(7)].map(() => { const p = mk(); p.x = Math.random(); return p; });
    let t = 0;
    return {
      step(dt) { t += dt; P.forEach((p, i) => { p.x += p.vx * dt; p.y += (p.vy + Math.sin(t * 0.8 + p.ph) * 0.01) * dt; if (p.x > 1.2) P[i] = mk(); }); },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        g.strokeStyle = `rgba(138,122,90,${0.1 * a})`; g.lineWidth = 1;
        for (let y = u * 0.05; y < h; y += u * 0.06) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.strokeStyle = `rgba(226,85,58,${0.15 * a})`; g.beginPath(); g.moveTo(u * 0.12, 0); g.lineTo(u * 0.12, h); g.stroke();
        for (const p of P) {
          const r = u * 0.05 * p.s, tilt = Math.sin(t * 0.8 + p.ph) * 0.15 - 0.1;
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(tilt);
          poly(g, [[r, 0], [-r, -r * 0.45], [-r * 0.55, 0]], rgba(p.c, 0.55 * a));
          poly(g, [[r, 0], [-r * 0.55, 0], [-r * 0.85, r * 0.35]], rgba(p.c, 0.85 * a));
          poly(g, [[r, 0], [-r * 0.55, 0], [-r * 0.2, r * 0.12]], `rgba(0,0,0,${0.15 * a})`);
          g.restore();
        }
      },
    };
  },
});
