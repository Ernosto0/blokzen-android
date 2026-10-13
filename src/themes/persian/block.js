import { rgba } from '../../core/color.js';
import { poly } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';
import { framedTile, paleHex, rosette } from '../shared/shapes.js';

Object.assign(STYLES, {
  carpet: { block(g, s, c) { framedTile(g, s, c, 'carpet', 0.06); } }, // a square of hand-knotted Persian carpet
});

Object.assign(TEX, {
  carpet(g, s, c, rnd, k) { // the knot grid of the pile, a border, a dotted inner border and a medallion
    const lt = paleHex(c) ? '#1e2a5a' : '#f6ecd4', au = c === '#e8c06a' ? '#b8283e' : '#e8c06a', q = s / 14;
    g.fillStyle = `rgba(0,0,0,${0.08 * k})`;
    for (let y = 0; y < 14; y++) for (let x = y % 2; x < 14; x += 2) g.fillRect(x * q, y * q, q, q);
    g.strokeStyle = rgba(lt, 0.7 * k); g.lineWidth = Math.max(1, s * 0.03); g.strokeRect(s * 0.12, s * 0.12, s * 0.76, s * 0.76);
    g.setLineDash([Math.max(1, s * 0.03), Math.max(1, s * 0.03)]); g.lineWidth = Math.max(1, s * 0.02); g.strokeStyle = rgba(au, 0.75 * k);
    g.strokeRect(s * 0.19, s * 0.19, s * 0.62, s * 0.62); g.setLineDash([]);
    poly(g, [[s * 0.5, s * 0.27], [s * 0.73, s * 0.5], [s * 0.5, s * 0.73], [s * 0.27, s * 0.5]], rgba(au, 0.85 * k));
    rosette(g, s * 0.5, s * 0.5, s * 0.13, rgba(lt, 0.85 * k), rgba(c, 1));
  },
});
