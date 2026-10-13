import { poly } from '../../render/sprites.js';

// a square cut into triangles like tangram pieces: kind 1 and 2 cut along one diagonal, 4 along both
export function tanSquare(g, x, y, w, c, lt, dk, kind, seam = 'rgba(255,250,240,.85)') {
  const A = [x, y], B = [x + w, y], C = [x + w, y + w], D = [x, y + w], M = [x + w / 2, y + w / 2];
  if (kind === 4) { poly(g, [A, B, M], lt); poly(g, [B, C, M], c); poly(g, [C, D, M], dk); poly(g, [D, A, M], c); }
  else if (kind === 1) { poly(g, [A, B, D], lt); poly(g, [B, C, D], c); }
  else { poly(g, [A, B, C], lt); poly(g, [A, C, D], c); }
  g.strokeStyle = seam; g.lineWidth = Math.max(1, w * 0.035); g.lineCap = 'round'; g.beginPath();
  if (kind === 4) { g.moveTo(...A); g.lineTo(...C); g.moveTo(...B); g.lineTo(...D); }
  else if (kind === 1) { g.moveTo(...B); g.lineTo(...D); }
  else { g.moveTo(...A); g.lineTo(...C); }
  g.stroke();
}
