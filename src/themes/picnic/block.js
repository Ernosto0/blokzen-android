import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  gingham: { // checked picnic cloth with stitched edges
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.07, s * 0.92, s * 0.9, s * 0.1); g.fillStyle = 'rgba(0,0,0,.16)'; g.fill();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.88, s * 0.1); g.fillStyle = mixHex(c, '#ffffff', 0.62); g.fill();
      g.save(); rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.88, s * 0.1); g.clip(); TEX.gingham(g, s, c, seeded(c), 1); g.restore();
      rr(g, s * 0.1, s * 0.1, s * 0.8, s * 0.76, s * 0.06);
      g.setLineDash([s * 0.05, s * 0.04]); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = Math.max(1, s * 0.022); g.stroke(); g.setLineDash([]);
    },
  },
});

Object.assign(TEX, {
  gingham(g, s, c, rnd, k) { // overlapping stripes make the checks; a fine weave on top
    const b = s / 8, dk = shade(c, -0.2);
    g.save(); g.globalAlpha = 0.5 * k; g.fillStyle = dk;
    for (let i = 0; i < 4; i++) { g.fillRect(i * s / 4 + b / 2, 0, b, s); g.fillRect(0, i * s / 4 + b / 2, s, b); }
    g.restore();
    g.strokeStyle = `rgba(255,255,255,${0.12 * k})`; g.lineWidth = 1;
    for (let x = 0; x < s; x += Math.max(2, s / 24)) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, s); g.stroke(); }
  },
});
