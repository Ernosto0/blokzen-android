import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { THEMES } from '../catalog.js';
import { kawaiiChar } from './helpers.js';
import { STYLES, TEX } from '../registry.js';

// each block colour carries its own character
const KAWAII_BLOCKS = THEMES.find(t => t.id === 'kawaii').blocks;
const kindOf = c => Math.max(0, KAWAII_BLOCKS.indexOf(c));

Object.assign(STYLES, {
  kawaii: { // a puffy pastel sticker with a white edge, polka dots and a character on it
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.07, s * 0.92, s * 0.9, s * 0.3); g.fillStyle = shade(c, -0.25); g.fill();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.9, s * 0.3); g.fillStyle = '#fff'; g.fill();
      const gr = g.createLinearGradient(0, s * 0.1, 0, s * 0.9); gr.addColorStop(0, mixHex(c, '#ffffff', 0.45)); gr.addColorStop(1, c);
      rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.8, s * 0.25); g.fillStyle = gr; g.fill();
      g.save(); rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.8, s * 0.25); g.clip();
      TEX.kawaii(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  kawaii(g, s, c, rnd, k) { // polka dots and the block's character
    g.fillStyle = `rgba(255,255,255,${0.28 * k})`;
    for (const [x, y] of [[0.2, 0.22], [0.8, 0.22], [0.2, 0.78], [0.8, 0.78], [0.5, 0.1], [0.5, 0.92]]) { g.beginPath(); g.arc(s * x, s * y, s * 0.045, 0, Math.PI * 2); g.fill(); }
    g.globalAlpha = Math.min(1, k + 0.15);
    kawaiiChar(g, kindOf(c), s * 0.5, s * 0.52, s * 0.31);
    g.globalAlpha = 1;
  },
});
