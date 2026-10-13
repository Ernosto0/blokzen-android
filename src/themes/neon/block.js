import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { TEX } from '../registry.js';

Object.assign(TEX, {
  neon(g, s, c) {
    rr(g, s * 0.22, s * 0.22, s * 0.56, s * 0.56, s * 0.08);
    g.shadowColor = shade(c, 0.4); g.shadowBlur = s * 0.14;
    g.strokeStyle = shade(c, 0.65); g.lineWidth = Math.max(1, s * 0.05); g.stroke(); g.stroke(); g.shadowBlur = 0;
  },
});
