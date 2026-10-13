import { TEX } from '../registry.js';

Object.assign(TEX, {
  candy(g, s, c, rnd, k) {
    g.strokeStyle = `rgba(255,255,255,${0.3 * k})`; g.lineWidth = s * 0.08;
    for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(s * i * 0.36, s); g.lineTo(s * (1 + i * 0.36), 0); g.stroke(); }
  },
});
