import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { softGlint, speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  gum: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.34); g.fillStyle = shade(c, -0.22); g.fill();
      const gr = g.createRadialGradient(s * 0.38, s * 0.34, s * 0.04, s * 0.5, s * 0.52, s * 0.56);
      gr.addColorStop(0, shade(c, 0.5)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.08));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.32); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'gum', 1, 0.07, 0.32);
    },
  },
});

Object.assign(TEX, {
  gum(g, s, c, rnd, k) { // powdered-sugar dusting and a soft matte highlight
    softGlint(g, s * 0.35, s * 0.3, s * 0.3, 0.45 * k);
    speckle(g, s, rnd, 34, 0.004, 0.01, () => `rgba(255,255,255,${(0.25 + rnd() * 0.35) * k})`);
  },
});
