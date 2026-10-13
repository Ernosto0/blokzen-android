import { shade } from '../../core/color.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  pixel: {
    block(g, s, c) {
      const p = s / 8;
      g.fillStyle = shade(c, -0.5); g.fillRect(0, 0, s, s);
      g.fillStyle = c; g.fillRect(p * 0.6, p * 0.6, s - p * 1.2, s - p * 1.2);
      g.fillStyle = shade(c, 0.45); g.fillRect(p * 0.6, p * 0.6, s - p * 1.2, p); g.fillRect(p * 0.6, p * 0.6, p, s - p * 1.2);
      g.fillStyle = shade(c, -0.25); g.fillRect(p * 0.6, s - p * 1.6, s - p * 1.2, p); g.fillRect(s - p * 1.6, p * 0.6, p, s - p * 1.2);
      g.fillStyle = '#fff'; g.fillRect(p * 2, p * 2, p, p); g.fillRect(p * 3, p * 2, p, p); g.fillRect(p * 2, p * 3, p, p);
    },
  },
});

Object.assign(TEX, {
  pixel(g, s, c, rnd, k) {
    const p = s / 8;
    g.fillStyle = `rgba(255,255,255,${0.85 * k})`; g.fillRect(p * 2, p * 2, p, p); g.fillRect(p * 3, p * 2, p, p); g.fillRect(p * 2, p * 3, p, p);
    g.fillStyle = `rgba(0,0,0,${0.18 * k})`; // dithered shadow in the lower right
    for (let y = 4; y < 7; y++) for (let x = 4; x < 7; x++) if ((x + y) % 2) g.fillRect(p * x, p * y, p, p);
  },
});
