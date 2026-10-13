import { mixHex } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  chalkdust(p, s, k) {
    const r = p.size * (0.35 + (1 - k) * 1.3); ctx.globalAlpha *= 0.55; ctx.fillStyle = mixHex(p.color, '#ffffff', 0.6);
    ctx.beginPath(); for (const [x, y, q] of [[-0.4, 0.1, 0.55], [0.1, -0.25, 0.7], [0.45, 0.15, 0.5]]) { ctx.moveTo(x * r + q * r, y * r); ctx.arc(x * r, y * r, q * r, 0, Math.PI * 2); } ctx.fill();
  },
});
