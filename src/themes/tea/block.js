import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  teaglass: { // tea in a glass: clear top, coloured brew, sugar at the bottom
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.14); g.fillStyle = mixHex(c, '#0a0604', 0.6); g.fill();
      g.save(); rr(g, s * 0.08, s * 0.06, s * 0.84, s * 0.86, s * 0.12); g.clip();
      g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(0, 0, s, s);
      const lg = g.createLinearGradient(0, s * 0.24, 0, s); lg.addColorStop(0, shade(c, 0.15)); lg.addColorStop(1, shade(c, -0.35));
      g.fillStyle = lg; g.fillRect(0, s * 0.25, s, s);
      TEX.teaglass(g, s, c, seeded(c), 1);
      g.restore();
      rr(g, s * 0.08, s * 0.06, s * 0.84, s * 0.86, s * 0.12); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = Math.max(1, s * 0.025); g.stroke();
    },
  },
});

Object.assign(TEX, {
  teaglass(g, s, c, rnd, k) { // the surface of the tea, a glass shine, a waisted glass, sugar and bubbles
    g.fillStyle = `rgba(255,236,200,${0.55 * k})`; g.beginPath(); g.ellipse(s * 0.5, s * 0.26, s * 0.42, s * 0.045, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = `rgba(0,0,0,${0.2 * k})`;
    for (const x of [0, 1]) { g.beginPath(); g.ellipse(s * x, s * 0.6, s * 0.12, s * 0.26, 0, 0, Math.PI * 2); g.fill(); }
    const hl = g.createLinearGradient(s * 0.14, 0, s * 0.32, 0);
    hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(0.5, `rgba(255,255,255,${0.38 * k})`); hl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hl; g.fillRect(s * 0.14, s * 0.08, s * 0.18, s * 0.84);
    for (let i = 0; i < 3; i++) {
      g.save(); g.translate(s * (0.4 + rnd() * 0.3), s * (0.8 + rnd() * 0.06)); g.rotate(rnd() * 1.5);
      const q = s * 0.06; g.fillStyle = `rgba(255,252,245,${0.75 * k})`; g.fillRect(-q / 2, -q / 2, q, q); g.restore();
    }
    g.strokeStyle = `rgba(255,240,210,${0.5 * k})`; g.lineWidth = Math.max(0.8, s * 0.012);
    for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(s * (0.3 + rnd() * 0.45), s * (0.38 + rnd() * 0.35), Math.max(0.8, s * (0.012 + rnd() * 0.015)), 0, Math.PI * 2); g.stroke(); }
  },
});
