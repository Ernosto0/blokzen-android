import { rgba } from '../../core/color.js';
import { clamp01, inOut, lerp, rand } from '../../core/util.js';
import { jigPath } from './helpers.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  jigsawtable(th) { // a puzzle mat with the cut lines printed on it; loose pieces drift about and every few seconds one flies home
    let mat = null, mw = 0, mh = 0, q = 0, t = 0, acc = 1.2;
    const hsh = (i, j, k) => (Math.imul(i + 101, 73856093) ^ Math.imul(j + 37, 19349663) ^ Math.imul(k, 83492791)) >>> 0;
    const hor = (i, j) => (hsh(i, j, 1) >>> 4) & 1 ? 1 : -1, ver = (i, j) => (hsh(i, j, 2) >>> 4) & 1 ? 1 : -1;
    const edges = (i, j) => [-ver(i, j - 1), hor(i, j), ver(i, j), -hor(i - 1, j)];
    const mk = init => ({ x: init ? Math.random() : (Math.random() < 0.5 ? -0.1 : 1.1), y: Math.random(), vx: rand(-0.012, 0.012), vy: rand(-0.01, 0.01), rot: rand(0, 6.3), vr: rand(-0.3, 0.3),
      c: th.blocks[(Math.random() * 7) | 0], e: [0, 1, 2, 3].map(() => (Math.random() < 0.5 ? 1 : -1)), s: rand(0.8, 1.05), fly: null });
    const P = [...Array(8)].map(() => mk(true));
    let placed = [];
    function build(w, h) {
      mw = w; mh = h; q = Math.max(44, Math.min(w, h) * 0.11);
      mat = document.createElement('canvas'); mat.width = Math.ceil(w); mat.height = Math.ceil(h);
      const g = mat.getContext('2d');
      g.strokeStyle = 'rgba(90,60,30,.11)'; g.lineWidth = 1.5; g.lineJoin = 'round';
      for (let j = 0; j * q < h + q; j++) for (let i = 0; i * q < w + q; i++) { jigPath(g, i * q, j * q, q, edges(i, j)); g.stroke(); }
      placed = [];
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        for (const p of P) if (!p.fly) { p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; if (p.x < -0.15) p.x = 1.15; if (p.x > 1.15) p.x = -0.15; if (p.y < -0.15) p.y = 1.15; if (p.y > 1.15) p.y = -0.15; }
        if (acc > 2.6 && q) {
          acc = 0;
          const p = P.find(o => !o.fly), cols = Math.floor(mw / q), rows = Math.floor(mh / q);
          if (p && cols > 0 && rows > 0) {
            for (let tries = 0; tries < 12; tries++) {
              const i = (Math.random() * cols) | 0, j = (Math.random() * rows) | 0;
              if (placed.some(o => o.i === i && o.j === j)) continue;
              const r0 = ((p.rot % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI; // turn the short way round
              p.fly = { t: 0, r0, i, j }; p.e = edges(i, j);
              break;
            }
          }
        }
        P.forEach((p, k) => {
          if (!p.fly) return;
          p.fly.t += dt / 1.6;
          if (p.fly.t >= 1) { placed.push({ i: p.fly.i, j: p.fly.j, c: p.c, t0: t }); P[k] = mk(false); }
        });
        placed = placed.filter(o => t - o.t0 < 30);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const lamp = g.createRadialGradient(w * 0.15, 0, 0, w * 0.15, 0, Math.max(w, h) * 0.8); lamp.addColorStop(0, `rgba(255,236,190,${0.4 * a})`); lamp.addColorStop(1, 'rgba(255,236,190,0)');
        g.fillStyle = lamp; g.fillRect(0, 0, w, h);
        if (!mat || Math.abs(w - mw) > 1 || Math.abs(h - mh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(mat, 0, 0, w, h); g.globalAlpha = 1;
        g.lineJoin = 'round';
        for (const o of placed) {
          const age = t - o.t0, fade = age > 26 ? 1 - (age - 26) / 4 : 1, pop = clamp01(age / 0.35);
          jigPath(g, o.i * q, o.j * q, q, edges(o.i, o.j));
          g.fillStyle = rgba(o.c, 0.3 * a * fade); g.fill();
          g.strokeStyle = rgba(th.accent, (1 - pop) * 0.8 * a); g.lineWidth = 3; g.stroke();
        }
        for (const p of P) {
          let x = p.x * w, y = p.y * h, rot = p.rot, L = q * p.s;
          if (p.fly) { const e = inOut(clamp01(p.fly.t)); x = lerp(x, p.fly.i * q + q / 2, e); y = lerp(y, p.fly.j * q + q / 2, e); rot = lerp(p.fly.r0, 0, e); L = lerp(L, q, e); }
          const lift = p.fly ? Math.sin(Math.PI * clamp01(p.fly.t)) * u * 0.02 : 0;
          g.save(); g.translate(x, y - lift); g.rotate(rot);
          g.save(); g.translate(u * 0.008 + lift * 0.5, u * 0.012 + lift); jigPath(g, -L / 2, -L / 2, L, p.e); g.fillStyle = `rgba(60,40,20,${0.14 * a})`; g.fill(); g.restore();
          jigPath(g, -L / 2, -L / 2, L, p.e); g.fillStyle = rgba(p.c, 0.55 * a); g.fill();
          g.strokeStyle = `rgba(255,255,255,${0.55 * a})`; g.lineWidth = 1.5; g.stroke();
          g.restore();
        }
      },
    };
  },
});
