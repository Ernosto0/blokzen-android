import { shade } from '../../core/color.js';
import { poly, rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  choco: {
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.08); g.fillStyle = shade(c, -0.5); g.fill();
      const o = s * 0.06, e = s * 0.94, b = s * 0.17;
      poly(g, [[o, o], [e, o], [e - b, o + b], [o + b, o + b]], shade(c, 0.22));
      poly(g, [[o, o], [o + b, o + b], [o + b, e - b], [o, e]], shade(c, 0.08));
      poly(g, [[e, o], [e, e], [e - b, e - b], [e - b, o + b]], shade(c, -0.25));
      poly(g, [[o, e], [o + b, e - b], [e - b, e - b], [e, e]], shade(c, -0.38));
      g.fillStyle = c; g.fillRect(o + b, o + b, e - o - 2 * b, e - o - 2 * b);
      texIn(g, s, c, 'choco', 1, 0.06, 0.02);
    },
  },
});

Object.assign(TEX, {
  choco(g, s, c, rnd, k) { // cocoa surface with a satin sheen
    speckle(g, s, rnd, 28, 0.004, 0.012, () => rnd() < 0.5 ? `rgba(0,0,0,${0.18 * k})` : `rgba(255,220,180,${0.1 * k})`);
    g.beginPath(); g.ellipse(s * 0.42, s * 0.35, s * 0.16, s * 0.045, -0.5, 0, Math.PI * 2); g.fillStyle = `rgba(255,230,200,${0.28 * k})`; g.fill();
  },
});
