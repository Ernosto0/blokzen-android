import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { STYLES, TEX } from '../registry.js';

function slimePath(g, s) {
  g.beginPath(); g.moveTo(s * 0.06, s * 0.3); g.quadraticCurveTo(s * 0.06, s * 0.05, s * 0.3, s * 0.05); g.lineTo(s * 0.7, s * 0.05);
  g.quadraticCurveTo(s * 0.94, s * 0.05, s * 0.94, s * 0.3); g.lineTo(s * 0.94, s * 0.78); g.quadraticCurveTo(s * 0.94, s * 0.9, s * 0.84, s * 0.88);
  g.quadraticCurveTo(s * 0.78, s * 0.87, s * 0.75, s * 0.9); g.arc(s * 0.69, s * 0.9, s * 0.06, 0, Math.PI);
  g.quadraticCurveTo(s * 0.58, s * 0.84, s * 0.46, s * 0.88); g.quadraticCurveTo(s * 0.36, s * 0.92, s * 0.3, s * 0.87);
  g.quadraticCurveTo(s * 0.22, s * 0.82, s * 0.15, s * 0.88); g.quadraticCurveTo(s * 0.06, s * 0.92, s * 0.06, s * 0.78); g.closePath();
}

Object.assign(STYLES, {
  slime: {
    block(g, s, c) {
      slimePath(g, s); g.fillStyle = shade(c, -0.35); g.fill();
      g.save(); g.translate(s * 0.5, s * 0.47); g.scale(0.93, 0.92); g.translate(-s * 0.5, -s * 0.5); slimePath(g, s); g.restore();
      const gr = g.createRadialGradient(s * 0.4, s * 0.33, s * 0.03, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, shade(c, 0.5)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.15));
      g.fillStyle = gr; g.fill();
      g.save(); slimePath(g, s); g.clip(); TEX.slime(g, s, c, seeded(c), 1); g.restore();
    },
  },
});

Object.assign(TEX, {
  slime(g, s, c, rnd, k) { // trapped bubbles of different sizes and a wet streak
    for (let i = 0; i < 6; i++) {
      const x = s * (0.15 + rnd() * 0.7), y = s * (0.3 + rnd() * 0.55), r = s * (0.015 + rnd() * 0.05);
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = `rgba(240,255,220,${0.5 * k})`; g.lineWidth = Math.max(0.8, s * 0.018); g.stroke();
      g.beginPath(); g.arc(x - r * 0.4, y - r * 0.4, Math.max(0.5, r * 0.25), 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.7 * k})`; g.fill();
    }
    g.beginPath(); g.ellipse(s * 0.34, s * 0.24, s * 0.16, s * 0.05, -0.3, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.5 * k})`; g.fill();
  },
});
