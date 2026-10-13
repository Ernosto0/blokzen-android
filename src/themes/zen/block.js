import { mixHex, shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { softGlint, speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  stone: {
    block(g, s, c) {
      g.beginPath(); g.ellipse(s * 0.5, s * 0.56, s * 0.44, s * 0.4, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.16)'; g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.36); g.fillStyle = shade(c, -0.25); g.fill();
      const gr = g.createRadialGradient(s * 0.38, s * 0.32, s * 0.04, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.4)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.8, s * 0.34); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'stone', 1, 0.07, 0.34);
    },
  },
});

Object.assign(TEX, {
  stone(g, s, c, rnd, k) { // river stone: grain, a pale vein, soft shine
    speckle(g, s, rnd, 36, 0.004, 0.012, () => rnd() < 0.5 ? `rgba(0,0,0,${0.12 * k})` : `rgba(255,255,255,${0.2 * k})`);
    const y = s * (0.35 + rnd() * 0.3);
    g.beginPath(); g.moveTo(-s * 0.05, y); g.bezierCurveTo(s * 0.3, y - s * 0.12, s * 0.6, y + s * 0.12, s * 1.05, y - s * 0.04);
    g.strokeStyle = `rgba(255,255,255,${0.28 * k})`; g.lineWidth = Math.max(1, s * 0.025); g.stroke();
    softGlint(g, s * 0.33, s * 0.28, s * 0.2, 0.35 * k);
  },
});
