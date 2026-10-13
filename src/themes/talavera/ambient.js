import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';
import { papelPath } from './helpers.js';

Object.assign(AMBIENTS, {
  plaza(th) { // strings of papel picado over the square, an adobe arcade, confetti in the air
    let t = 0;
    const CF = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.07), rot: rand(0, 6.3), vr: rand(-2, 2), c: th.blocks[(Math.random() * 7) | 0] }));
    return {
      step(dt) { t += dt; for (const p of CF) { p.y += p.v * dt; p.rot += p.vr * dt; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), aw = Math.max(80, w / 4), ah = h * 0.2;
        g.fillStyle = `rgba(200,110,70,${0.18 * a})`; g.fillRect(0, h - ah, w, ah);
        g.fillStyle = `rgba(10,20,50,${0.4 * a})`;
        for (let x = aw / 2; x < w + aw; x += aw) { g.beginPath(); g.moveTo(x - aw * 0.32, h); g.lineTo(x - aw * 0.32, h - ah * 0.5); g.arc(x, h - ah * 0.5, aw * 0.32, Math.PI, 0); g.lineTo(x + aw * 0.32, h); g.closePath(); g.fill(); }
        for (const [y0, sag, n, sh] of [[0.03, 0.04, 9, 0], [0.13, 0.05, 7, 3]]) {
          const ly = x => h * y0 + Math.sin(x / w * Math.PI) * h * sag;
          g.strokeStyle = `rgba(255,255,255,${0.35 * a})`; g.lineWidth = 1; g.beginPath(); for (let x = 0; x <= w; x += 10) x ? g.lineTo(x, ly(x)) : g.moveTo(0, ly(0)); g.stroke();
          for (let i = 0; i < n; i++) {
            const x = (i + 0.5) / n * w, fw = Math.min(w / n * 0.8, u * 0.11);
            g.save(); g.translate(x, ly(x)); g.rotate(Math.sin(t * 1.4 + i * 0.9 + sh) * 0.12); g.scale(1, 0.9 + 0.1 * Math.cos(t * 2 + i));
            papelPath(g, -fw / 2, 0, fw, fw * 1.1); g.fillStyle = rgba(th.blocks[(i + sh) % 7], 0.7 * a); g.fill('evenodd');
            g.restore();
          }
        }
        for (const p of CF) { g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.fillStyle = rgba(p.c, 0.7 * a); g.fillRect(-u * 0.006, -u * 0.003, u * 0.012, u * 0.006); g.restore(); }
      },
    };
  },
});
