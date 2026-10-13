import { jigPath } from './helpers.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  piece(p, s) { ctx.rotate(p.rot); const L = s * 0.75; jigPath(ctx, -L / 2, -L / 2, L, [1, -1, 1, -1], 0.6); ctx.fillStyle = p.color; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = Math.max(1, s * 0.06); ctx.stroke(); },
});
