import { rgba } from '../../core/color.js';
import { clamp01, rand } from '../../core/util.js';
import { hexPath, poly } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';
import { gearPath } from '../shared/shapes.js';

Object.assign(AMBIENTS, {
  drafting(th) { // blueprint paper: parts drawn line by line with dimensions, a compass swinging round, a title block in the corner
    let base = null, bw = 0, bh = 0, t = 0, next = 0.3;
    const SLOTS = [[0.06, 0.2], [0.62, 0.2], [0.08, 0.76], [0.58, 0.74], [0.3, 0.86], [0.04, 0.48], [0.74, 0.48]];
    const KINDS = ['circle', 'rect', 'hex', 'gear', 'angle'];
    const items = [], LIFE = 11;
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h), q = u * 0.035;
      g.lineWidth = 1;
      for (let i = 0, x = 0; x < w; i++, x += q) { g.strokeStyle = i % 5 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.11)'; g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, h); g.stroke(); }
      for (let i = 0, y = 0; y < h; i++, y += q) { g.strokeStyle = i % 5 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.11)'; g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(w, y + 0.5); g.stroke(); }
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.strokeRect(u * 0.02, u * 0.02, w - u * 0.04, h - u * 0.04);
      const tw = Math.min(w * 0.42, u * 0.5), tbh = u * 0.09, tx = w - u * 0.02 - tw, ty = h - u * 0.02 - tbh; // title block
      g.fillStyle = 'rgba(10,40,80,.5)'; g.fillRect(tx, ty, tw, tbh); g.strokeRect(tx, ty, tw, tbh);
      g.lineWidth = 1; g.beginPath(); g.moveTo(tx, ty + tbh / 2); g.lineTo(tx + tw, ty + tbh / 2); g.moveTo(tx + tw * 0.6, ty); g.lineTo(tx + tw * 0.6, ty + tbh); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.55)'; g.font = `700 ${tbh * 0.3}px "Baloo 2", sans-serif`; g.textBaseline = 'middle'; g.textAlign = 'left';
      g.fillText('BLOKZEN', tx + tw * 0.04, ty + tbh * 0.27); g.fillText('PAFTA 8×8', tx + tw * 0.04, ty + tbh * 0.76);
      g.fillText('ÖLÇEK 1:1', tx + tw * 0.64, ty + tbh * 0.27); g.fillText('A-01', tx + tw * 0.64, ty + tbh * 0.76);
    }
    function add() {
      const used = new Set(items.map(o => o.slot)), free = SLOTS.map((_, i) => i).filter(i => !used.has(i));
      if (!free.length) return;
      items.push({ slot: free[(Math.random() * free.length) | 0], age: 0, kind: KINDS[(Math.random() * KINDS.length) | 0], n: 10 + ((Math.random() * 90) | 0) });
    }
    return {
      step(dt) { t += dt; next -= dt; if (next <= 0) { next = rand(2.4, 3.6); add(); } for (const o of items) o.age += dt; for (let i = items.length - 1; i >= 0; i--) if (items[i].age > LIFE) items.splice(i, 1); },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), R = u * 0.06;
        g.lineCap = 'round'; g.lineJoin = 'round';
        for (const o of items) {
          const [sx, sy] = SLOTS[o.slot], x = sx * w + R * 1.2, y = sy * h + R * 1.2;
          const wr = clamp01(o.age / 2), fade = clamp01((LIFE - o.age) / 1.2), al = 0.6 * a * fade;
          g.strokeStyle = `rgba(244,249,255,${al})`; g.fillStyle = `rgba(244,249,255,${al})`; g.lineWidth = 1.8;
          const dash = L => g.setLineDash([L * wr, L + 1]);
          g.beginPath();
          if (o.kind === 'circle') { dash(Math.PI * 2 * R); g.arc(x, y, R, -Math.PI / 2, Math.PI * 1.5); }
          else if (o.kind === 'rect') { dash(R * 7.2); g.rect(x - R * 1.1, y - R * 0.7, R * 2.2, R * 1.4); }
          else if (o.kind === 'hex') { dash(R * 6.2); hexPath(g, x, y, R); }
          else if (o.kind === 'gear') { dash(R * 14); gearPath(g, x, y, R, 10, 0, 0.3); }
          else { dash(R * 4.4); g.moveTo(x - R, y + R * 0.6); g.lineTo(x + R * 1.2, y + R * 0.6); g.moveTo(x - R, y + R * 0.6); g.lineTo(x + R * 0.6, y - R * 0.9); }
          g.stroke(); g.setLineDash([]);
          if (wr >= 1) { // dimensions and a centre mark once the part is drawn
            g.lineWidth = 1;
            g.beginPath(); g.moveTo(x - R * 0.25, y); g.lineTo(x + R * 0.25, y); g.moveTo(x, y - R * 0.25); g.lineTo(x, y + R * 0.25); g.stroke();
            const dy = y + R * 1.45, x0 = x - R * 1.1, x1 = x + R * 1.1;
            g.beginPath(); g.moveTo(x0, dy); g.lineTo(x1, dy); g.moveTo(x0, dy - R * 0.2); g.lineTo(x0, dy + R * 0.2); g.moveTo(x1, dy - R * 0.2); g.lineTo(x1, dy + R * 0.2); g.stroke();
            poly(g, [[x0, dy], [x0 + R * 0.2, dy - R * 0.08], [x0 + R * 0.2, dy + R * 0.08]], `rgba(244,249,255,${al})`); poly(g, [[x1, dy], [x1 - R * 0.2, dy - R * 0.08], [x1 - R * 0.2, dy + R * 0.08]], `rgba(244,249,255,${al})`);
            g.font = `700 ${R * 0.42}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillStyle = `rgba(244,249,255,${al})`;
            g.fillText(o.kind === 'circle' ? `Ø${o.n}` : o.kind === 'angle' ? `${30 + (o.n % 4) * 15}°` : String(o.n), x, dy - R * 0.06);
          } else if (o.kind === 'circle') { // the compass swinging round while it draws
            const an = -Math.PI / 2 + wr * Math.PI * 2, px = x + Math.cos(an) * R, py = y + Math.sin(an) * R, hx = (x + px) / 2 - Math.sin(an) * R * 0.1, hy = Math.min(y, py) - R * 1.4;
            g.strokeStyle = `rgba(255,255,255,${0.75 * a})`; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x, y); g.lineTo(hx, hy); g.lineTo(px, py); g.stroke();
            g.beginPath(); g.arc(hx, hy, 3.5, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.9 * a); g.fill();
          }
        }
      },
    };
  },
});
