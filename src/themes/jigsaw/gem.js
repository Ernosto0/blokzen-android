import { mixHex, shade } from '../../core/color.js';
import { sparkle } from '../../render/sprites.js';
import { jigPath } from './helpers.js';
import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  jigsaw(g, s, th) { // the last missing piece
    const L = s * 0.42, x0 = s * 0.29, E = [1, 1, 1, 1];
    jigPath(g, x0, x0, L, E, 0.55); g.lineWidth = s * 0.08; g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineJoin = 'round'; g.stroke();
    const gr = g.createLinearGradient(0, x0, 0, x0 + L); gr.addColorStop(0, mixHex(th.accent, '#ffffff', 0.45)); gr.addColorStop(1, shade(th.accent, -0.25));
    g.fillStyle = gr; g.fill();
    g.lineWidth = Math.max(1, s * 0.032); g.strokeStyle = 'rgba(255,255,255,.9)'; g.stroke();
    sparkle(g, s * 0.38, s * 0.36, s * 0.1, 0.9);
  },
});
