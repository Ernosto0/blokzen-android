import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { softGlint, speckle } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  spice: { // a heap of ground spice in a brass bowl
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.6); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.1); g.fillStyle = shade(c, -0.3); g.fill();
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.1); g.clip();
      g.beginPath(); g.moveTo(-s * 0.02, s * 0.8); g.quadraticCurveTo(s * 0.5, -s * 0.12, s * 1.02, s * 0.8); g.lineTo(s, s); g.lineTo(0, s); g.closePath();
      const gr = g.createRadialGradient(s * 0.42, s * 0.34, s * 0.03, s * 0.5, s * 0.55, s * 0.6);
      gr.addColorStop(0, shade(c, 0.32)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.22));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.spice(g, s, c, seeded(c), 1); g.restore();
      const br = g.createLinearGradient(0, s * 0.74, 0, s); br.addColorStop(0, '#f0cc6a'); br.addColorStop(0.5, '#b8862c'); br.addColorStop(1, '#7a5418');
      g.fillStyle = br; g.fillRect(0, s * 0.76, s, s * 0.24);
      g.fillStyle = 'rgba(255,240,190,.6)'; g.fillRect(0, s * 0.76, s, Math.max(1, s * 0.025));
      g.restore();
    },
  },
});

Object.assign(TEX, {
  spice(g, s, c, rnd, k) { // fine grains, lighter and darker, a soft sheen on top
    speckle(g, s, rnd, 90, 0.004, 0.011, () => rnd() < 0.5 ? `rgba(255,236,190,${0.3 * k})` : `rgba(30,10,0,${0.3 * k})`);
    softGlint(g, s * 0.42, s * 0.3, s * 0.2, 0.3 * k);
  },
});
