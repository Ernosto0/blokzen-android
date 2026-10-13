import { mixHex } from '../../core/color.js';
import { chessPiece } from './helpers.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  chessman(p, s) { ctx.rotate(p.rot * 0.4); ctx.fillStyle = 'rgba(0,0,0,.35)'; chessPiece(ctx, (p.ph * 6 | 0) % 6, s * 0.06, s * 0.08, s * 1.3); ctx.fillStyle = mixHex(p.color, '#ffffff', 0.15); chessPiece(ctx, (p.ph * 6 | 0) % 6, 0, 0, s * 1.3); },
});
