import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  luxe(th) { // art deco sunburst, gold corner frames, floating gold leaf
    const P = [...Array(40)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(-0.015, -0.004), ph: rand(0, 6.3), f: rand(1, 3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y += p.vy * dt; p.x += Math.sin(t * 0.4 + p.ph) * 0.004 * dt; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), cx = w / 2, cy = h * 1.02, R = Math.hypot(w, h);
        g.strokeStyle = rgba(th.accent, 0.13 * a); g.lineWidth = 1;
        for (let i = 0; i <= 24; i++) { const an = Math.PI + (i / 24) * Math.PI; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); g.stroke(); }
        for (let k = 1; k <= 4; k++) { g.beginPath(); g.arc(cx, cy, u * 0.22 * k, Math.PI, 0); g.stroke(); }
        g.strokeStyle = rgba(th.accent, 0.35 * a); g.lineWidth = 1.5;
        const m = u * 0.04, L3 = u * 0.18;
        for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
          const x = sx > 0 ? m : w - m, y = sy > 0 ? m : h - m;
          g.beginPath(); g.moveTo(x, y + sy * L3); g.lineTo(x, y); g.lineTo(x + sx * L3, y); g.stroke();
          g.beginPath(); g.moveTo(x + sx * 6, y + sy * L3 * 0.6); g.lineTo(x + sx * 6, y + sy * 6); g.lineTo(x + sx * L3 * 0.6, y + sy * 6); g.stroke();
        }
        for (const p of P) {
          const k = Math.max(0, Math.sin(t * p.f + p.ph)), sz = 1.5 + k * 2;
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(t * 0.5 + p.ph);
          g.fillStyle = rgba('#f0d27a', (0.25 + 0.65 * k) * a); g.fillRect(-sz / 2, -sz / 2, sz, sz * (0.3 + 0.7 * Math.abs(Math.cos(t + p.ph))));
          g.restore();
        }
      },
    };
  },
});
