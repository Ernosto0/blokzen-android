import { mixHex } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { poly, rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  leaflet: { // a tear-off calendar leaf: coloured header with binder holes, perforation, curled corner
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.07, s * 0.9, s * 0.88, s * 0.08); g.fillStyle = 'rgba(0,0,0,.28)'; g.fill();
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.08); g.fillStyle = mixHex(c, '#ffffff', 0.8); g.fill();
      g.save(); rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.08); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s * 0.34);
      TEX.leaflet(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  leaflet(g, s, c, rnd, k) { // binder holes, a perforated tear line, a couple of pencil notes, a curled corner
    g.fillStyle = `rgba(0,0,0,${0.38 * k})`;
    for (const x of [0.3, 0.7]) { g.beginPath(); g.arc(s * x, s * 0.15, s * 0.045, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = `rgba(255,255,255,${0.75 * k})`; g.lineWidth = Math.max(1, s * 0.022); g.setLineDash([s * 0.04, s * 0.035]);
    g.beginPath(); g.moveTo(0, s * 0.34); g.lineTo(s, s * 0.34); g.stroke(); g.setLineDash([]);
    g.fillStyle = `rgba(40,40,60,${0.16 * k})`;
    g.fillRect(s * 0.16, s * 0.5, s * (0.5 + rnd() * 0.15), Math.max(1, s * 0.03));
    g.fillRect(s * 0.16, s * 0.62, s * (0.3 + rnd() * 0.15), Math.max(1, s * 0.03));
    const q = s * 0.22;
    poly(g, [[s - q, s], [s, s - q], [s, s]], `rgba(0,0,0,${0.3 * k})`);
    poly(g, [[s - q, s], [s, s - q], [s - q * 0.95, s - q * 0.95]], `rgba(255,255,255,${0.6 * k})`);
  },
});
