import { mixHex, shade } from '../../core/color.js';
import { poly } from '../../render/sprites.js';
import { texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  paper: {
    block(g, s, c) {
      const o = s * 0.06, e = s * 0.94;
      g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(o + s * 0.02, o + s * 0.03, e - o, e - o);
      poly(g, [[o, o], [e, o], [o, e]], mixHex(c, '#ffffff', 0.14));
      poly(g, [[e, o], [e, e], [o, e]], shade(c, -0.1));
      texIn(g, s, c, 'paper', 1, 0.06, 0);
    },
  },
});

Object.assign(TEX, {
  paper(g, s, c, rnd, k) { // paper fibres and a crease with a light and a dark side
    g.lineCap = 'round';
    for (let i = 0; i < 50; i++) {
      const x = rnd() * s, y = rnd() * s, an = rnd() * Math.PI, L = s * (0.02 + rnd() * 0.06);
      g.strokeStyle = rnd() < 0.5 ? `rgba(255,255,255,${0.18 * k})` : `rgba(0,0,0,${0.07 * k})`; g.lineWidth = Math.max(0.6, s * 0.008);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * L, y + Math.sin(an) * L); g.stroke();
    }
    const y0 = s * (0.2 + rnd() * 0.6), y1 = s * (0.2 + rnd() * 0.6), d = Math.max(1, s * 0.012);
    g.lineWidth = Math.max(1, s * 0.014);
    g.strokeStyle = `rgba(255,255,255,${0.5 * k})`; g.beginPath(); g.moveTo(0, y0); g.lineTo(s, y1); g.stroke();
    g.strokeStyle = `rgba(0,0,0,${0.16 * k})`; g.beginPath(); g.moveTo(0, y0 + d); g.lineTo(s, y1 + d); g.stroke();
  },
});
