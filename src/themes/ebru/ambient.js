import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  ebru(th) { // paint dropped on water spreading into rings, slow combed waves
    const D = []; let t = 0, next = 0;
    const add = init => D.push({ x: Math.random(), y: Math.random(), max: rand(0.12, 0.28), life: init ? rand(0, 0.6) : 0, cs: [0, 1, 2].map(() => th.blocks[(Math.random() * 7) | 0]) });
    for (let i = 0; i < 6; i++) add(true);
    return {
      step(dt) {
        t += dt; next -= dt;
        if (next <= 0) { add(false); next = rand(1.2, 2.4); }
        for (const d of D) d.life += dt / 16;
        for (let i = D.length - 1; i >= 0; i--) if (D[i].life >= 1) D.splice(i, 1);
      },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const d of D) {
          const grow = 1 - Math.pow(1 - Math.min(1, d.life * 4), 3), fade = d.life < 0.7 ? 1 : 1 - (d.life - 0.7) / 0.3;
          const R = d.max * u * grow, x = d.x * w + Math.sin(t * 0.1 + d.max * 40) * u * 0.02 * d.life, y = d.y * h;
          for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(x, y, R * (1 - k * 0.3), R * (1 - k * 0.3) * (0.9 + 0.08 * Math.sin(t * 0.3 + k)), d.life, 0, Math.PI * 2); g.fillStyle = rgba(d.cs[k], 0.12 * a * fade); g.fill(); }
          g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2); g.strokeStyle = `rgba(255,250,235,${0.12 * a * fade})`; g.lineWidth = 1.5; g.stroke();
        }
        g.strokeStyle = `rgba(255,250,235,${0.06 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const y0 = h * (0.1 + i * 0.2);
          g.beginPath(); for (let x = 0; x <= w + 12; x += 12) { const y = y0 + Math.sin(x * 0.015 + t * 0.25 + i) * u * 0.03; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        }
      },
    };
  },
});
