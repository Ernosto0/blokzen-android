import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { poly } from '../../render/sprites.js';
import { softGlint } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';
import { tanSquare } from './helpers.js';

Object.assign(STYLES, {
  tangram: { // flat lacquered wood cut into tangram triangles
    block(g, s, c) {
      const rnd = seeded(c), o = s * 0.05, w = s * 0.9, r = rnd();
      g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(o + s * 0.025, o + s * 0.035, w, w);
      tanSquare(g, o, o, w, c, mixHex(c, '#ffffff', 0.26), shade(c, -0.14), r < 0.34 ? 4 : r < 0.67 ? 1 : 2);
      g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = Math.max(1, s * 0.02); g.strokeRect(o, o, w, w);
      softGlint(g, s * 0.3, s * 0.26, s * 0.22, 0.35);
    },
  },
});

Object.assign(TEX, {
  tangram(g, s, c, rnd, k) {
    const one = rnd() < 0.5;
    poly(g, one ? [[0, 0], [s, 0], [0, s]] : [[0, 0], [s, 0], [s, s]], `rgba(255,255,255,${0.22 * k})`);
    g.strokeStyle = `rgba(255,250,240,${0.7 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.beginPath();
    if (one) { g.moveTo(s, 0); g.lineTo(0, s); } else { g.moveTo(0, 0); g.lineTo(s, s); } g.stroke();
  },
});
