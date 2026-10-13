import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { kawaiiChar } from './helpers.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  kawaii(th) { // polka dots, drifting hearts and sparkles, and the cast floating by now and then
    const P = [...Array(16)].map((_, i) => ({ x: Math.random(), y: Math.random(), s: rand(0.012, 0.03), vy: rand(0.015, 0.04), ph: rand(0, 6.3), kind: i % 4 === 0 ? 'char' : i % 2 ? 'heart' : 'star', ch: (Math.random() * 7) | 0 }));
    let t = 0;
    const heart = (g, x, y, r) => { g.beginPath(); g.moveTo(x, y + r * 0.9); g.bezierCurveTo(x - r * 1.4, y + r * 0.1, x - r * 0.95, y - r * 0.95, x, y - r * 0.4); g.bezierCurveTo(x + r * 0.95, y - r * 0.95, x + r * 1.4, y + r * 0.1, x, y + r * 0.9); g.fill(); };
    return {
      step(dt) { t += dt; for (const p of P) { p.y -= p.vy * dt; p.ph += dt * 1.4; if (p.y < -0.06) { p.y = 1.06; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), q = u * 0.14;
        g.fillStyle = rgba('#ffffff', 0.22 * a);
        for (let y = q / 2; y < h + q; y += q) for (let x = ((Math.round(y / q) % 2) ? q / 2 : 0); x < w + q; x += q) { g.beginPath(); g.arc(x, y, u * 0.016, 0, Math.PI * 2); g.fill(); }
        for (const p of P) {
          const x = p.x * w + Math.sin(p.ph) * u * 0.02, y = p.y * h, r = p.s * u * 1.6;
          if (p.kind === 'char') { g.globalAlpha = 0.32 * a; kawaiiChar(g, p.ch, x, y, r * 0.9); g.globalAlpha = 1; continue; }
          g.fillStyle = rgba(p.kind === 'heart' ? '#ff6fa6' : '#ffffff', (p.kind === 'heart' ? 0.4 : 0.7) * a);
          if (p.kind === 'heart') heart(g, x, y, r);
          else { const tw = 0.6 + 0.4 * Math.sin(t * 3 + p.ph); g.beginPath(); g.moveTo(x, y - r * tw); g.quadraticCurveTo(x, y, x + r * tw, y); g.quadraticCurveTo(x, y, x, y + r * tw); g.quadraticCurveTo(x, y, x - r * tw, y); g.quadraticCurveTo(x, y, x, y - r * tw); g.fill(); }
        }
      },
    };
  },
});
