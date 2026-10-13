import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';
import { carved, gearPath } from '../shared/shapes.js';

Object.assign(STYLES, {
  gear: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.09); g.fillStyle = shade(c, -0.5); g.fill();
      const lg = g.createLinearGradient(0, 0, s, s);
      lg.addColorStop(0, shade(c, 0.45)); lg.addColorStop(0.45, c); lg.addColorStop(0.7, shade(c, -0.15)); lg.addColorStop(1, shade(c, 0.15));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.07); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'gear', 1, 0.07, 0.07);
    },
  },
});

Object.assign(TEX, {
  gear(g, s, c, rnd, k) { // an engraved cog and four rivets
    const rot = rnd() * 6.3;
    carved(g, () => gearPath(g, s * 0.5, s * 0.5, s * 0.24, 8, rot, 0.4), Math.max(1, s * 0.03), `rgba(255,245,215,${0.4 * k})`, `rgba(40,25,10,${0.5 * k})`);
    for (const [x, y] of [[0.17, 0.17], [0.83, 0.17], [0.17, 0.83], [0.83, 0.83]]) {
      g.beginPath(); g.arc(s * x, s * y, s * 0.05, 0, Math.PI * 2); g.fillStyle = `rgba(40,25,10,${0.45 * k})`; g.fill();
      g.beginPath(); g.arc(s * x - s * 0.012, s * y - s * 0.012, s * 0.03, 0, Math.PI * 2); g.fillStyle = `rgba(255,245,215,${0.55 * k})`; g.fill();
    }
  },
});
