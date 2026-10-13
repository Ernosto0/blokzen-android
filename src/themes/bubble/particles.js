import { seaChar } from './helpers.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

// a cleared line floats up as soap bubbles; every third one carries a creature
Object.assign(PARTS, {
  bubble(p, s, k) {
    const kind = (p.ph * 7 / 6.29) | 0;
    const r = s * 0.7 * (k > 0.85 ? 1 + (k - 0.85) * 2 : 1);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(190,235,255,.35)'; ctx.fill();
    ctx.lineWidth = Math.max(1, r * 0.12); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.35, r * 0.2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
    if (kind % 3 === 0) seaChar(ctx, kind, 0, 0, r * 0.6);
  },
});
