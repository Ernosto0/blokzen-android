import { mixHex, rgba, shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { PARTS } from '../registry.js';
import { mapleShape } from './shapes.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  shard(p, s) {
    ctx.rotate(p.rot);
    ctx.beginPath(); ctx.moveTo(0, -s * 0.8); ctx.lineTo(s * 0.45, s * 0.4); ctx.lineTo(-s * 0.3, s * 0.55); ctx.closePath();
    ctx.fillStyle = rgba(p.color, 0.5); ctx.fill(); ctx.lineWidth = Math.max(1, s * 0.08); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.stroke();
  },
  crumb(p, s) {
    ctx.rotate(p.rot);
    ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.3); ctx.lineTo(s * 0.35, -s * 0.4); ctx.lineTo(s * 0.45, s * 0.25); ctx.lineTo(-s * 0.2, s * 0.42); ctx.closePath();
    ctx.fillStyle = shade(p.color, -0.1); ctx.fill();
    ctx.fillStyle = 'rgba(255,220,190,.35)'; ctx.fillRect(-s * 0.3, -s * 0.3, s * 0.3, s * 0.15);
  },
  ring(p, s, k) {
    const r = p.size * (0.4 + (1 - k) * 1.8);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.lineWidth = Math.max(1, p.size * 0.2 * k); ctx.strokeStyle = shade(p.color, 0.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(-r * 0.4, -r * 0.4, Math.max(0.8, r * 0.12), 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill();
  },
  grain(p, s) {
    ctx.fillStyle = shade(p.color, 0.1);
    for (const [x, y, r] of [[0, 0, 0.22], [0.35, 0.2, 0.15], [-0.3, 0.25, 0.13], [0.1, -0.35, 0.12]]) { ctx.beginPath(); ctx.arc(x * s, y * s, Math.max(0.8, r * s), 0, Math.PI * 2); ctx.fill(); }
  },
  tile(p, s) {
    ctx.rotate(p.rot); rr(ctx, -s * 0.45, -s * 0.45, s * 0.9, s * 0.9, s * 0.12); ctx.fillStyle = '#f4f8ff'; ctx.fill();
    ctx.lineWidth = Math.max(1, s * 0.12); ctx.strokeStyle = p.color; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
  },
  leaf(p, s) { ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.4 + 0.6 * Math.abs(Math.sin(p.life * 5 + p.ph))); mapleShape(ctx, 0, 0, s * 0.7, 0); ctx.fillStyle = shade(p.color, 0.05); ctx.fill(); },
  puff(p, s, k) {
    const r = p.size * (0.4 + (1 - k) * 1.2); ctx.fillStyle = mixHex(p.color, '#ffffff', 0.6);
    ctx.beginPath(); for (const [x, y, q] of [[-0.5, 0.1, 0.6], [0, -0.2, 0.8], [0.5, 0.1, 0.6]]) { ctx.moveTo(x * r + q * r, y * r); ctx.arc(x * r, y * r, q * r, 0, Math.PI * 2); } ctx.fill();
  },
});
