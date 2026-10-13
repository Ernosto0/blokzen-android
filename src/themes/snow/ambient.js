import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  snow() {
    const P = [...Array(80)].map(() => { const r = rand(0.002, 0.009); return { x: Math.random(), y: Math.random(), r, sp: 0.03 + r * 6, ph: rand(0, 6.3), sw: rand(0.004, 0.02) }; });
    return {
      step(dt) { for (const p of P) { p.y += p.sp * dt; p.ph += dt * 1.2; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const hill = g.createLinearGradient(0, h * 0.75, 0, h);
        hill.addColorStop(0, 'rgba(255,255,255,0)'); hill.addColorStop(1, `rgba(255,255,255,${0.5 * a})`);
        g.fillStyle = hill; g.fillRect(0, h * 0.75, w, h * 0.25);
        for (const p of P) {
          g.beginPath(); g.arc((p.x + Math.sin(p.ph) * p.sw) * w, p.y * h, p.r * u, 0, Math.PI * 2);
          g.fillStyle = `rgba(255,255,255,${(p.r > 0.006 ? 0.6 : 0.9) * a})`; g.fill();
        }
      },
    };
  },
});
