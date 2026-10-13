import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  envelope(p, s) {
    ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.3 + 0.7 * Math.abs(Math.sin(p.life * 4 + p.ph)));
    ctx.fillStyle = '#f6ecd8'; ctx.fillRect(-s * 0.55, -s * 0.38, s * 1.1, s * 0.76);
    ctx.strokeStyle = 'rgba(110,80,50,.5)'; ctx.lineWidth = Math.max(1, s * 0.06);
    ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.38); ctx.lineTo(0, s * 0.05); ctx.lineTo(s * 0.55, -s * 0.38); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, s * 0.05, s * 0.14, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
  },
});
