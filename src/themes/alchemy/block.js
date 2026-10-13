import { mixHex, rgba, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { rr } from '../../render/sprites.js';
import { alchemySign } from './helpers.js';
import { THEMES } from '../catalog.js';
import { STYLES, TEX } from '../registry.js';

const ALCHEMY_BLOCKS = THEMES.find(t => t.id === 'alchemy').blocks;

// a round-bottomed potion flask with its liquid, a couple of bubbles (lt: [dx, dy, r]) and a cork
function flask(g, x, y, w, c, lt) {
  const r = w * 0.36, by = y + w * 0.1, nw = w * 0.11;
  g.save(); g.beginPath(); g.arc(x, by, r, 0, Math.PI * 2); g.rect(x - nw, y - w * 0.46, nw * 2, w * 0.3); g.clip();
  g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x - r, y - w, r * 2, w * 2);
  const ly = by - r * 0.15, gr = g.createLinearGradient(0, ly, 0, by + r);
  gr.addColorStop(0, mixHex(c, '#ffffff', 0.35)); gr.addColorStop(1, shade(c, -0.25));
  g.fillStyle = gr; g.fillRect(x - r, ly, r * 2, r * 2);
  g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x - r, ly, r * 2, Math.max(1, w * 0.02));
  for (const [dx, dy, br] of lt) { g.beginPath(); g.arc(x + dx * r, by + dy * r, br * w, 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = Math.max(0.7, w * 0.012); g.stroke(); }
  g.restore();
  g.beginPath(); g.arc(x, by, r, 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = Math.max(1, w * 0.03); g.stroke();
  g.strokeRect(x - nw, y - w * 0.46, nw * 2, w * 0.25);
  rr(g, x - nw * 1.25, y - w * 0.53, nw * 2.5, w * 0.11, w * 0.02); g.fillStyle = '#9a6a3c'; g.fill(); // the cork
  g.beginPath(); g.ellipse(x - r * 0.42, by - r * 0.38, r * 0.14, r * 0.3, 0.5, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.45)'; g.fill();
}

Object.assign(STYLES, {
  flask: { // a glowing potion on a dark wooden shelf
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = '#1c1220'; g.fill();
      const glow = g.createRadialGradient(s * 0.5, s * 0.6, 0, s * 0.5, s * 0.6, s * 0.5); glow.addColorStop(0, rgba(c, 0.45)); glow.addColorStop(1, rgba(c, 0));
      g.fillStyle = glow; g.fillRect(0, 0, s, s);
      g.fillStyle = '#4a2e1c'; g.fillRect(s * 0.04, s * 0.86, s * 0.92, s * 0.1); g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(s * 0.04, s * 0.86, s * 0.92, Math.max(1, s * 0.015));
      const rnd = seeded(c);
      flask(g, s * 0.5, s * 0.5, s * 0.78, c, [[-0.2 + rnd() * 0.4, 0.3 + rnd() * 0.3, 0.025], [0.1 + rnd() * 0.2, 0.15 + rnd() * 0.2, 0.017]]);
    },
  },
});

Object.assign(TEX, {
  flask(g, s, c, rnd, k) { g.strokeStyle = `rgba(255,248,230,${0.6 * k})`; g.lineWidth = Math.max(1, s * 0.04); g.lineJoin = 'round'; alchemySign(g, Math.max(0, ALCHEMY_BLOCKS.indexOf(c)), s * 0.5, s * 0.52, s * 0.26); },
});
