import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  tiki: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.14); g.fillStyle = shade(c, -0.35); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.12); g.fillStyle = c; g.fill();
      g.save(); g.clip(); TEX.tiki(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  tiki(g, s, c, rnd, k) { // two bamboo stalks side by side: round shading, fibres, a node each
    const sw = s / 2;
    for (let i = 0; i < 2; i++) {
      const x = i * sw, gr = g.createLinearGradient(x, 0, x + sw, 0);
      gr.addColorStop(0, `rgba(0,0,0,${0.22 * k})`); gr.addColorStop(0.35, `rgba(255,255,230,${0.22 * k})`); gr.addColorStop(1, `rgba(0,0,0,${0.25 * k})`);
      g.fillStyle = gr; g.fillRect(x, 0, sw, s);
      const ny = s * (0.3 + rnd() * 0.4);
      g.fillStyle = `rgba(60,30,0,${0.35 * k})`; g.fillRect(x, ny, sw, Math.max(1, s * 0.035));
      g.fillStyle = `rgba(255,250,220,${0.35 * k})`; g.fillRect(x, ny + s * 0.035, sw, Math.max(1, s * 0.02));
      g.strokeStyle = `rgba(60,30,0,${0.12 * k})`; g.lineWidth = Math.max(0.6, s * 0.008);
      for (let f = 0; f < 3; f++) { const fx = x + sw * (0.25 + f * 0.25); g.beginPath(); g.moveTo(fx, 0); g.lineTo(fx, s); g.stroke(); }
    }
  },
});
