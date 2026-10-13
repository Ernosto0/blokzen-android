import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  rangoli: { // a soft mound of coloured powder with a flower laid out in white dots
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.22); g.fillStyle = shade(c, -0.3); g.fill();
      const gr = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.03, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, shade(c, 0.25)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.1));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.2); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'rangoli', 1, 0.07, 0.2);
    },
  },
});

Object.assign(TEX, {
  rangoli(g, s, c, rnd, k) { // powder grain and a flower of eight petals drawn in dotted white lines
    speckle(g, s, rnd, 50, 0.003, 0.009, () => rnd() < 0.5 ? `rgba(255,255,255,${0.22 * k})` : `rgba(0,0,0,${0.18 * k})`);
    const cx = s / 2, cy = s / 2;
    g.save(); g.lineCap = 'round'; g.setLineDash([0.1, s * 0.05]); g.lineWidth = Math.max(1.2, s * 0.035); g.strokeStyle = `rgba(255,250,235,${0.9 * k})`;
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; g.beginPath(); g.ellipse(cx + Math.cos(an) * s * 0.2, cy + Math.sin(an) * s * 0.2, s * 0.12, s * 0.055, an, 0, Math.PI * 2); g.stroke(); }
    g.beginPath(); g.arc(cx, cy, s * 0.4, 0, Math.PI * 2); g.stroke();
    g.restore();
    g.beginPath(); g.arc(cx, cy, s * 0.07, 0, Math.PI * 2); g.fillStyle = `rgba(255,250,235,${0.95 * k})`; g.fill();
  },
});
