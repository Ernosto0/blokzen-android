import { mixHex, shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { softGlint, speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';
import { paleHex } from '../shared/shapes.js';

// a Greek key running along a strip (path only, stroked by the caller)
function meander(g, x, y, w, h) {
  g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + w, y + h);
  for (let x0 = x; x0 < x + w - h * 0.2; x0 += h) {
    [[0, 1], [0, 0], [0.8, 0], [0.8, 0.68], [0.32, 0.68], [0.32, 0.34], [0.56, 0.34]].forEach(([px, py], i) => i ? g.lineTo(x0 + px * h, y + py * h) : g.moveTo(x0 + px * h, y + py * h));
  }
}

Object.assign(STYLES, {
  cycladic: { // a whitewashed, rounded tile like a Cycladic wall, painted in the block colour
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.07, s * 0.9, s * 0.9, s * 0.18); g.fillStyle = shade(c, -0.28); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.25)); gr.addColorStop(1, c);
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.18); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'cycladic', 1, 0.05, 0.18);
    },
  },
});

Object.assign(TEX, {
  cycladic(g, s, c, rnd, k) { // whitewash grain, a Greek key along the bottom, sun on the plaster
    speckle(g, s, rnd, 30, 0.004, 0.01, () => rnd() < 0.5 ? `rgba(255,255,255,${0.25 * k})` : `rgba(0,0,0,${0.08 * k})`);
    g.strokeStyle = paleHex(c) ? `rgba(30,94,200,${0.85 * k})` : `rgba(255,255,255,${0.85 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.lineJoin = 'miter';
    meander(g, s * 0.1, s * 0.66, s * 0.8, s * 0.17); g.stroke();
    softGlint(g, s * 0.3, s * 0.24, s * 0.24, 0.45 * k);
  },
});
