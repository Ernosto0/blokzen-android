import { TEX } from '../registry.js';

Object.assign(TEX, {
  honey(g, s, c, rnd, k) { // deep amber with air bubbles caught inside and a liquid sheen
    const deep = g.createLinearGradient(0, 0, 0, s); deep.addColorStop(0, 'rgba(120,50,0,0)'); deep.addColorStop(1, `rgba(120,50,0,${0.3 * k})`);
    g.fillStyle = deep; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 7; i++) {
      const x = s * (0.15 + rnd() * 0.7), y = s * (0.25 + rnd() * 0.65), r = s * (0.012 + rnd() * 0.035);
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = `rgba(255,240,190,${0.4 * k})`; g.lineWidth = Math.max(0.8, r * 0.3); g.stroke();
      g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, Math.max(0.5, r * 0.3), 0, Math.PI * 2); g.fillStyle = `rgba(255,255,240,${0.6 * k})`; g.fill();
    }
    g.beginPath(); g.moveTo(s * 0.12, s * 0.3); g.quadraticCurveTo(s * 0.5, s * 0.14, s * 0.88, s * 0.24);
    g.strokeStyle = `rgba(255,248,210,${0.45 * k})`; g.lineWidth = s * 0.05; g.lineCap = 'round'; g.stroke();
  },
});
