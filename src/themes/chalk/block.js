import { mixHex, rgba } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { speckle } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

// chalk laid down in slanted strokes, each a little uneven
function chalkHatch(g, s, col, rnd, a) {
  g.lineCap = 'round'; g.lineWidth = Math.max(1, s * 0.04);
  for (let i = -s; i < s * 1.2; i += s * 0.075) {
    const j = (rnd() - 0.5) * s * 0.03;
    g.strokeStyle = rgba(col, a * (0.6 + rnd() * 0.4));
    g.beginPath(); g.moveTo(i + j, s * 1.02); g.lineTo(i + s + j + (rnd() - 0.5) * s * 0.05, -s * 0.02); g.stroke();
  }
}

// a box drawn twice by hand in chalk, then the dust left on it
function chalkBox(g, s, c, rnd) {
  g.lineCap = 'round'; g.lineJoin = 'round';
  for (let p = 0; p < 2; p++) {
    const j = () => (rnd() - 0.5) * s * 0.035, o = s * 0.1, e = s * 0.9;
    g.strokeStyle = rgba(c, p ? 0.55 : 0.95); g.lineWidth = Math.max(1, s * (p ? 0.03 : 0.05));
    g.beginPath(); g.moveTo(o + j(), o + j()); g.lineTo(e + j(), o + j()); g.lineTo(e + j(), e + j()); g.lineTo(o + j(), e + j()); g.closePath(); g.stroke();
  }
  speckle(g, s, rnd, 24, 0.004, 0.01, () => `rgba(255,255,255,${0.12 + rnd() * 0.25})`);
}

Object.assign(STYLES, {
  chalk: { // a square hatched in coloured chalk on the blackboard
    block(g, s, c) {
      const rnd = seeded(c);
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.08); g.fillStyle = mixHex(c, '#163224', 0.68); g.fill();
      g.save(); g.clip(); chalkHatch(g, s, c, rnd, 0.85); g.restore();
      chalkBox(g, s, c, rnd);
    },
  },
});

Object.assign(TEX, {
  chalk(g, s, c, rnd, k) { chalkHatch(g, s, '#ffffff', rnd, 0.2 * k); speckle(g, s, rnd, 22, 0.004, 0.01, () => `rgba(255,255,255,${(0.15 + rnd() * 0.25) * k})`); },
});
