import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  balloon: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.2); g.fillStyle = shade(c, -0.3); g.fill();
      g.save(); rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.83, s * 0.18); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s);
      TEX.balloon(g, s, c, seeded(c), 1);
      const sh = g.createLinearGradient(0, 0, s, 0); sh.addColorStop(0, 'rgba(0,0,0,.16)'); sh.addColorStop(0.35, 'rgba(255,255,255,.18)'); sh.addColorStop(1, 'rgba(0,0,0,.22)');
      g.fillStyle = sh; g.fillRect(0, 0, s, s);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  balloon(g, s, c, rnd, k) { // envelope gores bulging outwards, seams and stitching
    const seams = [0.2, 0.4, 0.6, 0.8], bend = x => s / 2 + (x * s - s / 2) * 1.3;
    g.fillStyle = mixHex(c, '#ffffff', 0.35); g.globalAlpha = 0.75 * k;
    for (let i = 0; i < seams.length - 1; i += 2) {
      const a = seams[i] * s, b = seams[i + 1] * s;
      g.beginPath(); g.moveTo(a, -1); g.quadraticCurveTo(bend(seams[i]), s / 2, a, s + 1); g.lineTo(b, s + 1); g.quadraticCurveTo(bend(seams[i + 1]), s / 2, b, -1); g.closePath(); g.fill();
    }
    g.lineWidth = Math.max(1, s * 0.015);
    for (const x of seams) {
      g.globalAlpha = 0.35 * k; g.strokeStyle = '#3a1a10';
      g.beginPath(); g.moveTo(x * s, 0); g.quadraticCurveTo(bend(x), s / 2, x * s, s); g.stroke();
      g.globalAlpha = 0.5 * k; g.strokeStyle = '#ffffff'; g.setLineDash([s * 0.025, s * 0.03]);
      g.beginPath(); g.moveTo(x * s + s * 0.025, 0); g.quadraticCurveTo(bend(x) + s * 0.025, s / 2, x * s + s * 0.025, s); g.stroke();
      g.setLineDash([]);
    }
    g.globalAlpha = 1;
  },
});
