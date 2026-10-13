import { hexRgb, mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { THEMES } from '../catalog.js';
import { chessPiece } from './helpers.js';
import { STYLES, TEX } from '../registry.js';

// a chess piece as a filled silhouette, standing on its base at y + h/2; kind 0 pawn, 1 rook, 2 knight, 3 bishop, 4 queen, 5 king
const CHESS_BLOCKS = THEMES.find(t => t.id === 'chess').blocks;

const chessKind = c => [0, 1, 2, 3, 4, 5, 0][Math.max(0, CHESS_BLOCKS.indexOf(c))];

Object.assign(STYLES, {
  chesstile: { // a polished square of the board with a piece inlaid in it
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.05, s * 0.94, s * 0.92, s * 0.08); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.2)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.22));
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.9, s * 0.08); g.fillStyle = gr; g.fill();
      g.strokeStyle = 'rgba(255,240,200,.35)'; g.lineWidth = Math.max(1, s * 0.02); g.strokeRect(s * 0.11, s * 0.1, s * 0.78, s * 0.74);
      TEX.chesstile(g, s, c, seeded(c), 1);
      g.beginPath(); g.ellipse(s * 0.3, s * 0.13, s * 0.18, s * 0.035, -0.2, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.35)'; g.fill();
    },
  },
});

Object.assign(TEX, {
  chesstile(g, s, c, rnd, k) { // the piece inlaid in a lighter or darker wood than the square
    const light = hexRgb(c).reduce((a, b) => a + b, 0) > 520;
    g.fillStyle = light ? `rgba(40,28,20,${0.62 * k})` : `rgba(255,246,226,${0.7 * k})`;
    chessPiece(g, chessKind(c), s * 0.5, s * 0.47, s * 0.62);
  },
});
