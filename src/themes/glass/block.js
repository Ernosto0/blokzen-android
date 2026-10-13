import { hexOf, mixHex, rgba } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

function glassShine(g, s, a) {
  g.fillStyle = `rgba(255,255,255,${0.32 * a})`;
  g.beginPath(); g.moveTo(0, s * 0.6); g.lineTo(s * 0.6, 0); g.lineTo(s * 0.8, 0); g.lineTo(0, s * 0.8); g.closePath(); g.fill();
  g.fillStyle = `rgba(255,255,255,${0.2 * a})`;
  g.beginPath(); g.moveTo(0, s * 0.9); g.lineTo(s * 0.9, 0); g.lineTo(s * 0.97, 0); g.lineTo(0, s * 0.97); g.closePath(); g.fill();
}

Object.assign(STYLES, {
  glass: {
    tint: c => hexOf(mixHex(c, '#ffffff', 0.18)),
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.12); g.fillStyle = rgba(c, 0.36); g.fill();
      g.lineWidth = Math.max(1, s * 0.05); g.strokeStyle = mixHex(c, '#ffffff', 0.6); g.stroke();
      g.save(); g.clip(); glassShine(g, s, 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  glass(g, s, c, rnd, k) { glassShine(g, s, k); },
});
