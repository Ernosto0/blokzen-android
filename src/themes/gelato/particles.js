import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  sprinkle(p, s) { ctx.rotate(p.rot); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.5, s * 0.3); ctx.strokeStyle = p.color; ctx.beginPath(); ctx.moveTo(-s * 0.4, 0); ctx.lineTo(s * 0.4, 0); ctx.stroke(); },
});
