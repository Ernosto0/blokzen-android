import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { poly } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  park(th) { // drifting clouds, kites on long strings, butterflies, swaying grass and a line of ants
    let t = 0;
    const CL = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.05, 0.4), s: rand(0.7, 1.3), v: rand(0.006, 0.014) }));
    const KI = [0, 1].map(i => ({ x: i ? 0.8 : 0.22, y: i ? 0.14 : 0.24, c: th.blocks[i ? 4 : 0], c2: th.blocks[i ? 2 : 5], ph: rand(0, 6.3) }));
    const BF = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.3, 0.9), vx: 0, vy: 0, ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0] }));
    const GR = [...Array(70)].map(() => ({ x: Math.random(), h: rand(0.03, 0.07), ph: rand(0, 6.3) }));
    return {
      step(dt) {
        t += dt;
        for (const c of CL) { c.x += c.v * dt; if (c.x > 1.3) c.x = -0.3; }
        const damp = Math.pow(0.5, dt);
        for (const b of BF) {
          b.vx = (b.vx + (Math.random() - 0.5) * 0.4 * dt) * damp; b.vy = (b.vy + (Math.random() - 0.5) * 0.4 * dt) * damp;
          b.x += b.vx * dt; b.y += b.vy * dt; b.ph += dt * 18;
          if (b.x < -0.05) b.x = 1.05; if (b.x > 1.05) b.x = -0.05; if (b.y < 0.2) b.vy += 0.05 * dt; if (b.y > 0.95) b.vy -= 0.05 * dt;
        }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const c of CL) {
          const cx = c.x * w, cy = c.y * h, r = u * 0.05 * c.s;
          g.beginPath(); for (const [dx, dy, q] of [[-1.2, 0.2, 0.8], [0, -0.2, 1.1], [1.2, 0.2, 0.8], [0.5, 0.3, 0.9], [-0.5, 0.3, 0.9]]) { g.moveTo(cx + dx * r + q * r, cy + dy * r); g.arc(cx + dx * r, cy + dy * r, q * r, 0, Math.PI * 2); }
          g.fillStyle = `rgba(255,255,255,${0.7 * a})`; g.fill();
        }
        for (const k of KI) {
          const x = k.x * w + Math.sin(t * 0.7 + k.ph) * u * 0.03, y = k.y * h + Math.cos(t * 0.9 + k.ph) * u * 0.02, r = u * 0.05, tilt = Math.sin(t * 0.8 + k.ph) * 0.2;
          g.strokeStyle = `rgba(60,60,60,${0.3 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + r); g.quadraticCurveTo(x + u * 0.1, h * 0.6, k.x * w - u * 0.05, h * 1.02); g.stroke();
          g.save(); g.translate(x, y); g.rotate(tilt);
          poly(g, [[0, -r], [r * 0.7, 0], [0, r * 1.2], [-r * 0.7, 0]], rgba(k.c, 0.85 * a));
          poly(g, [[0, -r], [r * 0.7, 0], [0, 0]], rgba(k.c2, 0.85 * a)); poly(g, [[0, r * 1.2], [-r * 0.7, 0], [0, 0]], rgba(k.c2, 0.85 * a));
          g.strokeStyle = `rgba(80,60,60,${0.5 * a})`; g.beginPath(); g.moveTo(0, r * 1.2);
          for (let i = 1; i <= 6; i++) g.lineTo(Math.sin(t * 3 + i + k.ph) * r * 0.3, r * 1.2 + i * r * 0.35); g.stroke();
          for (let i = 1; i <= 3; i++) { g.fillStyle = rgba(i % 2 ? k.c : k.c2, 0.8 * a); g.fillRect(Math.sin(t * 3 + i * 2 + k.ph) * r * 0.3 - 3, r * 1.2 + i * 2 * r * 0.35 - 2, 6, 4); }
          g.restore();
        }
        for (const b of BF) {
          const x = b.x * w, y = b.y * h, bs = u * 0.016, f = 0.25 + 0.75 * Math.abs(Math.sin(b.ph));
          g.fillStyle = rgba(b.c, 0.8 * a);
          for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(x + sd * bs * 0.6 * f, y - bs * 0.2, bs * 0.65 * f, bs * 0.8, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x + sd * bs * 0.45 * f, y + bs * 0.45, bs * 0.45 * f, bs * 0.5, 0, 0, Math.PI * 2); g.fill(); }
          g.fillStyle = `rgba(40,30,20,${0.8 * a})`; g.fillRect(x - 1, y - bs * 0.7, 2, bs * 1.4);
        }
        g.strokeStyle = `rgba(60,120,40,${0.55 * a})`; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath();
        for (const b of GR) { const x = b.x * w, hh = b.h * h, sw = Math.sin(t * 1.4 + b.ph) * hh * 0.25; g.moveTo(x, h); g.quadraticCurveTo(x, h - hh * 0.6, x + sw, h - hh); }
        g.stroke(); g.lineCap = 'butt';
        g.fillStyle = `rgba(40,25,15,${0.7 * a})`;
        const ay = h * 0.985, sp = u * 0.025, off = (t * u * 0.03) % sp;
        for (let x = -sp + off; x < w * 0.45; x += sp) { const bob = Math.sin(x * 0.3 + t * 8) * 0.8; g.fillRect(x, ay + bob, 3, 2); g.fillRect(x + 3.5, ay + bob, 2.5, 2); }
      },
    };
  },
});
