import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

function marbleVeins(g, s, c, a = 1) {
  const rnd = seeded(c);
  g.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const y0 = s * rnd(), y1 = s * rnd();
    g.beginPath(); g.moveTo(-s * 0.05, y0);
    g.bezierCurveTo(s * 0.3, y0 + (rnd() - 0.5) * s * 0.6, s * 0.7, y1 + (rnd() - 0.5) * s * 0.6, s * 1.05, y1);
    g.strokeStyle = i === 2 ? `rgba(206,166,60,${0.85 * a})` : `rgba(90,96,100,${0.32 * a})`;
    g.lineWidth = Math.max(1, s * (i === 2 ? 0.026 : 0.018)); g.stroke();
  }
  g.fillStyle = `rgba(214,178,70,${0.9 * a})`;
  for (let i = 0; i < 3; i++) g.fillRect(s * (0.2 + rnd() * 0.6), s * (0.2 + rnd() * 0.6), s * 0.03, s * 0.03);
}

Object.assign(STYLES, {
  marble: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08);
      const gl = g.createLinearGradient(0, 0, s, s); gl.addColorStop(0, '#f6e08a'); gl.addColorStop(0.5, '#b8902c'); gl.addColorStop(1, '#e8c860');
      g.fillStyle = gl; g.fill();
      rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.82, s * 0.05);
      const gr = g.createRadialGradient(s * 0.35, s * 0.3, s * 0.05, s * 0.5, s * 0.5, s * 0.7); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, shade(c, -0.08));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); marbleVeins(g, s, c); g.restore();
    },
  },
});

Object.assign(TEX, {
  marble(g, s, c, rnd, k) { marbleVeins(g, s, c, k); },
});
