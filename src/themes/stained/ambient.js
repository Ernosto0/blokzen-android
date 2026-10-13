import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  cathedral(th) { // pointed windows high up, coloured light falling to the floor, dust in the beams
    let hall = null, hw = 0, hh = 0, t = 0;
    const DU = [...Array(36)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.01, -0.003), ph: rand(0, 6.3) }));
    const WIN = [0.2, 0.5, 0.8];
    function build(w, h) {
      hw = w; hh = h; hall = document.createElement('canvas'); hall.width = Math.ceil(w); hall.height = Math.ceil(h);
      const g = hall.getContext('2d'), u = Math.min(w, h);
      g.strokeStyle = 'rgba(255,255,255,.04)'; g.lineWidth = 1;
      for (let y = 0; y < h; y += u * 0.06) { const off = ((y / (u * 0.06)) | 0) % 2 * u * 0.06; for (let x = -off; x < w; x += u * 0.12) g.strokeRect(x, y, u * 0.12, u * 0.06); }
      for (const wx of WIN) { // a lancet window made of small coloured panes
        const cx = wx * w, ww = u * 0.11, top = h * 0.03, bot = h * 0.3;
        g.save(); g.beginPath(); g.moveTo(cx - ww, bot); g.lineTo(cx - ww, top + ww); g.quadraticCurveTo(cx - ww, top, cx, top - ww * 0.4); g.quadraticCurveTo(cx + ww, top, cx + ww, top + ww); g.lineTo(cx + ww, bot); g.closePath(); g.clip();
        for (let y = top - ww; y < bot; y += ww * 0.42) for (let x = cx - ww; x < cx + ww; x += ww * 0.5) { g.fillStyle = rgba(th.blocks[(Math.random() * 7) | 0], 0.28); g.fillRect(x + 1, y + 1, ww * 0.5 - 2, ww * 0.42 - 2); }
        g.restore();
      }
    }
    return {
      step(dt) { t += dt; for (const d of DU) { d.y += d.v * dt; d.x += Math.sin(t * 0.4 + d.ph) * 0.003 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!hall || Math.abs(w - hw) > 1 || Math.abs(h - hh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(hall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        g.save(); g.globalCompositeOperation = 'lighter';
        WIN.forEach((wx, i) => { // a beam per window, its colour slowly changing
          const cx = wx * w, ww = u * 0.11, sh = Math.sin(t * 0.15 + i) * w * 0.05, c = th.blocks[(i * 2 + ((t / 6) | 0)) % 7];
          const gr = g.createLinearGradient(0, h * 0.3, 0, h); gr.addColorStop(0, rgba(c, 0.12 * a)); gr.addColorStop(1, rgba(c, 0.02 * a));
          g.fillStyle = gr; g.beginPath(); g.moveTo(cx - ww, h * 0.3); g.lineTo(cx + ww, h * 0.3); g.lineTo(cx + ww * 2.6 + sh, h); g.lineTo(cx - ww * 0.4 + sh, h); g.closePath(); g.fill();
          g.beginPath(); g.ellipse(cx + ww * 1.1 + sh, h * 0.95, ww * 1.6, ww * 0.35, 0, 0, Math.PI * 2); g.fillStyle = rgba(c, 0.12 * a); g.fill();
        });
        g.restore();
        for (const d of DU) { const k = 0.5 + 0.5 * Math.sin(t * 1.4 + d.ph); g.fillStyle = `rgba(255,236,200,${(0.1 + 0.3 * k) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
});
