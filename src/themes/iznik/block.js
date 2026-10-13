import { mixHex, shade } from '../../core/color.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';
import { rosette } from '../shared/shapes.js';

function tulipPath(g, x, y, r) {
  g.beginPath(); g.moveTo(x, y + r * 0.35);
  g.quadraticCurveTo(x - r * 0.95, y + r * 0.05, x - r * 0.5, y - r * 0.85);
  g.quadraticCurveTo(x - r * 0.25, y - r * 0.3, x, y - r);
  g.quadraticCurveTo(x + r * 0.25, y - r * 0.3, x + r * 0.5, y - r * 0.85);
  g.quadraticCurveTo(x + r * 0.95, y + r * 0.05, x, y + r * 0.35);
  g.closePath();
}

Object.assign(STYLES, {
  iznik: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = shade(c, -0.3); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.08); g.fillStyle = mixHex(c, '#fbfdff', 0.84); g.fill();
      g.save(); rr(g, s * 0.12, s * 0.11, s * 0.76, s * 0.74, s * 0.05); g.clip();
      g.globalAlpha = 0.4; g.fillStyle = c;
      for (const [x, y] of [[0.12, 0.11], [0.88, 0.11], [0.12, 0.85], [0.88, 0.85]]) { g.beginPath(); g.arc(s * x, s * y, s * 0.14, 0, Math.PI * 2); g.fill(); }
      g.globalAlpha = 1;
      g.strokeStyle = '#2f8a4a'; g.lineWidth = Math.max(1, s * 0.03); g.lineCap = 'round';
      g.beginPath(); g.moveTo(s * 0.5, s * 0.58); g.quadraticCurveTo(s * 0.47, s * 0.7, s * 0.5, s * 0.82); g.stroke();
      g.fillStyle = '#2f8a4a';
      for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(s * (0.5 + sd * 0.11), s * 0.72, s * 0.1, s * 0.035, sd * -0.6, 0, Math.PI * 2); g.fill(); }
      tulipPath(g, s * 0.5, s * 0.5, s * 0.25); g.fillStyle = c; g.fill();
      g.beginPath(); g.arc(s * 0.5, s * 0.45, s * 0.05, 0, Math.PI * 2); g.fillStyle = c === '#d8402e' ? '#1f5fc8' : '#d8402e'; g.fill();
      g.restore();
      rr(g, s * 0.12, s * 0.11, s * 0.76, s * 0.74, s * 0.05); g.strokeStyle = c; g.lineWidth = Math.max(1, s * 0.03); g.stroke();
      g.beginPath(); g.ellipse(s * 0.32, s * 0.18, s * 0.18, s * 0.04, -0.3, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill();
    },
  },
});

Object.assign(TEX, {
  iznik(g, s, c, rnd, k) { // a white rosette and a glazed inner frame
    rosette(g, s * 0.5, s * 0.5, s * 0.3, `rgba(255,255,255,${0.55 * k})`, `rgba(216,64,46,${0.8 * k})`);
    rr(g, s * 0.14, s * 0.14, s * 0.72, s * 0.72, s * 0.05); g.strokeStyle = `rgba(255,255,255,${0.35 * k})`; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
  },
});
