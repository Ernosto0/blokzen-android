import { mixHex } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { texIn } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  storm: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.18); g.fillStyle = mixHex(c, '#05080e', 0.6); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.12)); gr.addColorStop(1, mixHex(c, '#05080e', 0.45));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.16); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'storm', 1, 0.07, 0.16);
    },
  },
});

Object.assign(TEX, {
  storm(g, s, c, rnd, k) { // cloud puffs with a lightning crack running through
    g.fillStyle = `rgba(255,255,255,${0.16 * k})`;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(s * (0.12 + i * 0.19), s * (0.18 + rnd() * 0.12), s * (0.12 + rnd() * 0.08), 0, Math.PI * 2); g.fill(); }
    const pts = []; let x = s * (0.3 + rnd() * 0.4), y = s * 0.04; pts.push([x, y]);
    while (y < s * 0.95) { y += s * (0.12 + rnd() * 0.1); x += s * (rnd() - 0.5) * 0.3; pts.push([x, y]); }
    const line = () => { g.beginPath(); pts.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); };
    g.lineJoin = 'round'; g.lineCap = 'round';
    g.save(); g.shadowColor = '#9fd8ff'; g.shadowBlur = s * 0.12; line(); g.strokeStyle = `rgba(160,220,255,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.05); g.stroke(); g.restore();
    line(); g.strokeStyle = `rgba(255,255,255,${0.9 * k})`; g.lineWidth = Math.max(1, s * 0.018); g.stroke();
  },
});
