import { shade } from '../../core/color.js';
import { batShape } from './helpers.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  bat(p, s) { batShape(ctx, 0, 0, s * 0.9, Math.sin(p.life * 28 + p.ph), shade(p.color, -0.6), p.vx < 0); },
});
