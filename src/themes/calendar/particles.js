import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  leaflet(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.2 + 0.8 * Math.abs(Math.sin(p.life * 5 + p.ph)));
    ctx.fillStyle = '#fdf8ee'; ctx.fillRect(-s * 0.5, -s * 0.55, s, s * 1.1);
    ctx.fillStyle = p.color; ctx.fillRect(-s * 0.5, -s * 0.55, s, s * 0.35);
  },
});
