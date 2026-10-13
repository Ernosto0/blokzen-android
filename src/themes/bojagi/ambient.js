import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  hanok(th) { // the curved eave of a hanok, bojagi cloths swaying on a line, plum blossoms drifting
    let t = 0;
    const CL = [...Array(6)].map((_, i) => ({ c: th.blocks[(i * 3) % 7], c2: th.blocks[(i * 3 + 2) % 7], ph: rand(0, 6.3), s: rand(0.85, 1.15), sx: rand(0.35, 0.65) }));
    const PE = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.02, 0.05), rot: rand(0, 6.3), vr: rand(-1.2, 1.2), ph: rand(0, 6.3) }));
    return {
      step(dt) { t += dt; for (const p of PE) { p.y += p.v * dt; p.x += Math.sin(t * 0.7 + p.ph) * 0.012 * dt; p.rot += p.vr * dt; if (p.y > 1.04) { p.y = -0.04; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), eave = x => h * (0.03 + 0.06 * Math.sin(x / w * Math.PI)); // lowest in the middle, lifting at both ends
        g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); for (let x = w; x >= 0; x -= 10) g.lineTo(x, eave(x)); g.closePath();
        g.fillStyle = `rgba(58,52,64,${0.6 * a})`; g.fill();
        g.strokeStyle = `rgba(255,255,255,${0.25 * a})`; g.lineWidth = 1.5; g.beginPath();
        for (let x = 6; x < w; x += u * 0.03) { g.moveTo(x, eave(x) - u * 0.04); g.lineTo(x, eave(x)); } g.stroke(); // roof tile ends
        const ly = x => h * 0.2 + Math.sin(x / w * Math.PI) * h * 0.03;
        g.strokeStyle = `rgba(80,60,60,${0.45 * a})`; g.lineWidth = 1.2; g.beginPath();
        for (let x = 0; x <= w; x += 10) x ? g.lineTo(x, ly(x)) : g.moveTo(0, ly(0)); g.stroke();
        CL.forEach((c, i) => {
          const x = (i + 0.5) / CL.length * w, cw = u * 0.12 * c.s, ch = cw * 1.15, sx = -cw / 2 + cw * c.sx;
          g.save(); g.translate(x, ly(x)); g.rotate(Math.sin(t * 0.8 + c.ph) * 0.07);
          g.fillStyle = rgba(c.c, 0.32 * a); g.fillRect(-cw / 2, 0, cw, ch);
          g.fillStyle = rgba(c.c2, 0.3 * a); g.fillRect(sx, ch * 0.45, cw / 2 - sx, ch * 0.55);
          g.strokeStyle = `rgba(255,255,255,${0.6 * a})`; g.lineWidth = 1.2; g.strokeRect(-cw / 2, 0, cw, ch);
          g.beginPath(); g.moveTo(sx, ch * 0.45); g.lineTo(sx, ch); g.moveTo(-cw / 2, ch * 0.45); g.lineTo(cw / 2, ch * 0.45); g.stroke();
          g.fillStyle = `rgba(80,60,60,${0.6 * a})`; g.fillRect(-1.5, -3, 3, 5);
          g.restore();
        });
        for (const p of PE) { // plum blossoms: five round petals and a dark heart
          const r = u * 0.008;
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.fillStyle = `rgba(255,214,226,${0.85 * a})`;
          for (let k = 0; k < 5; k++) { const an = k * Math.PI * 0.4; g.beginPath(); g.arc(Math.cos(an) * r, Math.sin(an) * r, r * 0.8, 0, Math.PI * 2); g.fill(); }
          g.fillStyle = `rgba(200,58,90,${0.8 * a})`; g.beginPath(); g.arc(0, 0, r * 0.45, 0, Math.PI * 2); g.fill(); g.restore();
        }
      },
    };
  },
});
