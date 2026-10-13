import { shade } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { gearPath } from '../shared/shapes.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  cog(p, s) { ctx.rotate(p.rot); gearPath(ctx, 0, 0, s * 0.6, 8, 0, 0.3); ctx.fillStyle = shade(p.color, 0.1); ctx.fill('evenodd'); },
});
