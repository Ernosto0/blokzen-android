import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  cappadocia(th) { // hot air balloons drifting up behind fairy chimneys
    let land = null, lw = 0, lh = 0, t = 0;
    const mkB = init => ({ x: rand(0.05, 0.95), y: init ? rand(0.05, 0.85) : 1.1, v: rand(0.008, 0.02), s: rand(0.6, 1.3), c1: th.blocks[(Math.random() * 7) | 0], c2: th.blocks[(Math.random() * 7) | 0], ph: rand(0, 6.3), burn: 0 });
    const B = [...Array(7)].map(() => mkB(true)).sort((p, q) => p.s - q.s);
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h * 0.32);
      const g = land.getContext('2d'), H = land.height, u = Math.min(w, h);
      g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= w + 10; x += 10) g.lineTo(x, H * 0.45 + Math.sin(x * 0.008) * H * 0.1 + Math.sin(x * 0.023) * H * 0.05); g.lineTo(w, H); g.closePath();
      g.fillStyle = 'rgba(160,90,70,.22)'; g.fill();
      for (let i = 0; i < 10; i++) {
        const x = (i + 0.2 + Math.random() * 0.6) / 10 * w, hh = H * rand(0.35, 0.75), bw = u * rand(0.035, 0.065);
        g.beginPath(); g.moveTo(x - bw, H); g.quadraticCurveTo(x - bw * 0.6, H - hh * 0.6, x - bw * 0.25, H - hh); g.lineTo(x + bw * 0.25, H - hh); g.quadraticCurveTo(x + bw * 0.6, H - hh * 0.6, x + bw, H); g.closePath();
        g.fillStyle = 'rgba(176,116,86,.42)'; g.fill();
        g.beginPath(); g.ellipse(x, H - hh, bw * 0.45, bw * 0.25, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(96,56,44,.5)'; g.fill();
      }
      g.fillStyle = 'rgba(140,80,60,.3)'; g.fillRect(0, H * 0.88, w, H * 0.12);
    }
    return {
      step(dt) {
        t += dt;
        B.forEach((b, i) => {
          b.y -= b.v * dt; b.burn = Math.max(0, b.burn - dt);
          if (!b.burn && Math.random() < dt * 0.15) b.burn = 0.7;
          if (b.y < -0.2) { B[i] = mkB(false); B.sort((p, q) => p.s - q.s); }
        });
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const b of B) {
          const x = (b.x + Math.sin(t * 0.2 + b.ph) * 0.01) * w, y = b.y * h, r = u * 0.045 * b.s;
          const env = () => {
            g.beginPath(); g.arc(x, y, r, Math.PI * 0.85, Math.PI * 0.15);
            g.quadraticCurveTo(x + r * 0.55, y + r * 1.15, x + r * 0.28, y + r * 1.45); g.lineTo(x - r * 0.28, y + r * 1.45);
            g.quadraticCurveTo(x - r * 0.55, y + r * 1.15, x + Math.cos(Math.PI * 0.85) * r, y + Math.sin(Math.PI * 0.85) * r); g.closePath();
          };
          env(); g.fillStyle = rgba(b.c1, 0.8 * a); g.fill();
          g.save(); env(); g.clip(); g.fillStyle = rgba(b.c2, 0.8 * a);
          for (let k = -2; k <= 2; k += 2) g.fillRect(x + k * r * 0.4 - r * 0.1, y - r, r * 0.2, r * 2.5);
          const sh = g.createRadialGradient(x - r * 0.4, y - r * 0.4, 0, x, y, r * 1.5); sh.addColorStop(0, `rgba(255,255,255,${0.35 * a})`); sh.addColorStop(1, `rgba(0,0,0,${0.15 * a})`);
          g.fillStyle = sh; g.fillRect(x - r, y - r, r * 2, r * 2.6); g.restore();
          g.strokeStyle = `rgba(80,50,30,${0.6 * a})`; g.lineWidth = 1;
          g.beginPath(); g.moveTo(x - r * 0.28, y + r * 1.45); g.lineTo(x - r * 0.16, y + r * 1.75); g.moveTo(x + r * 0.28, y + r * 1.45); g.lineTo(x + r * 0.16, y + r * 1.75); g.stroke();
          g.fillStyle = `rgba(110,70,40,${0.85 * a})`; g.fillRect(x - r * 0.18, y + r * 1.75, r * 0.36, r * 0.26);
          if (b.burn) { const fl = 0.6 + 0.4 * Math.sin(t * 40); g.beginPath(); g.ellipse(x, y + r * 1.55, r * 0.08, r * 0.18 * fl, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,170,60,${0.9 * a})`; g.fill(); }
        }
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, h * 0.68, w, h * 0.32); g.globalAlpha = 1;
      },
    };
  },
});
