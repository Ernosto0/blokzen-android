import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  lavalamp(th) { // groovy seventies bands and big slow blobs of light
    let bands = null, bw = 0, bh = 0, t = 0;
    const BL = [...Array(7)].map((_, i) => ({ x: rand(0.05, 0.95), ph: rand(0, 6.3), sp: rand(0.12, 0.25), r: rand(0.1, 0.18), c: th.blocks[i % 7] }));
    function build(w, h) {
      bw = w; bh = h; bands = document.createElement('canvas'); bands.width = Math.ceil(w); bands.height = Math.ceil(h);
      const g = bands.getContext('2d'), u = Math.max(w, h), cols = ['rgba(255,138,42,.1)', 'rgba(232,176,58,.09)', 'rgba(168,64,42,.1)'];
      g.lineWidth = u * 0.07;
      cols.forEach((c, i) => {
        g.strokeStyle = c;
        g.beginPath(); g.arc(0, h, u * (0.42 + i * 0.08), -Math.PI / 2, 0); g.stroke();
        g.beginPath(); g.arc(w, 0, u * (0.3 + i * 0.08), Math.PI / 2, Math.PI); g.stroke();
      });
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        if (!bands || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(bands, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const b of BL) {
          const x = (b.x + Math.sin(t * 0.1 + b.ph) * 0.04) * w, y = (0.5 + 0.45 * Math.sin(t * b.sp + b.ph)) * h, r = b.r * u * (1 + 0.15 * Math.cos(t * b.sp * 2 + b.ph));
          const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(b.c, 0.32 * a)); gr.addColorStop(0.6, rgba(b.c, 0.16 * a)); gr.addColorStop(1, rgba(b.c, 0));
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
});
