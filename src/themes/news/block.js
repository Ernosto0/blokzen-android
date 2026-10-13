import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  news: { // a colour panel printed on newsprint
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.06, s * 0.92, s * 0.9, s * 0.04); g.fillStyle = 'rgba(0,0,0,.18)'; g.fill();
      rr(g, s * 0.04, s * 0.03, s * 0.92, s * 0.9, s * 0.04); g.fillStyle = '#f4efe2'; g.fill();
      g.save(); rr(g, s * 0.1, s * 0.09, s * 0.8, s * 0.78, s * 0.02); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s);
      TEX.news(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  news(g, s, c, rnd, k) { // halftone dots growing toward one corner, a headline and a column of text
    const step = s / 9;
    g.save(); g.globalAlpha = 0.35 * k; g.fillStyle = shade(c, -0.5);
    for (let y = 0, row = 0; y < s + step; y += step, row++) for (let x = (row % 2) * step / 2; x < s + step; x += step) {
      g.beginPath(); g.arc(x, y, step * (0.08 + 0.32 * (x + y) / (2 * s)), 0, Math.PI * 2); g.fill();
    }
    g.restore();
    g.fillStyle = `rgba(20,18,14,${0.55 * k})`; g.fillRect(s * 0.16, s * 0.16, s * (0.42 + rnd() * 0.2), s * 0.08);
    g.fillStyle = `rgba(20,18,14,${0.28 * k})`;
    for (let i = 0; i < 4; i++) g.fillRect(s * 0.16, s * (0.34 + i * 0.12), s * (i === 3 ? 0.36 : 0.6 - rnd() * 0.1), Math.max(1, s * 0.035));
  },
});
