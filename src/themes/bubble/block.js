import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { THEMES } from '../catalog.js';
import { seaChar } from './helpers.js';
import { STYLES, TEX } from '../registry.js';

// each block colour carries its own sea creature
const BUBBLE_BLOCKS = THEMES.find(t => t.id === 'bubble').blocks;
const kindOf = c => Math.max(0, BUBBLE_BLOCKS.indexOf(c));

Object.assign(STYLES, {
  bubble: { // a glossy, bubbly tile with a bright rim and a creature on it
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.07, s * 0.92, s * 0.9, s * 0.28); g.fillStyle = shade(c, -0.3); g.fill();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.9, s * 0.28); g.fillStyle = '#ffffff'; g.fill();
      const gr = g.createLinearGradient(0, s * 0.1, 0, s * 0.9); gr.addColorStop(0, mixHex(c, '#ffffff', 0.5)); gr.addColorStop(1, c);
      rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.8, s * 0.23); g.fillStyle = gr; g.fill();
      g.save(); rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.8, s * 0.23); g.clip();
      TEX.bubble(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  bubble(g, s, c, rnd, k) { // a few tiny bubbles and the block's creature
    g.strokeStyle = `rgba(255,255,255,${0.7 * k})`; g.lineWidth = Math.max(1, s * 0.02);
    for (const [x, y, r] of [[0.2, 0.2, 0.05], [0.82, 0.3, 0.035], [0.18, 0.8, 0.03], [0.84, 0.82, 0.05]]) { g.beginPath(); g.arc(s * x, s * y, s * r, 0, Math.PI * 2); g.stroke(); }
    g.globalAlpha = Math.min(1, k + 0.15);
    seaChar(g, kindOf(c), s * 0.5, s * 0.52, s * 0.3);
    g.globalAlpha = 1;
  },
});
