import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { rr } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  sushibar(th) { // paper lanterns over a conveyor of sushi plates
    let t = 0;
    const PL = [...Array(8)].map((_, i) => ({ x: i / 8, c: th.blocks[(Math.random() * 7) | 0], rim: ['#d8344a', '#3a8ad8', '#e8b030'][(Math.random() * 3) | 0] }));
    const LN = [0.12, 0.38, 0.62, 0.88].map(x => ({ x, ph: rand(0, 6.3) }));
    return {
      step(dt) { t += dt; for (const p of PL) { p.x += 0.04 * dt; if (p.x > 1.1) { p.x -= 1.2; p.c = th.blocks[(Math.random() * 7) | 0]; } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), by = h * 0.86;
        const wood = g.createLinearGradient(0, by, 0, h); wood.addColorStop(0, `rgba(140,84,46,${0.4 * a})`); wood.addColorStop(1, `rgba(90,50,26,${0.5 * a})`);
        g.fillStyle = wood; g.fillRect(0, by, w, h - by);
        g.fillStyle = `rgba(60,60,66,${0.7 * a})`; g.fillRect(0, by - u * 0.03, w, u * 0.03);
        g.strokeStyle = `rgba(150,150,160,${0.3 * a})`; g.lineWidth = 1; const sp = u * 0.03, off = (t * 0.04 * w) % sp;
        g.beginPath(); for (let x = -sp + off; x < w + sp; x += sp) { g.moveTo(x, by - u * 0.03); g.lineTo(x, by); } g.stroke();
        for (const p of PL) {
          const x = p.x * w, y = by - u * 0.035;
          g.beginPath(); g.ellipse(x, y, u * 0.05, u * 0.016, 0, 0, Math.PI * 2); g.fillStyle = `rgba(250,248,244,${0.75 * a})`; g.fill();
          g.strokeStyle = rgba(p.rim, 0.7 * a); g.lineWidth = 2; g.stroke();
          rr(g, x - u * 0.028, y - u * 0.028, u * 0.056, u * 0.022, u * 0.008); g.fillStyle = `rgba(247,242,234,${0.9 * a})`; g.fill();
          rr(g, x - u * 0.03, y - u * 0.04, u * 0.06, u * 0.016, u * 0.008); g.fillStyle = rgba(p.c, 0.9 * a); g.fill();
        }
        for (const l of LN) {
          const sw = Math.sin(t * 0.9 + l.ph) * 0.06, x0 = l.x * w, L = h * 0.08, x = x0 + Math.sin(sw) * L, y = Math.cos(sw) * L, lr = u * 0.035;
          const gl = g.createRadialGradient(x, y + lr, 0, x, y + lr, lr * 4); gl.addColorStop(0, `rgba(255,140,80,${0.25 * a})`); gl.addColorStop(1, 'rgba(255,140,80,0)');
          g.fillStyle = gl; g.fillRect(x - lr * 4, y + lr - lr * 4, lr * 8, lr * 8);
          g.strokeStyle = `rgba(30,20,20,${0.6 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x, y); g.stroke();
          g.beginPath(); g.ellipse(x, y + lr * 1.2, lr, lr * 1.25, 0, 0, Math.PI * 2); g.fillStyle = `rgba(216,52,42,${0.75 * a})`; g.fill();
          g.strokeStyle = `rgba(120,20,16,${0.5 * a})`; for (let k = -2; k <= 2; k++) { g.beginPath(); g.ellipse(x, y + lr * 1.2 + k * lr * 0.4, lr * Math.sqrt(Math.max(0.05, 1 - (k * 0.32) ** 2)), lr * 0.08, 0, 0, Math.PI * 2); g.stroke(); }
          g.fillStyle = `rgba(30,20,20,${0.8 * a})`; g.fillRect(x - lr * 0.4, y - lr * 0.1, lr * 0.8, lr * 0.15); g.fillRect(x - lr * 0.4, y + lr * 2.4, lr * 0.8, lr * 0.15);
        }
      },
    };
  },
});
