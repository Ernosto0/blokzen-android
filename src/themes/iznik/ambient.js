import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';
import { rosette } from '../shared/shapes.js';

Object.assign(AMBIENTS, {
  iznik(th) { // tiled wall, a pointed arch window letting light in, floating motes
    let wall = null, ww = 0, wh = 0, t = 0;
    const M = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.012, -0.004), ph: rand(0, 6.3) }));
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), ts = Math.max(48, Math.min(w, h) * 0.16);
      for (let y = 0; y < h + ts; y += ts) for (let x = 0; x < w + ts; x += ts) {
        g.strokeStyle = 'rgba(160,200,255,.07)'; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, ts - 1, ts - 1);
        rosette(g, x + ts / 2, y + ts / 2, ts * 0.28, 'rgba(90,170,255,.09)', 'rgba(255,120,90,.12)');
        g.fillStyle = 'rgba(40,200,210,.06)';
        for (const [cx, cy] of [[x, y], [x + ts, y], [x, y + ts], [x + ts, y + ts]]) { g.beginPath(); g.arc(cx, cy, ts * 0.12, 0, Math.PI * 2); g.fill(); }
      }
    }
    return {
      step(dt) { t += dt; for (const m of M) { m.y += m.v * dt; m.x += Math.sin(t * 0.5 + m.ph) * 0.003 * dt; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), cx = w / 2, aw = u * 0.16, top = h * 0.02, bot = h * 0.2;
        const beam = g.createLinearGradient(0, bot, 0, h); beam.addColorStop(0, `rgba(255,236,190,${0.13 * a})`); beam.addColorStop(1, 'rgba(255,236,190,0)');
        g.fillStyle = beam; g.beginPath(); g.moveTo(cx - aw, bot); g.lineTo(cx + aw, bot); g.lineTo(cx + aw * 3, h); g.lineTo(cx - aw * 0.4, h); g.fill();
        g.beginPath(); g.moveTo(cx - aw, bot); g.lineTo(cx - aw, top + aw); g.quadraticCurveTo(cx - aw, top + aw * 0.2, cx, top);
        g.quadraticCurveTo(cx + aw, top + aw * 0.2, cx + aw, top + aw); g.lineTo(cx + aw, bot); g.closePath();
        g.fillStyle = `rgba(255,240,205,${0.16 * a})`; g.fill(); g.strokeStyle = `rgba(255,200,120,${0.3 * a})`; g.lineWidth = 2; g.stroke();
        for (const m of M) { const k = 0.5 + 0.5 * Math.sin(t * 2 + m.ph); g.fillStyle = `rgba(255,236,190,${(0.15 + 0.35 * k) * a})`; g.fillRect(m.x * w, m.y * h, 2, 2); }
      },
    };
  },
});
