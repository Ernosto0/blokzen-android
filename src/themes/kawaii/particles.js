import { kawaiiChar } from './helpers.js';
import { PARTS } from '../registry.js';
import { ctx } from '../../ui/dom.js';

// confetti of the whole cast: a particle keeps the character it was born with (ph picks it)
Object.assign(PARTS, {
  kawaii(p, s, k) {
    const kind = (p.ph * 7 / 6.29) | 0;
    ctx.rotate(Math.sin(p.life * 4 + p.ph) * 0.35);
    const pop = k > 0.85 ? 1 + (k - 0.85) * 3 : 1; // a quick pop as it appears
    kawaiiChar(ctx, kind, 0, 0, s * 1.4 * pop);
  },
});
