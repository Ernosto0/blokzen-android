import { mixHex, rgba } from '../../core/color.js';
import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  cipher(g, s, th) { // a lamp on the lampboard, lit with the coded letter
    const gl = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s * 0.48); gl.addColorStop(0, rgba(th.accent, 0.9)); gl.addColorStop(0.55, rgba(th.accent, 0.35)); gl.addColorStop(1, rgba(th.accent, 0));
    g.fillStyle = gl; g.fillRect(0, 0, s, s);
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.3, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.55)'; g.fill();
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.26, 0, Math.PI * 2); g.fillStyle = mixHex(th.accent, '#fff6d8', 0.45); g.fill();
    g.fillStyle = '#2a1a06'; g.strokeStyle = '#2a1a06'; g.lineWidth = s * 0.05; g.lineCap = 'round'; // the key that breaks the code
    g.beginPath(); g.arc(s * 0.4, s * 0.5, s * 0.09, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(s * 0.49, s * 0.5); g.lineTo(s * 0.68, s * 0.5); g.moveTo(s * 0.62, s * 0.5); g.lineTo(s * 0.62, s * 0.58); g.moveTo(s * 0.68, s * 0.5); g.lineTo(s * 0.68, s * 0.6); g.stroke();
  },
});
