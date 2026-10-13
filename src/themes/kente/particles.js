import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  thread(p, s) {
    const wv = s * 0.4 * Math.sin(p.life * 8 + p.ph);
    ctx.rotate(p.rot); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.2, s * 0.2); ctx.strokeStyle = p.color;
    ctx.beginPath(); ctx.moveTo(-s * 0.8, 0); ctx.quadraticCurveTo(-s * 0.4, -wv, 0, 0); ctx.quadraticCurveTo(s * 0.4, wv, s * 0.8, 0); ctx.stroke();
  },
});
