import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { makeDrips } from '../../render/backgrounds.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  ooze(th) { // slime dripping from above into a bubbling pool
    const D = makeDrips(6, '#7ee03a');
    const B = [...Array(14)].map(() => ({ x: Math.random(), y: rand(0.82, 1), r: rand(0.006, 0.016), vy: rand(0.02, 0.06), life: Math.random() }));
    let t = 0;
    return {
      step(dt) { t += dt; D.step(dt); for (const b of B) { b.y -= b.vy * dt; b.life += dt * 0.4; if (b.life > 1) { b.life = 0; b.y = rand(0.88, 1); b.x = Math.random(); } } },
      draw(g, w, h, a) {
        const base = h * 0.86;
        g.beginPath(); g.moveTo(0, h);
        for (let x = 0; x <= w + 10; x += 10) g.lineTo(x, base + Math.sin(x * 0.02 + t * 1.2) * h * 0.012 + Math.sin(x * 0.047 - t * 0.8) * h * 0.008);
        g.lineTo(w, h); g.closePath();
        const gr = g.createLinearGradient(0, base, 0, h); gr.addColorStop(0, rgba('#8cf04a', 0.55 * a)); gr.addColorStop(1, rgba('#2c6e14', 0.7 * a));
        g.fillStyle = gr; g.fill();
        const u = Math.min(w, h);
        g.lineWidth = 1.5;
        for (const b of B) {
          const r = b.r * u * (0.6 + b.life * 0.6);
          g.beginPath(); g.arc(b.x * w, b.y * h, r, 0, Math.PI * 2); g.strokeStyle = `rgba(220,255,190,${0.5 * a * (1 - b.life)})`; g.stroke();
        }
        D.draw(g, w, h, a);
      },
    };
  },
});
