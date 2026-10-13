import { mixHex } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  paper(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.15 + 0.85 * Math.abs(Math.sin(p.life * 6 + p.ph)));
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.15); ctx.fillRect(-s * 0.55, -s * 0.4, s * 1.1, s * 0.8);
    ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.4); ctx.lineTo(s * 0.55, s * 0.4); ctx.stroke();
  },
});
