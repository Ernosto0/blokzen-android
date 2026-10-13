import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';
import { mapleShape } from '../shared/shapes.js';

Object.assign(STYLES, {
  maple: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.16); g.fillStyle = shade(c, -0.38); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, shade(c, 0.18)); gr.addColorStop(1, shade(c, -0.1));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.14); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'maple', 1, 0.07, 0.14);
    },
  },
});

Object.assign(TEX, {
  maple(g, s, c, rnd, k) { // mottled autumn colour and a pale maple leaf with its veins
    speckle(g, s, rnd, 30, 0.01, 0.04, () => rnd() < 0.5 ? `rgba(255,220,120,${0.12 * k})` : `rgba(80,20,0,${0.14 * k})`);
    const rot = (rnd() - 0.5) * 0.8, r = s * 0.36;
    mapleShape(g, s * 0.5, s * 0.5, r, rot); g.fillStyle = `rgba(255,236,190,${0.32 * k})`; g.fill();
    g.save(); g.translate(s * 0.5, s * 0.5); g.rotate(rot);
    g.strokeStyle = `rgba(110,40,10,${0.4 * k})`; g.lineWidth = Math.max(1, s * 0.015); g.beginPath();
    for (const [x, y] of [[0, -0.85], [0.75, -0.35], [0.7, 0.2], [-0.75, -0.35], [-0.7, 0.2], [0, 0.95]]) { g.moveTo(0, r * 0.3); g.lineTo(x * r, y * r); }
    g.stroke(); g.restore();
  },
});
