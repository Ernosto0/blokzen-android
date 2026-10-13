import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr, sparkle } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

Object.assign(STYLES, {
  astrolabe: { // an enamelled dial in a brass rim
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = '#4a3410'; g.fill();
      const br = g.createLinearGradient(0, 0, s, s); br.addColorStop(0, '#f6dc8a'); br.addColorStop(0.5, '#b8862c'); br.addColorStop(1, '#e8c060');
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.88, s * 0.11); g.fillStyle = br; g.fill();
      const gr = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.02, s * 0.5, s * 0.5, s * 0.4);
      gr.addColorStop(0, shade(c, 0.25)); gr.addColorStop(1, shade(c, -0.25));
      g.beginPath(); g.arc(s * 0.5, s * 0.49, s * 0.34, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      TEX.astrolabe(g, s, c, seeded(c), 1);
    },
  },
});

Object.assign(TEX, {
  astrolabe(g, s, c, rnd, k) { // degree ticks, an engraved circle and a rotating pointer with a star
    const cx = s * 0.5, cy = s * 0.49, R = s * 0.34;
    g.strokeStyle = `rgba(70,46,10,${0.7 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    g.beginPath();
    for (let i = 0; i < 24; i++) { const an = i / 24 * Math.PI * 2, r0 = R * (i % 6 ? 1.06 : 1.0); g.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); g.lineTo(cx + Math.cos(an) * R * 1.18, cy + Math.sin(an) * R * 1.18); }
    g.stroke();
    g.strokeStyle = `rgba(255,236,190,${0.45 * k})`; g.lineWidth = Math.max(1, s * 0.015);
    g.beginPath(); g.arc(cx, cy, R * 0.62, 0, Math.PI * 2); g.stroke();
    const an = rnd() * 6.3;
    g.strokeStyle = `rgba(246,220,138,${0.9 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - Math.cos(an) * R * 0.5, cy - Math.sin(an) * R * 0.5); g.lineTo(cx + Math.cos(an) * R * 0.9, cy + Math.sin(an) * R * 0.9); g.stroke();
    g.beginPath(); g.arc(cx, cy, s * 0.04, 0, Math.PI * 2); g.fillStyle = `rgba(246,220,138,${0.95 * k})`; g.fill();
    sparkle(g, cx + Math.cos(an + 2) * R * 0.45, cy + Math.sin(an + 2) * R * 0.45, s * 0.07, 0.75 * k);
  },
});
