import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  detective(g, s, th) { // a fingerprint lifted in red
    g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.33, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill();
    g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.29, 0, Math.PI * 2); g.fillStyle = '#fbf3e4'; g.fill();
    g.save(); g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.27, 0, Math.PI * 2); g.clip();
    g.strokeStyle = th.accent; g.lineWidth = Math.max(1, s * 0.024); g.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const rx = s * (0.035 + i * 0.038), a0 = 0.3 + (i % 3) * 0.5, a1 = Math.PI * 2 - 0.25 - (i % 2) * 0.6;
      g.beginPath(); g.ellipse(s * 0.5, s * 0.53, rx, rx * 1.3, 0.15, a0, a1); g.stroke();
    }
    g.restore();
  },
});
