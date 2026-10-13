import { mixHex, shade } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  mosaicfloor(th) { // a floor mosaic coming to light tile by tile from the middle, a brush of dust at the edge
    let tiles = [], tw = 0, thh = 0, t = 0, q = 0;
    const DU = [...Array(24)].map(() => ({ x: Math.random(), y: Math.random(), ph: rand(0, 6.3) }));
    function build(w, h) {
      tw = w; thh = h; tiles = []; q = Math.max(10, Math.min(w, h) * 0.035);
      const cols = Math.ceil(w / q), rows = Math.ceil(h / q), cx = cols / 2, cy = rows / 2;
      const B = th.blocks;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const edge = Math.min(r, c, rows - 1 - r, cols - 1 - c);
        let col;
        if (edge === 0) col = '#4a2a1a';
        else if (edge === 1 || edge === 2) col = ((c + r + (edge === 2 ? 1 : 0)) % 4 < 2) ? B[0] : B[6]; // a running wave band
        else if (edge === 3) col = '#4a2a1a';
        else {
          const d = Math.hypot(c - cx, (r - cy) * 1.0), ring = Math.floor(d / 1.6);
          const an = Math.atan2(r - cy, c - cx), petal = Math.cos(an * 8) > 0.3;
          col = d < 1.5 ? B[2] : ring % 3 === 0 ? B[4] : ring % 3 === 1 ? (petal ? B[1] : B[6]) : (petal ? B[3] : B[6]);
        }
        const v = (Math.random() - 0.5) * 0.25; // each stone a little lighter or darker, worked out once
        tiles.push({ x: c * q, y: r * q, fill: v > 0 ? mixHex(col, '#ffffff', v) : shade(col, v), d: Math.hypot(c, rows - r) + Math.random() * 2.5 }); // uncovered from the bottom-left corner, which the board does not hide
      }
      tiles.sort((a, b) => a.d - b.d);
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        if (!tiles.length || Math.abs(w - tw) > 1 || Math.abs(h - thh) > 1) build(w, h);
        const cyc = 44, ct = t % cyc, reveal = Math.min(1, ct / 24), fade = ct > 40 ? 1 - (ct - 40) / 4 : 1;
        const n = Math.floor(tiles.length * reveal);
        g.globalAlpha = 0.32 * a * fade;
        for (let i = 0; i < n; i++) { const p = tiles[i]; g.fillStyle = p.fill; g.fillRect(p.x + 1, p.y + 1, q - 2, q - 2); }
        g.globalAlpha = 1;
        if (n < tiles.length && n > 0) { // dust being brushed off at the edge of what has been uncovered
          const e = tiles[n - 1], R = q * 3;
          for (const d of DU) { const x = e.x + Math.cos(d.ph + t * 2) * R * d.x, y = e.y + Math.sin(d.ph + t * 2) * R * d.y; g.fillStyle = `rgba(230,210,180,${0.4 * a})`; g.fillRect(x, y, 2, 2); }
        }
      },
    };
  },
});
