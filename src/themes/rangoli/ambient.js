import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  diya(th) { // a great rangoli on the floor turning very slowly, clay lamps flickering in a row, marigold petals falling
    let man = null, mu = 0, t = 0;
    const MG = [...Array(28)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.06), ph: rand(0, 6.3), c: Math.random() < 0.6 ? '#ff9a1a' : '#ffd83a' }));
    function build(u) {
      mu = u; const S = Math.ceil(u * 1.3); man = document.createElement('canvas'); man.width = man.height = S;
      const g = man.getContext('2d'), c = S / 2;
      for (let ring = 6; ring >= 1; ring--) {
        const n = 6 + ring * 4, R = S * 0.075 * ring, col = th.blocks[ring % 7];
        for (let i = 0; i < n; i++) {
          const an = i / n * Math.PI * 2 + ring * 0.3;
          g.save(); g.translate(c + Math.cos(an) * R, c + Math.sin(an) * R); g.rotate(an);
          g.beginPath(); g.ellipse(0, 0, S * 0.035, S * 0.016 * (1 + ring * 0.15), 0, 0, Math.PI * 2); g.fillStyle = rgba(col, 0.22); g.fill(); g.restore();
        }
        g.setLineDash([0.1, S * 0.012]); g.lineCap = 'round'; g.lineWidth = S * 0.006; g.strokeStyle = 'rgba(255,250,235,.16)';
        g.beginPath(); g.arc(c, c, R + S * 0.035, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
      }
      g.beginPath(); g.arc(c, c, S * 0.045, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.3); g.fill();
    }
    return {
      step(dt) { t += dt; for (const m of MG) { m.y += m.v * dt; m.ph += dt * 2; if (m.y > 1.04) { m.y = -0.04; m.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        if (!man || Math.abs(u - mu) > 1) build(u);
        const S = man.width;
        g.save(); g.globalAlpha = a; g.translate(w / 2, h * 0.5); g.rotate(t * 0.015); g.drawImage(man, -S / 2, -S / 2); g.restore();
        const n = Math.max(5, Math.round(w / 70));
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) / n * w, y = h * 0.97, fl = 0.8 + 0.2 * Math.sin(t * 10 + i * 1.9) * Math.sin(t * 6.1 + i);
          const gl = g.createRadialGradient(x, y - u * 0.03, 0, x, y - u * 0.03, u * 0.12 * fl); gl.addColorStop(0, rgba(th.accent, 0.35 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - u * 0.12, y - u * 0.15, u * 0.24, u * 0.24);
          g.beginPath(); g.moveTo(x - u * 0.03, y - u * 0.012); g.quadraticCurveTo(x, y + u * 0.02, x + u * 0.03, y - u * 0.012); g.closePath(); g.fillStyle = `rgba(170,80,40,${0.85 * a})`; g.fill();
          const fh = u * 0.03 * fl;
          g.beginPath(); g.moveTo(x, y - u * 0.012 - fh); g.quadraticCurveTo(x + u * 0.009, y - u * 0.016, x, y - u * 0.01); g.quadraticCurveTo(x - u * 0.009, y - u * 0.016, x, y - u * 0.012 - fh);
          g.fillStyle = `rgba(255,200,90,${0.95 * a})`; g.fill();
        }
        for (const m of MG) { g.beginPath(); g.ellipse((m.x + Math.sin(m.ph) * 0.01) * w, m.y * h, u * 0.009, u * 0.006 * (0.4 + 0.6 * Math.abs(Math.sin(m.ph))), m.ph, 0, Math.PI * 2); g.fillStyle = rgba(m.c, 0.75 * a); g.fill(); }
      },
    };
  },
});
