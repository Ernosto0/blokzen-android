import { rgba } from '../../core/color.js';
import { STYLES, TEX } from '../registry.js';
import { framedTile } from '../shared/shapes.js';

Object.assign(STYLES, {
  kente: { block(g, s, c) { framedTile(g, s, c, 'kente', 0.06); } }, // a strip of woven kente cloth
});

Object.assign(TEX, {
  kente(g, s, c, rnd, k) { // a dark band with a zigzag, thin stripes, check rows and the warp showing through
    const acc = c === '#e8b818' ? '#2a9a3a' : '#f0c020', q = s / 8;
    g.fillStyle = `rgba(16,12,4,${0.78 * k})`; g.fillRect(0, s * 0.38, s, s * 0.24);
    g.strokeStyle = rgba(acc, 0.95 * k); g.lineWidth = Math.max(1, s * 0.045); g.lineJoin = 'miter';
    g.beginPath(); for (let j = 0; j <= 8; j++) { const x = j / 8 * s, y = s * (j % 2 ? 0.43 : 0.57); j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.fillStyle = rgba(acc, 0.85 * k); g.fillRect(0, s * 0.29, s, s * 0.035); g.fillRect(0, s * 0.675, s, s * 0.035);
    g.fillStyle = `rgba(16,12,4,${0.55 * k})`;
    for (let i = 0; i < 8; i++) for (const y of [0.06, 0.76]) g.fillRect(i * q, s * y + (i % 2) * q, q, q);
    g.strokeStyle = `rgba(0,0,0,${0.1 * k})`; g.lineWidth = 1; g.beginPath();
    for (let x = 0; x < s; x += Math.max(2, s / 16)) { g.moveTo(x, 0); g.lineTo(x, s); } g.stroke();
  },
});
