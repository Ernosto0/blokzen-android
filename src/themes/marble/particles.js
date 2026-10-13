import { mixHex } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  fleck(p, s) {
    ctx.rotate(p.rot); const k = Math.abs(Math.cos(p.life * 9 + p.ph));
    ctx.fillStyle = mixHex('#e8c45a', '#fff6d0', k * 0.7); ctx.fillRect(-s * 0.35, -s * 0.35 * (0.2 + 0.8 * k), s * 0.7, s * 0.7 * (0.2 + 0.8 * k));
  },
});
