import { rgba } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  inkwash: { // a square of rice paper soaked with ink in the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.92, s * 0.05); g.fillStyle = 'rgba(0,0,0,.18)'; g.fill();
      rr(g, s * 0.04, s * 0.03, s * 0.92, s * 0.92, s * 0.05); g.fillStyle = '#f4efe2'; g.fill();
      g.save(); g.clip();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, rgba(c, 0.95)); gr.addColorStop(1, rgba(c, 0.62));
      g.fillStyle = gr; g.fillRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      TEX.inkwash(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  inkwash(g, s, c, rnd, k) { // darker pools in the wet ink, dry-brush streaks at the edges, sometimes a red seal
    for (let i = 0; i < 3; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.2 + rnd() * 0.25), gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(10,10,8,${0.22 * k})`); gr.addColorStop(1, 'rgba(10,10,8,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s);
    }
    for (let i = 0; i < 16; i++) {
      const y = rnd() < 0.5 ? s * (0.04 + rnd() * 0.14) : s * (0.82 + rnd() * 0.14);
      g.fillStyle = `rgba(242,236,220,${(0.35 + rnd() * 0.35) * k})`; g.fillRect(s * rnd() * 0.4, y, s * (0.3 + rnd() * 0.6), Math.max(0.6, s * 0.014));
    }
    if (rnd() < 0.45) {
      rr(g, s * 0.66, s * 0.64, s * 0.2, s * 0.2, s * 0.02); g.fillStyle = `rgba(196,42,34,${0.9 * k})`; g.fill();
      g.strokeStyle = `rgba(255,240,230,${0.85 * k})`; g.lineWidth = Math.max(0.8, s * 0.018);
      g.beginPath(); g.moveTo(s * 0.7, s * 0.69); g.lineTo(s * 0.82, s * 0.69); g.moveTo(s * 0.76, s * 0.67); g.lineTo(s * 0.76, s * 0.82); g.moveTo(s * 0.7, s * 0.78); g.lineTo(s * 0.82, s * 0.78); g.stroke();
    }
  },
});
