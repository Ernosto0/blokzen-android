import { softGlint, speckle } from '../../render/textures.js';
import { TEX } from '../registry.js';

Object.assign(TEX, {
  frost(g, s, c, rnd, k) { // rime crystals growing across the ice
    speckle(g, s, rnd, 30, 0.004, 0.012, () => `rgba(255,255,255,${(0.2 + rnd() * 0.3) * k})`);
    g.strokeStyle = `rgba(255,255,255,${0.45 * k})`; g.lineWidth = Math.max(1, s * 0.012); g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const x = rnd() * s, y = rnd() * s, an = rnd() * Math.PI * 2, L = s * (0.15 + rnd() * 0.2), dx = Math.cos(an), dy = Math.sin(an);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx * L, y + dy * L); g.stroke();
      for (let j = 1; j <= 3; j++) {
        const bx = x + dx * L * j / 4, by = y + dy * L * j / 4, b = L * 0.25 * (1 - j / 5);
        for (const sg of [1, -1]) { const a2 = an + sg * 0.8; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a2) * b, by + Math.sin(a2) * b); g.stroke(); }
      }
    }
    softGlint(g, s * 0.32, s * 0.28, s * 0.2, 0.35 * k);
  },
});
