import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  workshop() { // wooden planks, a window beam and drifting sawdust
    const P = [...Array(40)].map(() => ({ x: Math.random(), y: Math.random(), vx: rand(-0.01, 0.01), r: rand(0.6, 1.8), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.x += (p.vx + Math.sin(t * 0.5 + p.ph) * 0.006) * dt; p.y += 0.01 * dt; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } if (p.x < -0.03) p.x = 1.03; if (p.x > 1.03) p.x = -0.03; } },
      draw(g, w, h, a) {
        const pw = Math.max(60, w / 6);
        for (let i = 0; i * pw < w + pw; i++) {
          g.fillStyle = i % 2 ? `rgba(0,0,0,${0.05 * a})` : `rgba(255,255,255,${0.025 * a})`; g.fillRect(i * pw, 0, pw, h);
          g.fillStyle = `rgba(0,0,0,${0.3 * a})`; g.fillRect(i * pw, 0, 2, h);
          g.strokeStyle = `rgba(0,0,0,${0.08 * a})`; g.lineWidth = 1.2;
          for (let k = 0; k < 4; k++) { const x = i * pw + pw * (0.2 + k * 0.2); g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + pw * 0.08, h * 0.3, x - pw * 0.08, h * 0.6, x + pw * 0.03, h); g.stroke(); }
        }
        g.save(); g.translate(w * 0.8, 0); g.rotate(0.45);
        const beam = g.createLinearGradient(0, 0, 0, h * 1.2); beam.addColorStop(0, `rgba(255,217,160,${0.16 * a})`); beam.addColorStop(1, 'rgba(255,217,160,0)');
        g.fillStyle = beam; g.fillRect(-w * 0.18, 0, w * 0.36, h * 1.3); g.restore();
        for (const p of P) { g.beginPath(); g.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2); g.fillStyle = `rgba(255,226,170,${(0.3 + 0.3 * Math.sin(t * 2 + p.ph)) * a})`; g.fill(); }
      },
    };
  },
});
