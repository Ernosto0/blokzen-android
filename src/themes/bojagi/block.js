import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  bojagi: { // patches of translucent silk sewn together
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.globalAlpha = 0.92; g.fillStyle = mixHex(c, '#ffffff', 0.15); g.fill(); g.globalAlpha = 1;
      g.save(); g.clip(); TEX.bojagi(g, s, c, seeded(c), 1); g.restore();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.strokeStyle = shade(c, -0.25); g.lineWidth = Math.max(1, s * 0.025); g.stroke();
    },
  },
});

Object.assign(TEX, {
  bojagi(g, s, c, rnd, k) { // three patches of silk in slightly different shades, the seams stitched and showing
    const x0 = s * (0.3 + rnd() * 0.4), y0 = s * (0.3 + rnd() * 0.4);
    g.fillStyle = `rgba(255,255,255,${0.2 * k})`; g.fillRect(0, 0, x0, s);
    g.fillStyle = `rgba(0,0,0,${0.06 * k})`; g.fillRect(x0, 0, s - x0, y0);
    g.fillStyle = `rgba(255,255,255,${0.36 * k})`; g.fillRect(x0, y0, s - x0, s - y0);
    const seam = (x1, y1, x2, y2) => {
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2);
      g.strokeStyle = `rgba(255,255,255,${0.75 * k})`; g.lineWidth = Math.max(1.2, s * 0.035); g.stroke();
      g.strokeStyle = `rgba(0,0,0,${0.14 * k})`; g.lineWidth = Math.max(0.6, s * 0.01); g.setLineDash([s * 0.035, s * 0.03]); g.stroke(); g.setLineDash([]);
    };
    seam(x0, 0, x0, s); seam(x0, y0, s, y0);
    const sh = g.createLinearGradient(0, 0, s, s); sh.addColorStop(0, `rgba(255,255,255,${0.25 * k})`); sh.addColorStop(0.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, `rgba(255,255,255,${0.12 * k})`);
    g.fillStyle = sh; g.fillRect(0, 0, s, s);
  },
});
