import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { speckle } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';
import { carved } from '../shared/shapes.js';

Object.assign(STYLES, {
  fossil: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = shade(c, -0.45); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.08); g.fillStyle = c; g.fill();
      g.save(); g.clip(); TEX.fossil(g, s, c, seeded(c), 1); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(0, 0, s, s * 0.08); g.restore();
    },
  },
});

Object.assign(TEX, {
  fossil(g, s, c, rnd, k) { // rock strata with an ammonite or a bone pressed into it
    for (let i = 0; i < 4; i++) {
      const y = s * (0.15 + i * 0.24 + rnd() * 0.05);
      g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(s * 0.3, y + (rnd() - 0.5) * s * 0.1, s * 0.6, y + (rnd() - 0.5) * s * 0.1, s, y);
      g.lineTo(s, y + s * 0.07); g.lineTo(0, y + s * 0.07); g.closePath();
      g.fillStyle = i % 2 ? `rgba(0,0,0,${0.1 * k})` : `rgba(255,240,210,${0.1 * k})`; g.fill();
    }
    speckle(g, s, rnd, 24, 0.004, 0.01, () => `rgba(40,20,0,${0.2 * k})`);
    const kind = rnd() < 0.6 ? 0 : 1, rot = rnd() * 6.3;
    const shape = () => {
      g.beginPath();
      if (kind === 0) {
        for (let an = 0; an < Math.PI * 5; an += 0.2) { const r = s * 0.27 * Math.exp(-0.17 * an), x = Math.cos(an + rot) * r, y = Math.sin(an + rot) * r; an ? g.lineTo(s * 0.5 + x, s * 0.52 + y) : g.moveTo(s * 0.5 + x, s * 0.52 + y); }
        for (let an = 0; an < Math.PI * 2; an += 0.45) { const r = s * 0.27 * Math.exp(-0.17 * an), cx = Math.cos(an + rot), cy = Math.sin(an + rot); g.moveTo(s * 0.5 + cx * r, s * 0.52 + cy * r); g.lineTo(s * 0.5 + cx * r * 0.72, s * 0.52 + cy * r * 0.72); }
      } else {
        const L = s * 0.24, kr = s * 0.05, ca = Math.cos(rot), sa = Math.sin(rot), P = (x, y) => [s * 0.5 + x * ca - y * sa, s * 0.52 + x * sa + y * ca];
        g.moveTo(...P(-L, 0)); g.lineTo(...P(L, 0));
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const [x, y] = P(sx * L, sy * kr * 0.8); g.moveTo(x + kr, y); g.arc(x, y, kr, 0, Math.PI * 2); }
      }
    };
    carved(g, shape, Math.max(1, s * 0.03), `rgba(255,245,220,${0.45 * k})`, `rgba(50,30,15,${0.55 * k})`);
  },
});
