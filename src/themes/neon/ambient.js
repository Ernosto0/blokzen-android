import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  grid(th) {
    const S = [...Array(40)].map(() => ({ x: Math.random(), y: Math.random() * 0.6, r: rand(0.5, 1.4), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        const hy = h * 0.68, R = Math.min(w, h) * 0.26;
        for (const s of S) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.sin(t * 2 + s.ph)) * a})`; g.fillRect(s.x * w, s.y * hy, s.r, s.r); }
        // synth sun
        g.save(); g.beginPath(); g.rect(0, 0, w, hy); g.clip();
        const sun = g.createLinearGradient(0, hy - R, 0, hy);
        sun.addColorStop(0, rgba('#ffd23a', 0.85 * a)); sun.addColorStop(1, rgba(th.accent, 0.85 * a));
        g.beginPath(); g.arc(w / 2, hy, R, Math.PI, 0); g.fillStyle = sun; g.fill();
        g.fillStyle = th.bg;
        for (let k = 0; k < 6; k++) { const y = hy - R * (0.08 + k * 0.13); g.fillRect(w / 2 - R, y, 2 * R, R * (0.012 + k * 0.012)); }
        g.restore();
        // floor grid
        g.fillStyle = rgba(th.bg, a); g.fillRect(0, hy, w, h - hy);
        g.save(); g.strokeStyle = rgba(th.accent, 0.55 * a); g.lineWidth = 1.2; g.shadowColor = th.accent; g.shadowBlur = 6;
        g.beginPath(); g.moveTo(0, hy); g.lineTo(w, hy); g.stroke();
        for (let i = -14; i <= 14; i++) { g.beginPath(); g.moveTo(w / 2 + i * w * 0.012, hy); g.lineTo(w / 2 + i * w * 0.13, h); g.stroke(); }
        const off = (t * 0.35) % 1;
        for (let j = 0; j < 12; j++) { const z = (j + off) / 12, y = hy + (h - hy) * z * z; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.restore();
      },
    };
  },
});
