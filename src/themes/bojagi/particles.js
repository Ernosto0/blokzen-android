import { mixHex } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  silk(p, s) {
    ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.25 + 0.75 * Math.abs(Math.sin(p.life * 5 + p.ph))); ctx.globalAlpha *= 0.85;
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.25); ctx.fillRect(-s * 0.55, -s * 0.45, s * 1.1, s * 0.9);
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = Math.max(1, s * 0.06); ctx.strokeRect(-s * 0.55, -s * 0.45, s * 1.1, s * 0.9);
  },
});
