import { mixHex, rgba } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { THEMES } from '../catalog.js';
import { pips } from './helpers.js';
import { STYLES, TEX } from '../registry.js';

const DOMINO_BLOCKS = THEMES.find(t => t.id === 'domino').blocks;

const pipCount = c => { const i = DOMINO_BLOCKS.indexOf(c); return i < 0 ? 3 : (i % 6) + 1; };

Object.assign(STYLES, {
  domino: { // an ivory domino half, the pips drilled and filled with the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.06, s * 0.92, s * 0.9, s * 0.16); g.fillStyle = 'rgba(0,0,0,.38)'; g.fill();
      rr(g, s * 0.04, s * 0.03, s * 0.92, s * 0.9, s * 0.16); g.fillStyle = mixHex(c, '#cfc3a8', 0.85); g.fill();
      const iv = g.createLinearGradient(0, 0, 0, s); iv.addColorStop(0, '#fffaf0'); iv.addColorStop(1, mixHex(c, '#efe4cc', 0.9));
      rr(g, s * 0.06, s * 0.04, s * 0.88, s * 0.83, s * 0.14); g.fillStyle = iv; g.fill();
      pips(g, s * 0.06, s * 0.035, s * 0.88, pipCount(c), c, s * 0.075);
      g.beginPath(); g.ellipse(s * 0.34, s * 0.12, s * 0.2, s * 0.035, -0.1, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill();
    },
  },
});

Object.assign(TEX, {
  domino(g, s, c, rnd, k) { pips(g, s * 0.08, s * 0.08, s * 0.84, pipCount(c), rgba('#fff8e8', 0.92 * k), s * 0.07, false); },
});
