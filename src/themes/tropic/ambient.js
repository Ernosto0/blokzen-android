import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

function palm(g, x, y, H, dir, sway, a) {
  const tx = x + dir * H * 0.28 + sway * H, ty = y - H;
  g.strokeStyle = `rgba(90,60,30,${0.55 * a})`; g.lineWidth = H * 0.05; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + dir * H * 0.02, y - H * 0.6, tx, ty); g.stroke();
  g.fillStyle = `rgba(40,120,60,${0.6 * a})`;
  for (let i = 0; i < 6; i++) {
    const an = -Math.PI / 2 + (i - 2.5) * 0.55 + sway * 2, L = H * 0.32;
    const ex = tx + Math.cos(an) * L, ey = ty + Math.sin(an) * L + L * 0.35;
    g.beginPath(); g.moveTo(tx, ty);
    g.quadraticCurveTo(tx + Math.cos(an) * L * 0.6, ty + Math.sin(an) * L * 0.6 - L * 0.15, ex, ey);
    g.quadraticCurveTo(tx + Math.cos(an) * L * 0.5, ty + Math.sin(an) * L * 0.5 + L * 0.05, tx, ty);
    g.fill();
  }
  g.lineCap = 'butt';
}

Object.assign(AMBIENTS, {
  island(th) { // sun, rolling sea, palms leaning in from both sides, gulls
    let t = 0;
    const GU = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.08, 0.3), v: rand(0.02, 0.04), ph: rand(0, 6.3) }));
    return {
      step(dt) { t += dt; for (const b of GU) { b.x += b.v * dt; b.ph += dt * 6; if (b.x > 1.1) b.x = -0.1; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sy = h * 0.74, sx = w * 0.78, sr = u * 0.09, syy = h * 0.14;
        const gl = g.createRadialGradient(sx, syy, 0, sx, syy, sr * 3.5); gl.addColorStop(0, `rgba(255,240,180,${0.7 * a})`); gl.addColorStop(1, 'rgba(255,240,180,0)');
        g.fillStyle = gl; g.fillRect(sx - sr * 3.5, syy - sr * 3.5, sr * 7, sr * 7);
        g.beginPath(); g.arc(sx, syy, sr, 0, Math.PI * 2); g.fillStyle = `rgba(255,250,220,${0.9 * a})`; g.fill();
        const sea = g.createLinearGradient(0, sy, 0, h); sea.addColorStop(0, `rgba(30,150,170,${0.35 * a})`); sea.addColorStop(1, `rgba(20,110,140,${0.5 * a})`);
        g.fillStyle = sea; g.fillRect(0, sy, w, h - sy);
        g.strokeStyle = `rgba(255,255,255,${0.45 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const y0 = sy + (h - sy) * (0.1 + i * 0.2);
          g.beginPath(); for (let x = 0; x <= w + 10; x += 10) { const y = y0 + Math.sin(x * 0.03 + t * (1 + i * 0.2) + i) * u * 0.006; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        }
        palm(g, w * 0.04, h * 0.98, u * 0.5, 1, Math.sin(t * 0.8) * 0.05, a);
        palm(g, w * 0.96, h * 0.98, u * 0.45, -1, Math.sin(t * 0.8 + 2) * 0.05, a);
        g.strokeStyle = `rgba(40,60,60,${0.5 * a})`; g.lineWidth = 1.6;
        for (const b of GU) {
          const x = b.x * w, y = b.y * h, bs = u * 0.02, f = Math.sin(b.ph) * 0.5 + 0.5;
          g.beginPath(); g.moveTo(x - bs, y - bs * 0.3 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.6 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.6 * f, x + bs, y - bs * 0.3 * f); g.stroke();
        }
      },
    };
  },
});
