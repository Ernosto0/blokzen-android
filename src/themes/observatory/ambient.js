import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { sparkle } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  starchart(th) { // the sky turning round the pole star, constellation lines, brass rings, a telescope
    let t = 0;
    const ST = [...Array(120)].map(() => ({ r: Math.sqrt(Math.random()) * 1.1, an: rand(0, 6.3), s: rand(0.6, 1.8), ph: rand(0, 6.3) }));
    const CON = [...Array(5)].map(() => { const r0 = rand(0.25, 0.9), a0 = rand(0, 6.3); return [...Array(4 + ((Math.random() * 3) | 0))].map((_, i) => [r0 + rand(-0.08, 0.08), a0 + i * rand(0.08, 0.16)]); });
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h), px = w * 0.5, py = h * 0.12, rot = t * 0.02;
        const P = (r, an) => [px + Math.cos(an + rot) * r * M, py + Math.sin(an + rot) * r * M];
        for (const s2 of ST) { const [x, y] = P(s2.r, s2.an); g.fillStyle = `rgba(255,255,255,${(0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.3 + s2.ph))) * a})`; g.fillRect(x, y, s2.s, s2.s); }
        g.strokeStyle = rgba(th.accent, 0.22 * a); g.lineWidth = 1;
        for (const c of CON) { g.beginPath(); c.forEach(([r, an], i) => { const [x, y] = P(r, an); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); for (const [r, an] of c) { const [x, y] = P(r, an); g.beginPath(); g.arc(x, y, 2, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.6 * a); g.fill(); } }
        sparkle(g, px, py, u * 0.03, 0.9 * a);
        g.strokeStyle = rgba(th.accent, 0.16 * a); g.lineWidth = 2;
        for (const [R, sp] of [[0.5, -0.03], [0.62, 0.02]]) {
          g.beginPath(); g.arc(px, py, R * M, 0, Math.PI * 2); g.stroke();
          g.beginPath(); for (let i = 0; i < 72; i++) { const an = i / 72 * Math.PI * 2 + t * sp, l = i % 6 ? 0.012 : 0.03; g.moveTo(px + Math.cos(an) * R * M, py + Math.sin(an) * R * M); g.lineTo(px + Math.cos(an) * (R - l) * M, py + Math.sin(an) * (R - l) * M); } g.stroke();
        }
        const tx = w * 0.88, ty = h * 0.97; // telescope on its tripod
        g.strokeStyle = `rgba(200,170,110,${0.45 * a})`; g.lineWidth = 2; g.beginPath(); g.moveTo(tx, ty - u * 0.1); g.lineTo(tx - u * 0.05, ty); g.moveTo(tx, ty - u * 0.1); g.lineTo(tx + u * 0.05, ty); g.stroke();
        g.save(); g.translate(tx, ty - u * 0.1); g.rotate(-0.8); g.fillStyle = `rgba(200,170,110,${0.55 * a})`; g.fillRect(-u * 0.04, -u * 0.015, u * 0.16, u * 0.03); g.fillRect(u * 0.12, -u * 0.02, u * 0.03, u * 0.04); g.restore();
      },
    };
  },
});
