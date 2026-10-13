import { poly } from '../../render/sprites.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  dimension(p, s) { // a dimension line with its two arrowheads
    ctx.rotate(p.rot * 0.4); ctx.strokeStyle = '#f4f9ff'; ctx.fillStyle = '#f4f9ff'; ctx.lineWidth = Math.max(1, s * 0.08);
    ctx.beginPath(); ctx.moveTo(-s * 0.7, 0); ctx.lineTo(s * 0.7, 0); ctx.moveTo(-s * 0.7, -s * 0.25); ctx.lineTo(-s * 0.7, s * 0.25); ctx.moveTo(s * 0.7, -s * 0.25); ctx.lineTo(s * 0.7, s * 0.25); ctx.stroke();
    poly(ctx, [[-s * 0.7, 0], [-s * 0.45, -s * 0.12], [-s * 0.45, s * 0.12]], '#f4f9ff'); poly(ctx, [[s * 0.7, 0], [s * 0.45, -s * 0.12], [s * 0.45, s * 0.12]], '#f4f9ff');
  },
});
