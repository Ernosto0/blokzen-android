import { PARTS } from '../registry.js';
import { papelPath } from './helpers.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  flag(p, s) { ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.3 + 0.7 * Math.abs(Math.sin(p.life * 6 + p.ph))); papelPath(ctx, -s * 0.5, -s * 0.55, s, s * 1.1); ctx.fillStyle = p.color; ctx.fill('evenodd'); },
});
