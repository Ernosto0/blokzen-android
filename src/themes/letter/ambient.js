import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  post(th) { // postmarks and stamps on the desk, envelopes gliding across
    let desk = null, dw = 0, dh = 0, t = 0;
    const mk = init => ({ x: init ? Math.random() : -0.15, y: rand(0.08, 0.92), v: rand(0.025, 0.05), s: rand(0.7, 1.3), ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0] });
    const E = [...Array(6)].map(() => mk(true));
    function build(w, h) {
      dw = w; dh = h; desk = document.createElement('canvas'); desk.width = Math.ceil(w); desk.height = Math.ceil(h);
      const g = desk.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 5; i++) { // round postmarks with wavy cancellation lines
        const x = Math.random() * w, y = Math.random() * h, r = u * rand(0.08, 0.12);
        g.strokeStyle = 'rgba(200,210,235,.08)'; g.lineWidth = 2;
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(x, y, r * 0.75, 0, Math.PI * 2); g.stroke();
        for (let k = 0; k < 4; k++) { g.beginPath(); for (let j = 0; j <= 20; j++) { const xx = x + r * 1.2 + j * u * 0.02, yy = y - r * 0.5 + k * r * 0.33 + Math.sin(j * 0.9) * u * 0.008; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
      }
      for (let i = 0; i < 6; i++) { // perforated stamp outlines
        const x = Math.random() * w, y = Math.random() * h, sw = u * 0.08, sh2 = u * 0.1;
        g.setLineDash([3, 3]); g.strokeStyle = 'rgba(232,90,74,.12)'; g.strokeRect(x, y, sw, sh2); g.setLineDash([]);
        g.fillStyle = 'rgba(232,90,74,.06)'; g.fillRect(x + 4, y + 4, sw - 8, sh2 - 8);
      }
    }
    return {
      step(dt) { t += dt; E.forEach((e, i) => { e.x += e.v * dt; if (e.x > 1.2) E[i] = mk(false); }); },
      draw(g, w, h, a) {
        if (!desk || Math.abs(w - dw) > 1 || Math.abs(h - dh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(desk, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const e of E) {
          const ew = u * 0.1 * e.s, eh = ew * 0.66, x = e.x * w, y = e.y * h + Math.sin(t * 1.2 + e.ph) * u * 0.015;
          g.save(); g.translate(x, y); g.rotate(Math.sin(t * 0.8 + e.ph) * 0.12);
          g.fillStyle = `rgba(246,236,216,${0.5 * a})`; g.fillRect(-ew / 2, -eh / 2, ew, eh);
          g.strokeStyle = `rgba(110,80,50,${0.4 * a})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-ew / 2, -eh / 2); g.lineTo(0, eh * 0.1); g.lineTo(ew / 2, -eh / 2); g.stroke();
          g.beginPath(); g.arc(0, eh * 0.1, ew * 0.1, 0, Math.PI * 2); g.fillStyle = rgba(e.c, 0.7 * a); g.fill();
          g.restore();
        }
      },
    };
  },
});
