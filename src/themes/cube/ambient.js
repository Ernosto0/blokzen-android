import { hexOf, mixHex, rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { poly } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  cubes(th) { // puzzle cubes turning in space; now and then their stickers get shuffled
    const FACES = [[[1, 0, 0], [0, 0, -1], [0, 1, 0]], [[-1, 0, 0], [0, 0, 1], [0, 1, 0]], [[0, 1, 0], [1, 0, 0], [0, 0, 1]], [[0, -1, 0], [1, 0, 0], [0, 0, -1]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]], [[0, 0, -1], [-1, 0, 0], [0, 1, 0]]];
    const COLS = th.blocks.slice(0, 6);
    const mk = (x, y, s) => ({ x, y, s, ax: rand(0, 6.3), ay: rand(0, 6.3), vx: rand(0.1, 0.25), vy: rand(0.15, 0.35), st: FACES.map((_, f) => Array(9).fill(f)), flip: Array(54).fill(1), wait: rand(2, 6) });
    const C = [mk(0.12, 0.88, 0.075), mk(0.87, 0.83, 0.06), mk(0.9, 0.26, 0.045), mk(0.1, 0.27, 0.04)];
    const rot = (v, ax, ay) => { const [x, y, z] = v, cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax); const x1 = x * cy + z * sy, z1 = -x * sy + z * cy; return [x1, y * cx - z1 * sx, y * sx + z1 * cx]; };
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const c of C) {
          c.ax += c.vx * dt; c.ay += c.vy * dt; c.wait -= dt;
          for (let i = 0; i < 54; i++) c.flip[i] = Math.min(1, c.flip[i] + dt * 3);
          if (c.wait <= 0) { // shuffle a few stickers, or solve the cube again after a while
            c.wait = rand(3, 6);
            const solve = Math.random() < 0.25;
            c.st.forEach((f, fi) => f.forEach((_, i) => { if (solve ? f[i] !== fi : Math.random() < 0.35) { f[i] = solve ? fi : (Math.random() * 6) | 0; c.flip[fi * 9 + i] = 0; } }));
          }
        }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const c of C) {
          const S = c.s * u * 2, cx = c.x * w, cy = c.y * h;
          const faces = FACES.map(([n, uu, vv], fi) => ({ fi, n: rot(n, c.ax, c.ay), uu: rot(uu, c.ax, c.ay), vv: rot(vv, c.ax, c.ay) })).filter(f => f.n[2] > 0.02).sort((p, q) => p.n[2] - q.n[2]);
          for (const f of faces) {
            const at = (a2, b2) => [cx + (f.n[0] * 0.5 + f.uu[0] * (a2 - 0.5) + f.vv[0] * (b2 - 0.5)) * S, cy + (f.n[1] * 0.5 + f.uu[1] * (a2 - 0.5) + f.vv[1] * (b2 - 0.5)) * S];
            poly(g, [at(0, 0), at(1, 0), at(1, 1), at(0, 1)], `rgba(12,12,16,${0.85 * a})`);
            const lightK = 0.55 + 0.45 * f.n[2];
            for (let i = 0; i < 9; i++) {
              const q = (i % 3) / 3, r2 = ((i / 3) | 0) / 3, d = 0.025 + (1 - c.flip[f.fi * 9 + i]) * 0.13; // a sticker that just changed grows back in
              poly(g, [at(q + d, r2 + d), at(q + 1 / 3 - d, r2 + d), at(q + 1 / 3 - d, r2 + 1 / 3 - d), at(q + d, r2 + 1 / 3 - d)], rgba(hexOf(mixHex(COLS[c.st[f.fi][i]], '#000000', 1 - lightK)), 0.75 * a));
            }
          }
        }
        const glow = g.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, Math.max(w, h) * 0.6); glow.addColorStop(0, rgba(th.accent, 0.06 * a)); glow.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = glow; g.fillRect(0, 0, w, h);
      },
    };
  },
});
