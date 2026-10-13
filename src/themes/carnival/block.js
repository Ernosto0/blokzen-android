import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  marquee: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.5); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.1); g.fillStyle = shade(c, -0.2); g.fill();
      const gr = g.createLinearGradient(0, s * 0.2, 0, s * 0.8); gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, c);
      rr(g, s * 0.21, s * 0.2, s * 0.58, s * 0.56, s * 0.06); g.fillStyle = gr; g.fill();
      TEX.marquee(g, s, c, seeded(c), 1);
    },
  },
});

Object.assign(TEX, {
  marquee(g, s, c, rnd, k) { // a ring of light bulbs, every other one lit
    const P = [0.13, 0.37, 0.63, 0.87], pts = [];
    for (const v of P) pts.push([v, 0.13]); for (const v of P.slice(1)) pts.push([0.87, v]);
    for (const v of P.slice(0, 3).reverse()) pts.push([v, 0.87]); for (const v of [0.63, 0.37]) pts.push([0.13, v]);
    const r = s * 0.045;
    pts.forEach(([x, y], i) => {
      const lit = i % 2 === 0;
      if (lit) { const gl = g.createRadialGradient(s * x, s * y, 0, s * x, s * y, r * 2.6); gl.addColorStop(0, `rgba(255,240,170,${0.7 * k})`); gl.addColorStop(1, 'rgba(255,240,170,0)'); g.fillStyle = gl; g.fillRect(s * x - r * 2.6, s * y - r * 2.6, r * 5.2, r * 5.2); }
      g.beginPath(); g.arc(s * x, s * y, r, 0, Math.PI * 2); g.fillStyle = lit ? `rgba(255,250,215,${k})` : `rgba(255,240,200,${0.35 * k})`; g.fill();
    });
    g.beginPath(); g.ellipse(s * 0.4, s * 0.3, s * 0.14, s * 0.04, -0.2, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.35 * k})`; g.fill();
  },
});
