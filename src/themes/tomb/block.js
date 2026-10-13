import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';
import { carved } from '../shared/shapes.js';
import { glyph } from './helpers.js';

Object.assign(STYLES, {
  tomb: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.06); g.fillStyle = shade(c, -0.45); g.fill();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, shade(c, 0.22)); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.05); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'tomb', 1, 0.06, 0.05);
    },
  },
});

Object.assign(TEX, {
  tomb(g, s, c, rnd, k) { // sandstone grain and one carved glyph
    speckle(g, s, rnd, 40, 0.004, 0.012, () => rnd() < 0.5 ? `rgba(70,40,10,${0.22 * k})` : `rgba(255,240,200,${0.18 * k})`);
    const kind = (rnd() * 4) | 0;
    carved(g, () => glyph(g, kind, s * 0.5, s * 0.5, s * 0.25), Math.max(1, s * 0.045), `rgba(255,240,205,${0.45 * k})`, `rgba(60,30,8,${0.6 * k})`);
  },
});
