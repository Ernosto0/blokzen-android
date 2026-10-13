import { softGlint } from '../../render/textures.js';
import { TEX } from '../registry.js';

Object.assign(TEX, {
  jelly(g, s, c, rnd, k) {
    g.save(); g.translate(s * 0.4, s * 0.33); g.rotate(-0.45);
    g.beginPath(); g.ellipse(0, 0, s * 0.17, s * 0.07, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.55 * k})`; g.fill(); g.restore();
    softGlint(g, s * 0.68, s * 0.68, s * 0.12, 0.25 * k);
  },
});
