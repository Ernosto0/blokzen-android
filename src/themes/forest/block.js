import { speckle } from '../../render/textures.js';
import { TEX } from '../registry.js';

Object.assign(TEX, {
  leaf(g, s, c, rnd, k) { // leaf surface: midrib, side veins, mottled colour
    speckle(g, s, rnd, 34, 0.01, 0.035, () => rnd() < 0.5 ? `rgba(255,255,210,${0.12 * k})` : `rgba(0,40,0,${0.14 * k})`);
    const off = (rnd() - 0.5) * s * 0.3, P = t => [-s * 0.1 + off + s * 1.2 * t, s * 1.1 - s * 1.2 * t];
    g.lineCap = 'round'; g.strokeStyle = `rgba(255,255,225,${0.3 * k})`;
    g.lineWidth = Math.max(1, s * 0.022); g.beginPath(); g.moveTo(...P(0)); g.lineTo(...P(1)); g.stroke();
    g.lineWidth = Math.max(1, s * 0.011);
    for (let i = 1; i < 8; i++) {
      const [x, y] = P(i / 8);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + s * 0.14, y + s * 0.06, x + s * 0.28, y - s * 0.02); g.stroke();
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - s * 0.06, y - s * 0.14, x + s * 0.02, y - s * 0.28); g.stroke();
    }
  },
});
