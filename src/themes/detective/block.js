import { mixHex, shade } from '../../core/color.js';
import { seeded } from '../../render/blocks.js';
import { poly, rr } from '../../render/sprites.js';
import { memoPin } from './helpers.js';
import { STYLES, TEX } from '../registry.js';

// a note or photo pinned to the board; rnd picks its handwriting
function memoFace(g, s, c, rnd, k) {
  if (c === '#efe9dc') { // a polaroid: a dark photo of somebody, a caption under it
    const x0 = s * 0.17, y0 = s * 0.2, pw = s * 0.66, ph = s * 0.46;
    const gr = g.createLinearGradient(0, y0, 0, y0 + ph); gr.addColorStop(0, `rgba(44,54,66,${k})`); gr.addColorStop(1, `rgba(82,96,104,${k})`);
    g.fillStyle = gr; g.fillRect(x0, y0, pw, ph);
    g.save(); g.beginPath(); g.rect(x0, y0, pw, ph); g.clip(); g.fillStyle = `rgba(14,16,22,${0.75 * k})`;
    g.beginPath(); g.arc(s * 0.5, y0 + ph * 0.42, s * 0.085, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(s * 0.5, y0 + ph * 1.02, s * 0.2, s * 0.16, 0, 0, Math.PI * 2); g.fill();
    g.restore();
    g.strokeStyle = `rgba(40,40,60,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.022); g.lineCap = 'round';
    g.beginPath(); for (let i = 0; i <= 8; i++) { const x = s * (0.24 + i * 0.05), y = s * 0.8 + Math.sin(i * 1.9 + rnd() * 2) * s * 0.02; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    return;
  }
  g.strokeStyle = `rgba(36,30,48,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.024); g.lineCap = 'round';
  for (let r = 0; r < 3; r++) { // handwriting: a few wobbly lines
    const y0 = s * (0.4 + r * 0.16), x1 = s * (0.55 + rnd() * 0.27), ph = rnd() * 6;
    g.beginPath(); for (let x = s * 0.18; x <= x1; x += s * 0.04) { const y = y0 + Math.sin(x / s * 30 + ph) * s * 0.018; x === s * 0.18 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  }
  if (c === '#c8a274') { // a case file: a red stamp across it
    g.save(); g.translate(s * 0.52, s * 0.6); g.rotate(-0.28);
    g.strokeStyle = `rgba(196,40,36,${0.75 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.strokeRect(-s * 0.3, -s * 0.1, s * 0.6, s * 0.2);
    g.fillStyle = `rgba(196,40,36,${0.75 * k})`; g.font = `800 ${s * 0.15}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('GİZLİ', 0, s * 0.01);
    g.restore();
  }
}

Object.assign(STYLES, {
  memo: { // a note or a polaroid pinned to the cork, a little askew
    block(g, s, c) {
      const rnd = seeded(c), rot = (rnd() - 0.5) * 0.12;
      g.save(); g.translate(s / 2, s / 2); g.rotate(rot); g.translate(-s / 2, -s / 2);
      rr(g, s * 0.08, s * 0.1, s * 0.86, s * 0.84, s * 0.03); g.fillStyle = 'rgba(0,0,0,.42)'; g.fill();
      rr(g, s * 0.06, s * 0.06, s * 0.88, s * 0.86, s * 0.03);
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.18)); gr.addColorStop(1, shade(c, -0.05));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); memoFace(g, s, c, rnd, 1);
      poly(g, [[s * 0.94, s * 0.76], [s * 0.94, s * 0.92], [s * 0.76, s * 0.92]], 'rgba(0,0,0,.18)'); // a curled corner
      poly(g, [[s * 0.94, s * 0.76], [s * 0.76, s * 0.92], [s * 0.8, s * 0.79]], mixHex(c, '#ffffff', 0.45));
      g.restore(); g.restore();
      memoPin(g, s * 0.5, s * 0.14, s * 0.075, c === '#ef98ae' ? '#2f6fc8' : '#d6332e');
    },
  },
});

Object.assign(TEX, {
  memo(g, s, c, rnd, k) { memoFace(g, s, c, rnd, k * 0.9); memoPin(g, s * 0.5, s * 0.15, s * 0.07, c === '#ef98ae' ? '#2f6fc8' : '#d6332e'); },
});
