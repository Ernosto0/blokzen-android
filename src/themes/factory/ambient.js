import { rgba } from '../../core/color.js';
import { state } from '../../core/state.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  factory(th) { // a rotating beacon, a welding robot arm, a conveyor belt of crates
    let t = 0, spk = [], swait = rand(1, 3);
    const BOX = [...Array(6)].map((_, i) => ({ x: i / 6, c: th.blocks[(Math.random() * 7) | 0], s: rand(0.7, 1) }));
    return {
      step(dt) {
        t += dt;
        for (const b of BOX) { b.x += 0.05 * dt; if (b.x > 1.1) { b.x -= 1.2; b.c = th.blocks[(Math.random() * 7) | 0]; } }
        swait -= dt;
        if (swait < 0) { swait = rand(1.5, 4); if (!state.REDUCED) for (let i = 0; i < 22; i++) spk.push({ x: 0, y: 0, vx: rand(-0.25, 0.25), vy: rand(-0.35, 0.05), life: 0, max: rand(0.4, 0.9) }); }
        for (const p of spk) { p.life += dt; p.vy += 0.9 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        spk = spk.filter(p => p.life < p.max);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const bx = w * 0.1, by = h * 0.06, R = u * 0.5;
        g.save(); g.translate(bx, by); g.rotate(t * 2.4);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, R); gr.addColorStop(0, rgba(th.accent, 0.2 * a)); gr.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, -0.3, 0.3); g.closePath(); g.fill(); g.restore();
        g.beginPath(); g.arc(bx, by, u * 0.02, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.8 * a); g.fill();
        const ax = w * 0.86, ay = h * 0.74, a1 = -1.9 + 0.35 * Math.sin(t * 0.7), a2 = a1 + 1.2 + 0.5 * Math.sin(t * 0.7 + 1), L1 = u * 0.22, L2 = u * 0.17;
        const ex = ax + Math.cos(a1) * L1, ey = ay + Math.sin(a1) * L1, tx = ex + Math.cos(a2) * L2, ty = ey + Math.sin(a2) * L2;
        g.fillStyle = `rgba(150,160,175,${0.3 * a})`; g.fillRect(ax - u * 0.05, ay, u * 0.1, h - ay);
        g.lineCap = 'round'; g.strokeStyle = `rgba(150,160,175,${0.35 * a})`; g.lineWidth = u * 0.035;
        g.beginPath(); g.moveTo(ax, ay); g.lineTo(ex, ey); g.lineTo(tx, ty); g.stroke();
        g.fillStyle = `rgba(170,180,195,${0.45 * a})`; for (const [x, y] of [[ax, ay], [ex, ey]]) { g.beginPath(); g.arc(x, y, u * 0.03, 0, Math.PI * 2); g.fill(); }
        const cl = 0.4 + 0.2 * Math.sin(t * 2);
        g.strokeStyle = rgba(th.accent, 0.5 * a); g.lineWidth = u * 0.012;
        g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a2 - cl) * u * 0.04, ty + Math.sin(a2 - cl) * u * 0.04); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a2 + cl) * u * 0.04, ty + Math.sin(a2 + cl) * u * 0.04); g.stroke();
        g.lineCap = 'butt';
        for (const p of spk) { const k = 1 - p.life / p.max; g.fillStyle = `rgba(255,${(180 + 70 * k) | 0},90,${k * a})`; g.fillRect(tx + p.x * u, ty + p.y * u, 2, 2); }
        const cy = h * 0.9, ch = h * 0.035, sp = u * 0.05, off = (t * 0.05 * w) % sp;
        g.fillStyle = `rgba(20,22,26,${0.85 * a})`; g.fillRect(0, cy, w, ch);
        g.strokeStyle = `rgba(120,130,140,${0.35 * a})`; g.lineWidth = 2;
        g.beginPath(); for (let x = -sp + off; x < w + sp; x += sp) { g.moveTo(x, cy); g.lineTo(x, cy + ch); } g.stroke();
        g.lineWidth = 1;
        for (const b of BOX) { const bs = u * 0.06 * b.s; g.fillStyle = rgba(b.c, 0.55 * a); g.fillRect(b.x * w, cy - bs, bs, bs); g.strokeStyle = `rgba(0,0,0,${0.3 * a})`; g.strokeRect(b.x * w, cy - bs, bs, bs); }
        g.save(); g.beginPath(); g.rect(0, cy + ch, w, h - cy - ch); g.clip();
        g.fillStyle = rgba(th.accent, 0.22 * a); const hh = h - cy;
        for (let x = -hh; x < w; x += u * 0.06) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + u * 0.03, h); g.lineTo(x + u * 0.03 + hh, cy); g.lineTo(x + hh, cy); g.fill(); }
        g.restore();
      },
    };
  },
});
