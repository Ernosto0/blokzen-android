import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  arcade(th) { // scrolling pixel stars, marching space invaders, scanlines
    const S = [...Array(70)].map(() => ({ x: Math.random(), y: Math.random(), z: rand(0.3, 1) }));
    const INV = ['00100000100', '00010001000', '00111111100', '01101110110', '11111111111', '10111111101', '10100000101', '00011011000'];
    let t = 0;
    return {
      step(dt) { t += dt; for (const s of S) { s.y += s.z * 0.12 * dt; if (s.y > 1) { s.y = 0; s.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), px = Math.max(2, Math.round(u * 0.006));
        for (const s of S) {
          const q = s.z > 0.7 ? px : Math.max(1, px / 2);
          g.fillStyle = `rgba(255,255,255,${(0.25 + 0.6 * s.z) * a})`; g.fillRect(Math.round(s.x * w / q) * q, Math.round(s.y * h / q) * q, q, q);
        }
        const step = Math.floor(t * 2), frame = step % 2, cw = 15 * px, ph = step % 16, march = (ph < 8 ? ph : 16 - ph) * px * 2;
        const ox = (w - 4 * cw) / 2 - 8 * px + march, oy = h * 0.06;
        const ic = [th.blocks[0], th.blocks[3], th.blocks[4], th.blocks[6]];
        for (let k = 0; k < 4; k++) {
          g.fillStyle = rgba(ic[k], 0.4 * a);
          INV.forEach((row, r) => { const rw = frame && r === 7 ? '01000000010' : row; for (let c = 0; c < 11; c++) if (rw[c] === '1') g.fillRect(ox + k * cw + c * px, oy + r * px, px, px); });
        }
        g.fillStyle = `rgba(0,0,0,${0.18 * a})`; for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 1.5);
      },
    };
  },
});
