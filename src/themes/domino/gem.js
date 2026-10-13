import { rr } from '../../render/sprites.js';
import { pips } from './helpers.js';
import { GEM_LOOKS } from '../registry.js';

Object.assign(GEM_LOOKS, {
  domino(g, s, th) { // the double six
    const w = s * 0.36, h = s * 0.7, x = (s - w) / 2, y = (s - h) / 2;
    rr(g, x - s * 0.03, y - s * 0.02, w + s * 0.06, h + s * 0.06, s * 0.08); g.fillStyle = 'rgba(0,0,0,.55)'; g.fill();
    rr(g, x, y, w, h, s * 0.06); g.fillStyle = '#fbf4e4'; g.fill();
    g.fillStyle = 'rgba(60,40,30,.5)'; g.fillRect(x + w * 0.12, y + h / 2 - s * 0.01, w * 0.76, Math.max(1, s * 0.02));
    for (const yy of [y, y + h / 2]) pips(g, x + w * 0.04, yy + h * 0.03, w * 0.92, 6, th.accent === '#f2c14e' ? '#c8323a' : th.accent, s * 0.03, false);
    g.beginPath(); g.arc(x + w / 2, y + h / 2, s * 0.03, 0, Math.PI * 2); g.fillStyle = th.accent; g.fill(); // the brass spinner
  },
});
