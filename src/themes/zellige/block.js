import { hexOf, mixHex, rgba, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { softGlint, speckle } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';
import { star8 } from './helpers.js';

Object.assign(STYLES, {
  zellige: { // a glazed tile set in cream mortar, an eight-pointed star cut into it
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.08); g.fillStyle = '#d8ccb0'; g.fill();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, shade(c, 0.25)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.2));
      rr(g, s * 0.07, s * 0.07, s * 0.86, s * 0.86, s * 0.06); g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.zellige(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  zellige(g, s, c, rnd, k) { // a pale star in the glaze, mortar lines out to the corners, an uneven shine
    star8(g, s * 0.5, s * 0.5, s * 0.34); g.fillStyle = rgba(hexOf(mixHex(c, '#ffffff', 0.5)), 0.45 * k); g.fill();
    g.strokeStyle = `rgba(232,224,204,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.028); g.stroke();
    g.beginPath(); for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) { g.moveTo(x, y); g.lineTo(s * 0.5 + (x - s * 0.5) * 0.48, s * 0.5 + (y - s * 0.5) * 0.48); } g.stroke();
    speckle(g, s, rnd, 12, 0.006, 0.016, () => `rgba(255,255,255,${0.22 * k})`);
    softGlint(g, s * 0.3, s * 0.27, s * 0.22, 0.45 * k);
  },
});
