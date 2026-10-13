import { shade } from '../../core/color.js';
import { fishShape } from './helpers.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  fish(p, s) { ctx.rotate(Math.atan2(p.vy, p.vx)); fishShape(ctx, 0, 0, s * 0.6, 1, shade(p.color, 0.15), Math.sin(p.life * 30 + p.ph)); },
});
