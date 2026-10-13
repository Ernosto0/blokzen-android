import { rr } from '../../render/sprites.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  sugar(p, s) {
    ctx.rotate(p.rot); rr(ctx, -s * 0.35, -s * 0.35, s * 0.7, s * 0.7, s * 0.08); ctx.fillStyle = '#fffaf0'; ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.1)'; ctx.fillRect(-s * 0.35, s * 0.15, s * 0.7, s * 0.2);
  },
});
