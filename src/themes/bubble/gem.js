import { sparkle } from '../../render/sprites.js';
import { seaChar } from './helpers.js';
import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  bubble(g, s) { // the pineapple in a bubble, sparkling
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.42, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.8)'; g.fill();
    seaChar(g, 6, s / 2, s * 0.56, s * 0.3);
    sparkle(g, s * 0.8, s * 0.22, s * 0.1, 0.95); sparkle(g, s * 0.22, s * 0.78, s * 0.07, 0.8);
  },
});
