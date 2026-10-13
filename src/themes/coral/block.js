import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { softGlint, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  coral: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.26); g.fillStyle = shade(c, -0.3); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.35, s * 0.05, s * 0.5, s * 0.5, s * 0.62);
      gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, shade(c, -0.08));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.24); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'coral', 1, 0.07, 0.24);
    },
  },
});

Object.assign(TEX, {
  coral(g, s, c, rnd, k) { // porous polyp cups
    const dk = shade(c, -0.38), lt = shade(c, 0.45);
    for (let i = 0; i < 16; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.025 + rnd() * 0.035);
      g.globalAlpha = 0.6 * k; g.beginPath(); g.arc(x, y + r * 0.25, r, 0, Math.PI * 2); g.fillStyle = lt; g.fill();
      g.globalAlpha = 0.75 * k; g.beginPath(); g.arc(x, y, r * 0.7, 0, Math.PI * 2); g.fillStyle = dk; g.fill();
    }
    g.globalAlpha = 1;
    softGlint(g, s * 0.32, s * 0.28, s * 0.22, 0.3 * k);
  },
});
