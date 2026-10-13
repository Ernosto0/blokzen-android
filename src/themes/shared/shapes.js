// Shapes and drawing helpers that more than one theme uses. A helper only one theme uses lives in that theme's folder.

import { Sfx } from '../../audio/sfx.js';
import { hexRgb, shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { seeded } from '../../render/blocks.js';
import { TEX } from '../registry.js';

export function rosette(g, x, y, r, petal, center) {
  g.fillStyle = petal;
  for (let i = 0; i < 8; i++) { g.save(); g.translate(x, y); g.rotate(i * Math.PI / 4); g.beginPath(); g.ellipse(r * 0.55, 0, r * 0.45, r * 0.2, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
  g.beginPath(); g.arc(x, y, r * 0.25, 0, Math.PI * 2); g.fillStyle = center; g.fill();
}
export function gearPath(g, x, y, r, n, rot = 0, hole = 0.35) {
  g.beginPath();
  const ri = r * 0.78, st = Math.PI * 2 / n;
  for (let i = 0; i < n; i++) {
    const a = rot + i * st;
    [[ri, a], [r, a + st * 0.15], [r, a + st * 0.45], [ri, a + st * 0.6]].forEach(([rad, an], j) => {
      const px = x + Math.cos(an) * rad, py = y + Math.sin(an) * rad;
      if (i === 0 && j === 0) g.moveTo(px, py); else g.lineTo(px, py);
    });
  }
  g.closePath();
  if (hole) { g.moveTo(x + r * hole, y); g.arc(x, y, r * hole, 0, Math.PI * 2); }
}
const MAPLE = (() => {
  const R = [[0, -1], [0.18, -0.62], [0.42, -0.78], [0.4, -0.38], [0.86, -0.42], [0.66, -0.1], [0.9, 0.12], [0.42, 0.22], [0.36, 0.5], [0.08, 0.36], [0.04, 0.6], [0.04, 0.95]];
  return [...R, ...R.slice(1).reverse().map(([x, y]) => [-x, y])];
})();
export function mapleShape(g, x, y, r, rot) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); MAPLE.forEach(([px, py], i) => i ? g.lineTo(px * r, py * r) : g.moveTo(px * r, py * r)); g.closePath();
  g.restore();
}
// stroke the current path twice: a light edge offset down-right, then the dark cut, so it reads as carved
export function carved(g, build, lw, light, dark) {
  g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  g.save(); g.translate(lw * 0.6, lw * 0.6); build(); g.strokeStyle = light; g.stroke(); g.restore();
  build(); g.strokeStyle = dark; g.stroke();
}

export const paleHex = c => { const [r, g, b] = hexRgb(c); return r + g + b > 560; }; // a light block colour needs dark ornament
// soft bands of mist drifting slowly sideways; rgb is "r,g,b"
export function mistBands(g, w, h, a, t, ys, rgb) {
  ys.forEach((yf, i) => {
    const y = h * yf, off = Math.sin(t * 0.1 + i * 2) * w * 0.15, gr = g.createLinearGradient(0, y - h * 0.06, 0, y + h * 0.06);
    gr.addColorStop(0, `rgba(${rgb},0)`); gr.addColorStop(0.5, `rgba(${rgb},${0.1 * a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(off - w * 0.2, y - h * 0.06, w * 1.4, h * 0.12);
  });
}

// a framed tile: dark rim, the block colour, then the theme's texture clipped inside
export function framedTile(g, s, c, style, r = 0.08) {
  rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * r); g.fillStyle = shade(c, -0.45); g.fill();
  rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * r * 0.9); g.fillStyle = c; g.fill();
  g.save(); g.clip(); TEX[style](g, s, c, seeded(c), 1); g.restore();
}

// one face of a 3 x 3 puzzle cube seen straight on
function cubeFace(g, x, y, w, cols, gap = 0.07) {
  rr(g, x, y, w, w, w * 0.1); g.fillStyle = '#101014'; g.fill();
  const q = w / 3;
  cols.forEach((c, i) => {
    const cx = x + (i % 3) * q, cy = y + ((i / 3) | 0) * q;
    rr(g, cx + q * gap, cy + q * gap, q * (1 - 2 * gap), q * (1 - 2 * gap), q * 0.18); g.fillStyle = c; g.fill();
  });
}
