import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  sandstone: { // a chiselled sandstone block: lit top-left edge, shaded bottom-right, layered strata, cracks and pits
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.04, s * 0.94, s * 0.94, s * 0.14); g.fillStyle = shade(c, -0.55); g.fill();
      const gr = g.createLinearGradient(0, 0, s * 0.5, s); gr.addColorStop(0, shade(c, 0.28)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.2));
      rr(g, s * 0.055, s * 0.05, s * 0.89, s * 0.86, s * 0.12); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'sandstone', 1, 0.055, 0.12);
      g.save(); rr(g, s * 0.055, s * 0.05, s * 0.89, s * 0.86, s * 0.12); g.clip(); // bevel: warm light on the top and left edge, shadow on the bottom and right
      g.lineWidth = s * 0.05; g.strokeStyle = 'rgba(255,240,205,.38)'; g.beginPath(); g.moveTo(s * 0.05, s * 0.92); g.lineTo(s * 0.05, s * 0.05); g.lineTo(s * 0.94, s * 0.05); g.stroke();
      g.strokeStyle = 'rgba(70,30,8,.34)'; g.beginPath(); g.moveTo(s * 0.06, s * 0.92); g.lineTo(s * 0.95, s * 0.92); g.lineTo(s * 0.95, s * 0.06); g.stroke();
      g.restore();
    },
  },
});

Object.assign(TEX, {
  sandstone(g, s, c, rnd, k) { // sedimentary layers, a crack, wind-worn pits and loose grains
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let i = 0; i < 5; i++) { // strata: a dark seam with a lit edge just under it, each a little different in length
      const y0 = s * (0.2 + i * 0.16 + rnd() * 0.04), x0 = s * rnd() * 0.25, x1 = s * (0.7 + rnd() * 0.3), ph = rnd() * 6.3, amp = s * (0.012 + rnd() * 0.018);
      const path = dy => { g.beginPath(); for (let j = 0; j <= 10; j++) { const x = x0 + (x1 - x0) * j / 10, y = y0 + dy + Math.sin(x / s * 5 + ph) * amp; j ? g.lineTo(x, y) : g.moveTo(x, y); } };
      path(0); g.strokeStyle = `rgba(80,36,10,${(0.16 + rnd() * 0.14) * k})`; g.lineWidth = Math.max(1, s * (0.016 + rnd() * 0.02)); g.stroke();
      path(s * 0.022); g.strokeStyle = `rgba(255,236,190,${0.22 * k})`; g.lineWidth = Math.max(1, s * 0.012); g.stroke();
    }
    if (rnd() < 0.8) { // a hairline crack with a lit lip
      let x = s * (0.25 + rnd() * 0.5), y = s * 0.08; const pts = [[x, y]];
      while (y < s * (0.55 + rnd() * 0.3)) { x += (rnd() - 0.5) * s * 0.16; y += s * (0.07 + rnd() * 0.06); pts.push([x, y]); }
      const tr = dx => { g.beginPath(); pts.forEach(([px, py], i) => i ? g.lineTo(px + dx, py) : g.moveTo(px + dx, py)); };
      tr(0); g.strokeStyle = `rgba(55,22,6,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.022); g.stroke();
      tr(s * 0.02); g.strokeStyle = `rgba(255,236,190,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.01); g.stroke();
    }
    for (let i = 0; i < 6; i++) { // pits: a dark hollow with a light lower rim
      const x = s * (0.12 + rnd() * 0.76), y = s * (0.12 + rnd() * 0.76), r = s * (0.014 + rnd() * 0.026);
      g.beginPath(); g.ellipse(x, y + r * 0.35, r, r * 0.8, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,236,190,${0.3 * k})`; g.fill();
      g.beginPath(); g.ellipse(x, y, r, r * 0.8, 0, 0, Math.PI * 2); g.fillStyle = `rgba(70,30,8,${0.4 * k})`; g.fill();
    }
    speckle(g, s, rnd, 70, 0.003, 0.009, () => rnd() < 0.5 ? `rgba(255,240,205,${0.34 * k})` : `rgba(80,40,10,${0.3 * k})`);
  },
});
