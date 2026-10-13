import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { STYLES, TEX } from '../registry.js';

const CLOUD = [[0.3, 0.4, 0.2], [0.53, 0.3, 0.24], [0.74, 0.42, 0.2], [0.24, 0.64, 0.2], [0.5, 0.62, 0.26], [0.76, 0.66, 0.2]];

function cloudPath(g, s, dy = 0) {
  g.beginPath();
  for (const [x, y, r] of CLOUD) { g.moveTo(s * x + s * r, s * y + dy); g.arc(s * x, s * y + dy, s * r, 0, Math.PI * 2); }
  g.rect(s * 0.2, s * 0.35 + dy, s * 0.6, s * 0.38);
}

Object.assign(STYLES, {
  cloud: {
    block(g, s, c) {
      cloudPath(g, s, s * 0.045); g.fillStyle = shade(c, -0.22); g.fill();
      cloudPath(g, s);
      const gr = g.createLinearGradient(0, s * 0.08, 0, s * 0.88); gr.addColorStop(0, mixHex(c, '#ffffff', 0.55)); gr.addColorStop(1, c);
      g.fillStyle = gr; g.fill();
      g.save(); cloudPath(g, s); g.clip(); TEX.cloud(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  cloud(g, s, c, rnd, k) { // sunlit puffs on top, a soft shadowed base
    g.fillStyle = `rgba(255,255,255,${0.45 * k})`;
    for (const [x, y, r] of CLOUD.slice(0, 3)) { g.beginPath(); g.arc(s * (x - r * 0.25), s * (y - r * 0.3), s * r * 0.45, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = `rgba(0,0,0,${0.06 * k})`; g.fillRect(0, s * 0.78, s, s * 0.22);
  },
});
