import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  prehistoric(th) { // a smoking volcano on the horizon, ferns, gliding pterosaurs
    let land = null, lw = 0, lh = 0, t = 0, acc = 0, SM = [];
    const PT = [0, 1].map(i => ({ x: Math.random(), y: rand(0.1, 0.32), v: rand(0.015, 0.03) * (i ? -1 : 1), ph: rand(0, 6.3), s: rand(0.8, 1.2) }));
    const CR = [0.78, 0.46];
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d'), u = Math.min(w, h), hy = h * 0.72;
      g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 10; x += 10) g.lineTo(x, hy - Math.abs(Math.sin(x * 0.006)) * h * 0.08 - Math.sin(x * 0.02) * h * 0.015); g.lineTo(w, h); g.closePath();
      g.fillStyle = 'rgba(90,60,40,.28)'; g.fill();
      g.beginPath(); g.moveTo(w * 0.58, hy); g.lineTo(w * (CR[0] - 0.05), h * CR[1]); g.lineTo(w * (CR[0] + 0.05), h * CR[1]); g.lineTo(w * 1.02, hy); g.closePath();
      g.fillStyle = 'rgba(70,45,30,.5)'; g.fill();
      g.strokeStyle = 'rgba(30,50,25,.5)'; g.lineCap = 'round';
      for (let i = 0; i < 14; i++) {
        const x = (i + Math.random()) / 14 * w, dir = Math.random() < 0.5 ? -1 : 1, H = u * rand(0.14, 0.26), ex = x + dir * H * 0.45, ey = h - H;
        g.lineWidth = 2; g.beginPath(); g.moveTo(x, h); g.quadraticCurveTo(x, h - H * 0.7, ex, ey); g.stroke();
        g.lineWidth = 1.5;
        for (let j = 1; j < 9; j++) {
          const q = j / 9, px = (1 - q) * (1 - q) * x + 2 * (1 - q) * q * x + q * q * ex, py = (1 - q) * (1 - q) * h + 2 * (1 - q) * q * (h - H * 0.7) + q * q * ey, L = H * 0.22 * (1 - q * 0.7);
          g.beginPath(); g.moveTo(px - L, py - L * 0.3); g.lineTo(px, py); g.lineTo(px + L, py - L * 0.3); g.stroke();
        }
      }
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.5) { acc = 0; SM.push({ x: CR[0] + rand(-0.01, 0.01), y: CR[1], life: 0 }); }
        for (const p of SM) { p.y -= 0.025 * dt; p.x += 0.008 * dt; p.life += dt / 8; }
        SM = SM.filter(p => p.life < 1);
        for (const p of PT) { p.x += p.v * dt; p.ph += dt * 3; if (p.x > 1.2) p.x = -0.2; if (p.x < -0.2) p.x = 1.2; }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const p of SM) {
          const r = u * (0.03 + p.life * 0.12), al = Math.sin(p.life * Math.PI) * 0.16 * a;
          const gr = g.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, r); gr.addColorStop(0, `rgba(120,100,90,${al})`); gr.addColorStop(1, 'rgba(120,100,90,0)');
          g.fillStyle = gr; g.fillRect(p.x * w - r, p.y * h - r, 2 * r, 2 * r);
        }
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        const pulse = 0.7 + 0.3 * Math.sin(t * 1.5), cx = CR[0] * w, cy = CR[1] * h, R = u * 0.12;
        const gl = g.createRadialGradient(cx, cy, 0, cx, cy, R); gl.addColorStop(0, rgba(th.accent, 0.45 * a * pulse)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        g.fillStyle = `rgba(40,25,15,${0.6 * a})`;
        for (const p of PT) {
          const x = p.x * w, y = p.y * h, bs = u * 0.04 * p.s, f = Math.sin(p.ph) * 0.4, dir = p.v > 0 ? 1 : -1;
          g.save(); g.translate(x, y); g.scale(dir, 1);
          g.beginPath(); g.moveTo(-bs * 0.1, 0); g.quadraticCurveTo(-bs * 0.5, -bs * (0.3 + f), -bs * 1.4, -bs * (0.15 + f)); g.lineTo(-bs * 0.25, bs * 0.12); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(bs * 0.1, 0); g.quadraticCurveTo(bs * 0.5, -bs * (0.3 + f), bs * 1.4, -bs * (0.15 + f)); g.lineTo(bs * 0.25, bs * 0.12); g.closePath(); g.fill();
          g.beginPath(); g.ellipse(0, bs * 0.04, bs * 0.32, bs * 0.1, 0, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.moveTo(bs * 0.28, 0); g.lineTo(bs * 0.6, bs * 0.06); g.lineTo(bs * 0.3, bs * 0.1); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(bs * 0.3, -bs * 0.02); g.lineTo(bs * 0.12, -bs * 0.22); g.lineTo(bs * 0.22, -bs * 0.02); g.closePath(); g.fill();
          g.restore();
        }
      },
    };
  },
});
