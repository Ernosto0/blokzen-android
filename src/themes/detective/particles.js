import { mixHex } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  memo(p, s) {
    ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.25 + 0.75 * Math.abs(Math.sin(p.life * 5 + p.ph)));
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.1); ctx.fillRect(-s * 0.5, -s * 0.5, s, s);
    ctx.fillStyle = 'rgba(36,30,48,.35)'; ctx.fillRect(-s * 0.32, -s * 0.05, s * 0.6, Math.max(1, s * 0.06)); ctx.fillRect(-s * 0.32, s * 0.18, s * 0.4, Math.max(1, s * 0.06));
    ctx.beginPath(); ctx.arc(0, -s * 0.36, s * 0.1, 0, Math.PI * 2); ctx.fillStyle = '#d6332e'; ctx.fill();
  },
});
