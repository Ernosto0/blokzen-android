import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  rice(p, s) { ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, s * 0.4, s * 0.2, 0, 0, Math.PI * 2); ctx.fillStyle = '#fbf6ec'; ctx.fill(); },
});
