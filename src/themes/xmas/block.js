import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

function caneStripes(g, s, c, a = 1) {
  g.save(); g.globalAlpha = a; g.lineWidth = s * 0.13; g.strokeStyle = c;
  for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(s * k * 0.34, s * 1.05); g.lineTo(s * (1 + k * 0.34), -s * 0.05); g.stroke(); }
  g.restore();
}

Object.assign(STYLES, {
  cane: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.18); g.fillStyle = shade(c, -0.35); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.16); g.fillStyle = '#fff7f0'; g.fill();
      g.save(); g.clip(); caneStripes(g, s, c);
      rr(g, s * 0.16, s * 0.1, s * 0.68, s * 0.12, s * 0.06); g.fillStyle = 'rgba(255,255,255,.4)'; g.fill(); g.restore();
    },
  },
});

Object.assign(TEX, {
  cane(g, s, c, rnd, k) { caneStripes(g, s, '#ffffff', 0.75 * k); },
});
