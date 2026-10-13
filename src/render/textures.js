import { rr } from './sprites.js';
import { seeded } from './blocks.js';
import { TEX } from '../themes/registry.js';

/* ---------- Texture helpers (each theme's own surface texture is in themes/<id>/block.js) ---------- */
export function speckle(g, s, rnd, n, r0, r1, col) {
  for (let i = 0; i < n; i++) { g.beginPath(); g.arc(rnd() * s, rnd() * s, Math.max(0.5, s * (r0 + rnd() * (r1 - r0))), 0, Math.PI * 2); g.fillStyle = col(); g.fill(); }
}
export function softGlint(g, x, y, r, a) { // round specular highlight instead of a star
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
// clip to a rounded inset and lay the theme's texture inside it
export function texIn(g, s, c, style, k, x0, r) {
  g.save(); rr(g, s * x0, s * x0, s * (1 - 2 * x0), s * (1 - 2 * x0), s * r); g.clip();
  TEX[style](g, s, c, seeded(c), k);
  g.restore();
}
