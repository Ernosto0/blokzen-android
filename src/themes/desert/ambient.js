import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { poly } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  hourglass(th) { // layered dunes at sunset, wind-blown sand, an hourglass slowly running out
    let land = null, lw = 0, lh = 0, t = 0;
    const WI = [...Array(50)].map(() => ({ x: Math.random(), y: rand(0.35, 1), v: rand(0.08, 0.2), l: rand(0.01, 0.03) }));
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d');
      [[0.66, 'rgba(230,160,90,.18)', 0.004, 0.05], [0.76, 'rgba(200,120,60,.26)', 0.006, 0.06], [0.87, 'rgba(140,76,36,.4)', 0.009, 0.05]].forEach(([y0, col, f, amp], i) => {
        g.beginPath(); g.moveTo(0, h);
        for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, h * y0 - Math.abs(Math.sin(x * f + i * 2)) * h * amp);
        g.lineTo(w, h); g.closePath(); g.fillStyle = col; g.fill();
      });
    }
    return {
      step(dt) { t += dt; for (const p of WI) { p.x += p.v * dt; if (p.x > 1.05) { p.x = -0.05; p.y = rand(0.35, 1); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sx = w * 0.7, sy = h * 0.66;
        const gl = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.5); gl.addColorStop(0, rgba(th.accent, 0.4 * a)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
        g.beginPath(); g.arc(sx, sy, u * 0.13, 0, Math.PI * 2); g.fillStyle = `rgba(255,200,120,${0.55 * a})`; g.fill();
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        g.strokeStyle = `rgba(255,224,170,${0.25 * a})`; g.lineWidth = 1; g.beginPath();
        for (const p of WI) { const x = p.x * w, y = p.y * h + Math.sin(t * 2 + p.y * 30) * 2; g.moveTo(x, y); g.lineTo(x - p.l * w, y + 1); }
        g.stroke();
        const hx = w * 0.1, hy = h * 0.86, hs = u * 0.085, f = (t % 45) / 45, hw = y => hs * (0.06 + 0.49 * Math.abs(y - hy) / hs);
        const y1 = hy - hs * 0.85 * (1 - f);
        if (f < 1) poly(g, [[hx - hw(y1), y1], [hx + hw(y1), y1], [hx + hs * 0.06, hy], [hx - hs * 0.06, hy]], `rgba(240,190,110,${0.7 * a})`);
        const yb = hy + hs - hs * 0.8 * f;
        poly(g, [[hx - hs * 0.55, hy + hs], [hx + hs * 0.55, hy + hs], [hx + hw(yb) * 0.9, yb], [hx - hw(yb) * 0.9, yb]], `rgba(240,190,110,${0.7 * a})`);
        g.strokeStyle = `rgba(240,190,110,${0.7 * a})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx, yb); g.stroke();
        g.strokeStyle = `rgba(255,236,200,${0.55 * a})`; g.lineWidth = 2;
        g.beginPath(); g.moveTo(hx - hs * 0.55, hy - hs); g.lineTo(hx + hs * 0.55, hy - hs); g.lineTo(hx + hs * 0.06, hy); g.lineTo(hx + hs * 0.55, hy + hs); g.lineTo(hx - hs * 0.55, hy + hs); g.lineTo(hx - hs * 0.06, hy); g.closePath(); g.stroke();
        g.fillStyle = `rgba(110,62,26,${0.9 * a})`; g.fillRect(hx - hs * 0.72, hy - hs - hs * 0.14, hs * 1.44, hs * 0.14); g.fillRect(hx - hs * 0.72, hy + hs, hs * 1.44, hs * 0.14);
      },
    };
  },
});
