import { rgba } from '../../core/color.js';
import { clamp01, rand } from '../../core/util.js';
import { memoPin } from './helpers.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  corkboard(th) { // a cork board of clues: notes and photos pinned up, red string drawn between them one by one, a magnifying glass passing over
    let cork = null, cw = 0, ch = 0, t = 0, pins = [], links = [], drawn = 0, prog = 0;
    const SPOTS = [[0.12, 0.22], [0.46, 0.2], [0.85, 0.23], [0.93, 0.47], [0.06, 0.5], [0.12, 0.89], [0.5, 0.95], [0.87, 0.88], [0.66, 0.6], [0.3, 0.64]]; // clear of the score and level name at the top
    function build(w, h) {
      cw = w; ch = h; cork = document.createElement('canvas'); cork.width = Math.ceil(w); cork.height = Math.ceil(h);
      const g = cork.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 2600; i++) { const r = rand(0.6, 2); g.fillStyle = Math.random() < 0.6 ? 'rgba(20,10,0,.2)' : 'rgba(255,215,160,.08)'; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2); g.fill(); }
      pins = [];
      SPOTS.forEach(([fx, fy], i) => {
        const x = fx * w, y = fy * h, s = u * rand(0.12, 0.16), rot = rand(-0.18, 0.18), kind = i % 3, c = th.blocks[(i * 3) % 7];
        g.save(); g.translate(x, y); g.rotate(rot);
        g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-s / 2 + 3, -s * 0.4 + 4, s, s * 0.85);
        if (kind === 0) { // a photo
          g.fillStyle = '#efe9dc'; g.fillRect(-s / 2, -s * 0.4, s, s * 0.85);
          g.fillStyle = 'rgba(44,54,66,.9)'; g.fillRect(-s * 0.4, -s * 0.32, s * 0.8, s * 0.55);
          g.fillStyle = 'rgba(14,16,22,.6)'; g.beginPath(); g.arc(0, -s * 0.1, s * 0.1, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(0, s * 0.18, s * 0.22, s * 0.14, 0, Math.PI, 0); g.fill();
        } else if (kind === 1) { // a note
          g.fillStyle = c; g.fillRect(-s / 2, -s * 0.4, s, s * 0.85);
          g.strokeStyle = 'rgba(36,30,48,.4)'; g.lineWidth = 1.5;
          for (let r = 0; r < 4; r++) { g.beginPath(); g.moveTo(-s * 0.36, -s * 0.15 + r * s * 0.15); g.lineTo(s * (0.1 + Math.random() * 0.25), -s * 0.15 + r * s * 0.15); g.stroke(); }
        } else { // a scrap of map
          g.fillStyle = '#e8dcc0'; g.fillRect(-s / 2, -s * 0.4, s, s * 0.85);
          g.strokeStyle = 'rgba(80,120,150,.45)'; g.lineWidth = 1;
          for (let r = 1; r < 5; r++) { g.beginPath(); g.moveTo(-s / 2, -s * 0.4 + r * s * 0.17); g.lineTo(s / 2, -s * 0.4 + r * s * 0.17); g.moveTo(-s / 2 + r * s * 0.2, -s * 0.4); g.lineTo(-s / 2 + r * s * 0.2, s * 0.45); g.stroke(); }
          g.strokeStyle = 'rgba(196,40,36,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(s * 0.08, s * 0.05, s * 0.12, 0, Math.PI * 2); g.stroke();
        }
        g.restore();
        pins.push({ x: x + Math.sin(rot) * s * 0.3, y: y - Math.cos(rot) * s * 0.3 });
      });
      g.strokeStyle = 'rgba(70,44,22,.85)'; g.lineWidth = u * 0.02; g.strokeRect(u * 0.01, u * 0.01, w - u * 0.02, h - u * 0.02); // the board's frame
      const order = [0, 9, 1, 8, 2, 3, 7, 6, 5, 4, 9, 8];
      links = []; for (let i = 1; i < order.length; i++) links.push([order[i - 1], order[i]]);
    }
    return {
      step(dt) { t += dt; prog += dt / 1.4; if (prog >= 1) { prog = 0; drawn++; if (drawn > links.length + 3) drawn = 0; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const lamp = g.createRadialGradient(w * 0.85, 0, 0, w * 0.85, 0, Math.max(w, h) * 0.75); lamp.addColorStop(0, `rgba(255,214,150,${0.22 * a})`); lamp.addColorStop(1, 'rgba(255,214,150,0)');
        g.fillStyle = lamp; g.fillRect(0, 0, w, h);
        if (!cork || Math.abs(w - cw) > 1 || Math.abs(h - ch) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(cork, 0, 0, w, h); g.globalAlpha = 1;
        const fade = drawn > links.length ? 1 - clamp01((drawn - links.length - 1 + prog) / 2) : 1;
        g.lineCap = 'round';
        links.forEach(([i, j], k) => {
          if (k > drawn) return;
          const A = pins[i], B = pins[j], part = k === drawn ? prog : 1;
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 + Math.hypot(B.x - A.x, B.y - A.y) * 0.1 + Math.sin(t * 0.8 + k) * u * 0.005;
          const pt = s => [(1 - s) * (1 - s) * A.x + 2 * (1 - s) * s * mx + s * s * B.x, (1 - s) * (1 - s) * A.y + 2 * (1 - s) * s * my + s * s * B.y];
          for (const [dx, col, lw] of [[2, `rgba(0,0,0,${0.25 * a * fade})`, 2], [0, rgba(th.accent, 0.8 * a * fade), 2]]) {
            g.strokeStyle = col; g.lineWidth = lw; g.beginPath();
            for (let s = 0; s <= 24; s++) { const [x, y] = pt(s / 24 * part); s ? g.lineTo(x + dx, y + dx) : g.moveTo(x + dx, y + dx); }
            g.stroke();
          }
        });
        for (const p of pins) { g.save(); g.globalAlpha = a; memoPin(g, p.x, p.y, u * 0.011, '#d6332e'); g.restore(); }
        const lx = (0.5 + 0.38 * Math.sin(t * 0.13)) * w, ly = (0.5 + 0.4 * Math.sin(t * 0.17 + 1)) * h, lr = u * 0.07; // the magnifying glass
        g.save(); g.globalAlpha = a;
        g.strokeStyle = 'rgba(40,24,12,.85)'; g.lineWidth = u * 0.018; g.beginPath(); g.moveTo(lx + lr * 0.75, ly + lr * 0.75); g.lineTo(lx + lr * 1.7, ly + lr * 1.7); g.stroke();
        g.beginPath(); g.arc(lx, ly, lr, 0, Math.PI * 2); g.fillStyle = 'rgba(255,250,235,.1)'; g.fill();
        g.strokeStyle = 'rgba(30,20,10,.75)'; g.lineWidth = u * 0.012; g.stroke();
        g.strokeStyle = 'rgba(214,176,96,.7)'; g.lineWidth = u * 0.005; g.beginPath(); g.arc(lx, ly, lr * 0.93, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = u * 0.006; g.beginPath(); g.arc(lx, ly, lr * 0.72, Math.PI * 1.1, Math.PI * 1.45); g.stroke();
        g.restore();
      },
    };
  },
});
