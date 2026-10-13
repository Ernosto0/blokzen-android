import { hexOf, mixHex, rgba, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  ebru: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.35); g.fill();
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.1); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s);
      TEX.ebru(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  ebru(g, s, c, rnd, k) { // dropped paint spreading into rings, then combed through
    const L = hexOf(mixHex(c, '#fff6e6', 0.6)), D = hexOf(mixHex(c, '#101820', 0.35));
    for (let i = 0; i < 4; i++) {
      const x = s * (0.1 + rnd() * 0.8), y = s * (0.1 + rnd() * 0.8), r = s * (0.12 + rnd() * 0.16);
      for (const [q, col, al] of [[1, L, 0.55], [0.72, D, 0.5], [0.45, L, 0.6], [0.22, c, 1]]) { g.beginPath(); g.arc(x, y, r * q, 0, Math.PI * 2); g.fillStyle = rgba(col, al * k); g.fill(); }
    }
    g.lineWidth = Math.max(1, s * 0.018); g.strokeStyle = `rgba(255,250,240,${0.5 * k})`;
    const ph = rnd() * 6.3;
    for (let i = 0; i < 4; i++) {
      const y0 = s * (0.15 + i * 0.24);
      g.beginPath(); for (let j = 0; j <= 16; j++) { const x = j * s / 16, y = y0 + Math.sin(x / s * 9 + ph + i) * s * 0.05; j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    }
  },
});
