import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { poly, rr } from '../../render/sprites.js';
import { speckle } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  vitray: { // glass lit from behind, held in lead
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.08); g.fillStyle = '#18141e'; g.fill();
      g.save(); rr(g, s * 0.08, s * 0.08, s * 0.84, s * 0.84, s * 0.05); g.clip();
      const gr = g.createRadialGradient(s * 0.45, s * 0.4, s * 0.02, s * 0.5, s * 0.5, s * 0.62);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.45)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.35));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      TEX.vitray(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  vitray(g, s, c, rnd, k) { // facets meeting near the middle, each a slightly different shade, held by lead lines
    const cx = s * (0.38 + rnd() * 0.24), cy = s * (0.38 + rnd() * 0.24);
    const E = [[rnd() * s, 0], [s, rnd() * s], [rnd() * s, s], [0, rnd() * s]], C = [[s, 0], [s, s], [0, s], [0, 0]];
    for (let i = 0; i < 4; i++) {
      poly(g, [[cx, cy], E[i], C[i], E[(i + 1) % 4]], i % 2 ? `rgba(255,255,255,${0.14 * k})` : `rgba(0,0,0,${0.16 * k})`);
    }
    speckle(g, s, rnd, 14, 0.006, 0.014, () => `rgba(255,255,255,${0.35 * k})`);
    g.strokeStyle = `rgba(22,18,28,${0.92 * k})`; g.lineWidth = Math.max(1.5, s * 0.055); g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); for (const [x, y] of E) { g.moveTo(cx, cy); g.lineTo(x, y); } g.stroke();
    g.strokeStyle = `rgba(255,255,255,${0.2 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    g.beginPath(); for (const [x, y] of E) { g.moveTo(cx + 1.5, cy + 1.5); g.lineTo(x + 1.5, y + 1.5); } g.stroke();
  },
});
