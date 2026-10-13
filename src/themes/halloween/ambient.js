import { rand } from '../../core/util.js';
import { batShape } from './helpers.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  night() { // full moon, flapping bats, drifting fog
    const ST = [...Array(50)].map(() => ({ x: Math.random(), y: Math.random() * 0.6, ph: rand(0, 6.3) }));
    const BT = [...Array(6)].map(() => ({ x: Math.random(), y: rand(0.1, 0.5), vx: rand(0.04, 0.09) * (Math.random() < 0.5 ? -1 : 1), ph: rand(0, 6.3), s: rand(0.7, 1.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const b of BT) { b.x += b.vx * dt; b.y += Math.sin(t * 2 + b.ph) * 0.02 * dt; b.ph += dt * 14; if (b.x > 1.1) b.x = -0.1; if (b.x < -0.1) b.x = 1.1; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const s of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.sin(t * 1.5 + s.ph)) * a})`; g.fillRect(s.x * w, s.y * h, 1.5, 1.5); }
        const mx = w * 0.78, my = h * 0.13, mr = u * 0.11;
        const gl = g.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 3.2); gl.addColorStop(0, `rgba(255,230,176,${0.25 * a})`); gl.addColorStop(1, 'rgba(255,230,176,0)');
        g.fillStyle = gl; g.fillRect(mx - mr * 3.2, my - mr * 3.2, mr * 6.4, mr * 6.4);
        g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.fillStyle = `rgba(255,240,200,${0.92 * a})`; g.fill();
        g.fillStyle = `rgba(232,212,160,${0.5 * a})`;
        for (const [dx, dy, r] of [[-0.3, -0.2, 0.18], [0.25, 0.15, 0.24], [-0.1, 0.4, 0.12]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2); g.fill(); }
        for (const b of BT) batShape(g, b.x * w, b.y * h, u * 0.03 * b.s, Math.sin(b.ph), `rgba(10,5,16,${0.9 * a})`, b.vx < 0);
        for (let i = 0; i < 3; i++) {
          const y = h * (0.78 + i * 0.08), off = Math.sin(t * 0.2 + i) * w * 0.1;
          const gr = g.createLinearGradient(0, y - h * 0.08, 0, y + h * 0.08);
          gr.addColorStop(0, 'rgba(180,160,200,0)'); gr.addColorStop(0.5, `rgba(180,160,200,${0.1 * a})`); gr.addColorStop(1, 'rgba(180,160,200,0)');
          g.fillStyle = gr; g.fillRect(off - w * 0.2, y - h * 0.08, w * 1.4, h * 0.16);
        }
      },
    };
  },
});
