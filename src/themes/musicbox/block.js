import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { noteShape } from './helpers.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  lacquer: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.14);
      const gl = g.createLinearGradient(0, 0, s, s); gl.addColorStop(0, '#f6e08a'); gl.addColorStop(0.5, '#b8902c'); gl.addColorStop(1, '#e8c860');
      g.fillStyle = gl; g.fill();
      rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.82, s * 0.1);
      const gr = g.createRadialGradient(s * 0.38, s * 0.3, s * 0.04, s * 0.5, s * 0.55, s * 0.65);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.25)); gr.addColorStop(0.5, c); gr.addColorStop(1, shade(c, -0.45));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.lacquer(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  lacquer(g, s, c, rnd, k) { // glossy shine, a gold note and a gold inner line
    g.beginPath(); g.ellipse(s * 0.38, s * 0.2, s * 0.26, s * 0.06, -0.2, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.35 * k})`; g.fill();
    g.fillStyle = `rgba(255,214,110,${0.75 * k})`; noteShape(g, s * 0.5, s * 0.52, s * 0.26);
    rr(g, s * 0.16, s * 0.16, s * 0.68, s * 0.68, s * 0.06); g.strokeStyle = `rgba(255,214,110,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
  },
});
