import { rr } from '../../render/sprites.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  bone(p, s) {
    ctx.rotate(p.rot); rr(ctx, -s * 0.32, -s * 0.6, s * 0.64, s * 1.2, s * 0.12); ctx.fillStyle = '#f8f1e2'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = Math.max(1, s * 0.05); ctx.stroke();
    ctx.fillStyle = 'rgba(60,40,30,.5)'; ctx.fillRect(-s * 0.22, -s * 0.02, s * 0.44, Math.max(1, s * 0.04));
    ctx.fillStyle = p.color; for (const y of [-0.3, 0.3]) { ctx.beginPath(); ctx.arc(0, y * s, s * 0.09, 0, Math.PI * 2); ctx.fill(); }
  },
});
