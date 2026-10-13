import { shade } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  chip(p, s) {
    ctx.rotate(p.rot); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.5, 0.2, 2.6);
    ctx.lineWidth = Math.max(1.5, s * 0.28); ctx.strokeStyle = shade(p.color, 0.15); ctx.stroke();
    ctx.lineWidth = Math.max(1, s * 0.08); ctx.strokeStyle = shade(p.color, -0.25); ctx.stroke();
  },
});
