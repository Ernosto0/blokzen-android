import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { makeDrips } from '../../render/backgrounds.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  cocoa(th) { // melting chocolate from the top, falling sprinkles
    const D = makeDrips(7, '#5a2c12');
    const SPR = ['#ff6b8a', '#ffd166', '#7ae0ff', '#a6f06b', '#ffffff', '#c58bff'];
    const P = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.03, 0.08), rot: rand(0, 6.3), vr: rand(-2, 2), c: SPR[(Math.random() * 6) | 0] }));
    return {
      step(dt) { D.step(dt); for (const p of P) { p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const warm = g.createLinearGradient(0, h * 0.6, 0, h); warm.addColorStop(0, rgba(th.glow, 0)); warm.addColorStop(1, rgba(th.glow, 0.5 * a));
        g.fillStyle = warm; g.fillRect(0, h * 0.6, w, h * 0.4);
        const u = Math.min(w, h), l = u * 0.012;
        g.lineCap = 'round'; g.lineWidth = Math.max(2, u * 0.008);
        for (const p of P) {
          const x = p.x * w, y = p.y * h, cx = Math.cos(p.rot) * l, cy = Math.sin(p.rot) * l;
          g.strokeStyle = rgba(p.c, 0.7 * a); g.beginPath(); g.moveTo(x - cx, y - cy); g.lineTo(x + cx, y + cy); g.stroke();
        }
        g.lineCap = 'butt';
        D.draw(g, w, h, a);
      },
    };
  },
});
