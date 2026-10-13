import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  pumpkin: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.08, s * 0.9, s * 0.88, s * 0.32); g.fillStyle = shade(c, -0.38); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.38, s * 0.04, s * 0.5, s * 0.55, s * 0.58);
      gr.addColorStop(0, shade(c, 0.35)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.18));
      rr(g, s * 0.07, s * 0.09, s * 0.86, s * 0.82, s * 0.3); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'pumpkin', 1, 0.07, 0.3);
    },
  },
});

Object.assign(TEX, {
  pumpkin(g, s, c, rnd, k) { // ribbed rind with a waxy shine and skin flecks
    g.strokeStyle = `rgba(120,40,0,${0.32 * k})`; g.lineWidth = Math.max(1, s * 0.028);
    for (const x of [0.22, 0.4, 0.6, 0.78]) { g.beginPath(); g.moveTo(s * x, 0); g.quadraticCurveTo(s * (x + (x - 0.5) * 0.5), s * 0.5, s * x, s); g.stroke(); }
    speckle(g, s, rnd, 20, 0.004, 0.01, () => `rgba(255,220,150,${0.3 * k})`);
    for (const x of [0.31, 0.5, 0.69]) { const gr = g.createLinearGradient(s * (x - 0.06), 0, s * (x + 0.06), 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,240,200,${0.22 * k})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(s * (x - 0.06), s * 0.1, s * 0.12, s * 0.5); }
  },
});
