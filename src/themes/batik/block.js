import { STYLES, TEX } from '../registry.js';
import { framedTile } from '../shared/shapes.js';

// four ovals round a centre, the kawung motif of Javanese batik (filled with the current fillStyle)
function kawung(g, x, y, r) {
  for (let i = 0; i < 4; i++) {
    const an = Math.PI / 4 + i * Math.PI / 2;
    g.beginPath(); g.ellipse(x + Math.cos(an) * r * 0.5, y + Math.sin(an) * r * 0.5, r * 0.46, r * 0.26, an, 0, Math.PI * 2); g.fill();
  }
}

Object.assign(STYLES, {
  batik: { block(g, s, c) { framedTile(g, s, c, 'batik', 0.12); } },   // wax-resist cloth with the kawung motif
});

Object.assign(TEX, {
  batik(g, s, c, rnd, k) { // kawung ovals left pale by the wax, dots inside, fine cracks where the wax broke
    g.fillStyle = `rgba(255,240,210,${0.55 * k})`;
    kawung(g, s * 0.5, s * 0.5, s * 0.36);
    for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) kawung(g, x, y, s * 0.36);
    g.fillStyle = `rgba(40,20,5,${0.45 * k})`;
    for (let i = 0; i < 4; i++) { const an = Math.PI / 4 + i * Math.PI / 2; g.beginPath(); g.arc(s * 0.5 + Math.cos(an) * s * 0.18, s * 0.5 + Math.sin(an) * s * 0.18, s * 0.03, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = `rgba(40,20,5,${0.35 * k})`; g.lineWidth = Math.max(0.7, s * 0.01);
    for (let i = 0; i < 4; i++) {
      let x = rnd() * s, y = rnd() * s; g.beginPath(); g.moveTo(x, y);
      for (let j = 0; j < 5; j++) { x += (rnd() - 0.5) * s * 0.3; y += (rnd() - 0.5) * s * 0.3; g.lineTo(x, y); }
      g.stroke();
    }
  },
});
