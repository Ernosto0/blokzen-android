import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';
import { mistBands } from '../shared/shapes.js';

Object.assign(AMBIENTS, {
  paddy(th) { // rice terraces holding water at dawn, a stupa on the far hill, mist, egrets crossing
    let land = null, lw = 0, lh = 0, t = 0;
    const EG = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.1, 0.3), v: rand(0.02, 0.035), ph: rand(0, 6.3) }));
    const bend = (x, w, h, k) => Math.sin(x / w * Math.PI * 1.3 + k * 0.6) * h * 0.02;
    const hill = (x, w, h) => h * (0.46 - 0.08 * Math.sin(x / w * Math.PI));
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d'), u = Math.min(w, h);
      g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, hill(x, w, h)); g.lineTo(w, h); g.closePath(); g.fillStyle = 'rgba(70,50,36,.3)'; g.fill();
      const sx = w * 0.62, sy = hill(sx, w, h), su = u * 0.05; // a bell-shaped stupa on stepped platforms
      g.fillStyle = 'rgba(60,42,30,.45)';
      for (let i = 0; i < 3; i++) g.fillRect(sx - su * (1.6 - i * 0.35), sy - su * 0.3 * (i + 1), su * 2 * (1.6 - i * 0.35), su * 0.3);
      g.beginPath(); g.arc(sx, sy - su * 0.9, su * 0.6, Math.PI, 0); g.fill(); g.fillRect(sx - su * 0.08, sy - su * 2, su * 0.16, su * 0.6);
      for (let k = 0; k < 9; k++) {
        const y0 = h * (0.56 + k * 0.05), y1 = y0 + h * 0.05;
        g.beginPath(); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, y0 + bend(x, w, h, k)); for (let x = w + 8; x >= 0; x -= 8) g.lineTo(x, y1 + bend(x, w, h, k + 1)); g.closePath();
        g.fillStyle = k % 2 ? 'rgba(220,190,140,.12)' : 'rgba(90,150,60,.22)'; g.fill();
        g.strokeStyle = 'rgba(30,20,10,.25)'; g.lineWidth = 1.5; g.beginPath(); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, y0 + bend(x, w, h, k)); g.stroke();
      }
    }
    return {
      step(dt) { t += dt; for (const e of EG) { e.x += e.v * dt; e.ph += dt * 5; if (e.x > 1.1) { e.x = -0.1; e.y = rand(0.1, 0.3); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const sun = g.createRadialGradient(w * 0.8, h * 0.3, 0, w * 0.8, h * 0.3, u * 0.6); sun.addColorStop(0, rgba(th.accent, 0.3 * a)); sun.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = sun; g.fillRect(0, 0, w, h);
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        g.strokeStyle = `rgba(255,230,180,${0.35 * a})`; g.lineWidth = 1.5; g.beginPath(); // light on the flooded terraces
        for (let k = 1; k < 9; k += 2) for (let i = 0; i < 4; i++) {
          const x = ((i * 0.27 + k * 0.13 + t * 0.01) % 1) * w, y = h * (0.585 + k * 0.05) + bend(x, w, h, k), l = u * 0.04 * (0.6 + 0.4 * Math.sin(t + i + k));
          g.moveTo(x - l, y); g.lineTo(x + l, y);
        }
        g.stroke();
        mistBands(g, w, h, a, t, [0.5, 0.62], '255,240,220');
        g.strokeStyle = `rgba(255,255,250,${0.75 * a})`; g.lineWidth = 2;
        for (const e of EG) { // egrets: white, slow wing beats
          const x = e.x * w, y = e.y * h, bs = u * 0.022, f = Math.sin(e.ph) * 0.5 + 0.5;
          g.beginPath(); g.moveTo(x - bs, y - bs * 0.4 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.7 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.7 * f, x + bs, y - bs * 0.4 * f); g.stroke();
        }
      },
    };
  },
});
