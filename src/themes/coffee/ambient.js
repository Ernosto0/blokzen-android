import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

function beanMark(g, x, y, r, rot, fill, crease) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); g.ellipse(0, 0, r * 0.72, r, 0, 0, Math.PI * 2); g.fillStyle = fill; g.fill();
  g.beginPath(); g.moveTo(0, -r * 0.85); g.bezierCurveTo(r * 0.38, -r * 0.3, -r * 0.38, r * 0.3, 0, r * 0.85);
  g.strokeStyle = crease; g.lineWidth = Math.max(1, r * 0.14); g.lineCap = 'round'; g.stroke();
  g.restore();
}

Object.assign(AMBIENTS, {
  steam(th) { // steam rising from below, coffee beans drifting, warm cafe light
    const W3 = [0.2, 0.5, 0.8].map(x => ({ x, P: [] }));
    const BE = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.015, 0.035), rot: rand(0, 6.3), vr: rand(-0.6, 0.6) }));
    let t = 0, acc = 0;
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.25) { acc = 0; for (const s of W3) s.P.push({ y: 1.02, life: 0, ph: rand(0, 6.3) }); }
        for (const s of W3) { for (const p of s.P) { p.y -= 0.12 * dt; p.life += dt / 6; } s.P = s.P.filter(p => p.life < 1); }
        for (const b of BE) { b.y += b.vy * dt; b.rot += b.vr * dt; if (b.y > 1.04) { b.y = -0.04; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const warm = g.createRadialGradient(w / 2, h, 0, w / 2, h, Math.max(w, h) * 0.7); warm.addColorStop(0, rgba(th.accent, 0.22 * a)); warm.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = warm; g.fillRect(0, 0, w, h);
        for (const b of BE) beanMark(g, b.x * w, b.y * h, u * 0.018, b.rot, rgba('#2a160c', 0.6 * a), rgba('#8a5a3a', 0.55 * a));
        for (const s of W3) for (const p of s.P) {
          const x = (s.x + Math.sin(p.y * 7 + t * 0.6 + p.ph * 0.2) * 0.035) * w, y = p.y * h, r = u * (0.03 + p.life * 0.09);
          const al = Math.sin(p.life * Math.PI) * 0.07 * a;
          const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,245,235,${al})`); gr.addColorStop(1, 'rgba(255,245,235,0)');
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
});
