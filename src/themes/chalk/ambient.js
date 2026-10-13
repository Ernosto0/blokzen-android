import { rgba } from '../../core/color.js';
import { clamp01, rand } from '../../core/util.js';
import { rr } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  blackboard(th) { // sums and drawings appear in chalk, stay a while, then an eraser wipes them; a ledge with chalk below
    let base = null, bw = 0, bh = 0, t = 0, next = 0.4;
    const TX = ['a² + b² = c²', 'x + 7 = 12', 'π ≈ 3,14', 'E = mc²', '√64 = 8', 'y = 2x + 1', '8 × 8 = 64', '∠A = 90°', '(a + b)²', 'Σ n', 'f(x) = x²', '3 · 4 = 12'];
    const SLOTS = [[0.05, 0.19], [0.55, 0.18], [0.03, 0.4], [0.82, 0.36], [0.03, 0.6], [0.82, 0.62], [0.06, 0.91], [0.56, 0.9], [0.3, 0.23], [0.3, 0.95]]; // clear of the score and level name at the top
    const items = [];
    const LIFE = 10.7;
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h);
      g.lineCap = 'round';
      for (let i = 0; i < 9; i++) { // old eraser swirls
        g.strokeStyle = `rgba(255,255,255,${rand(0.015, 0.035)})`; g.lineWidth = u * rand(0.05, 0.1);
        const x = Math.random() * w, y = Math.random() * h, r = u * rand(0.1, 0.25);
        g.beginPath(); g.arc(x, y, r, rand(0, 3), rand(3.5, 6)); g.stroke();
      }
      const lh = u * 0.03; // the wooden chalk ledge along the bottom
      g.fillStyle = 'rgba(112,74,42,.9)'; g.fillRect(0, h - lh, w, lh);
      g.fillStyle = 'rgba(255,230,190,.25)'; g.fillRect(0, h - lh, w, 2);
      const sticks = ['#f6f4ea', '#ffe27a', '#f5a3cf', '#8ecdf0'];
      for (let i = 0; i < 4; i++) { const x = w * (0.2 + i * 0.07); rr(g, x, h - lh - u * 0.012, u * 0.05, u * 0.012, u * 0.006); g.fillStyle = sticks[i]; g.fill(); }
      rr(g, w * 0.7, h - lh - u * 0.03, u * 0.11, u * 0.03, u * 0.006); g.fillStyle = 'rgba(150,110,70,.95)'; g.fill();
      g.fillStyle = 'rgba(60,60,64,.95)'; g.fillRect(w * 0.7, h - lh - u * 0.012, u * 0.11, u * 0.012);
      g.strokeStyle = 'rgba(90,60,34,.8)'; g.lineWidth = u * 0.018; g.strokeRect(u * 0.009, u * 0.009, w - u * 0.018, h - u * 0.018); // the frame
    }
    function add() {
      const used = new Set(items.map(o => o.slot)), free = SLOTS.map((_, i) => i).filter(i => !used.has(i));
      if (!free.length) return;
      const r = Math.random(), slot = free[(Math.random() * free.length) | 0];
      items.push({ slot, age: 0, kind: r < 0.6 ? 'text' : r < 0.8 ? 'circle' : 'tri', text: TX[(Math.random() * TX.length) | 0],
        col: Math.random() < 0.75 ? '#f6f4ea' : th.blocks[(Math.random() * 7) | 0] });
    }
    return {
      step(dt) {
        t += dt; next -= dt;
        if (next <= 0) { next = rand(2.2, 3.4); add(); }
        for (const o of items) o.age += dt;
        for (let i = items.length - 1; i >= 0; i--) if (items[i].age > LIFE) items.splice(i, 1);
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), fs = u * 0.055;
        g.font = `700 ${fs}px "Baloo 2", sans-serif`; g.textBaseline = 'middle'; g.textAlign = 'left'; g.lineCap = 'round'; g.lineJoin = 'round';
        for (const o of items) {
          const [sx, sy] = SLOTS[o.slot], x = sx * w, y = sy * h;
          const wr = clamp01(o.age / 1.6), er = clamp01((o.age - (LIFE - 1.1)) / 1.1);
          const R = u * 0.055, W = o.kind === 'text' ? g.measureText(o.text).width : o.kind === 'circle' ? R * 2 : R * 2.4, top = y - (o.kind === 'text' ? fs * 0.7 : 0), H = o.kind === 'text' ? fs * 1.4 : R * 2.2;
          g.save(); g.beginPath(); g.rect(x - 4 + er * (W + 8), top - 4, (W + 8) * (1 - er), H + 8); g.clip();
          if (o.kind === 'text') {
            g.beginPath(); g.rect(x - 4, top - 4, (W + 8) * wr, H + 8); g.clip();
            g.fillStyle = rgba(o.col, 0.55 * a); g.fillText(o.text, x, y);
            g.fillStyle = rgba(o.col, 0.22 * a); g.fillText(o.text, x + 1.2, y + 0.8);
          } else {
            g.strokeStyle = rgba(o.col, 0.55 * a); g.lineWidth = 2.5;
            if (o.kind === 'circle') {
              const L = Math.PI * 2 * R; g.setLineDash([L * wr, L + 1]);
              g.beginPath(); g.arc(x + R, y + R, R, -Math.PI / 2, Math.PI * 1.5); g.stroke(); g.setLineDash([]);
              if (wr >= 1) { g.beginPath(); g.moveTo(x + R, y + R); g.lineTo(x + R * 1.7, y + R * 0.3); g.stroke(); g.beginPath(); g.arc(x + R, y + R, 2.5, 0, Math.PI * 2); g.fillStyle = rgba(o.col, 0.6 * a); g.fill(); }
            } else {
              const A = [x, y], B = [x, y + R * 2], C = [x + R * 2.4, y + R * 2], L = R * 2 + R * 2.4 + Math.hypot(R * 2.4, R * 2);
              g.setLineDash([L * wr, L + 1]); g.beginPath(); g.moveTo(...A); g.lineTo(...B); g.lineTo(...C); g.closePath(); g.stroke(); g.setLineDash([]);
              if (wr >= 1) { g.strokeRect(x, y + R * 2 - R * 0.35, R * 0.35, R * 0.35); }
            }
          }
          g.restore();
          if (er > 0 && er < 1) { // the eraser passing over, a smear of dust behind it
            g.fillStyle = `rgba(255,255,255,${0.06 * a * (1 - er)})`; g.fillRect(x - 4, top - 4, (W + 8) * er, H + 8);
            const ex = x - 4 + er * (W + 8), eh = H + 12;
            rr(g, ex - u * 0.015, top - 6, u * 0.04, eh, u * 0.008); g.fillStyle = `rgba(150,110,70,${0.9 * a})`; g.fill();
            g.fillStyle = `rgba(60,60,64,${0.95 * a})`; g.fillRect(ex - u * 0.015, top - 6, u * 0.015, eh);
          }
        }
      },
    };
  },
});
