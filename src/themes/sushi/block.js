import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  sushi: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.06, s * 0.92, s * 0.9, s * 0.24); g.fillStyle = '#c9bca8'; g.fill();
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.24); g.fillStyle = '#f7f2ea'; g.fill();
      g.save(); g.clip();
      const rnd = seeded(c);
      g.strokeStyle = 'rgba(170,158,136,.55)'; g.lineWidth = Math.max(0.6, s * 0.01);
      for (let i = 0; i < 34; i++) { g.save(); g.translate(rnd() * s, rnd() * s); g.rotate(rnd() * 3.14); g.beginPath(); g.ellipse(0, 0, s * 0.035, s * 0.016, 0, 0, Math.PI * 2); g.stroke(); g.restore(); }
      g.restore();
      rr(g, s * 0.13, s * 0.12, s * 0.74, s * 0.7, s * 0.2);
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.25)); gr.addColorStop(0.5, c); gr.addColorStop(1, shade(c, -0.15));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.sushi(g, s, c, seeded(c), 1); g.restore();
      if (rnd() < 0.45) { // a strip of nori round the middle
        g.fillStyle = '#1c281e'; g.fillRect(s * 0.42, s * 0.05, s * 0.16, s * 0.87);
        g.fillStyle = 'rgba(120,150,110,.25)'; for (let y = s * 0.1; y < s * 0.9; y += s * 0.08) g.fillRect(s * 0.42, y, s * 0.16, Math.max(0.6, s * 0.01));
      }
    },
  },
});

Object.assign(TEX, {
  sushi(g, s, c, rnd, k) { // the white lines of fat running through raw fish, a glaze
    g.strokeStyle = `rgba(255,255,255,${0.45 * k})`; g.lineWidth = Math.max(1, s * 0.035); g.lineCap = 'round';
    for (let i = -2; i <= 3; i++) { const x = s * (i * 0.2 + rnd() * 0.05); g.beginPath(); g.moveTo(x, s); g.quadraticCurveTo(x + s * 0.25, s * 0.5, x + s * 0.45, 0); g.stroke(); }
    g.beginPath(); g.ellipse(s * 0.36, s * 0.26, s * 0.2, s * 0.05, -0.4, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.3 * k})`; g.fill();
  },
});
