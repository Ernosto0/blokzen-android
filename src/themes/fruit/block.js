import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { speckle } from '../../render/textures.js';
import { FRUIT } from './helpers.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  fruit: {
    block(g, s, c) {
      const F = FRUIT[c] || { rind: shade(c, -0.35), kind: 'dots' };
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.22); g.fillStyle = F.rind; g.fill();
      rr(g, s * 0.1, s * 0.1, s * 0.8, s * 0.8, s * 0.17); g.fillStyle = F.pith || '#fffbe8'; g.fill();
      rr(g, s * 0.14, s * 0.14, s * 0.72, s * 0.72, s * 0.14);
      const gr = g.createRadialGradient(s * 0.5, s * 0.5, 0, s * 0.5, s * 0.5, s * 0.5); gr.addColorStop(0, mixHex(c, '#ffffff', 0.3)); gr.addColorStop(1, c);
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.fruit(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  fruit(g, s, c, rnd, k) { // the fruit's own flesh: pulp, seeds or skin bloom
    const kind = (FRUIT[c] || {}).kind || 'dots';
    if (kind === 'citrus') {
      for (let i = 0; i < 26; i++) { g.save(); g.translate(rnd() * s, rnd() * s); g.rotate(rnd() * Math.PI); g.beginPath(); g.ellipse(0, 0, s * 0.06, s * 0.016, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,230,${0.3 * k})`; g.fill(); g.restore(); }
    } else if (kind === 'seeds') {
      speckle(g, s, rnd, 30, 0.006, 0.014, () => `rgba(255,230,230,${0.28 * k})`);
      for (let i = 0; i < 4; i++) { g.save(); g.translate(s * (0.18 + rnd() * 0.64), s * (0.18 + rnd() * 0.64)); g.rotate(rnd() * Math.PI); g.beginPath(); g.ellipse(0, 0, s * 0.055, s * 0.032, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(26,16,16,.9)'; g.fill(); g.restore(); }
    } else if (kind === 'kiwi') {
      for (let i = 0; i < 16; i++) { g.save(); g.translate(rnd() * s, rnd() * s); g.rotate(rnd() * Math.PI); g.fillStyle = `rgba(250,255,215,${0.25 * k})`; g.fillRect(-s * 0.06, -s * 0.008, s * 0.12, s * 0.016); g.restore(); }
      speckle(g, s, rnd, 18, 0.008, 0.016, () => 'rgba(26,20,8,.85)');
    } else if (kind === 'black') {
      speckle(g, s, rnd, 34, 0.006, 0.013, () => 'rgba(26,16,16,.8)');
    } else {
      g.fillStyle = `rgba(255,255,255,${0.12 * k})`; g.fillRect(0, 0, s, s);
      speckle(g, s, rnd, 24, 0.006, 0.016, () => `rgba(255,255,255,${0.22 * k})`);
    }
    g.beginPath(); g.ellipse(s * 0.32, s * 0.26, s * 0.12, s * 0.04, -0.5, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.4 * k})`; g.fill();
  },
});
