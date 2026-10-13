import { poly } from '../../render/sprites.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  tan(p, s) { ctx.rotate(p.rot); poly(ctx, [[-s * 0.6, s * 0.3], [s * 0.6, s * 0.3], [0, -s * 0.3]], p.color); ctx.strokeStyle = 'rgba(255,250,240,.8)'; ctx.lineWidth = Math.max(1, s * 0.05); ctx.stroke(); },
});
