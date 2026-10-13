import { mixHex, shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { speckle, texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  gelato: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.06, s * 0.9, s * 0.88, s * 0.3); g.fillStyle = shade(c, -0.2); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.32, s * 0.05, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.45)); gr.addColorStop(0.65, c); gr.addColorStop(1, shade(c, -0.06));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.84, s * 0.3); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'gelato', 1, 0.06, 0.3);
    },
  },
});

Object.assign(TEX, {
  gelato(g, s, c, rnd, k) { // ridges left by the spatula, flecks of vanilla or nut, a creamy shine
    g.lineCap = 'round'; g.lineWidth = Math.max(1, s * 0.03);
    for (let i = 0; i < 3; i++) {
      const y = s * (0.3 + i * 0.2 + rnd() * 0.04);
      const ridge = dy => { g.beginPath(); g.moveTo(s * 0.12, y + s * 0.04 + dy); g.quadraticCurveTo(s * 0.5, y - s * 0.12 + dy, s * 0.88, y + s * 0.02 + dy); };
      ridge(s * 0.035); g.strokeStyle = `rgba(0,0,0,${0.08 * k})`; g.stroke();
      ridge(0); g.strokeStyle = `rgba(255,255,255,${0.4 * k})`; g.stroke();
    }
    speckle(g, s, rnd, 14, 0.006, 0.012, () => `rgba(80,40,20,${0.35 * k})`);
    g.beginPath(); g.ellipse(s * 0.34, s * 0.22, s * 0.16, s * 0.05, -0.4, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.4 * k})`; g.fill();
  },
});
