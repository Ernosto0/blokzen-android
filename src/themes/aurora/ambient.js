import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  aurora(th) { // light curtains rippling over snowy hills
    const ST = [...Array(90)].map(() => ({ x: Math.random(), y: Math.random() * 0.7, r: rand(0.5, 1.5), ph: rand(0, 6.3), f: rand(0.5, 2) }));
    const CU = [0, 1, 2].map(i => ({ y: 0.1 + i * 0.1, amp: rand(0.04, 0.08), f: rand(3, 6), sp: rand(0.15, 0.3) * (i % 2 ? -1 : 1), ph: rand(0, 6.3), c: [th.blocks[0], th.blocks[2], th.blocks[4]][i], len: rand(0.25, 0.4) }));
    let t = 0, hills = null, hw = 0, hh = 0;
    function build(w, h) {
      hw = w; hh = h; hills = document.createElement('canvas'); hills.width = Math.ceil(w); hills.height = Math.ceil(h * 0.3);
      const g = hills.getContext('2d'), H = hills.height;
      for (let L = 0; L < 2; L++) {
        g.beginPath(); g.moveTo(0, H);
        for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, H * (0.35 + L * 0.25) + Math.sin(x * 0.006 + L * 2) * H * 0.12 + Math.sin(x * 0.017 + L) * H * 0.05);
        g.lineTo(w, H); g.closePath(); g.globalAlpha = L ? 0.22 : 0.15; g.fillStyle = L ? '#e8f4fa' : '#9fbccc'; g.fill();
      }
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        for (const s of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * s.f + s.ph))) * a})`; g.fillRect(s.x * w, s.y * h, s.r, s.r); }
        g.save(); g.globalCompositeOperation = 'lighter';
        const n = Math.ceil(w / 10), sw = w / n;
        for (const cu of CU) {
          const L = cu.len * h, gr = g.createLinearGradient(0, 0, 0, L);
          gr.addColorStop(0, rgba(cu.c, 0.02 * a)); gr.addColorStop(0.15, rgba(cu.c, 0.22 * a)); gr.addColorStop(1, rgba(cu.c, 0));
          g.fillStyle = gr;
          for (let i = 0; i < n; i++) {
            const x = i * sw, y = h * (cu.y + cu.amp * Math.sin(x / w * cu.f + t * cu.sp + cu.ph) + 0.02 * Math.sin(x / w * 17 + t * 0.7));
            g.globalAlpha = 0.6 + 0.4 * Math.sin(x / w * 9 - t * 0.5 + cu.ph);
            g.translate(x, y); g.fillRect(0, 0, sw + 0.6, L); g.translate(-x, -y);
          }
        }
        g.restore();
        if (!hills || Math.abs(w - hw) > 1 || Math.abs(h - hh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(hills, 0, h * 0.7, w, h * 0.3); g.globalAlpha = 1;
      },
    };
  },
});
