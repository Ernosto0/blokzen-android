import { rgba } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  powder(p, s, k) { const r = p.size * (0.5 + (1 - k) * 1.6), gr = ctx.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, rgba(p.color, 0.7)); gr.addColorStop(1, rgba(p.color, 0)); ctx.fillStyle = gr; ctx.fillRect(-r, -r, 2 * r, 2 * r); },
});
