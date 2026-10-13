import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  lights() { // a string of twinkling bulbs and falling snow
    const BUL = ['#ff4a5a', '#ffd25a', '#4ad08a', '#5ab0ff', '#ff8ad0'];
    const SN = [...Array(60)].map(() => { const r = rand(0.002, 0.007); return { x: Math.random(), y: Math.random(), r, sp: 0.03 + r * 6, ph: rand(0, 6.3) }; });
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of SN) { p.y += p.sp * dt; p.ph += dt * 1.2; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sag = h * 0.06, wireY = x => h * 0.02 + Math.pow(Math.sin(x * Math.PI * 3), 2) * sag;
        g.strokeStyle = `rgba(10,26,16,${0.9 * a})`; g.lineWidth = 2; g.beginPath();
        for (let i = 0; i <= 60; i++) { const x = i / 60; i ? g.lineTo(x * w, wireY(x)) : g.moveTo(0, wireY(0)); }
        g.stroke();
        const n = Math.max(8, Math.round(w / 45));
        for (let i = 0; i < n; i++) {
          const fx = (i + 0.5) / n, x = fx * w, y = wireY(fx) + u * 0.014, c = BUL[i % BUL.length], k = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.7);
          const R = u * 0.05 * k, gl = g.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba(c, 0.5 * a * k)); gl.addColorStop(1, rgba(c, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - R, 2 * R, 2 * R);
          g.beginPath(); g.ellipse(x, y, u * 0.008, u * 0.013, 0, 0, Math.PI * 2); g.fillStyle = rgba(c, (0.6 + 0.4 * k) * a); g.fill();
        }
        for (const p of SN) { g.beginPath(); g.arc((p.x + Math.sin(p.ph) * 0.01) * w, p.y * h, p.r * u, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.8 * a})`; g.fill(); }
      },
    };
  },
});
