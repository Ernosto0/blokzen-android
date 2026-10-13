import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

Object.assign(PARTS, {
  cipherchar(p, s) { // a typed letter flying off the tape
    ctx.rotate(p.rot * 0.5); rr(ctx, -s * 0.45, -s * 0.5, s * 0.9, s, s * 0.1); ctx.fillStyle = '#f4efe0'; ctx.fill();
    ctx.font = `800 ${s * 0.8}px "Baloo 2", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = shade(p.color, -0.35);
    ctx.fillText('XKQZRVJ'[(p.ph * 7 | 0) % 7], 0, s * 0.06);
  },
});
