import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  envelope: { // a cream envelope closed with a wax seal in the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.08, s * 0.92, s * 0.86, s * 0.06); g.fillStyle = 'rgba(0,0,0,.3)'; g.fill();
      rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.86, s * 0.06); g.fillStyle = mixHex(c, '#f6ecd8', 0.84); g.fill();
      g.save(); rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.86, s * 0.06); g.clip(); TEX.envelope(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  envelope(g, s, c, rnd, k) { // the folds of the envelope and a round wax seal with a pressed flower
    g.lineWidth = Math.max(1, s * 0.02); g.lineJoin = 'round';
    g.strokeStyle = `rgba(110,80,50,${0.38 * k})`;
    g.beginPath(); g.moveTo(0, s * 0.06); g.lineTo(s * 0.5, s * 0.52); g.lineTo(s, s * 0.06); g.stroke();
    g.strokeStyle = `rgba(110,80,50,${0.2 * k})`;
    g.beginPath(); g.moveTo(0, s * 0.95); g.lineTo(s * 0.4, s * 0.58); g.moveTo(s, s * 0.95); g.lineTo(s * 0.6, s * 0.58); g.stroke();
    const cx = s * 0.5, cy = s * 0.52, r = s * 0.17, wax = shade(c, -0.12);
    g.fillStyle = wax;
    for (let i = 0; i < 7; i++) { const an = i / 7 * Math.PI * 2 + rnd() * 0.4; g.beginPath(); g.arc(cx + Math.cos(an) * r * 0.95, cy + Math.sin(an) * r * 0.95, r * (0.22 + rnd() * 0.12), 0, Math.PI * 2); g.fill(); }
    const gr = g.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx, cy, r * 1.1); gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, shade(c, -0.25));
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    g.beginPath(); g.arc(cx, cy, r * 0.72, 0, Math.PI * 2); g.strokeStyle = shade(c, -0.4); g.lineWidth = Math.max(1, s * 0.015); g.stroke();
    g.fillStyle = shade(c, 0.35);
    for (let i = 0; i < 5; i++) { const an = i / 5 * Math.PI * 2; g.beginPath(); g.arc(cx + Math.cos(an) * r * 0.3, cy + Math.sin(an) * r * 0.3, r * 0.16, 0, Math.PI * 2); g.fill(); }
  },
});
