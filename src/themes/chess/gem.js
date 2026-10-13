import { sparkle } from '../../render/sprites.js';
import { chessPiece } from './helpers.js';
import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  chess(g, s, th) { // the king in gold
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.38, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.4)'; g.fill();
    g.save(); g.translate(s * 0.02, s * 0.03); g.fillStyle = 'rgba(0,0,0,.55)'; chessPiece(g, 5, s / 2, s * 0.5, s * 0.62); g.restore();
    const gr = g.createLinearGradient(0, s * 0.18, 0, s * 0.82); gr.addColorStop(0, '#fff2b0'); gr.addColorStop(0.5, th.accent); gr.addColorStop(1, '#8a5a12');
    g.fillStyle = gr; chessPiece(g, 5, s / 2, s * 0.5, s * 0.62);
    sparkle(g, s * 0.4, s * 0.3, s * 0.08, 0.9);
  },
});
