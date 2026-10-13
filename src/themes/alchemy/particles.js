import { mixHex } from '../../core/color.js';
import { alchemySign } from './helpers.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  rune(p, s) { ctx.rotate(Math.sin(p.life * 3 + p.ph) * 0.4); ctx.strokeStyle = mixHex(p.color, '#ffffff', 0.45); ctx.lineWidth = Math.max(1.2, s * 0.14); ctx.lineJoin = 'round'; alchemySign(ctx, (p.ph * 7 | 0) % 7, 0, 0, s * 0.6); },
});
