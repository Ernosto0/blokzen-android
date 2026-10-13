import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { rr } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  bazaar(th) { // striped stone arches, swaying mosaic lanterns, sacks of spice below, dust in the light
    let hall = null, hw = 0, hh = 0, t = 0;
    const LN = [0.14, 0.38, 0.62, 0.86].map((x, i) => ({ x, len: rand(0.1, 0.22), ph: rand(0, 6.3), c: th.blocks[[0, 5, 4, 6][i]] }));
    const DU = [...Array(36)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.012, -0.004), ph: rand(0, 6.3) }));
    function build(w, h) {
      hw = w; hh = h; hall = document.createElement('canvas'); hall.width = Math.ceil(w); hall.height = Math.ceil(h);
      const g = hall.getContext('2d'), u = Math.min(w, h), aw = Math.max(90, w / 3.2);
      for (let x = 0; x < w + aw; x += aw) { // striped arches
        for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(x, h * 0.32, aw * 0.5 - k * 5, Math.PI, Math.PI * 2); g.strokeStyle = k % 2 ? 'rgba(240,200,140,.07)' : 'rgba(150,60,30,.1)'; g.lineWidth = 5; g.stroke(); }
        g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x - aw * 0.06, h * 0.32, aw * 0.12, h);
      }
      const sy = h * 0.88;
      for (let i = 0; i < 9; i++) { // spice sacks along the floor
        const x = (i + 0.5) / 9 * w, r = u * rand(0.06, 0.08), c = th.blocks[i % 7];
        g.fillStyle = 'rgba(140,100,60,.4)'; rr(g, x - r, sy - r * 0.5, r * 2, h - sy + r, r * 0.4); g.fill();
        g.beginPath(); g.ellipse(x, sy - r * 0.45, r * 0.95, r * 0.5, 0, Math.PI, 0); g.fillStyle = rgba(c, 0.55); g.fill();
        g.fillStyle = 'rgba(90,60,30,.5)'; g.fillRect(x - r, sy - r * 0.5, r * 2, r * 0.12);
      }
    }
    return {
      step(dt) { t += dt; for (const d of DU) { d.y += d.v * dt; d.x += Math.sin(t * 0.5 + d.ph) * 0.004 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!hall || Math.abs(w - hw) > 1 || Math.abs(h - hh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(hall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        g.save(); g.translate(w * 0.9, 0); g.rotate(0.5);
        const beam = g.createLinearGradient(0, 0, 0, h * 1.2); beam.addColorStop(0, `rgba(255,210,140,${0.14 * a})`); beam.addColorStop(1, 'rgba(255,210,140,0)');
        g.fillStyle = beam; g.fillRect(-w * 0.12, 0, w * 0.24, h * 1.3); g.restore();
        for (const l of LN) {
          const sw = Math.sin(t * 0.8 + l.ph) * 0.08, x0 = l.x * w, L = l.len * h, x = x0 + Math.sin(sw) * L, y = Math.cos(sw) * L, r = u * 0.04;
          g.strokeStyle = `rgba(200,160,90,${0.5 * a})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x, y); g.stroke();
          const gl = g.createRadialGradient(x, y + r, 0, x, y + r, r * 4); gl.addColorStop(0, rgba(l.c, 0.35 * a)); gl.addColorStop(1, rgba(l.c, 0));
          g.fillStyle = gl; g.fillRect(x - r * 4, y + r - r * 4, r * 8, r * 8);
          g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + r * 1.1, y + r, x, y + r * 2.2); g.quadraticCurveTo(x - r * 1.1, y + r, x, y); g.fillStyle = rgba(l.c, 0.75 * a); g.fill();
          g.strokeStyle = `rgba(255,220,150,${0.6 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x - r * 0.75, y + r); g.lineTo(x + r * 0.75, y + r); g.stroke();
          g.fillStyle = `rgba(210,170,90,${0.8 * a})`; g.fillRect(x - r * 0.25, y + r * 2.15, r * 0.5, r * 0.25);
        }
        for (const d of DU) { const k = 0.5 + 0.5 * Math.sin(t * 2 + d.ph); g.fillStyle = `rgba(255,214,150,${(0.15 + 0.35 * k) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
});
