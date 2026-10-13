import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  carriage: { // a painted carriage panel with a lit window and rivets
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.fillStyle = shade(c, -0.55); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, shade(c, 0.18)); gr.addColorStop(1, shade(c, -0.2));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.07); g.fillStyle = gr; g.fill();
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.07); g.clip(); TEX.carriage(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  carriage(g, s, c, rnd, k) { // a lit window with a warm glow, a row of rivets and a lining stripe
    const wx = s * 0.2, wy = s * 0.16, ww = s * 0.6, wh = s * 0.36;
    const gl = g.createRadialGradient(s * 0.5, wy + wh / 2, 0, s * 0.5, wy + wh / 2, s * 0.5); gl.addColorStop(0, `rgba(255,200,110,${0.35 * k})`); gl.addColorStop(1, 'rgba(255,200,110,0)');
    g.fillStyle = gl; g.fillRect(0, 0, s, s);
    rr(g, wx - s * 0.03, wy - s * 0.03, ww + s * 0.06, wh + s * 0.06, s * 0.08); g.fillStyle = `rgba(20,16,12,${0.7 * k})`; g.fill();
    const wg = g.createLinearGradient(0, wy, 0, wy + wh); wg.addColorStop(0, `rgba(255,226,150,${0.95 * k})`); wg.addColorStop(1, `rgba(240,160,60,${0.95 * k})`);
    rr(g, wx, wy, ww, wh, s * 0.06); g.fillStyle = wg; g.fill();
    g.fillStyle = `rgba(60,30,10,${0.5 * k})`; g.fillRect(wx + ww * 0.15, wy + wh * 0.45, ww * 0.12, wh * 0.55); // a passenger's shadow
    g.beginPath(); g.arc(wx + ww * 0.21, wy + wh * 0.38, ww * 0.07, 0, Math.PI * 2); g.fill();
    g.fillStyle = `rgba(255,236,190,${0.6 * k})`; g.fillRect(0, s * 0.68, s, Math.max(1, s * 0.03));
    for (let i = 0; i < 5; i++) {
      const x = s * (0.14 + i * 0.18), y = s * 0.82;
      g.beginPath(); g.arc(x, y, s * 0.028, 0, Math.PI * 2); g.fillStyle = `rgba(0,0,0,${0.35 * k})`; g.fill();
      g.beginPath(); g.arc(x - s * 0.006, y - s * 0.006, s * 0.016, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.45 * k})`; g.fill();
    }
  },
});
