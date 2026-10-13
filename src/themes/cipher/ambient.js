import { rgba } from '../../core/color.js';
import { clamp01, rand } from '../../core/util.js';
import { rr } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  enigma(th) { // a cipher machine: rotors stepping at the sides, letters lighting on the lampboard, coded tape running out below
    const ROWS = ['QWERTZUIO', 'ASDFGHJK', 'PYXCVBNML'], ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let t = 0, keyT = 0.5, lit = null, rot = [3, 17, 9], step = [0, 0, 0], tape = '', off = 0, base = null, bw = 0, bh = 0;
    for (let i = 0; i < 60; i++) tape += (i % 6 === 5) ? ' ' : ABC[(Math.random() * 26) | 0];
    const lamps = [];
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 1400; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.02)' : 'rgba(0,0,0,.12)'; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } // crackle paint
      lamps.length = 0;
      const lr = Math.min(u * 0.026, w / 28), top = h * 0.885; // low, under the tray
      ROWS.forEach((row, ri) => [...row].forEach((ch, ci) => {
        const x = w / 2 + (ci - (row.length - 1) / 2) * lr * 2.6, y = top + ri * lr * 2.3;
        g.beginPath(); g.arc(x, y, lr, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.5)'; g.fill();
        g.beginPath(); g.arc(x, y, lr * 0.82, 0, Math.PI * 2); g.fillStyle = 'rgba(240,230,200,.05)'; g.fill();
        g.font = `700 ${lr}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(240,230,200,.2)'; g.fillText(ch, x, y + lr * 0.08);
        lamps.push({ ch, x, y, r: lr });
      }));
    }
    return {
      step(dt) {
        t += dt; keyT -= dt; off += dt * 26;
        if (keyT <= 0 && lamps.length) {
          keyT = rand(0.35, 0.9); lit = { i: (Math.random() * lamps.length) | 0, t0: t };
          step[2] = 1; rot[2] = (rot[2] + 1) % 26; // the fast rotor steps on every key, the next one every full turn
          if (rot[2] === 0) { step[1] = 1; rot[1] = (rot[1] + 1) % 26; if (rot[1] === 0) { step[0] = 1; rot[0] = (rot[0] + 1) % 26; } }
        }
        for (let k = 0; k < 3; k++) step[k] = Math.max(0, step[k] - dt * 5);
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        if (lit) { // the lit lamp glows, then fades
          const L = lamps[lit.i], k = clamp01(1 - (t - lit.t0) / 0.8);
          const gl = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r * 4); gl.addColorStop(0, rgba(th.accent, 0.55 * k * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(L.x - L.r * 4, L.y - L.r * 4, L.r * 8, L.r * 8);
          g.beginPath(); g.arc(L.x, L.y, L.r * 0.82, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.85 * k * a); g.fill();
          g.font = `800 ${L.r}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(40,24,4,${k * a})`; g.fillText(L.ch, L.x, L.y + L.r * 0.08);
        }
        const rw = u * 0.075, rh = u * 0.26; // three rotors standing at the edges, ridged, a window showing the letter
        [[0.035, 0], [0.965, 1], [0.035, 2]].forEach(([fx, k], idx) => {
          const x = fx * w - rw / 2, y = h * (idx === 2 ? 0.52 : 0.3) - rh / 2 + (idx === 1 ? h * 0.1 : 0);
          const gr = g.createLinearGradient(x, 0, x + rw, 0); gr.addColorStop(0, `rgba(40,44,46,${0.9 * a})`); gr.addColorStop(0.5, `rgba(120,126,124,${0.9 * a})`); gr.addColorStop(1, `rgba(40,44,46,${0.9 * a})`);
          g.fillStyle = gr; g.fillRect(x, y, rw, rh);
          const sp = rh / 12, ro = (rot[k] + 1 - step[k]) * sp;
          g.fillStyle = `rgba(0,0,0,${0.35 * a})`;
          for (let j = -1; j < 13; j++) { const yy = y + ((j * sp + ro) % rh + rh) % rh; g.fillRect(x, yy, rw, Math.max(1, sp * 0.25)); }
          rr(g, x + rw * 0.15, y + rh / 2 - rw * 0.4, rw * 0.7, rw * 0.8, rw * 0.1); g.fillStyle = `rgba(245,238,220,${0.85 * a})`; g.fill();
          g.font = `800 ${rw * 0.5}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(30,24,16,${a})`;
          g.fillText(ABC[rot[k]], x + rw / 2, y + rh / 2 + rw * 0.04 - step[k] * rw * 0.3);
        });
        const ty = h * 0.965, th2 = u * 0.04, cw = th2 * 0.62; // the coded tape running out along the bottom
        g.fillStyle = `rgba(240,232,210,${0.7 * a})`; g.fillRect(0, ty - th2 / 2, w, th2);
        g.font = `700 ${th2 * 0.7}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(40,30,20,${0.75 * a})`;
        const n = tape.length, shift = off % (n * cw);
        for (let i = 0; i * cw < w + cw * n; i++) { const x = i * cw - shift; if (x < -cw || x > w + cw) continue; g.fillText(tape[i % n], x, ty + th2 * 0.05); }
      },
    };
  },
});
