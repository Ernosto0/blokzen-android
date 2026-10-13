import { mixHex } from '../../core/color.js';
import { hexPath } from '../../render/sprites.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  nut(p, s) { ctx.rotate(p.rot); hexPath(ctx, 0, 0, s * 0.6); ctx.moveTo(s * 0.25, 0); ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2); ctx.fillStyle = mixHex('#c8d0d8', p.color, 0.3); ctx.fill('evenodd'); },
});
