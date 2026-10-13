import { rgba } from '../../core/color.js';
import { state } from '../../core/state.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  stars(th) {
    const P = [...Array(110)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.5, 1.7), ph: rand(0, 6.3), f: rand(0.5, 2) }));
    const neb = [0, 1].map(i => ({ x: rand(0.1, 0.9), y: rand(0.1, 0.9), c: th.blocks[i ? 5 : 3] }));
    let t = 0, shoot = null, wait = rand(2, 5);
    return {
      step(dt) {
        t += dt; wait -= dt;
        if (!shoot && wait < 0 && !state.REDUCED) { shoot = { x: rand(0.1, 0.9), y: rand(0, 0.4), life: 0 }; wait = rand(3, 7); }
        if (shoot) { shoot.life += dt; if (shoot.life > 0.8) shoot = null; }
      },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const n of neb) {
          const gr = g.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, u * 0.45);
          gr.addColorStop(0, rgba(n.c, 0.12 * a)); gr.addColorStop(1, rgba(n.c, 0));
          g.fillStyle = gr; g.fillRect(0, 0, w, h);
        }
        for (const p of P) {
          g.fillStyle = `rgba(255,255,255,${(0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * p.f + p.ph))) * a})`;
          g.fillRect(p.x * w, p.y * h, p.r, p.r);
        }
        if (shoot) {
          const k = shoot.life / 0.8, x = (shoot.x + k * 0.35) * w, y = (shoot.y + k * 0.2) * h, len = u * 0.12;
          const gr = g.createLinearGradient(x, y, x - len, y - len * 0.57);
          gr.addColorStop(0, `rgba(255,255,255,${(1 - k) * a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
          g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - len, y - len * 0.57); g.stroke();
        }
      },
    };
  },
});
