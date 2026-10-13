import { shade } from '../../core/color.js';
import { speckle } from '../../render/textures.js';
import { TEX } from '../registry.js';

Object.assign(TEX, {
  lava(g, s, c, rnd, k) { // cooled crust broken by a network of glowing seams
    speckle(g, s, rnd, 26, 0.01, 0.03, () => `rgba(0,0,0,${0.22 * k})`);
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let w = 0; w < 3; w++) {
      let x = rnd() * s, y = rnd() < 0.5 ? 0 : s, an = y ? -Math.PI / 2 : Math.PI / 2;
      g.beginPath(); g.moveTo(x, y);
      for (let i = 0; i < 6; i++) { an += (rnd() - 0.5) * 1.4; x += Math.cos(an) * s * 0.17; y += Math.sin(an) * s * 0.17; g.lineTo(x, y); }
      g.shadowColor = c; g.shadowBlur = s * 0.15;
      g.strokeStyle = shade(c, 0.45); g.lineWidth = Math.max(1, s * 0.045 * k); g.stroke();
      g.shadowBlur = 0; g.strokeStyle = `rgba(255,240,190,${0.85 * k})`; g.lineWidth = Math.max(1, s * 0.016); g.stroke();
    }
  },
});
