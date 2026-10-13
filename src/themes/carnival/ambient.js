import { rgba } from '../../core/color.js';
import { state } from '../../core/state.js';
import { rand } from '../../core/util.js';
import { rr } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  carnival(th) { // a turning ferris wheel, bulb strings, bursts of fireworks
    let t = 0, fw = [], fwait = rand(1, 3);
    const BUL = [...Array(14)].map((_, i) => th.blocks[i % 7]);
    return {
      step(dt) {
        t += dt; fwait -= dt;
        if (fwait < 0) {
          fwait = rand(1.5, 3.5);
          if (!state.REDUCED) { const x = rand(0.25, 0.85), y = rand(0.08, 0.3), c = th.blocks[(Math.random() * 7) | 0]; for (let i = 0; i < 28; i++) { const an = i / 28 * Math.PI * 2, v = rand(0.12, 0.22); fw.push({ x, y, vx: Math.cos(an) * v, vy: Math.sin(an) * v, life: 0, c }); } }
        }
        for (const p of fw) { p.life += dt / 1.4; p.vx *= Math.exp(-1.5 * dt); p.vy = p.vy * Math.exp(-1.5 * dt) + 0.08 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        fw = fw.filter(p => p.life < 1);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), cx = w * 0.16, cy = h * 0.66, R = u * 0.34, rot = t * 0.15;
        g.strokeStyle = `rgba(200,180,230,${0.25 * a})`; g.lineWidth = 4;
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx - R * 0.5, h); g.moveTo(cx, cy); g.lineTo(cx + R * 0.5, h); g.stroke();
        g.strokeStyle = `rgba(255,220,150,${0.28 * a})`; g.lineWidth = 3;
        g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(cx, cy, R * 0.9, 0, Math.PI * 2); g.stroke();
        g.lineWidth = 1.5; g.beginPath();
        for (let i = 0; i < 12; i++) { const an = rot + i * Math.PI / 6; g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); }
        g.stroke();
        const step = Math.floor(t * 4);
        for (let i = 0; i < 24; i++) { const an = rot + i * Math.PI / 12, on = (i + step) % 3 === 0; g.beginPath(); g.arc(cx + Math.cos(an) * R, cy + Math.sin(an) * R, on ? 3 : 2, 0, Math.PI * 2); g.fillStyle = on ? `rgba(255,246,200,${0.9 * a})` : `rgba(255,220,150,${0.35 * a})`; g.fill(); }
        for (let i = 0; i < 8; i++) {
          const an = rot + i * Math.PI / 4, x = cx + Math.cos(an) * R, y = cy + Math.sin(an) * R, gs2 = u * 0.035;
          g.strokeStyle = `rgba(255,220,150,${0.4 * a})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + gs2 * 0.5); g.stroke();
          rr(g, x - gs2 * 0.5, y + gs2 * 0.5, gs2, gs2 * 0.7, gs2 * 0.2); g.fillStyle = rgba(th.blocks[i % 7], 0.6 * a); g.fill();
        }
        const sag = h * 0.05, wy = x => h * 0.02 + Math.pow(Math.sin(x * Math.PI * 2), 2) * sag;
        g.strokeStyle = `rgba(30,10,40,${0.8 * a})`; g.lineWidth = 1.5; g.beginPath();
        for (let i = 0; i <= 40; i++) { const x = i / 40; i ? g.lineTo(x * w, wy(x)) : g.moveTo(0, wy(0)); } g.stroke();
        BUL.forEach((c, i) => { const fx = (i + 0.5) / BUL.length, k = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.3); g.beginPath(); g.arc(fx * w, wy(fx) + u * 0.012, u * 0.009, 0, Math.PI * 2); g.fillStyle = rgba(c, (0.4 + 0.5 * k) * a); g.fill(); });
        g.save(); g.globalCompositeOperation = 'lighter';
        for (const p of fw) { g.fillStyle = rgba(p.c, (1 - p.life) * 0.9 * a); g.fillRect(p.x * w - 1.5, p.y * h - 1.5, 3, 3); }
        g.restore();
      },
    };
  },
});
