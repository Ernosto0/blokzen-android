import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  newsclip(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.2 + 0.8 * Math.abs(Math.sin(p.life * 6 + p.ph)));
    ctx.fillStyle = '#f4efe2'; ctx.fillRect(-s * 0.55, -s * 0.42, s * 1.1, s * 0.84);
    ctx.fillStyle = p.color; ctx.fillRect(-s * 0.45, -s * 0.32, s * 0.9, s * 0.2);
    ctx.fillStyle = 'rgba(30,28,24,.4)'; ctx.fillRect(-s * 0.45, 0, s * 0.8, s * 0.07); ctx.fillRect(-s * 0.45, s * 0.16, s * 0.6, s * 0.07);
  },
});
