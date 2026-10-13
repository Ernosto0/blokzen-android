import { mixHex, rgba } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr, sparkle } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  cometcore: { // an icy core racing up the tile with its tail behind it
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.18); g.fillStyle = mixHex(c, '#04061a', 0.82); g.fill();
      g.save(); rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.18); g.clip();
      const neb = g.createRadialGradient(s * 0.62, s * 0.38, 0, s * 0.5, s * 0.5, s * 0.7); neb.addColorStop(0, rgba(c, 0.45)); neb.addColorStop(1, rgba(c, 0.05));
      g.fillStyle = neb; g.fillRect(0, 0, s, s);
      TEX.cometcore(g, s, c, seeded(c), 1);
      g.restore();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.18); g.strokeStyle = rgba(c, 0.55); g.lineWidth = Math.max(1, s * 0.03); g.stroke();
    },
  },
});

Object.assign(TEX, {
  cometcore(g, s, c, rnd, k) { // tail streaks, a glowing core and a few stars
    const hx = s * 0.68, hy = s * 0.32;
    g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const off = (i - 2) * s * 0.05, len = s * (0.6 + rnd() * 0.25);
      const gr = g.createLinearGradient(hx, hy, hx - len * 0.7, hy + len * 0.7);
      gr.addColorStop(0, `rgba(255,255,255,${0.75 * k})`); gr.addColorStop(0.3, rgba(c, 0.6 * k)); gr.addColorStop(1, rgba(c, 0));
      g.strokeStyle = gr; g.lineWidth = Math.max(1, s * (i === 2 ? 0.09 : 0.035));
      g.beginPath(); g.moveTo(hx + off * 0.7, hy + off * 0.7); g.lineTo(hx - len * 0.7 + off * 0.7, hy + len * 0.7 + off * 0.7); g.stroke();
    }
    const gl = g.createRadialGradient(hx, hy, 0, hx, hy, s * 0.22); gl.addColorStop(0, `rgba(255,255,255,${0.95 * k})`); gl.addColorStop(0.35, rgba(c, 0.6 * k)); gl.addColorStop(1, rgba(c, 0));
    g.fillStyle = gl; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 3; i++) sparkle(g, s * (0.15 + rnd() * 0.3), s * (0.1 + rnd() * 0.3), s * (0.03 + rnd() * 0.03), 0.8 * k);
  },
});
