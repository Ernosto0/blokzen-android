import { mixHex, shade } from '../../core/color.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

// a cleared line sheds soft wool: fuzzy pom-poms, curled bits of yarn and now and then a small heart
Object.assign(PARTS, {
  wool(p, s, k) {
    const kind = (p.ph * 3 / 6.29) | 0, pop = k > 0.85 ? 1 + (k - 0.85) * 2.5 : 1;
    ctx.rotate(p.rot * 0.4); ctx.scale(pop, pop);
    if (kind === 0) { // pom-pom: a round core with fibres all round
      ctx.strokeStyle = mixHex(p.color, '#ffffff', 0.35); ctx.lineWidth = Math.max(1, s * 0.07); ctx.lineCap = 'round';
      ctx.beginPath(); for (let i = 0; i < 12; i++) { const a = i * 0.524 + p.ph; ctx.moveTo(Math.cos(a) * s * 0.4, Math.sin(a) * s * 0.4); ctx.lineTo(Math.cos(a) * s * 0.72, Math.sin(a) * s * 0.72); } ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2); ctx.fillStyle = shade(p.color, 0.08); ctx.fill();
      ctx.beginPath(); ctx.arc(-s * 0.15, -s * 0.15, s * 0.16, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fill();
    } else if (kind === 1) { // a curl of yarn
      ctx.beginPath(); for (let i = 0; i <= 24; i++) { const a = i * 0.45, r = s * (0.08 + i * 0.026); i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(r, 0); }
      ctx.strokeStyle = shade(p.color, 0.05); ctx.lineWidth = Math.max(1.2, s * 0.17); ctx.lineCap = 'round'; ctx.stroke();
    } else { // a heart
      ctx.beginPath(); ctx.moveTo(0, s * 0.5); ctx.bezierCurveTo(-s * 0.85, -s * 0.05, -s * 0.4, -s * 0.7, 0, -s * 0.2); ctx.bezierCurveTo(s * 0.4, -s * 0.7, s * 0.85, -s * 0.05, 0, s * 0.5);
      ctx.fillStyle = mixHex(p.color, '#ffb4c0', 0.4); ctx.fill();
    }
  },
});
