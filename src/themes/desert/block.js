import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  dune: { // wind-rippled sand
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.16); g.fillStyle = shade(c, -0.42); g.fill();
      const gr = g.createLinearGradient(0, 0, s * 0.3, s); gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.84, s * 0.14); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'dune', 1, 0.06, 0.14);
    },
  },
});

Object.assign(TEX, {
  dune(g, s, c, rnd, k) { // ripples with a lit crest and a shaded trough, loose grains
    g.lineCap = 'round';
    const ph = rnd() * 6.3;
    for (let i = 0; i < 6; i++) {
      const y0 = s * (0.12 + i * 0.16);
      const path = () => { g.beginPath(); for (let j = 0; j <= 12; j++) { const x = j * s / 12, y = y0 + Math.sin(x / s * 7 + ph + i * 0.7) * s * 0.035; j ? g.lineTo(x, y) : g.moveTo(x, y); } };
      path(); g.strokeStyle = `rgba(90,40,10,${0.22 * k})`; g.lineWidth = Math.max(1, s * 0.028); g.stroke();
      g.save(); g.translate(0, -s * 0.022); path(); g.strokeStyle = `rgba(255,240,200,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.018); g.stroke(); g.restore();
    }
    speckle(g, s, rnd, 40, 0.003, 0.008, () => rnd() < 0.5 ? `rgba(255,240,200,${0.3 * k})` : `rgba(80,40,10,${0.25 * k})`);
  },
});
