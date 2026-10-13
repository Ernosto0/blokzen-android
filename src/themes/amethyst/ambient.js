import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { poly } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  cave(th) { // stalactites dripping water, glowing amethyst clusters, floating motes
    const top = [...Array(9)].map((_, i) => ({ x: (i + rand(0.1, 0.9)) / 9, len: rand(0.05, 0.14), wd: rand(0.03, 0.06) }));
    const drops = top.map(s => ({ s, y: -1, wait: rand(0.5, 5) }));
    const M = [...Array(24)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(-0.02, -0.005), ph: rand(0, 6.3) }));
    const CL = [[0.08, 1, 1], [0.92, 1, -1], [0.55, 1.02, 1]];
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const d of drops) { if (d.y < 0) { d.wait -= dt; if (d.wait < 0) d.y = d.s.len; } else { d.y += dt * 0.6; if (d.y > 1.05) { d.y = -1; d.wait = rand(1.5, 6); } } }
        for (const m of M) { m.y += m.vy * dt; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        g.fillStyle = rgba(th.board, 0.9 * a);
        for (const s of top) { const x = s.x * w, ww = s.wd * w; g.beginPath(); g.moveTo(x - ww, 0); g.lineTo(x + ww, 0); g.lineTo(x, s.len * h); g.closePath(); g.fill(); }
        g.fillStyle = rgba('#bfe6ff', 0.7 * a);
        for (const d of drops) if (d.y >= 0) { g.beginPath(); g.ellipse(d.s.x * w, d.y * h, u * 0.004, u * 0.007, 0, 0, Math.PI * 2); g.fill(); }
        for (const [cx, cy, dir] of CL) {
          const x = cx * w, y = cy * h, R = u * 0.32, pulse = 0.75 + 0.25 * Math.sin(t * 1.2 + cx * 5);
          const gl = g.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba(th.accent, 0.35 * a * pulse)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - R, 2 * R, 2 * R);
          for (let k = -2; k <= 2; k++) {
            const len = u * (0.16 - Math.abs(k) * 0.025), wd = u * 0.022;
            g.save(); g.translate(x + k * u * 0.03, y); g.rotate(k * 0.3 * dir);
            poly(g, [[-wd, 0], [-wd, -len], [0, -len - wd * 1.6], [0, 0]], rgba('#e6b8ff', 0.6 * a));
            poly(g, [[0, 0], [0, -len - wd * 1.6], [wd, -len], [wd, 0]], rgba('#8a4ad8', 0.7 * a));
            g.restore();
          }
        }
        for (const m of M) { const k = 0.5 + 0.5 * Math.sin(t * 2 + m.ph); g.beginPath(); g.arc(m.x * w, m.y * h, 1 + k * 1.5, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, (0.2 + 0.5 * k) * a); g.fill(); }
      },
    };
  },
});
