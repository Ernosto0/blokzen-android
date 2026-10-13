import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  bubbles(th) {
    const P = [...Array(34)].map(() => ({ x: Math.random(), y: rand(0, 1.1), r: rand(0.004, 0.016), sp: rand(0.03, 0.09), ph: rand(0, 6.3), wob: rand(0.004, 0.014) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y -= p.sp * dt; p.ph += dt * 1.6; if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h) * 1.6;
        for (let i = 0; i < 4; i++) { // light shafts from the surface
          const x = w * (0.15 + i * 0.24) + Math.sin(t * 0.3 + i * 1.7) * w * 0.05;
          const gr = g.createLinearGradient(0, 0, 0, h * 0.8);
          gr.addColorStop(0, rgba(th.accent, 0.09 * a)); gr.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gr;
          g.beginPath(); g.moveTo(x - w * 0.04, 0); g.lineTo(x + w * 0.05, 0); g.lineTo(x + w * 0.16, h * 0.8); g.lineTo(x - w * 0.02, h * 0.8); g.fill();
        }
        g.lineWidth = 1.2;
        for (const p of P) {
          const x = (p.x + Math.sin(p.ph) * p.wob) * w, y = p.y * h, r = p.r * u;
          g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
          g.strokeStyle = `rgba(255,255,255,${0.32 * a})`; g.stroke();
          g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, Math.PI * 2);
          g.fillStyle = `rgba(255,255,255,${0.45 * a})`; g.fill();
        }
      },
    };
  },
});
