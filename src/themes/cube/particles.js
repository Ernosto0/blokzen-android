import { rr } from '../../render/sprites.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  sticker(p, s) { ctx.rotate(p.rot); ctx.scale(1, 0.3 + 0.7 * Math.abs(Math.cos(p.life * 7 + p.ph))); rr(ctx, -s * 0.5, -s * 0.5, s, s, s * 0.18); ctx.fillStyle = '#0c0c10'; ctx.fill(); rr(ctx, -s * 0.38, -s * 0.38, s * 0.76, s * 0.76, s * 0.14); ctx.fillStyle = p.color; ctx.fill(); },
});
