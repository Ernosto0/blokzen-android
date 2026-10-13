import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  tesserae: { // small stone tiles set in mortar
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.fillStyle = '#b8a890'; g.fill();
      g.save(); rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.clip(); TEX.tesserae(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  tesserae(g, s, c, rnd, k) { // a 4 x 4 set of slightly uneven tiles, each a shade of its own, with mortar lines between
    const n = 4, q = s / n;
    g.fillStyle = `rgba(150,130,100,${0.55 * k})`; g.fillRect(0, 0, s, s);
    for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) {
      const j = () => (rnd() - 0.5) * q * 0.1, x = cc * q + q * 0.08 + j(), y = r * q + q * 0.08 + j(), w = q * 0.84 + j(), h = q * 0.84 + j();
      const v = (rnd() - 0.5) * 0.3;
      g.fillStyle = v > 0 ? mixHex(c, '#ffffff', v) : shade(c, v);
      g.globalAlpha = k; rr(g, x, y, w, h, q * 0.12); g.fill();
      g.fillStyle = `rgba(255,255,255,${0.18 * k})`; g.fillRect(x + w * 0.1, y + h * 0.1, w * 0.35, h * 0.12);
      g.globalAlpha = 1;
    }
  },
});
