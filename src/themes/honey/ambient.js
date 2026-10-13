import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { hexPath } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  hive(th) {
    // honeycomb wall (pre-rendered), a few cells glowing with honey, drips from the top, bees drifting about
    let comb = null, cw = 0, ch = 0, cells = [];
    const R = 26;
    function build(w, h) {
      cw = w; ch = h; cells = [];
      comb = document.createElement('canvas'); comb.width = Math.ceil(w); comb.height = Math.ceil(h);
      const g = comb.getContext('2d'), dx = R * Math.sqrt(3), dy = R * 1.5;
      g.strokeStyle = rgba(th.accent, 0.13); g.lineWidth = 2; g.lineJoin = 'round';
      for (let row = -1, y = -R; y < h + R; row++, y += dy) {
        for (let x = (row & 1) ? dx / 2 : 0; x < w + dx; x += dx) {
          hexPath(g, x, y, R - 1.5); g.stroke();
          if (Math.random() < 0.09) cells.push({ x, y, ph: rand(0, 6.3), f: rand(0.3, 0.8) });
        }
      }
    }
    const drips = [...Array(6)].map(() => ({ x: Math.random(), len: rand(0, 0.06), max: rand(0.05, 0.13), sp: rand(0.006, 0.02), drop: null }));
    const bees = [...Array(5)].map(() => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const d of drips) {
          if (d.drop) { d.drop.v += 1.4 * dt; d.drop.y += d.drop.v * dt; if (d.drop.y > 1.1) d.drop = null; }
          d.len += d.sp * dt;
          if (d.len > d.max) { d.drop = { y: d.len, v: 0.02 }; d.len = 0.015; d.max = rand(0.05, 0.13); d.sp = rand(0.006, 0.02); }
        }
        const damp = Math.pow(0.5, dt);
        for (const b of bees) {
          b.vx = (b.vx + (Math.random() - 0.5) * 0.5 * dt) * damp; b.vy = (b.vy + (Math.random() - 0.5) * 0.5 * dt) * damp;
          b.x += b.vx * dt; b.y += b.vy * dt; b.ph += dt * 40;
          if (b.x < -0.05) b.x = 1.05; if (b.x > 1.05) b.x = -0.05; if (b.y < -0.05) b.y = 1.05; if (b.y > 1.05) b.y = -0.05;
        }
      },
      draw(g, w, h, a) {
        if (!comb || Math.abs(w - cw) > 1 || Math.abs(h - ch) > 1) build(w, h);
        const warm = g.createLinearGradient(0, h * 0.55, 0, h);
        warm.addColorStop(0, rgba(th.accent, 0)); warm.addColorStop(1, rgba(th.accent, 0.2 * a));
        g.fillStyle = warm; g.fillRect(0, h * 0.55, w, h * 0.45);
        g.globalAlpha = a; g.drawImage(comb, 0, 0, w, h); g.globalAlpha = 1;
        for (const c of cells) {
          const k = (0.5 + 0.5 * Math.sin(t * c.f + c.ph)) * a;
          hexPath(g, c.x, c.y, R - 3);
          g.fillStyle = rgba(th.accent, 0.05 + 0.13 * k); g.fill();
        }
        const u = Math.min(w, h);
        for (const d of drips) {
          const x = d.x * w, len = d.len * h, bw = u * 0.012;
          g.fillStyle = rgba('#f2a516', 0.75 * a);
          g.beginPath(); g.moveTo(x - bw * 1.8, 0); g.quadraticCurveTo(x - bw * 0.6, len * 0.5, x - bw, len);
          g.arc(x, len, bw, Math.PI, 0, true); g.quadraticCurveTo(x + bw * 0.6, len * 0.5, x + bw * 1.8, 0); g.fill();
          g.beginPath(); g.arc(x - bw * 0.35, len - bw * 0.1, bw * 0.3, 0, Math.PI * 2); g.fillStyle = `rgba(255,248,220,${0.6 * a})`; g.fill();
          if (d.drop) {
            const y = d.drop.y * h;
            g.beginPath(); g.ellipse(x, y, bw * 0.9, bw * 1.25, 0, 0, Math.PI * 2); g.fillStyle = rgba('#f2a516', 0.7 * a); g.fill();
          }
        }
        const top =g.createLinearGradient(0, 0, 0, u * 0.025);
        top.addColorStop(0, rgba('#f2a516', 0.8 * a)); top.addColorStop(1, rgba('#f2a516', 0));
        g.fillStyle = top; g.fillRect(0, 0, w, u * 0.025);
        const bs = u * 0.016;
        for (const b of bees) {
          const x = b.x * w, y = b.y * h, dir = b.vx < 0 ? -1 : 1, flap = 0.5 + 0.5 * Math.sin(b.ph);
          g.save(); g.translate(x, y); g.scale(dir, 1);
          g.fillStyle = `rgba(255,255,255,${0.45 * a})`;
          g.beginPath(); g.ellipse(-bs * 0.2, -bs * 1.1, bs * 0.9, bs * (0.35 + 0.4 * flap), -0.4, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.ellipse(bs * 0.4, -bs * 1.0, bs * 0.7, bs * (0.3 + 0.35 * flap), 0.3, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.ellipse(0, 0, bs * 1.4, bs, 0, 0, Math.PI * 2); g.fillStyle = rgba('#ffc93a', 0.9 * a); g.fill();
          g.save(); g.clip(); g.fillStyle = rgba('#2a1703', 0.9 * a);
          g.fillRect(-bs * 0.55, -bs, bs * 0.38, bs * 2); g.fillRect(bs * 0.15, -bs, bs * 0.38, bs * 2); g.restore();
          g.restore();
        }
      },
    };
  },
});
