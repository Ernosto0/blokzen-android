import { STYLES, TEX } from '../registry.js';
import { framedTile } from '../shared/shapes.js';

Object.assign(STYLES, {
  andean: { block(g, s, c) { framedTile(g, s, c, 'andean', 0.1); } }, // Andean weaving with a stepped diamond
});

Object.assign(TEX, {
  andean(g, s, c, rnd, k) { // a stepped diamond woven in, fringe stripes top and bottom, the weft lines
    const q = s / 10;
    for (let r = 0; r < 10; r++) for (let cc = 0; cc < 10; cc++) {
      const d = Math.abs(cc - 4.5) + Math.abs(r - 4.5);
      if (d < 1.5) g.fillStyle = `rgba(30,10,0,${0.45 * k})`;
      else if (d >= 3 && d < 4) g.fillStyle = `rgba(255,248,230,${0.8 * k})`;
      else if (d >= 5 && d < 6) g.fillStyle = `rgba(30,10,0,${0.3 * k})`;
      else continue;
      g.fillRect(cc * q, r * q, q + 0.5, q + 0.5);
    }
    g.fillStyle = `rgba(255,248,230,${0.5 * k})`; g.fillRect(0, s * 0.06, s, Math.max(1, s * 0.03)); g.fillRect(0, s * 0.91, s, Math.max(1, s * 0.03));
    g.fillStyle = `rgba(0,0,0,${0.07 * k})`; for (let y = 0; y < s; y += Math.max(2, s / 18)) g.fillRect(0, y, s, 1);
  },
});
