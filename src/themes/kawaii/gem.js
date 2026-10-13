import { sparkle } from '../../render/sprites.js';
import { kawaiiChar } from './helpers.js';
import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  kawaii(g, s) { // the kitty with a bow, sparkling
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.4, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.85)'; g.fill();
    kawaiiChar(g, 0, s / 2, s * 0.52, s * 0.3);
    sparkle(g, s * 0.8, s * 0.22, s * 0.1, 0.95); sparkle(g, s * 0.22, s * 0.78, s * 0.07, 0.8);
  },
});
