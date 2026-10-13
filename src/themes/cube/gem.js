import { poly } from '../../render/sprites.js';
import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  cube(g, s, th) { // a little cube in three-quarter view, solved on every side
    const cx = s / 2, cy = s * 0.5, r = s * 0.3, h = r * Math.sqrt(3) / 2;
    const top = [[cx, cy - r], [cx + h, cy - r / 2], [cx, cy], [cx - h, cy - r / 2]], left = [[cx - h, cy - r / 2], [cx, cy], [cx, cy + r], [cx - h, cy + r / 2]], right = [[cx, cy], [cx + h, cy - r / 2], [cx + h, cy + r / 2], [cx, cy + r]];
    g.lineJoin = 'round'; g.beginPath(); [[cx, cy - r], [cx + h, cy - r / 2], [cx + h, cy + r / 2], [cx, cy + r], [cx - h, cy + r / 2], [cx - h, cy - r / 2]].forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
    g.fillStyle = '#0c0c10'; g.fill(); g.lineWidth = s * 0.05; g.strokeStyle = 'rgba(0,0,0,.6)'; g.stroke();
    const face = (Q, col) => { // nine stickers on a parallelogram
      const [A, B, , D] = Q, ux = (B[0] - A[0]) / 3, uy = (B[1] - A[1]) / 3, vx = (D[0] - A[0]) / 3, vy = (D[1] - A[1]) / 3;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        const P = (a, b) => [A[0] + ux * (i + a) + vx * (j + b), A[1] + uy * (i + a) + vy * (j + b)];
        poly(g, [P(0.12, 0.12), P(0.88, 0.12), P(0.88, 0.88), P(0.12, 0.88)], col);
      }
    };
    face(top, th.accent); face(left, '#e8333a'); face(right, '#2a6ce8');
  },
});
