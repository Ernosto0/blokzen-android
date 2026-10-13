import { rr } from '../../render/sprites.js';
import { TEX } from '../registry.js';

Object.assign(TEX, {
  gloss(g, s, c, rnd, k) { g.globalAlpha = 0.45 * k; rr(g, s * 0.2, s * 0.19, s * 0.6, s * 0.11, s * 0.05); g.fillStyle = '#fff'; g.fill(); g.globalAlpha = 1; },
});
