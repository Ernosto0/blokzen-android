import { mixHex, shade } from '../../core/color.js';
import { poly, rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  cubeface: { // a sticker on the black plastic of a puzzle cube
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.14); g.fillStyle = '#0c0c10'; g.fill();
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.14); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
      const gr = g.createLinearGradient(0, s * 0.1, 0, s * 0.9); gr.addColorStop(0, mixHex(c, '#ffffff', 0.22)); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.12, s * 0.12, s * 0.76, s * 0.76, s * 0.14); g.fillStyle = gr; g.fill();
      g.save(); rr(g, s * 0.12, s * 0.12, s * 0.76, s * 0.76, s * 0.14); g.clip();
      poly(g, [[s * 0.12, s * 0.12], [s * 0.88, s * 0.12], [s * 0.12, s * 0.62]], 'rgba(255,255,255,.18)');
      g.restore();
    },
  },
});

Object.assign(TEX, {
  cubeface(g, s, c, rnd, k) { // the classic tile is cut into a cube face of nine stickers
    g.strokeStyle = `rgba(0,0,0,${0.4 * k})`; g.lineWidth = Math.max(1, s * 0.035);
    g.beginPath(); for (const v of [1 / 3, 2 / 3]) { g.moveTo(s * v, s * 0.1); g.lineTo(s * v, s * 0.9); g.moveTo(s * 0.1, s * v); g.lineTo(s * 0.9, s * v); } g.stroke();
  },
});
