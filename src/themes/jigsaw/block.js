import { rgba, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { speckle } from '../../render/textures.js';
import { jigPath } from './helpers.js';
import { STYLES, TEX } from '../registry.js';
import { carved } from '../shared/shapes.js';

Object.assign(STYLES, {
  jigsaw: { // a cardboard jigsaw piece with two sockets and two knobs, a scrap of the picture printed on it
    block(g, s, c) {
      const kn = 0.6, x0 = s * 0.03, L = s * 0.94 / (1 + 0.32 * kn), E = [-1, 1, 1, -1];
      g.save(); g.translate(0, s * 0.03); jigPath(g, x0, x0, L, E, kn); g.fillStyle = shade(c, -0.4); g.fill(); g.restore();
      jigPath(g, x0, x0, L, E, kn);
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, shade(c, 0.24)); gr.addColorStop(1, shade(c, -0.06));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.jigsawPic(g, s, c, seeded(c), 1); g.restore();
      jigPath(g, x0, x0, L, E, kn); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = Math.max(1, s * 0.022); g.stroke();
    },
  },
});

Object.assign(TEX, {
  jigsawPic(g, s, c, rnd, k) { // a scrap of the printed picture: soft patches of light and shade, cardboard fibres
    for (let i = 0; i < 3; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.25 + rnd() * 0.3), gr = g.createRadialGradient(x, y, 0, x, y, r);
      const col = i === 1 ? '#ffffff' : i === 2 ? '#3a2410' : '#fff2c8';
      gr.addColorStop(0, rgba(col, (i === 2 ? 0.14 : 0.24) * k)); gr.addColorStop(1, rgba(col, 0));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
    }
    speckle(g, s, rnd, 26, 0.003, 0.008, () => rnd() < 0.5 ? `rgba(255,255,255,${0.22 * k})` : `rgba(60,40,20,${0.12 * k})`);
  },
  jigsaw(g, s, c, rnd, k) { // the classic tile gets the cut of a piece pressed into it
    TEX.jigsawPic(g, s, c, rnd, k * 0.7);
    carved(g, () => jigPath(g, s * 0.2, s * 0.2, s * 0.5, [-1, 1, 1, -1], 0.6), Math.max(1, s * 0.024), `rgba(255,250,235,${0.5 * k})`, `rgba(60,35,10,${0.45 * k})`);
  },
});
