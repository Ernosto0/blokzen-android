import { shade } from '../../core/color.js';
import { noteShape } from './helpers.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  note(p, s) { ctx.rotate(Math.sin(p.life * 4 + p.ph) * 0.3); ctx.fillStyle = shade(p.color, 0.2); noteShape(ctx, 0, 0, s * 0.8); },
});
