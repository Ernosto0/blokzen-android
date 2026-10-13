import { shade } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { FRUIT } from './helpers.js';
import { AMBIENTS } from '../registry.js';

function fruitPattern(g, r, kind) { // centred on 0,0
  g.save();
  if (kind === 'citrus') {
    g.strokeStyle = 'rgba(255,255,240,.7)'; g.lineWidth = Math.max(1, r * 0.07);
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * r * 0.92, Math.sin(an) * r * 0.92); g.stroke(); }
    g.beginPath(); g.arc(0, 0, r * 0.12, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,240,.85)'; g.fill();
  } else if (kind === 'seeds') {
    g.fillStyle = '#1a1010';
    for (const [an, d] of [[0.3, 0.55], [1.5, 0.6], [2.6, 0.5], [3.7, 0.62], [4.9, 0.55], [5.8, 0.3]]) {
      g.save(); g.rotate(an); g.translate(d * r, 0); g.beginPath(); g.ellipse(0, 0, r * 0.11, r * 0.065, 0, 0, Math.PI * 2); g.fill(); g.restore();
    }
  } else if (kind === 'kiwi') {
    g.beginPath(); g.ellipse(0, 0, r * 0.32, r * 0.24, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(250,255,220,.9)'; g.fill();
    g.fillStyle = '#1a1408';
    for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6; g.beginPath(); g.arc(Math.cos(an) * r * 0.45, Math.sin(an) * r * 0.38, Math.max(0.7, r * 0.045), 0, Math.PI * 2); g.fill(); }
  } else {
    g.fillStyle = kind === 'black' ? '#1a1010' : 'rgba(255,255,255,.7)';
    for (let i = 0; i < 14; i++) { const an = i * 2.4, d = Math.sqrt((i + 0.5) / 14) * 0.85; g.beginPath(); g.arc(Math.cos(an) * d * r, Math.sin(an) * d * r, Math.max(0.6, r * 0.045), 0, Math.PI * 2); g.fill(); }
  }
  g.restore();
}

function fruitSlice(g, x, y, r, c, rot = 0) {
  const F = FRUIT[c] || { rind: shade(c, -0.35), kind: 'dots' };
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fillStyle = F.rind; g.fill();
  g.beginPath(); g.arc(0, 0, r * 0.88, 0, Math.PI * 2); g.fillStyle = F.pith || '#fffbe8'; g.fill();
  g.beginPath(); g.arc(0, 0, r * 0.8, 0, Math.PI * 2); g.fillStyle = c; g.fill();
  fruitPattern(g, r * 0.8, F.kind);
  g.restore();
}

Object.assign(AMBIENTS, {
  summer(th) { // sun rays, fruit slices floating, fizzy bubbles
    const P = [...Array(9)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.015, 0.035), rot: rand(0, 6.3), vr: rand(-0.4, 0.4), r: rand(0.04, 0.07), c: th.blocks[(Math.random() * 7) | 0] }));
    const B = [...Array(24)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.003, 0.008), vy: rand(0.03, 0.08), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const p of P) { p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y > 1.1) { p.y = -0.1; p.x = Math.random(); } }
        for (const b of B) { b.y -= b.vy * dt; b.ph += dt * 2; if (b.y < -0.02) { b.y = 1.02; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), len = Math.hypot(w, h);
        g.save(); g.translate(w, 0);
        for (let i = 0; i < 7; i++) {
          g.save(); g.rotate(Math.PI / 2 + 0.1 + i * 0.2 + Math.sin(t * 0.2) * 0.03);
          const gr = g.createLinearGradient(0, 0, len, 0); gr.addColorStop(0, `rgba(255,255,230,${0.35 * a})`); gr.addColorStop(1, 'rgba(255,255,230,0)');
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(len, -len * 0.04); g.lineTo(len, len * 0.04); g.fill();
          g.restore();
        }
        g.restore();
        for (const p of P) { g.save(); g.globalAlpha = 0.5 * a; fruitSlice(g, p.x * w, p.y * h, p.r * u, p.c, p.rot); g.restore(); }
        g.lineWidth = 1.2;
        for (const b of B) { g.beginPath(); g.arc((b.x + Math.sin(b.ph) * 0.008) * w, b.y * h, b.r * u, 0, Math.PI * 2); g.strokeStyle = `rgba(255,255,255,${0.6 * a})`; g.stroke(); }
      },
    };
  },
});
