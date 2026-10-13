import { mixHex } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  blob(p, s) {
    const r = s * 0.6, gr = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
    gr.addColorStop(0, mixHex(p.color, '#fff0c0', 0.5)); gr.addColorStop(1, p.color);
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * (1 + 0.2 * Math.sin(p.life * 8 + p.ph)), 0, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
  },
});
