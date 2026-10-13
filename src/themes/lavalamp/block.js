import { hexOf, mixHex, rgba } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  lamp: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.22); g.fillStyle = mixHex(c, '#120604', 0.6); g.fill();
      g.save(); rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.2); g.clip();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#1a0804', 0.6)); gr.addColorStop(1, mixHex(c, '#1a0804', 0.3));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      TEX.lamp(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  lamp(g, s, c, rnd, k) { // glowing wax blobs inside glass
    const hi = hexOf(mixHex(c, '#fff0c0', 0.35));
    for (let i = 0; i < 3; i++) {
      const x = s * (0.2 + rnd() * 0.6), y = s * (0.2 + rnd() * 0.6), rx = s * (0.12 + rnd() * 0.12), ry = rx * (1.1 + rnd() * 0.5);
      const gr = g.createRadialGradient(x - rx * 0.3, y - ry * 0.3, 0, x, y, Math.max(rx, ry));
      gr.addColorStop(0, rgba(hi, 0.95 * k)); gr.addColorStop(0.7, rgba(c, 0.85 * k)); gr.addColorStop(1, rgba(c, 0));
      g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    }
    const sh = g.createLinearGradient(s * 0.12, 0, s * 0.3, 0);
    sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, `rgba(255,255,255,${0.25 * k})`); sh.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sh; g.fillRect(s * 0.12, s * 0.08, s * 0.18, s * 0.84);
  },
});
