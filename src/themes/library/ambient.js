import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  library(th) { // full bookshelves, two flickering candles, dust in the air
    let shelves = null, sw = 0, sh = 0, t = 0;
    const DU = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.01, -0.003), ph: rand(0, 6.3) }));
    function build(w, h) {
      sw = w; sh = h; shelves = document.createElement('canvas'); shelves.width = Math.ceil(w); shelves.height = Math.ceil(h);
      const g = shelves.getContext('2d'), u = Math.min(w, h), rowH = u * 0.22;
      for (let y = rowH * 0.15; y < h; y += rowH) {
        for (let x = 0; x < w;) {
          const bw = u * rand(0.025, 0.05), bh = rowH * rand(0.6, 0.86), c = th.blocks[(Math.random() * 7) | 0];
          if (Math.random() < 0.08) { x += bw * 1.5; continue; } // a gap on the shelf
          g.fillStyle = rgba(c, 0.22); g.fillRect(x, y + rowH - bh - rowH * 0.08, bw - 1.5, bh);
          g.fillStyle = 'rgba(240,200,110,.12)'; g.fillRect(x, y + rowH - bh - rowH * 0.08 + bh * 0.12, bw - 1.5, 2); g.fillRect(x, y + rowH - rowH * 0.08 - bh * 0.15, bw - 1.5, 2);
          x += bw;
        }
        g.fillStyle = 'rgba(90,56,30,.5)'; g.fillRect(0, y + rowH - rowH * 0.08, w, rowH * 0.07);
      }
      const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
    }
    return {
      step(dt) { t += dt; for (const d of DU) { d.y += d.v * dt; d.x += Math.sin(t * 0.4 + d.ph) * 0.003 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!shelves || Math.abs(w - sw) > 1 || Math.abs(h - sh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(shelves, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const cx of [0.08, 0.92]) {
          const x = cx * w, y = h * 0.9, fl = 0.85 + 0.15 * Math.sin(t * 11 + cx * 7) * Math.sin(t * 6.3 + cx), R = u * 0.4 * fl;
          const gl = g.createRadialGradient(x, y - u * 0.1, 0, x, y - u * 0.1, R); gl.addColorStop(0, rgba(th.accent, 0.3 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - u * 0.1 - R, 2 * R, 2 * R);
          g.fillStyle = `rgba(240,228,200,${0.85 * a})`; g.fillRect(x - u * 0.014, y - u * 0.08, u * 0.028, u * 0.12);
          g.fillStyle = `rgba(160,120,60,${0.9 * a})`; g.fillRect(x - u * 0.03, y + u * 0.04, u * 0.06, u * 0.012);
          const fh = u * 0.04 * fl;
          g.beginPath(); g.moveTo(x, y - u * 0.08 - fh); g.quadraticCurveTo(x + u * 0.012, y - u * 0.08 - fh * 0.3, x, y - u * 0.078); g.quadraticCurveTo(x - u * 0.012, y - u * 0.08 - fh * 0.3, x, y - u * 0.08 - fh);
          g.fillStyle = `rgba(255,200,100,${0.95 * a})`; g.fill();
        }
        for (const d of DU) { const k = 0.5 + 0.5 * Math.sin(t * 1.5 + d.ph); g.fillStyle = `rgba(255,220,170,${(0.12 + 0.3 * k) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
});
