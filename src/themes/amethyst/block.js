import { shade } from '../../core/color.js';
import { poly, rr } from '../../render/sprites.js';
import { softGlint, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  crystal: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.45); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.1); g.fillStyle = c; g.fill();
      texIn(g, s, c, 'crystal', 1, 0.07, 0.1);
    },
  },
});

Object.assign(TEX, {
  crystal(g, s, c, rnd, k) { // amethyst cut into irregular facets
    const edge = () => (rnd() < 0.5 ? rnd() * 0.15 : 0.85 + rnd() * 0.15); // facets fan out from near a corner, not the middle
    const cx = s * edge(), cy = s * edge(), pts = [];
    for (let i = 0; i < 8; i++) { const an = (i + rnd() * 0.6) / 8 * Math.PI * 2; pts.push([cx + Math.cos(an) * s, cy + Math.sin(an) * s]); }
    pts.forEach((p, i) => {
      const a = (0.08 + rnd() * 0.25) * k;
      poly(g, [[cx, cy], p, pts[(i + 1) % 8]], i % 2 ? `rgba(255,255,255,${a})` : `rgba(20,0,40,${a})`);
    });
    g.strokeStyle = `rgba(255,240,255,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    for (const p of pts) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(...p); g.stroke(); }
    softGlint(g, cx, cy, s * 0.18, 0.5 * k);
  },
});
