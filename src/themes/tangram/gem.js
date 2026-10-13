import { mixHex, shade } from '../../core/color.js';
import { GEM_LOOKS } from '../registry.js';
import { tanSquare } from './helpers.js';

Object.assign(GEM_LOOKS, {
  tangram(g, s, th) { // the tangram square itself, turned on its corner
    g.save(); g.translate(s / 2, s / 2); g.rotate(Math.PI / 4);
    const w = s * 0.46;
    g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(-w / 2 - s * 0.04, -w / 2 - s * 0.04, w + s * 0.08, w + s * 0.08);
    tanSquare(g, -w / 2, -w / 2, w, th.accent, mixHex(th.accent, '#ffffff', 0.4), shade(th.accent, -0.25), 4, 'rgba(255,255,255,.95)');
    g.restore();
  },
});
