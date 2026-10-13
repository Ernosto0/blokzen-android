import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  gold: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.9, s * 0.1); g.fillStyle = shade(c, -0.5); g.fill();
      const lg = g.createLinearGradient(0, 0, s, s);
      lg.addColorStop(0, shade(c, 0.6)); lg.addColorStop(0.3, c); lg.addColorStop(0.5, shade(c, -0.18)); lg.addColorStop(0.72, shade(c, 0.3)); lg.addColorStop(1, shade(c, -0.25));
      rr(g, s * 0.06, s * 0.06, s * 0.88, s * 0.82, s * 0.09); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'gold', 1, 0.06, 0.09);
    },
  },
});

Object.assign(TEX, {
  gold(g, s, c, rnd, k) { // brushed metal with a sweeping highlight
    for (let y = 0; y < s; y += Math.max(1, s / 30)) {
      g.fillStyle = rnd() < 0.5 ? `rgba(255,250,220,${(0.04 + rnd() * 0.12) * k})` : `rgba(90,50,0,${(0.04 + rnd() * 0.1) * k})`;
      g.fillRect(0, y, s, Math.max(1, s / 60));
    }
    const sh = g.createLinearGradient(0, 0, s, s);
    sh.addColorStop(0.2, 'rgba(255,255,240,0)'); sh.addColorStop(0.38, `rgba(255,255,240,${0.4 * k})`); sh.addColorStop(0.5, 'rgba(255,255,240,0)');
    g.fillStyle = sh; g.fillRect(0, 0, s, s);
  },
});
