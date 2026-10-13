import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  tearoff(th) { // a big faint month grid with today circled, leaves tearing off and fluttering down
    let grid2 = null, gw = 0, gh = 0, t = 0;
    const today = new Date(), first = new Date(today.getFullYear(), today.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7, day = today.getDate();
    const mk = init => ({ x: Math.random(), y: init ? Math.random() : -0.1, rot: rand(0, 6.3), vr: rand(-1.4, 1.4), v: rand(0.03, 0.06), ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0], s: rand(0.7, 1.2) });
    const LV = [...Array(14)].map(() => mk(true));
    let cell = { x: 0, y: 0, r: 0 };
    function build(w, h) {
      gw = w; gh = h; grid2 = document.createElement('canvas'); grid2.width = Math.ceil(w); grid2.height = Math.ceil(h);
      const g = grid2.getContext('2d'), cs = Math.min(w * 0.9 / 7, h * 0.7 / 6), ox = (w - cs * 7) / 2, oy = h * 0.14;
      g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 1.5;
      for (let i = 0; i < 42; i++) {
        const r = (i / 7) | 0, c = i % 7;
        g.strokeRect(ox + c * cs + 3, oy + r * cs + 3, cs - 6, cs - 6);
        const d = i - offset + 1;
        if (d >= 1 && d <= 31) { g.fillStyle = c >= 5 ? 'rgba(255,120,100,.14)' : 'rgba(255,255,255,.1)'; g.font = `700 ${cs * 0.26}px "Baloo 2", sans-serif`; g.fillText(String(d), ox + c * cs + cs * 0.14, oy + r * cs + cs * 0.36); }
        if (d === day) cell = { x: ox + c * cs + cs / 2, y: oy + r * cs + cs / 2, r: cs * 0.42 };
      }
    }
    return {
      step(dt) { t += dt; LV.forEach((l, i) => { l.y += l.v * dt; l.rot += l.vr * dt; l.ph += dt * 4; l.x += Math.sin(t + l.ph * 0.2) * 0.012 * dt; if (l.y > 1.1) LV[i] = mk(false); }); },
      draw(g, w, h, a) {
        if (!grid2 || Math.abs(w - gw) > 1 || Math.abs(h - gh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(grid2, 0, 0, w, h); g.globalAlpha = 1;
        if (cell.r) { g.beginPath(); g.arc(cell.x, cell.y, cell.r * (1 + 0.04 * Math.sin(t * 2)), 0, Math.PI * 2); g.strokeStyle = rgba(th.accent, 0.35 * a); g.lineWidth = 3; g.stroke(); }
        const u = Math.min(w, h);
        for (const l of LV) {
          const lw = u * 0.06 * l.s, lh = lw * 1.15;
          g.save(); g.translate(l.x * w, l.y * h); g.rotate(l.rot); g.scale(1, 0.25 + 0.75 * Math.abs(Math.sin(l.ph)));
          g.fillStyle = `rgba(253,248,238,${0.6 * a})`; g.fillRect(-lw / 2, -lh / 2, lw, lh);
          g.fillStyle = rgba(l.c, 0.7 * a); g.fillRect(-lw / 2, -lh / 2, lw, lh * 0.32);
          g.restore();
        }
      },
    };
  },
});
