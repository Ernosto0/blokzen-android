import { mixHex } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  crescent(p, s) {
    ctx.rotate(p.rot * 0.3);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2); ctx.arc(s * 0.25, -s * 0.1, s * 0.48, 0, Math.PI * 2, true);
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.5); ctx.fill('evenodd');
  },
});
