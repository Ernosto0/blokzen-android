import { mixHex } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  inkdrop(p, s) {
    ctx.fillStyle = mixHex(p.color, '#141210', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 4; i++) { const an = p.ph + i * 1.7, d = s * (i % 2 ? 0.8 : 0.62); ctx.beginPath(); ctx.arc(Math.cos(an) * d, Math.sin(an) * d, s * 0.1, 0, Math.PI * 2); ctx.fill(); }
  },
});
