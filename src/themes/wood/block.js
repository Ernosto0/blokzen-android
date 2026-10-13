import { shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { STYLES, TEX } from '../registry.js';

function woodGrain(g, s, c, a = 1) {
  const rnd = seeded(c);
  g.strokeStyle = `rgba(90,52,20,${0.3 * a})`; g.lineWidth = Math.max(1, s * 0.022);
  for (let i = 0; i < 5; i++) {
    const y = s * (0.14 + i * 0.18) + (rnd() - 0.5) * s * 0.05;
    g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(s * 0.3, y - s * 0.06, s * 0.62, y + s * 0.07, s, y - s * 0.02); g.stroke();
  }
  g.beginPath(); g.ellipse(s * (0.5 + rnd() * 0.2), s * 0.46, s * 0.08, s * 0.045, 0, 0, Math.PI * 2); g.stroke();
}

Object.assign(STYLES, {
  wood: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = shade(c, -0.4); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.85, s * 0.09); g.fillStyle = c; g.fill();
      g.save(); g.clip(); woodGrain(g, s, c); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(0, 0, s, s * 0.1); g.restore();
    },
  },
});

Object.assign(TEX, {
  wood(g, s, c, rnd, k) { woodGrain(g, s, c, k); },
});
