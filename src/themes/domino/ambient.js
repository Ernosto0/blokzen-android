import { rgba } from '../../core/color.js';
import { clamp01, inOut, lerp } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  dominorun(th) { // a long line of dominoes snaking over the felt; a wave knocks them down one after another, then they stand up again
    let felt = null, fw = 0, fh = 0, path = [], t = 0, phase = 0, head = 0, wait = 0, rise = 0;
    function build(w, h) {
      fw = w; fh = h; felt = document.createElement('canvas'); felt.width = Math.ceil(w); felt.height = Math.ceil(h);
      const g = felt.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 1800; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.025)' : 'rgba(0,0,0,.07)'; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
      const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)');
      g.fillStyle = v; g.fillRect(0, 0, w, h);
      const ys = [0.2, 0.43, 0.68, 0.955], pts = [], x0 = w * 0.06, x1 = w * 0.94;
      ys.forEach((yf, r) => { // rows across the table joined by turns at the ends
        const y = yf * h, ltr = r % 2 === 0, a0 = ltr ? x0 : x1, a1 = ltr ? x1 : x0;
        for (let k = 0; k <= 60; k++) pts.push([lerp(a0, a1, k / 60), y + Math.sin(k / 60 * Math.PI * 3 + r) * u * 0.015]);
        if (r < ys.length - 1) { const R = (ys[r + 1] * h - y) / 2; for (let k = 1; k < 24; k++) { const an = -Math.PI / 2 + k / 24 * Math.PI; pts.push([a1 + (ltr ? 1 : -1) * Math.cos(an) * Math.min(R * 0.4, w * 0.05), y + R + Math.sin(an) * R]); } }
      });
      path = []; const d = u * 0.034; let acc = 0;
      for (let i = 1; i < pts.length; i++) { // resample at even spacing
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i], seg = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax);
        while (acc <= seg) { const k = acc / seg; path.push({ x: lerp(ax, bx, k), y: lerp(ay, by, k), ang }); acc += d; }
        acc -= seg;
      }
    }
    return {
      step(dt) {
        t += dt;
        if (!path.length) return;
        if (phase === 0) { head += dt * 22; if (head > path.length + 3) { phase = 1; wait = 2.2; } }
        else if (phase === 1) { wait -= dt; if (wait <= 0) { phase = 2; rise = 0; } }
        else { rise += dt * 0.9; if (rise >= 1) { phase = 0; head = 0; } }
      },
      draw(g, w, h, a) {
        if (!felt || Math.abs(w - fw) > 1 || Math.abs(h - fh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(felt, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        const lamp = g.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.6); lamp.addColorStop(0, rgba(th.accent, 0.1 * a)); lamp.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = lamp; g.fillRect(0, 0, w, h);
        const T = u * 0.009, W = u * 0.022, L = u * 0.046, n = path.length;
        for (let i = 0; i < n; i++) {
          const d = path[i];
          const f = phase === 0 ? inOut(clamp01((head - i) / 2.5)) : phase === 1 ? 1 : 1 - inOut(clamp01(rise * 1.6 - (i / n) * 0.6));
          const len = lerp(T, L, f), off = lerp(0, L / 2 - T / 2, f);
          g.save(); g.translate(d.x, d.y); g.rotate(d.ang);
          g.fillStyle = `rgba(0,0,0,${0.25 * a})`; g.fillRect(off - len / 2 + 2, -W / 2 + 2, len, W);
          g.fillStyle = `rgba(246,238,222,${(0.42 + 0.18 * f) * a})`; g.fillRect(off - len / 2, -W / 2, len, W);
          if (f > 0.6) { // lying face up: the dividing line and a pip on each half
            g.fillStyle = `rgba(40,20,20,${0.45 * a})`; g.fillRect(off - 0.5, -W * 0.35, 1, W * 0.7);
            g.beginPath(); g.arc(off - len * 0.25, 0, W * 0.12, 0, Math.PI * 2); g.arc(off + len * 0.25, 0, W * 0.12, 0, Math.PI * 2); g.fillStyle = rgba(th.blocks[i % 7], 0.6 * a); g.fill();
          } else { g.fillStyle = `rgba(255,255,255,${0.25 * a})`; g.fillRect(off - len / 2, -W / 2, len, 1.5); }
          g.restore();
        }
      },
    };
  },
});
