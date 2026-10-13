import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  newsroom() { // column rules and a halftone corner on the page, a coffee ring, sheets of newspaper drifting down
    let page = null, sheet = null, pw = 0, ph = 0;
    const mkSheet = () => {
      const c = document.createElement('canvas'); c.width = 120; c.height = 160;
      const g = c.getContext('2d');
      g.fillStyle = '#fbf8f0'; g.fillRect(0, 0, 120, 160);
      g.fillStyle = '#2a2824'; g.fillRect(10, 10, 100, 14);
      g.fillRect(10, 30, 100, 2);
      g.fillStyle = '#c8321e'; g.fillRect(10, 38, 62, 9);
      g.fillStyle = 'rgba(42,40,36,.35)';
      for (let col = 0; col < 3; col++) for (let y = 54; y < 150; y += 6) g.fillRect(10 + col * 34, y, 30 - ((y * 7 + col * 13) % 9), 2);
      g.fillStyle = 'rgba(42,40,36,.18)'; g.fillRect(78, 38, 32, 30);
      return c;
    };
    const S2 = [...Array(7)].map(() => ({ x: Math.random(), y: Math.random(), rot: rand(-0.6, 0.6), vr: rand(-0.3, 0.3), v: rand(0.015, 0.035), ph: rand(0, 6.3), s: rand(0.7, 1.2) }));
    let t = 0;
    function build(w, h) {
      pw = w; ph = h; page = document.createElement('canvas'); page.width = Math.ceil(w); page.height = Math.ceil(h);
      const g = page.getContext('2d'), u = Math.min(w, h), cw = Math.max(70, w / 5);
      g.strokeStyle = 'rgba(40,36,30,.07)'; g.lineWidth = 1;
      for (let x = cw; x < w; x += cw) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      g.fillStyle = 'rgba(40,36,30,.07)';
      const st = u * 0.025;
      for (let y = 0; y < h * 0.4; y += st) for (let x = w * 0.55; x < w; x += st) { const r = st * 0.45 * (1 - y / (h * 0.4)) * ((x - w * 0.55) / (w * 0.45)); if (r > 0.4) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); } }
      g.strokeStyle = 'rgba(120,80,40,.16)'; g.lineWidth = u * 0.012;
      g.beginPath(); g.arc(w * 0.18, h * 0.82, u * 0.11, 0.3, Math.PI * 1.85); g.stroke();
      g.lineWidth = u * 0.004; g.beginPath(); g.arc(w * 0.18, h * 0.82, u * 0.095, 0, Math.PI * 2); g.stroke();
    }
    return {
      step(dt) { t += dt; for (const p of S2) { p.y += p.v * dt; p.rot += p.vr * dt; p.ph += dt; if (p.y > 1.15) { p.y = -0.15; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!page || Math.abs(w - pw) > 1 || Math.abs(h - ph) > 1) build(w, h);
        if (!sheet) sheet = mkSheet();
        g.globalAlpha = a; g.drawImage(page, 0, 0, w, h);
        const u = Math.min(w, h);
        for (const p of S2) {
          const sw = u * 0.16 * p.s, sh = sw * 4 / 3;
          g.save(); g.translate((p.x + Math.sin(t * 0.4 + p.ph) * 0.03) * w, p.y * h); g.rotate(p.rot); g.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(p.ph * 0.8)));
          g.globalAlpha = 0.5 * a; g.drawImage(sheet, -sw / 2, -sh / 2, sw, sh); g.restore();
        }
        g.globalAlpha = 1;
      },
    };
  },
});
