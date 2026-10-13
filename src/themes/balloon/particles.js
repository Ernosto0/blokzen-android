import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  balloon(p, s) {
    const r = s * 0.5;
    ctx.beginPath(); ctx.arc(0, -r * 0.2, r, Math.PI * 0.85, Math.PI * 0.15); ctx.lineTo(0, r * 1.1); ctx.closePath(); ctx.fillStyle = p.color; ctx.fill();
    ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.5, r * 0.25, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fill();
    ctx.fillStyle = '#6a4020'; ctx.fillRect(-r * 0.18, r * 1.25, r * 0.36, r * 0.3);
  },
});
