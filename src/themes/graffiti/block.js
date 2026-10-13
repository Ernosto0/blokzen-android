import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { speckle } from '../../render/textures.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  spray: {
    block(g, s, c) {
      const rnd = seeded(c);
      for (let i = 0; i < 70; i++) { g.globalAlpha = 0.25 + rnd() * 0.35; g.fillStyle = c; const r = Math.max(0.6, s * (0.006 + rnd() * 0.012)); g.fillRect(s * (0.02 + rnd() * 0.96), s * (0.02 + rnd() * 0.96), r, r); }
      g.globalAlpha = 1;
      for (let i = 0; i < 1 + ((rnd() * 2) | 0); i++) { // paint drips
        const x = s * (0.2 + rnd() * 0.6), len = s * (0.06 + rnd() * 0.08), dw = s * 0.05;
        g.fillStyle = c; g.fillRect(x - dw / 2, s * 0.8, dw, len); g.beginPath(); g.arc(x, s * 0.8 + len, dw * 0.65, 0, Math.PI * 2); g.fill();
      }
      rr(g, s * 0.09, s * 0.08, s * 0.82, s * 0.78, s * 0.12); g.fillStyle = c; g.fill();
      g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = Math.max(1, s * 0.03); g.stroke();
      g.save(); g.clip(); TEX.spray(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  spray(g, s, c, rnd, k) { // spray grain, a darker lower edge, a white shine stroke
    speckle(g, s, rnd, 40, 0.003, 0.008, () => rnd() < 0.5 ? `rgba(255,255,255,${0.25 * k})` : `rgba(0,0,0,${0.2 * k})`);
    const gr = g.createLinearGradient(0, s * 0.4, 0, s); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${0.22 * k})`);
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
    g.strokeStyle = `rgba(255,255,255,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.045); g.lineCap = 'round';
    g.beginPath(); g.moveTo(s * 0.2, s * 0.36); g.quadraticCurveTo(s * 0.22, s * 0.2, s * 0.38, s * 0.18); g.stroke();
    g.beginPath(); g.arc(s * 0.48, s * 0.18, Math.max(0.8, s * 0.025), 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.8 * k})`; g.fill();
  },
});
