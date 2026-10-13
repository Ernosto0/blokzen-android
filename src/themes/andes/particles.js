import { mixHex } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  wool(p, s) { ctx.fillStyle = mixHex(p.color, '#ffffff', 0.2); for (let i = 0; i < 6; i++) { const an = i * 1.05 + p.ph; ctx.beginPath(); ctx.arc(Math.cos(an) * s * 0.25, Math.sin(an) * s * 0.25, s * 0.28, 0, Math.PI * 2); ctx.fill(); } },
});
