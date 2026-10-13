import { shade } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  coin(p, s) {
    ctx.rotate(p.rot * 0.2); ctx.scale(Math.abs(Math.cos(p.life * 12 + p.ph)) + 0.08, 1);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2); ctx.fillStyle = shade(p.color, 0.1); ctx.fill();
    ctx.lineWidth = Math.max(1, s * 0.12); ctx.strokeStyle = shade(p.color, -0.3); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,245,200,.8)'; ctx.lineWidth = Math.max(1, s * 0.08); ctx.stroke();
  },
});
