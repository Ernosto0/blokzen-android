import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  embers(th) {
    const P = [...Array(48)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.04, 0.13), ph: rand(0, 6.3), r: rand(0.8, 2.6), hot: Math.random() }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y -= p.vy * dt; p.ph += dt * 3; p.x += Math.sin(p.ph * 0.4) * 0.01 * dt; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const pulse = 0.8 + 0.2 * Math.sin(t * 1.3);
        const lava = g.createLinearGradient(0, h * 0.55, 0, h);
        lava.addColorStop(0, rgba(th.accent, 0)); lava.addColorStop(1, rgba(th.accent, 0.32 * a * pulse));
        g.fillStyle = lava; g.fillRect(0, h * 0.55, w, h * 0.45);
        g.globalCompositeOperation = 'lighter';
        for (const p of P) {
          const fl = (0.5 + 0.5 * Math.sin(p.ph)) * a * (0.4 + 0.6 * p.y);
          g.beginPath(); g.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
          g.fillStyle = p.hot > 0.5 ? `rgba(255,210,90,${fl})` : `rgba(255,120,40,${fl})`; g.fill();
        }
        g.globalCompositeOperation = 'source-over';
      },
    };
  },
});
