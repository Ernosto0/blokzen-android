import { rgba } from '../../core/color.js';
import { state } from '../../core/state.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';
import { star8 } from './helpers.js';

Object.assign(AMBIENTS, {
  riad(th) { // a riad courtyard at night: star-tiled walls, horseshoe arches, a fountain, brass lanterns
    let wall = null, ww = 0, wh = 0, t = 0, acc = 0, D = [];
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), u = Math.min(w, h), q = Math.max(46, u * 0.15);
      g.lineWidth = 1.5; g.strokeStyle = 'rgba(232,224,204,.07)';
      for (let y = 0; y < h + q; y += q) for (let x = 0; x < w + q; x += q) {
        star8(g, x, y, q * 0.42); g.fillStyle = 'rgba(232,184,74,.04)'; g.fill(); g.stroke();
        g.save(); g.translate(x + q / 2, y + q / 2); g.rotate(Math.PI / 4); g.strokeRect(-q * 0.13, -q * 0.13, q * 0.26, q * 0.26); g.restore();
      }
      const ah = h * 0.22, aw = Math.max(70, w / 4.5);
      g.fillStyle = 'rgba(0,0,0,.28)';
      for (let x = aw / 2; x < w + aw; x += aw) {
        g.beginPath(); g.moveTo(x - aw * 0.36, h); g.lineTo(x - aw * 0.36, h - ah * 0.55);
        g.arc(x, h - ah * 0.55, aw * 0.4, Math.PI * 0.85, Math.PI * 2.15); g.lineTo(x + aw * 0.36, h); g.closePath(); g.fill();
      }
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        while (acc > 0.04) { acc -= 0.04; if (!state.REDUCED || Math.random() < 0.3) D.push({ x: 0, y: 0, vx: rand(-0.09, 0.09), vy: rand(-0.32, -0.22) }); }
        for (const p of D) { p.vy += 0.9 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        D = D.filter(p => p.y < 0.02);
      },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), fx = w / 2, fy = h * 0.95;
        g.beginPath(); g.ellipse(fx, fy, u * 0.2, u * 0.035, 0, 0, Math.PI * 2); g.fillStyle = `rgba(40,150,150,${0.35 * a})`; g.fill();
        g.strokeStyle = `rgba(232,224,204,${0.35 * a})`; g.lineWidth = 2; g.stroke();
        g.fillStyle = `rgba(180,240,235,${0.6 * a})`;
        for (const p of D) g.fillRect(fx + p.x * u, fy - u * 0.02 + p.y * u, 2, 2);
        for (const [lx, ph] of [[0.12, 0], [0.88, 2]]) {
          const x = lx * w, y = h * 0.12 + Math.sin(t * 0.9 + ph) * 3, r = u * 0.035, fl = 0.85 + 0.15 * Math.sin(t * 9 + ph) * Math.sin(t * 5.3);
          g.strokeStyle = `rgba(200,160,90,${0.5 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y - r); g.stroke();
          const gl = g.createRadialGradient(x, y, 0, x, y, u * 0.3 * fl); gl.addColorStop(0, rgba(th.accent, 0.3 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - u * 0.3, y - u * 0.3, u * 0.6, u * 0.6);
          star8(g, x, y, r); g.fillStyle = `rgba(255,210,120,${0.85 * fl * a})`; g.fill(); g.strokeStyle = `rgba(120,80,30,${0.8 * a})`; g.lineWidth = 1.5; g.stroke();
        }
      },
    };
  },
});
