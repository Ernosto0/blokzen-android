import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  confetti(p, s) { ctx.rotate(p.rot); ctx.scale(1, 0.15 + 0.85 * Math.abs(Math.sin(p.life * 9 + p.ph))); ctx.fillStyle = p.color; ctx.fillRect(-s * 0.5, -s * 0.28, s, s * 0.56); },
});
