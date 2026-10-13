import { shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { softGlint } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

// a hand-painted Puebla flower: four petals, leaves on the diagonals, quarter circles in the corners, a yellow eye
function talaveraFlower(g, s, col, eye) {
  const cx = s / 2, cy = s / 2;
  g.fillStyle = col;
  for (let i = 0; i < 4; i++) {
    g.save(); g.translate(cx, cy); g.rotate(i * Math.PI / 2);
    g.beginPath(); g.ellipse(0, -s * 0.16, s * 0.085, s * 0.14, 0, 0, Math.PI * 2); g.fill();
    g.rotate(Math.PI / 4); g.beginPath(); g.ellipse(0, -s * 0.27, s * 0.035, s * 0.07, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) { g.beginPath(); g.arc(x, y, s * 0.14, 0, Math.PI * 2); g.fill(); }
  g.beginPath(); g.arc(cx, cy, s * 0.065, 0, Math.PI * 2); g.fillStyle = eye; g.fill();
}

Object.assign(STYLES, {
  talavera: { // a glazed white tile with a flower painted in the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.fillStyle = shade(c, -0.45); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.07); g.fillStyle = '#fbf6ea'; g.fill();
      g.save(); g.clip();
      talaveraFlower(g, s, c, '#f0b020');
      g.strokeStyle = c; g.lineWidth = Math.max(1, s * 0.03); g.strokeRect(s * 0.13, s * 0.12, s * 0.74, s * 0.74);
      softGlint(g, s * 0.3, s * 0.26, s * 0.22, 0.6);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  talavera(g, s, c, rnd, k) { talaveraFlower(g, s, `rgba(255,250,235,${0.85 * k})`, `rgba(240,176,32,${0.95 * k})`); },
});
