import { mixHex, rgba, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  lunar: { // a little moon in its phase, on a night tile
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.2); g.fillStyle = mixHex(c, '#08101e', 0.78); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.38, s * 0.02, s * 0.5, s * 0.5, s * 0.42);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.5)); gr.addColorStop(1, shade(c, -0.15));
      g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      g.save(); g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 0, Math.PI * 2); g.clip(); TEX.lunar(g, s, c, seeded(c), 1); g.restore();
      g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 0, Math.PI * 2); g.strokeStyle = rgba(c, 0.35); g.lineWidth = Math.max(1, s * 0.03); g.stroke();
    },
  },
});

Object.assign(TEX, {
  lunar(g, s, c, rnd, k) { // craters with a lit rim and the shadow of the phase sliding across
    for (let i = 0; i < 5; i++) {
      const x = s * (0.25 + rnd() * 0.5), y = s * (0.25 + rnd() * 0.5), r = s * (0.03 + rnd() * 0.05);
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = `rgba(0,0,0,${0.16 * k})`; g.fill();
      g.beginPath(); g.arc(x + r * 0.2, y + r * 0.2, r * 0.85, Math.PI * 0.1, Math.PI * 1.1); g.strokeStyle = `rgba(255,255,255,${0.35 * k})`; g.lineWidth = Math.max(0.8, s * 0.012); g.stroke();
    }
    const ph = 0.25 + rnd() * 0.6, dir = rnd() < 0.5 ? -1 : 1;
    g.beginPath(); g.arc(s * 0.5 + dir * s * 0.72 * ph, s * 0.5, s * 0.4, 0, Math.PI * 2); g.fillStyle = `rgba(8,14,30,${0.55 * k})`; g.fill();
  },
});
