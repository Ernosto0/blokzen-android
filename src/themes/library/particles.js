import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  page(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(0.25 + 0.75 * Math.abs(Math.sin(p.life * 5 + p.ph)), 1);
    ctx.fillStyle = '#f6ead2'; ctx.fillRect(-s * 0.4, -s * 0.55, s * 0.8, s * 1.1);
    ctx.fillStyle = 'rgba(80,60,40,.35)'; for (let i = 0; i < 4; i++) ctx.fillRect(-s * 0.28, -s * 0.36 + i * s * 0.22, s * 0.56, Math.max(1, s * 0.06));
  },
});
