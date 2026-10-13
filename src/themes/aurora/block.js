import { hexOf, mixHex, rgba } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  aurora: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.16); g.fillStyle = mixHex(c, '#06121e', 0.55); g.fill();
      g.save(); rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.84, s * 0.14); g.clip();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#0a1a2a', 0.2)); gr.addColorStop(1, mixHex(c, '#06121e', 0.62));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      TEX.aurora(g, s, c, seeded(c), 1);
      g.restore();
      rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.84, s * 0.14); g.strokeStyle = 'rgba(220,255,250,.5)'; g.lineWidth = Math.max(1, s * 0.03); g.stroke();
    },
  },
});

Object.assign(TEX, {
  aurora(g, s, c, rnd, k) { // curtains of light hanging from a wavy edge, a few stars
    const hi = hexOf(mixHex(c, '#ffffff', 0.55)), ph = rnd() * 6.3, n = 14, sw = s / n;
    const top = i => s * (0.18 + 0.12 * Math.sin(i / n * 5 + ph));
    const gr = g.createLinearGradient(0, 0, 0, s * 0.5); gr.addColorStop(0, rgba(hi, 0.55 * k)); gr.addColorStop(1, rgba(hi, 0));
    g.fillStyle = gr;
    for (let i = 0; i < n; i++) { g.save(); g.translate(i * sw, top(i)); g.fillRect(0, 0, sw + 0.6, s * 0.5); g.restore(); }
    g.beginPath(); for (let i = 0; i <= n; i++) i ? g.lineTo(i * sw, top(i)) : g.moveTo(0, top(0));
    g.strokeStyle = rgba(hi, 0.75 * k); g.lineWidth = Math.max(1, s * 0.02); g.stroke();
    for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(255,255,255,${(0.4 + rnd() * 0.5) * k})`; const r = Math.max(0.6, s * 0.015); g.fillRect(rnd() * s, rnd() * s * 0.16, r, r); }
  },
});
