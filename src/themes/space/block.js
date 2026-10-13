import { TEX } from '../registry.js';

Object.assign(TEX, {
  cosmic(g, s, c, rnd, k) { // drifting nebula clouds and pinpoint stars
    for (let i = 0; i < 3; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.25 + rnd() * 0.25);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, i === 1 ? `rgba(10,10,40,${0.35 * k})` : `rgba(255,255,255,${0.22 * k})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
    }
    for (let i = 0; i < 16; i++) { g.fillStyle = `rgba(255,255,255,${(0.35 + rnd() * 0.6) * k})`; const r = Math.max(0.6, s * (0.006 + rnd() * 0.012)); g.fillRect(rnd() * s, rnd() * s, r, r); }
  },
});
