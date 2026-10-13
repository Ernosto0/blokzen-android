import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';
import { gearPath } from '../shared/shapes.js';

Object.assign(AMBIENTS, {
  clockwork(th) { // big meshing gears, a swinging pendulum, puffs of steam
    const G = [[0.06, 0.85, 0.24, 16, 1], [0.3, 0.97, 0.13, 9, -1], [0.95, 0.12, 0.2, 14, -1], [0.78, 0.02, 0.11, 8, 1], [0.98, 0.62, 0.15, 11, 1]];
    let t = 0, acc = 0, P = [];
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.6) { acc = 0; P.push({ x: rand(0.12, 0.24), y: 1.02, life: 0 }); }
        for (const p of P) { p.y -= 0.08 * dt; p.life += dt / 6; }
        P = P.filter(p => p.life < 1);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const [x, y, r, n, dir] of G) {
          gearPath(g, x * w, y * h, r * u, n, t * 0.35 * (12 / n) * dir, 0.25);
          g.fillStyle = rgba(th.accent, 0.08 * a); g.fill('evenodd');
          g.strokeStyle = rgba(th.accent, 0.16 * a); g.lineWidth = 2; g.stroke();
        }
        const px = w * 0.5, L = h * 0.3, an = 0.32 * Math.sin(t * 1.8), bx = px + Math.sin(an) * L, by = Math.cos(an) * L;
        g.strokeStyle = rgba(th.accent, 0.22 * a); g.lineWidth = 3; g.beginPath(); g.moveTo(px, 0); g.lineTo(bx, by); g.stroke();
        const bg = g.createRadialGradient(bx - u * 0.01, by - u * 0.01, 0, bx, by, u * 0.04); bg.addColorStop(0, rgba('#fff2c0', 0.5 * a)); bg.addColorStop(1, rgba(th.accent, 0.3 * a));
        g.beginPath(); g.arc(bx, by, u * 0.04, 0, Math.PI * 2); g.fillStyle = bg; g.fill();
        for (const p of P) {
          const r = u * (0.04 + p.life * 0.12), al = Math.sin(p.life * Math.PI) * 0.08 * a;
          const gr = g.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, r); gr.addColorStop(0, `rgba(255,248,235,${al})`); gr.addColorStop(1, 'rgba(255,248,235,0)');
          g.fillStyle = gr; g.fillRect(p.x * w - r, p.y * h - r, 2 * r, 2 * r);
        }
      },
    };
  },
});
