import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { poly } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  charbagh(th) { // a Persian garden seen from above: a carpet border, water channels quartering it, cypresses, a fountain, rose petals
    let base = null, bw = 0, bh = 0, t = 0;
    const PE = [...Array(22)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.02, 0.045), rot: rand(0, 6.3), vr: rand(-1, 1), ph: rand(0, 6.3) }));
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h), cx = w / 2, cy = h / 2, ch = u * 0.05, m = u * 0.03, bd = u * 0.05, i0 = m + bd;
      g.strokeStyle = rgba(th.accent, 0.2); g.lineWidth = 2; g.strokeRect(m, m, w - 2 * m, h - 2 * m); g.strokeRect(i0, i0, w - 2 * i0, h - 2 * i0);
      const dm = (x, y) => poly(g, [[x, y - bd * 0.3], [x + bd * 0.3, y], [x, y + bd * 0.3], [x - bd * 0.3, y]], rgba(th.blocks[0], 0.22));
      for (let x = i0; x < w - i0; x += bd) { dm(x, m + bd / 2); dm(x, h - m - bd / 2); }
      for (let y = i0; y < h - i0; y += bd) { dm(m + bd / 2, y); dm(w - m - bd / 2, y); }
      for (let i = 0; i < 220; i++) { // flower beds in the four quarters
        const x = i0 + Math.random() * (w - 2 * i0), y = i0 + Math.random() * (h - 2 * i0);
        if (Math.abs(x - cx) < ch * 2.2 || Math.abs(y - cy) < ch * 2.2) continue;
        g.beginPath(); g.arc(x, y, u * 0.006, 0, Math.PI * 2); g.fillStyle = rgba(th.blocks[(Math.random() * 7) | 0], 0.25); g.fill();
      }
      g.fillStyle = 'rgba(60,150,180,.2)'; g.fillRect(cx - ch / 2, i0, ch, h - 2 * i0); g.fillRect(i0, cy - ch / 2, w - 2 * i0, ch);
      const cyp = (x, y) => { const r = u * 0.014; g.beginPath(); g.moveTo(x, y - r * 2.4); g.quadraticCurveTo(x + r * 1.2, y, x, y + r); g.quadraticCurveTo(x - r * 1.2, y, x, y - r * 2.4); g.fillStyle = 'rgba(20,60,40,.45)'; g.fill(); };
      for (let y = i0 + u * 0.05; y < h - i0; y += u * 0.08) if (Math.abs(y - cy) > ch * 2) { cyp(cx - ch * 1.5, y); cyp(cx + ch * 1.5, y); }
      for (let x = i0 + u * 0.05; x < w - i0; x += u * 0.08) if (Math.abs(x - cx) > ch * 2) { cyp(x, cy - ch * 1.5); cyp(x, cy + ch * 1.5); }
      g.beginPath(); for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + Math.PI / 8; i ? g.lineTo(cx + Math.cos(an) * ch * 1.6, cy + Math.sin(an) * ch * 1.6) : g.moveTo(cx + Math.cos(an) * ch * 1.6, cy + Math.sin(an) * ch * 1.6); } g.closePath();
      g.fillStyle = 'rgba(60,150,180,.28)'; g.fill(); g.strokeStyle = rgba(th.accent, 0.3); g.stroke();
    }
    return {
      step(dt) { t += dt; for (const p of PE) { p.y += p.v * dt; p.x += Math.sin(t * 0.8 + p.ph) * 0.01 * dt; p.rot += p.vr * dt; if (p.y > 1.04) { p.y = -0.04; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), cx = w / 2, cy = h / 2, ch = u * 0.05, i0 = u * 0.08;
        g.fillStyle = `rgba(230,250,255,${0.35 * a})`; // light running along the channels, out from the fountain
        for (let k = 0; k < 5; k++) {
          const f = (t * 0.04 + k / 5) % 1;
          for (const [dx, dy, L] of [[0, -1, cy - i0], [0, 1, h - i0 - cy], [-1, 0, cx - i0], [1, 0, w - i0 - cx]]) {
            const d = ch * 1.6 + f * (L - ch * 1.6);
            g.beginPath(); g.ellipse(cx + dx * d, cy + dy * d, dx ? u * 0.018 : ch * 0.18, dy ? u * 0.018 : ch * 0.18, 0, 0, Math.PI * 2); g.fill();
          }
        }
        g.lineWidth = 1.5;
        for (let k = 0; k < 3; k++) { const f = ((t * 0.35 + k / 3) % 1 + 1) % 1; /* t can be negative */ g.beginPath(); g.arc(cx, cy, ch * 1.4 * f, 0, Math.PI * 2); g.strokeStyle = `rgba(230,250,255,${0.4 * (1 - f) * a})`; g.stroke(); }
        for (const p of PE) {
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.scale(1, 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + p.ph)));
          g.beginPath(); g.ellipse(0, 0, u * 0.009, u * 0.006, 0, 0, Math.PI * 2); g.fillStyle = `rgba(214,60,90,${0.65 * a})`; g.fill(); g.restore();
        }
      },
    };
  },
});
