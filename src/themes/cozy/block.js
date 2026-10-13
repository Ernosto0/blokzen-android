import { mixHex, shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { softGlint, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  knit: { // a plump knitted cushion: soft shadow, rows of stitches, a fuzzy rim and a stitched seam
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.08, s * 0.9, s * 0.88, s * 0.3); g.fillStyle = 'rgba(0,0,0,.28)'; g.fill();
      const gr = g.createRadialGradient(s * 0.36, s * 0.3, s * 0.04, s * 0.5, s * 0.5, s * 0.66);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.34)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.2));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.3); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'knit', 1, 0.06, 0.3);
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.3); g.clip(); // puffy rim: light from above, a darker belly
      g.lineWidth = s * 0.07; g.strokeStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.moveTo(s * 0.1, s * 0.5); g.quadraticCurveTo(s * 0.12, s * 0.08, s * 0.5, s * 0.07); g.quadraticCurveTo(s * 0.88, s * 0.08, s * 0.9, s * 0.4); g.stroke();
      g.strokeStyle = 'rgba(40,16,8,.2)'; g.beginPath(); g.moveTo(s * 0.12, s * 0.7); g.quadraticCurveTo(s * 0.2, s * 0.9, s * 0.5, s * 0.9); g.quadraticCurveTo(s * 0.82, s * 0.9, s * 0.92, s * 0.62); g.stroke();
      g.restore();
      g.setLineDash([s * 0.05, s * 0.05]); g.lineWidth = Math.max(1, s * 0.022); g.lineCap = 'round'; g.strokeStyle = 'rgba(255,248,236,.5)'; // the stitched seam
      rr(g, s * 0.15, s * 0.14, s * 0.7, s * 0.68, s * 0.22); g.stroke(); g.setLineDash([]);
    },
  },
});

Object.assign(TEX, {
  knit(g, s, c, rnd, k) { // rows of V stitches, each a pair of slanted loops, plus a few stray fibres
    const rows = 6, cols = 5, dx = s / cols, dy = s / rows;
    g.lineCap = 'round';
    for (let r = 0; r < rows + 1; r++) for (let q = 0; q < cols + 1; q++) {
      const x = q * dx + (r % 2 ? dx / 2 : 0) - dx * 0.25, y = r * dy - dy * 0.15, j = (rnd() - 0.5) * dx * 0.06;
      for (const sd of [-1, 1]) { // one arm of the V: a dark underside with a lit loop on top
        const x0 = x + sd * dx * 0.04 + j, x1 = x + sd * dx * 0.34 + j;
        g.beginPath(); g.moveTo(x1, y - dy * 0.3); g.quadraticCurveTo(x0 + sd * dx * 0.1, y + dy * 0.15, x0, y + dy * 0.5);
        g.strokeStyle = `rgba(50,20,10,${0.22 * k})`; g.lineWidth = Math.max(1, s * 0.05); g.stroke();
        g.strokeStyle = `rgba(255,248,236,${0.26 * k})`; g.lineWidth = Math.max(1, s * 0.026); g.stroke();
      }
    }
    for (let i = 0; i < 10; i++) { // loose fuzz
      const x = rnd() * s, y = rnd() * s, a = rnd() * 6.28, l = s * (0.03 + rnd() * 0.04);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.strokeStyle = `rgba(255,248,236,${0.32 * k})`; g.lineWidth = Math.max(0.6, s * 0.01); g.stroke();
    }
    softGlint(g, s * 0.34, s * 0.28, s * 0.26, 0.2 * k);
  },
});
