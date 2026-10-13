import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  book: { // a leather-bound spine with gold bands and a title plate
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.92, s * 0.08); g.fillStyle = shade(c, -0.55); g.fill();
      const lg = g.createLinearGradient(0, 0, s, 0);
      lg.addColorStop(0, shade(c, -0.28)); lg.addColorStop(0.3, shade(c, 0.12)); lg.addColorStop(0.7, c); lg.addColorStop(1, shade(c, -0.32));
      rr(g, s * 0.07, s * 0.05, s * 0.86, s * 0.86, s * 0.07); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'book', 1, 0.07, 0.07);
    },
  },
});

Object.assign(TEX, {
  book(g, s, c, rnd, k) { // grained leather, gold bands and a dark title plate
    speckle(g, s, rnd, 40, 0.004, 0.01, () => rnd() < 0.5 ? `rgba(0,0,0,${0.18 * k})` : `rgba(255,240,220,${0.1 * k})`);
    g.fillStyle = `rgba(240,200,110,${0.85 * k})`;
    for (const y of [0.12, 0.17, 0.79, 0.84]) g.fillRect(0, s * y, s, Math.max(1, s * 0.025));
    rr(g, s * 0.24, s * 0.36, s * 0.52, s * 0.26, s * 0.03); g.fillStyle = `rgba(20,10,0,${0.4 * k})`; g.fill();
    g.strokeStyle = `rgba(240,200,110,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.015); g.stroke();
    g.fillStyle = `rgba(240,200,110,${0.75 * k})`;
    g.fillRect(s * 0.32, s * 0.44, s * 0.36, Math.max(1, s * 0.03)); g.fillRect(s * 0.38, s * 0.52, s * 0.24, Math.max(1, s * 0.025));
  },
});
