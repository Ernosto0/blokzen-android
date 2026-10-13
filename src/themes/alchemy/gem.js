import { sparkle } from '../../render/sprites.js';
import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  alchemy(g, s, th) { // the philosopher's stone: a red stone engraved with circle, square, triangle and circle
    const gr = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.02, s / 2, s / 2, s * 0.34); gr.addColorStop(0, '#ff8a8a'); gr.addColorStop(0.6, '#c8202a'); gr.addColorStop(1, '#5a0810');
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.36, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.5)'; g.fill();
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.32, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    g.strokeStyle = '#ffd86a'; g.lineWidth = Math.max(1, s * 0.022); g.lineJoin = 'round';
    const R = s * 0.27, a = R * Math.SQRT1_2;
    g.beginPath(); g.arc(s / 2, s / 2, R, 0, Math.PI * 2); g.stroke();
    g.strokeRect(s / 2 - a, s / 2 - a, a * 2, a * 2);
    g.beginPath(); g.moveTo(s / 2, s / 2 - a); g.lineTo(s / 2 + a, s / 2 + a); g.lineTo(s / 2 - a, s / 2 + a); g.closePath(); g.stroke();
    g.beginPath(); g.arc(s / 2, s / 2 + a * 0.33, a * 0.42, 0, Math.PI * 2); g.stroke();
    sparkle(g, s * 0.36, s * 0.32, s * 0.09, 0.9);
  },
});
