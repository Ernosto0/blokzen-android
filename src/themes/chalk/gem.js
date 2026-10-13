import { rgba } from '../../core/color.js';
import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  chalk(g, s, th) { // a question mark circled in yellow chalk
    g.lineCap = 'round';
    for (const [w, a, dx] of [[0.11, 0.5, 0], [0.065, 1, 0], [0.03, 0.6, s * 0.015]]) {
      g.beginPath(); g.arc(s * 0.5 + dx, s * 0.5, s * 0.29, 0.2, Math.PI * 2.05); g.lineWidth = s * w;
      g.strokeStyle = w > 0.1 ? 'rgba(0,0,0,.5)' : rgba(th.accent, a); g.stroke();
    }
    g.font = `800 ${s * 0.46}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = s * 0.07; g.strokeStyle = 'rgba(0,0,0,.5)'; g.strokeText('?', s * 0.5, s * 0.54);
    g.fillStyle = th.accent; g.fillText('?', s * 0.5, s * 0.54);
  },
});
