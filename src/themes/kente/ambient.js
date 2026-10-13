import { rgba } from '../../core/color.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  loom(th) { // narrow strips of kente coming off the loom one block at a time, warp threads, a shuttle passing
    let t = 0;
    const NS = 5, B = th.blocks, at = m => B[((m % 7) + 7) % 7];
    const seg = (g, x, y, sw, sh, k, i) => { // one block of a strip, in one of three weaves
      const c = at(k * 3 + i * 2), c2 = at(k * 3 + i * 2 + 3), kind = (((k + i) % 3) + 3) % 3;
      g.fillStyle = rgba(c, 0.2); g.fillRect(x, y, sw, sh);
      if (kind === 0) { g.fillStyle = 'rgba(10,8,4,.25)'; for (let j = 1; j < 4; j++) g.fillRect(x, y + sh * j / 4 - sh * 0.03, sw, sh * 0.06); }
      else if (kind === 1) { g.fillStyle = rgba(c2, 0.18); const q = sw / 4; for (let r = 0; r < 4; r++) for (let cc = 0; cc < 4; cc++) if ((r + cc) % 2) g.fillRect(x + cc * q, y + r * sh / 4, q, sh / 4); }
      else {
        g.fillStyle = 'rgba(10,8,4,.3)'; g.fillRect(x, y + sh * 0.3, sw, sh * 0.4);
        g.strokeStyle = rgba(c2, 0.35); g.lineWidth = 2; g.beginPath();
        for (let j = 0; j <= 6; j++) { const px = x + j / 6 * sw, py = y + sh * (j % 2 ? 0.38 : 0.62); j ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.stroke();
      }
    };
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        const u = Math.min(w, h), gap = w / NS, sw = gap * 0.62, sh = sw * 1.1, run = t * u * 0.012, off = run % sh, base = Math.floor(run / sh);
        g.globalAlpha = a * 0.6; // kept faint so the cloth does not compete with the board
        g.strokeStyle = 'rgba(255,240,200,.06)'; g.lineWidth = 1; g.beginPath();
        for (let x = 0; x < w; x += 6) { g.moveTo(x, 0); g.lineTo(x, h); } g.stroke();
        for (let i = 0; i < NS; i++) {
          const x = gap * (i + 0.5) - sw / 2;
          for (let j = -1; j * sh < h + sh; j++) seg(g, x, j * sh + off, sw, sh, j - base + i * 5, i);
        }
        const sx = (0.5 + 0.46 * Math.sin(t * 0.6)) * w, sy = h * 0.05;
        g.fillStyle = 'rgba(200,150,80,.5)'; g.beginPath(); g.ellipse(sx, sy, u * 0.045, u * 0.011, 0, 0, Math.PI * 2); g.fill();
        g.globalAlpha = 1;
      },
    };
  },
});
