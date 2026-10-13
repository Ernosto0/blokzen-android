import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  gumballs(th) { // bubbles that blow up and pop
    const mk = () => ({ x: rand(0.05, 0.95), y: rand(0.05, 0.95), r: 0, max: rand(0.03, 0.08), sp: rand(0.01, 0.03), pop: 0, c: th.blocks[(Math.random() * 7) | 0] });
    const P = [...Array(9)].map(() => { const p = mk(); p.r = Math.random() * p.max; return p; });
    return {
      step(dt) { P.forEach((p, i) => { if (p.pop) { p.pop += dt * 3; if (p.pop > 1) P[i] = mk(); } else { p.r += p.sp * dt; p.y -= 0.01 * dt; if (p.r >= p.max) p.pop = 0.001; } }); },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const p of P) {
          const x = p.x * w, y = p.y * h, r = p.r * u;
          if (p.pop) {
            g.strokeStyle = rgba(p.c, (1 - p.pop) * 0.7 * a); g.lineWidth = 2;
            for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4, r1 = r * (1 + p.pop * 0.6), r2 = r * (1.2 + p.pop); g.beginPath(); g.moveTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1); g.lineTo(x + Math.cos(an) * r2, y + Math.sin(an) * r2); g.stroke(); }
            continue;
          }
          const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r);
          gr.addColorStop(0, `rgba(255,255,255,${0.5 * a})`); gr.addColorStop(0.4, rgba(p.c, 0.28 * a)); gr.addColorStop(1, rgba(p.c, 0.45 * a));
          g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
          g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.15, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.7 * a})`; g.fill();
        }
      },
    };
  },
});
