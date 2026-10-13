import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  gelateria(th) { // a striped awning, pastel bokeh, sprinkles and waffle crumbs falling
    let awn = null, aw = 0, ah = 0, t = 0;
    const SP = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.07), rot: rand(0, 6.3), vr: rand(-2, 2), c: th.blocks[(Math.random() * 7) | 0], waffle: Math.random() < 0.3 }));
    const BK = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.04, 0.09), v: rand(0.005, 0.015), c: th.blocks[(Math.random() * 6) | 0] }));
    function build(w, h) {
      aw = w; ah = h; const u = Math.min(w, h), H = Math.ceil(u * 0.13), sw = u * 0.07, base = H * 0.68;
      awn = document.createElement('canvas'); awn.width = Math.ceil(w); awn.height = H;
      const g = awn.getContext('2d');
      g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, base);
      for (let x = Math.ceil(w / sw) * sw; x > 0; x -= sw) g.arc(x - sw / 2, base, sw / 2, 0, Math.PI);
      g.closePath(); g.save(); g.clip();
      for (let i = 0, x = 0; x < w; i++, x += sw) { g.fillStyle = i % 2 ? '#fff8f2' : th.accent; g.fillRect(x, 0, sw, H); }
      const sh = g.createLinearGradient(0, 0, 0, H); sh.addColorStop(0, 'rgba(0,0,0,.12)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sh; g.fillRect(0, 0, w, H);
      g.restore();
    }
    return {
      step(dt) {
        t += dt;
        for (const p of SP) { p.y += p.v * dt; p.rot += p.vr * dt; if (p.y > 1.03) { p.y = 0.08; p.x = Math.random(); } }
        for (const b of BK) { b.y -= b.v * dt; if (b.y < -0.1) { b.y = 1.1; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const b of BK) { const r = b.r * u, gr = g.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, r); gr.addColorStop(0, rgba(b.c, 0.22 * a)); gr.addColorStop(1, rgba(b.c, 0)); g.fillStyle = gr; g.fillRect(b.x * w - r, b.y * h - r, 2 * r, 2 * r); }
        g.lineCap = 'round';
        for (const p of SP) {
          const x = p.x * w, y = p.y * h;
          g.save(); g.translate(x, y); g.rotate(p.rot);
          if (p.waffle) { const q = u * 0.014; g.fillStyle = `rgba(216,160,96,${0.8 * a})`; g.fillRect(-q, -q, q * 2, q * 2); g.strokeStyle = `rgba(150,100,50,${0.6 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(-q, 0); g.lineTo(q, 0); g.moveTo(0, -q); g.lineTo(0, q); g.stroke(); }
          else { g.strokeStyle = rgba(p.c, 0.85 * a); g.lineWidth = Math.max(2, u * 0.006); g.beginPath(); g.moveTo(-u * 0.008, 0); g.lineTo(u * 0.008, 0); g.stroke(); }
          g.restore();
        }
        g.lineCap = 'butt';
        if (!awn || Math.abs(w - aw) > 1 || Math.abs(h - ah) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(awn, 0, 0); g.globalAlpha = 1;
      },
    };
  },
});
