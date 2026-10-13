import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  bean: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.2); g.fillStyle = shade(c, -0.32); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.18);
      const lg = g.createLinearGradient(0, 0, 0, s); lg.addColorStop(0, shade(c, 0.22)); lg.addColorStop(1, c); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'bean', 1, 0.07, 0.18);
    },
  },
});

Object.assign(TEX, {
  bean(g, s, c, rnd, k) { // espresso crema: marbled swirls and fine foam
    g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const y0 = rnd() * s, y1 = rnd() * s;
      g.beginPath(); g.moveTo(-s * 0.1, y0); g.bezierCurveTo(s * 0.35, y0 + (rnd() - 0.5) * s, s * 0.65, y1 + (rnd() - 0.5) * s, s * 1.1, y1);
      g.strokeStyle = i % 2 ? `rgba(70,35,12,${0.28 * k})` : `rgba(255,236,210,${0.32 * k})`; g.lineWidth = s * (0.03 + rnd() * 0.04); g.stroke();
    }
    speckle(g, s, rnd, 26, 0.004, 0.01, () => `rgba(255,245,230,${(0.2 + rnd() * 0.3) * k})`);
  },
});
