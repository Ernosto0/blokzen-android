import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  metal: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.07); g.fillStyle = shade(c, -0.5); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.06); g.fillStyle = c; g.fill();
      g.save(); g.clip(); TEX.metal(g, s, c, seeded(c), 1);
      g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(0, 0, s, s * 0.07); g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(0, s * 0.84, s, s * 0.16);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  metal(g, s, c, rnd, k) { // brushed plate with four slotted screws
    for (let y = 0; y < s; y += Math.max(1, s / 36)) {
      g.fillStyle = rnd() < 0.5 ? `rgba(255,255,255,${(0.03 + rnd() * 0.08) * k})` : `rgba(0,0,0,${(0.03 + rnd() * 0.08) * k})`;
      g.fillRect(0, y, s, Math.max(0.6, s / 72));
    }
    for (const [x, y] of [[0.16, 0.16], [0.84, 0.16], [0.16, 0.8], [0.84, 0.8]]) {
      g.beginPath(); g.arc(s * x, s * y, s * 0.07, 0, Math.PI * 2); g.fillStyle = `rgba(30,34,40,${0.45 * k})`; g.fill();
      g.beginPath(); g.arc(s * x - s * 0.01, s * y - s * 0.01, s * 0.052, 0, Math.PI * 2); g.fillStyle = `rgba(230,236,242,${0.6 * k})`; g.fill();
      g.save(); g.translate(s * x - s * 0.01, s * y - s * 0.01); g.rotate(0.7 + rnd()); g.fillStyle = `rgba(30,34,40,${0.6 * k})`; g.fillRect(-s * 0.042, -s * 0.009, s * 0.084, s * 0.018); g.restore();
    }
  },
});
