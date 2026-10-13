import { rgba } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  draft: { // a part drawn on blueprint paper: tinted fill, white outline, hatching and a dimension line
    block(g, s, c) {
      g.fillStyle = rgba(c, 0.62); g.fillRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      g.save(); g.beginPath(); g.rect(s * 0.08, s * 0.08, s * 0.84, s * 0.84); g.clip();
      TEX.draft(g, s, c, seeded(c), 1);
      g.restore();
      g.strokeStyle = '#f4f9ff'; g.lineWidth = Math.max(1, s * 0.04); g.strokeRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      g.strokeStyle = 'rgba(244,249,255,.7)'; g.lineWidth = Math.max(1, s * 0.015);
      g.beginPath(); for (const [x, y] of [[0.08, 0.08], [0.92, 0.08], [0.08, 0.92], [0.92, 0.92]]) { g.moveTo(s * x - s * 0.06, s * y); g.lineTo(s * x + s * 0.06, s * y); g.moveTo(s * x, s * y - s * 0.06); g.lineTo(s * x, s * y + s * 0.06); } g.stroke();
    },
  },
});

Object.assign(TEX, {
  draft(g, s, c, rnd, k) { // 45° hatching, a centre mark and a little dimension line
    g.strokeStyle = `rgba(255,255,255,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.018);
    g.beginPath(); for (let i = -s; i < s; i += s * 0.14) { g.moveTo(i, s); g.lineTo(i + s, 0); } g.stroke();
    g.strokeStyle = `rgba(244,249,255,${0.9 * k})`; g.lineWidth = Math.max(1, s * 0.02); g.setLineDash([s * 0.08, s * 0.04, s * 0.02, s * 0.04]);
    g.beginPath(); g.moveTo(s * 0.5, s * 0.2); g.lineTo(s * 0.5, s * 0.8); g.moveTo(s * 0.2, s * 0.5); g.lineTo(s * 0.8, s * 0.5); g.stroke(); g.setLineDash([]);
    const r = s * (0.12 + rnd() * 0.08);
    g.beginPath(); g.arc(s * 0.5, s * 0.5, r, 0, Math.PI * 2); g.stroke();
  },
});
