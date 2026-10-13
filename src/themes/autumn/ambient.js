import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';
import { mapleShape } from '../shared/shapes.js';

Object.assign(AMBIENTS, {
  autumn(th) { // misty tree trunks, maple leaves blown about by gusts
    let trees = null, tw = 0, th2 = 0, t = 0;
    const LV = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), rot: rand(0, 6.3), vr: rand(-1.5, 1.5), v: rand(0.03, 0.07), ph: rand(0, 6.3), s: rand(0.6, 1.2), c: th.blocks[(Math.random() * 7) | 0] }));
    function build(w, h) {
      tw = w; th2 = h; trees = document.createElement('canvas'); trees.width = Math.ceil(w); trees.height = Math.ceil(h);
      const g = trees.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 9; i++) {
        const x = (i + Math.random()) / 9 * w, tw2 = u * rand(0.03, 0.07), al = rand(0.15, 0.35);
        g.fillStyle = `rgba(20,10,4,${al})`; g.strokeStyle = `rgba(20,10,4,${al})`;
        g.beginPath(); g.moveTo(x - tw2, h); g.lineTo(x - tw2 * 0.4, 0); g.lineTo(x + tw2 * 0.4, 0); g.lineTo(x + tw2, h); g.closePath(); g.fill();
        g.lineCap = 'round';
        for (let j = 0; j < 3; j++) { const by = h * rand(0.1, 0.5), dir = Math.random() < 0.5 ? -1 : 1; g.lineWidth = tw2 * 0.3; g.beginPath(); g.moveTo(x, by); g.quadraticCurveTo(x + dir * u * 0.08, by - u * 0.04, x + dir * u * 0.16, by - u * 0.12); g.stroke(); }
      }
    }
    return {
      step(dt) {
        t += dt;
        const wind = 0.05 * Math.sin(t * 0.3) + 0.03 * Math.sin(t * 1.1);
        for (const l of LV) { l.y += l.v * dt; l.x += (wind + Math.sin(t * 1.5 + l.ph) * 0.02) * dt; l.rot += l.vr * dt; if (l.y > 1.05) { l.y = -0.05; l.x = Math.random(); } if (l.x > 1.05) l.x = -0.05; if (l.x < -0.05) l.x = 1.05; }
      },
      draw(g, w, h, a) {
        if (!trees || Math.abs(w - tw) > 1 || Math.abs(h - th2) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(trees, 0, 0, w, h); g.globalAlpha = 1;
        for (let i = 0; i < 2; i++) {
          const y = h * (0.7 + i * 0.15), off = Math.sin(t * 0.15 + i) * w * 0.1;
          const fg = g.createLinearGradient(0, y - h * 0.1, 0, y + h * 0.1); fg.addColorStop(0, 'rgba(255,220,180,0)'); fg.addColorStop(0.5, `rgba(255,220,180,${0.08 * a})`); fg.addColorStop(1, 'rgba(255,220,180,0)');
          g.fillStyle = fg; g.fillRect(off - w * 0.2, y - h * 0.1, w * 1.4, h * 0.2);
        }
        const u = Math.min(w, h);
        for (const l of LV) { mapleShape(g, l.x * w, l.y * h, u * 0.022 * l.s, l.rot); g.fillStyle = rgba(l.c, 0.75 * a); g.fill(); }
      },
    };
  },
});
