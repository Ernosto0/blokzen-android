import { poly } from '../../render/sprites.js';
import { softGlint } from '../../render/textures.js';
import { TEX } from '../registry.js';

Object.assign(TEX, {
  gem(g, s, c, rnd, k) { // facets meeting at an off-centre point, light caught in one corner
    const cx = s * (0.4 + rnd() * 0.2), cy = s * (0.4 + rnd() * 0.2), C = [[0, 0], [s, 0], [s, s], [0, s]];
    C.forEach((p, i) => poly(g, [[cx, cy], p, C[(i + 1) % 4]], i % 2 ? `rgba(0,0,0,${0.12 * k})` : `rgba(255,255,255,${0.16 * k})`));
    g.strokeStyle = `rgba(255,255,255,${0.25 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    for (const p of C) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(...p); g.stroke(); }
    softGlint(g, s * 0.3, s * 0.28, s * 0.22, 0.5 * k);
  },
});
