import { rgba } from '../../core/color.js';
import { state } from '../../core/state.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  graffiti(th) { // a brick wall covered in old tags under a flickering street lamp
    let wall = null, ww = 0, wh = 0, t = 0, fwait = rand(3, 7);
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), u = Math.min(w, h), bh = u * 0.045, bw = bh * 2.6;
      for (let r = 0, y = 0; y < h; r++, y += bh) {
        const off = (r % 2) * bw / 2;
        for (let x = -off; x < w; x += bw) { g.fillStyle = `rgba(140,70,56,${0.05 + Math.random() * 0.08})`; g.fillRect(x + 1, y + 1, bw - 2, bh - 2); }
      }
      g.lineCap = 'round'; g.lineJoin = 'round';
      for (let i = 0; i < 10; i++) {
        const c = th.blocks[(Math.random() * 7) | 0], x = Math.random() * w, y = Math.random() * h, L = u * rand(0.15, 0.35);
        g.strokeStyle = rgba(c, rand(0.1, 0.16)); g.lineWidth = u * rand(0.015, 0.035);
        g.beginPath(); g.moveTo(x, y);
        for (let j = 0; j < 3; j++) g.bezierCurveTo(x + rand(-L, L), y + rand(-L, L) * 0.5, x + rand(-L, L), y + rand(-L, L) * 0.5, x + rand(-L, L), y + rand(-L, L) * 0.4);
        g.stroke();
        g.lineWidth = u * 0.006;
        for (let j = 0; j < 3; j++) { const dx = x + rand(-L, L) * 0.6, dy = y + rand(-L, L) * 0.3; g.beginPath(); g.moveTo(dx, dy); g.lineTo(dx, dy + u * rand(0.03, 0.08)); g.stroke(); }
      }
    }
    return {
      step(dt) { t += dt; fwait -= dt; if (fwait < -0.5) fwait = rand(3, 7); },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), lx = w * 0.84, fl = fwait < 0 && !state.REDUCED ? (Math.sin(t * 60) > 0 ? 0.35 : 1) : 1;
        const cone = g.createLinearGradient(0, u * 0.05, 0, h); cone.addColorStop(0, `rgba(255,220,150,${0.18 * fl * a})`); cone.addColorStop(1, 'rgba(255,220,150,0)');
        g.fillStyle = cone; g.beginPath(); g.moveTo(lx - u * 0.03, u * 0.05); g.lineTo(lx + u * 0.03, u * 0.05); g.lineTo(lx + w * 0.35, h); g.lineTo(lx - w * 0.35, h); g.fill();
        g.fillStyle = `rgba(40,40,44,${0.9 * a})`; g.fillRect(lx - u * 0.04, u * 0.02, u * 0.08, u * 0.03);
        g.fillStyle = `rgba(255,236,190,${0.9 * fl * a})`; g.fillRect(lx - u * 0.03, u * 0.05, u * 0.06, u * 0.008);
      },
    };
  },
});
