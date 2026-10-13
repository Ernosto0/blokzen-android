import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  pixel(p, s) {
    const q = Math.max(2, Math.round(s * 0.7));
    ctx.fillStyle = p.color; ctx.fillRect(-q / 2, -q / 2, q, q);
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(-q / 2, -q / 2, q / 2, q / 2);
  },
});
