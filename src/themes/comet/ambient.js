import { rgba } from '../../core/color.js';
import { state } from '../../core/state.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  comet(th) { // a great comet sweeping across the sky with a dust tail, stars, a nebula and now and then a meteor
    let t = 0, dust = [], met = null, mwait = rand(2, 5);
    const ST = [...Array(130)].map(() => ({ x: Math.random(), y: Math.random(), s: rand(0.5, 1.8), ph: rand(0, 6.3), f: rand(0.5, 2) }));
    const head = () => { const k = (t % 24) / 24; return [-0.15 + k * 1.3, 0.97 - k * 0.2]; }; // low across the sky, below the board
    return {
      step(dt) {
        t += dt;
        const [hx, hy] = head();
        if (!state.REDUCED) for (let i = 0; i < 3; i++) dust.push({ x: hx, y: hy, vx: -rand(0.02, 0.06), vy: rand(0.005, 0.03), life: 0, c: th.blocks[(Math.random() * 7) | 0] });
        for (const p of dust) { p.x += p.vx * dt; p.y += p.vy * dt; p.life += dt / 2.5; }
        dust = dust.filter(p => p.life < 1);
        mwait -= dt;
        if (!met && mwait < 0 && !state.REDUCED) { met = { x: rand(0.2, 1), y: rand(0, 0.3), life: 0 }; mwait = rand(3, 7); }
        if (met) { met.life += dt / 0.7; if (met.life >= 1) met = null; }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h);
        const neb = g.createRadialGradient(w * 0.3, h * 0.7, 0, w * 0.3, h * 0.7, M * 0.6); neb.addColorStop(0, rgba(th.blocks[5], 0.14 * a)); neb.addColorStop(1, rgba(th.blocks[5], 0));
        g.fillStyle = neb; g.fillRect(0, 0, w, h);
        for (const s2 of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * s2.f + s2.ph))) * a})`; g.fillRect(s2.x * w, s2.y * h, s2.s, s2.s); }
        const [hx, hy] = head(), x = hx * w, y = hy * h, L = M * 0.55;
        g.save(); g.globalCompositeOperation = 'lighter';
        for (const p of dust) { g.fillStyle = rgba(p.c, 0.5 * (1 - p.life) * a); g.fillRect(p.x * w, p.y * h, 2, 2); }
        g.translate(x, y); g.rotate(Math.atan2(0.2 * h, -1.3 * w) + Math.PI); // the tail points away from where it is heading
        for (const [wd, al, col] of [[0.16, 0.18, th.accent], [0.07, 0.35, '#ffffff'], [0.22, 0.08, th.blocks[6]]]) {
          const gr = g.createLinearGradient(0, 0, -L, 0); gr.addColorStop(0, rgba(col, al * a)); gr.addColorStop(1, rgba(col, 0));
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(-L, -L * wd); g.lineTo(-L, L * wd); g.closePath(); g.fill();
        }
        g.restore();
        const gl = g.createRadialGradient(x, y, 0, x, y, u * 0.08); gl.addColorStop(0, `rgba(255,255,255,${0.95 * a})`); gl.addColorStop(0.3, rgba(th.accent, 0.6 * a)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(x - u * 0.08, y - u * 0.08, u * 0.16, u * 0.16);
        if (met) {
          const k = met.life, mx = (met.x - k * 0.25) * w, my = (met.y + k * 0.18) * h, len = u * 0.15;
          const gr = g.createLinearGradient(mx, my, mx + len, my - len * 0.72); gr.addColorStop(0, `rgba(255,255,255,${(1 - k) * a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
          g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + len, my - len * 0.72); g.stroke();
        }
      },
    };
  },
});
