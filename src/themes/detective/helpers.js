import { mixHex, shade } from '../../core/color.js';

export function memoPin(g, x, y, r, col) {
  g.beginPath(); g.ellipse(x + r * 0.35, y + r * 0.5, r * 0.9, r * 0.55, 0.4, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.3)'; g.fill();
  const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r); gr.addColorStop(0, mixHex(col, '#ffffff', 0.55)); gr.addColorStop(1, shade(col, -0.25));
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
}
