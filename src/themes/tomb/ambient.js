import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';
import { glyph } from './helpers.js';

Object.assign(AMBIENTS, {
  tomb(th) { // carved stone wall, two torches, trickles of sand, dust
    let wall = null, ww = 0, wh = 0, t = 0;
    const DUST = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.01, 0.01), ph: rand(0, 6.3) }));
    const SAND = [0, 1, 2].map(() => ({ x: rand(0.15, 0.85), on: rand(0, 3), wait: rand(0, 3), acc: 0, G: [] }));
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), u = Math.min(w, h), rh = u * 0.085, bw = rh * 2.2;
      g.strokeStyle = 'rgba(255,214,150,.07)'; g.lineWidth = 1.5;
      for (let r = 0, y = 0; y < h; r++, y += rh) { const off = (r % 2) * bw / 2; for (let x = -off; x < w; x += bw) g.strokeRect(x + 1, y + 1, bw - 2, rh - 2); }
      g.lineWidth = Math.max(1.5, u * 0.008); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,200,120,.09)';
      for (const cx of [0.28, 0.72]) for (let i = 0, y = h * 0.12; y < h * 0.9; i++, y += u * 0.12) { glyph(g, (i + (cx > 0.5 ? 2 : 0)) % 4, cx * w, y, u * 0.035); g.stroke(); }
    }
    return {
      step(dt) {
        t += dt;
        for (const s of SAND) {
          if (s.on > 0) { s.on -= dt; s.acc += dt; while (s.acc > 0.03) { s.acc -= 0.03; s.G.push({ y: 0, v: rand(0.05, 0.15), dx: rand(-0.004, 0.004) }); } }
          else { s.wait -= dt; if (s.wait <= 0) { s.on = rand(1.5, 4); s.wait = rand(2, 6); s.x = rand(0.15, 0.85); } }
          for (const p of s.G) { p.v += 1.2 * dt; p.y += p.v * dt; }
          s.G = s.G.filter(p => p.y < 1.05);
        }
        for (const d of DUST) { d.x += d.v * dt; d.y -= 0.006 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const tx of [0.08, 0.92]) {
          const x = tx * w, y = h * 0.34, fl = 0.85 + 0.15 * Math.sin(t * 13 + tx * 9) * Math.sin(t * 7.3), R = u * 0.32 * fl;
          const gl = g.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba(th.accent, 0.3 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - R, 2 * R, 2 * R);
          g.fillStyle = `rgba(60,36,16,${0.9 * a})`; g.fillRect(x - u * 0.008, y, u * 0.016, u * 0.09);
          const fh = u * 0.05 * fl;
          g.beginPath(); g.moveTo(x, y - fh); g.quadraticCurveTo(x + u * 0.022, y - fh * 0.2, x, y + u * 0.006); g.quadraticCurveTo(x - u * 0.022, y - fh * 0.2, x, y - fh);
          g.fillStyle = `rgba(255,190,80,${0.9 * a})`; g.fill();
        }
        g.fillStyle = `rgba(230,190,120,${0.55 * a})`;
        const gs2 = Math.max(1, u * 0.004);
        for (const s of SAND) for (const p of s.G) g.fillRect((s.x + p.dx) * w, p.y * h, gs2, gs2);
        for (const d of DUST) { g.fillStyle = `rgba(255,220,160,${(0.2 + 0.15 * Math.sin(t + d.ph)) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
});
