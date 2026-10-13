import { PARTS } from '../registry.js';
import { star8 } from './helpers.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  zillij(p, s) { ctx.rotate(p.rot); star8(ctx, 0, 0, s * 0.6); ctx.fillStyle = p.color; ctx.fill(); ctx.lineWidth = Math.max(1, s * 0.1); ctx.strokeStyle = '#efe6d2'; ctx.stroke(); },
});
