import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { noteShape } from './helpers.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  musicbox(th) { // a turning pin cylinder under its comb, notes rising
    const N2 = [...Array(14)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.02, 0.05), ph: rand(0, 6.3), s: rand(0.6, 1.2), c: Math.random() < 0.5 ? th.accent : th.blocks[(Math.random() * 7) | 0] }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const n of N2) { n.y -= n.v * dt; if (n.y < -0.05) { n.y = 1.05; n.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h);
        const sp = g.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, M * 0.6); sp.addColorStop(0, rgba(th.accent, 0.08 * a)); sp.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = sp; g.fillRect(0, 0, w, h);
        for (const n of N2) { g.fillStyle = rgba(n.c, 0.4 * a); noteShape(g, (n.x + Math.sin(t + n.ph) * 0.02) * w, n.y * h, u * 0.03 * n.s); }
        const cy = h * 0.9, ch = u * 0.07;
        const cg = g.createLinearGradient(0, cy - ch / 2, 0, cy + ch / 2); cg.addColorStop(0, `rgba(246,224,138,${0.35 * a})`); cg.addColorStop(0.5, `rgba(184,144,44,${0.35 * a})`); cg.addColorStop(1, `rgba(120,90,30,${0.35 * a})`);
        g.fillStyle = cg; g.fillRect(0, cy - ch / 2, w, ch);
        const gap = u * 0.035, pos = t * u * 0.06, base = Math.floor(pos / gap), off = pos - base * gap;
        g.fillStyle = `rgba(255,240,190,${0.6 * a})`;
        for (let j = -1; j * gap < w + gap; j++) for (let r = 0; r < 4; r++) if (((j + base) * 7 + r * 3) % 5 === 0) g.fillRect(j * gap - off, cy - ch * 0.35 + r * ch * 0.22, 2.5, 2.5);
        g.strokeStyle = `rgba(220,220,230,${0.25 * a})`; g.lineWidth = 2;
        g.beginPath(); for (let x = u * 0.04; x < w; x += u * 0.025) { g.moveTo(x, cy - ch * 1.3); g.lineTo(x, cy - ch * 0.55); } g.stroke();
      },
    };
  },
});
