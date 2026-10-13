import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { fishShape } from './helpers.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  reef(th) { // shafts of light, schools of fish, swaying seaweed, rising bubbles
    const WEED = [...Array(10)].map((_, i) => ({ x: (i + rand(0.1, 0.9)) / 10, hg: rand(0.12, 0.3), ph: rand(0, 6.3), c: i % 3 ? '#2f9a6a' : '#e0708a', n: 2 + ((Math.random() * 2) | 0) }));
    const school = init => {
      const dir = Math.random() < 0.5 ? 1 : -1;
      return { x: init ? Math.random() : (dir > 0 ? -0.25 : 1.25), y: rand(0.12, 0.62), v: rand(0.03, 0.06), dir, c: th.blocks[(Math.random() * 7) | 0],
        F: [...Array(6 + ((Math.random() * 6) | 0))].map(() => [rand(-0.07, 0.07), rand(-0.04, 0.04), rand(0, 6.3)]) };
    };
    const SC = [school(true), school(true), school(true)];
    const BU = [...Array(18)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.003, 0.009), v: rand(0.04, 0.09), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        SC.forEach((s, i) => { s.x += s.v * s.dir * dt; if (s.x < -0.3 || s.x > 1.3) SC[i] = school(false); });
        for (const b of BU) { b.y -= b.v * dt; if (b.y < -0.02) { b.y = 1.02; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (let i = 0; i < 3; i++) {
          const x = w * (0.2 + i * 0.3) + Math.sin(t * 0.4 + i * 2) * w * 0.06;
          const gr = g.createLinearGradient(0, 0, 0, h * 0.7); gr.addColorStop(0, `rgba(255,255,230,${0.08 * a})`); gr.addColorStop(1, 'rgba(255,255,230,0)');
          g.fillStyle = gr; g.beginPath(); g.moveTo(x - w * 0.05, 0); g.lineTo(x + w * 0.06, 0); g.lineTo(x + w * 0.18, h * 0.7); g.lineTo(x - w * 0.03, h * 0.7); g.fill();
        }
        const fr = u * 0.014;
        for (const s of SC) for (const [ox, oy, ph] of s.F) fishShape(g, (s.x + ox) * w, (s.y + oy + Math.sin(t * 2 + ph) * 0.006) * h, fr, s.dir, rgba(s.c, 0.6 * a), Math.sin(t * 9 + ph));
        g.lineCap = 'round'; g.lineWidth = u * 0.016;
        for (const wd of WEED) {
          const x0 = wd.x * w, H = wd.hg * h;
          for (let k = 0; k < wd.n; k++) {
            const sw = Math.sin(t * 0.9 + wd.ph + k) * u * 0.05, xo = (k - (wd.n - 1) / 2) * u * 0.02;
            g.beginPath(); g.moveTo(x0 + xo, h); g.bezierCurveTo(x0 + xo - sw, h - H * 0.35, x0 + xo + sw, h - H * 0.7, x0 + xo + sw * 1.4, h - H * (0.85 + 0.1 * k));
            g.strokeStyle = rgba(wd.c, 0.5 * a); g.stroke();
          }
        }
        g.lineCap = 'butt'; g.lineWidth = 1;
        g.strokeStyle = `rgba(255,255,255,${0.35 * a})`;
        for (const b of BU) { g.beginPath(); g.arc((b.x + Math.sin(t + b.ph) * 0.006) * w, b.y * h, b.r * u, 0, Math.PI * 2); g.stroke(); }
      },
    };
  },
});
