import { hexRgb, mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { THEMES } from '../catalog.js';
import { STYLES, TEX } from '../registry.js';

// cipher keys: each block colour wears its own letter
const CIPHER_BLOCKS = THEMES.find(t => t.id === 'cipher').blocks;

const cipherLetter = c => 'XKQZRVJ'[Math.max(0, CIPHER_BLOCKS.indexOf(c))];

Object.assign(STYLES, {
  cipherkey: { // a round typewriter key in a chrome ring, its letter printed on top, set in the dark machine
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.12); g.fillStyle = '#121618'; g.fill();
      g.beginPath(); g.arc(s * 0.5, s * 0.54, s * 0.4, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.6)'; g.fill();
      const ring = g.createLinearGradient(0, s * 0.1, 0, s * 0.9); ring.addColorStop(0, '#f2f4f2'); ring.addColorStop(0.5, '#7c8482'); ring.addColorStop(1, '#d4d8d6');
      g.beginPath(); g.arc(s * 0.5, s * 0.49, s * 0.4, 0, Math.PI * 2); g.fillStyle = ring; g.fill();
      const cap = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.02, s * 0.5, s * 0.5, s * 0.36);
      cap.addColorStop(0, mixHex(c, '#ffffff', 0.35)); cap.addColorStop(1, shade(c, -0.3));
      g.beginPath(); g.arc(s * 0.5, s * 0.49, s * 0.33, 0, Math.PI * 2); g.fillStyle = cap; g.fill();
      TEX.cipherkey(g, s, c, seeded(c), 1);
    },
  },
});

Object.assign(TEX, {
  cipherkey(g, s, c, rnd, k) { // the key's letter, dark on pale caps and white on dark ones
    const light = hexRgb(c).reduce((a, b) => a + b, 0) > 560;
    g.font = `800 ${s * 0.38}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = light ? `rgba(30,30,34,${0.85 * k})` : `rgba(255,255,255,${0.92 * k})`;
    g.fillText(cipherLetter(c), s * 0.5, s * 0.53);
  },
});
