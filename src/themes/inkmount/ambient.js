import { state } from '../../core/state.js';
import { clamp01, inOut, rand } from '../../core/util.js';
import { rr } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';
import { mistBands } from '../shared/shapes.js';

Object.assign(AMBIENTS, {
  shanshui(th) { // ink mountains brushed in one layer at a time, mist between them, a boat on the river, birds, a red seal
    let layers = null, lw = 0, lh = 0, t = 0;
    const BD = [...Array(5)].map(() => ({ x: Math.random(), y: rand(0.08, 0.25), v: rand(0.015, 0.03), ph: rand(0, 6.3) }));
    function build(w, h) {
      lw = w; lh = h; layers = [];
      [[0.36, 0.16, 0.14], [0.5, 0.24, 0.22], [0.64, 0.28, 0.32], [0.8, 0.2, 0.45]].forEach(([y0, ph, ink], L) => {
        const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h);
        const g = c.getContext('2d');
        const P = [...Array(2 + L)].map(() => ({ x: Math.random() * w, hg: ph * h * rand(0.6, 1.2), wd: w * rand(0.15, 0.32) }));
        const top = x => { let y = h * y0; for (const p of P) { const d = (x - p.x) / p.wd; if (Math.abs(d) < 1) y = Math.min(y, h * y0 - p.hg * (1 - d * d) * (0.9 + 0.1 * Math.cos(d * 11))); } return y; };
        g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 6; x += 6) g.lineTo(x, top(x)); g.lineTo(w, h); g.closePath();
        const gr = g.createLinearGradient(0, h * y0 - ph * h * 1.2, 0, h * y0 + h * 0.14); gr.addColorStop(0, `rgba(28,26,22,${ink})`); gr.addColorStop(1, 'rgba(28,26,22,0)');
        g.fillStyle = gr; g.fill();
        g.strokeStyle = `rgba(28,26,22,${Math.min(0.8, ink * 1.6)})`; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 1.8;
        g.beginPath(); let on = false;
        for (let x = 0; x <= w + 6; x += 6) { const y = top(x); if (y < h * y0 - 1) { on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; } else on = false; }
        g.stroke();
        for (let i = 0; i < 30 + L * 10; i++) { // texture strokes running down the slopes
          const x = Math.random() * w, y = top(x); if (y >= h * y0 - 4) continue;
          g.lineWidth = rand(0.8, 2.2); g.beginPath(); g.moveTo(x, y + 2); g.quadraticCurveTo(x + rand(-8, 8), y + rand(8, 18), x + rand(-14, 14), y + rand(16, 34)); g.stroke();
        }
        layers.push(c);
      });
    }
    return {
      step(dt) { t += dt; for (const b of BD) { b.x += b.v * dt; b.ph += dt * 6; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.08, 0.25); } } },
      draw(g, w, h, a) {
        if (!layers || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        const u = Math.min(w, h), ct = t % 64, fade = state.REDUCED ? 1 : ct > 58 ? 1 - (ct - 58) / 6 : 1;
        layers.forEach((c, L) => { // far layers first, each painted in from left to right
          const r = state.REDUCED ? 1 : clamp01((ct - L * 5) / 8); if (r <= 0) return;
          g.save(); g.beginPath(); g.rect(0, 0, w * inOut(r), h); g.clip(); g.globalAlpha = a * fade; g.drawImage(c, 0, 0, w, h); g.restore();
        });
        mistBands(g, w, h, a, t, [0.42, 0.58, 0.74], '250,247,239');
        g.strokeStyle = `rgba(28,26,22,${0.18 * a})`; g.lineWidth = 1.5; g.beginPath(); // the river, a few dry strokes
        for (let i = 0; i < 4; i++) { const y = h * (0.87 + i * 0.03), x0 = w * (0.1 + i * 0.13 + 0.05 * Math.sin(t * 0.2 + i)); g.moveTo(x0, y); g.lineTo(x0 + w * 0.3, y); }
        g.stroke();
        const bx = (((t * 0.008) % 1.3) - 0.15) * w, by = h * 0.9, bs = u * 0.04;
        g.fillStyle = `rgba(28,26,22,${0.7 * a})`;
        g.beginPath(); g.moveTo(bx - bs, by); g.quadraticCurveTo(bx, by + bs * 0.35, bx + bs, by); g.closePath(); g.fill();
        g.fillRect(bx - bs * 0.1, by - bs * 0.45, bs * 0.12, bs * 0.45); g.beginPath(); g.arc(bx - bs * 0.04, by - bs * 0.5, bs * 0.1, 0, Math.PI * 2); g.fill();
        g.strokeStyle = `rgba(28,26,22,${0.5 * a})`; g.lineWidth = 1.4;
        for (const b of BD) { const x = b.x * w, y = b.y * h, s2 = u * 0.012, f = Math.sin(b.ph) * 0.5 + 0.5; g.beginPath(); g.moveTo(x - s2, y - s2 * 0.5 * f); g.quadraticCurveTo(x - s2 * 0.4, y - s2 * 0.6 * f, x, y); g.quadraticCurveTo(x + s2 * 0.4, y - s2 * 0.6 * f, x + s2, y - s2 * 0.5 * f); g.stroke(); }
        const sx = u * 0.05, sy = h * 0.8, ss = u * 0.06; // the painter's red seal
        rr(g, sx, sy, ss, ss * 1.3, ss * 0.08); g.fillStyle = `rgba(196,42,34,${0.75 * a})`; g.fill();
        g.strokeStyle = `rgba(255,240,230,${0.8 * a})`; g.lineWidth = Math.max(1, ss * 0.07); g.beginPath();
        g.moveTo(sx + ss * 0.2, sy + ss * 0.3); g.lineTo(sx + ss * 0.8, sy + ss * 0.3); g.moveTo(sx + ss * 0.5, sy + ss * 0.2); g.lineTo(sx + ss * 0.5, sy + ss * 1.1);
        g.moveTo(sx + ss * 0.22, sy + ss * 0.75); g.lineTo(sx + ss * 0.78, sy + ss * 0.75); g.stroke();
      },
    };
  },
});
