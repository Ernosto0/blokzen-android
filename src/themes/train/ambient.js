import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  nighttrain(th) { // the view from the window: mountains, lights of towns and passing poles, the moon keeping up
    let far = null, fw = 0, fh = 0, t = 0;
    const TOWN = [...Array(28)].map(() => ({ x: Math.random(), y: rand(0.7, 0.8), ph: rand(0, 6.3), c: Math.random() < 0.7 ? '255,210,130' : '255,240,220' }));
    const ST = [...Array(60)].map(() => ({ x: Math.random(), y: Math.random() * 0.55, ph: rand(0, 6.3) }));
    function build(w, h) {
      fw = w; fh = h; far = document.createElement('canvas'); far.width = Math.ceil(w * 2); far.height = Math.ceil(h * 0.4);
      const g = far.getContext('2d'), H = far.height, W2 = far.width;
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W2; x += 8) { const p = x / W2 * Math.PI * 2; g.lineTo(x, H * 0.45 - (Math.sin(p * 3) * 0.22 + Math.sin(p * 7 + 1) * 0.1 + Math.sin(p * 13) * 0.04) * H); }
      g.lineTo(W2, H); g.closePath(); g.fillStyle = 'rgba(30,32,64,.85)'; g.fill();
    }
    return {
      step(dt) { t += dt; for (const l of TOWN) { l.x -= 0.03 * dt; if (l.x < -0.02) { l.x = 1.02; l.y = rand(0.7, 0.8); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const s2 of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.sin(t * 1.5 + s2.ph)) * a})`; g.fillRect(s2.x * w, s2.y * h, 1.5, 1.5); }
        const mx = w * 0.78, my = h * 0.16, mr = u * 0.07;
        const gl = g.createRadialGradient(mx, my, mr, mx, my, mr * 4); gl.addColorStop(0, `rgba(230,230,255,${0.2 * a})`); gl.addColorStop(1, 'rgba(230,230,255,0)');
        g.fillStyle = gl; g.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8);
        g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.fillStyle = `rgba(245,242,230,${0.9 * a})`; g.fill();
        if (!far || Math.abs(w - fw) > 1 || Math.abs(h - fh) > 1) build(w, h);
        const off = (t * w * 0.012) % (w * 2);
        g.globalAlpha = a; g.drawImage(far, -off, h * 0.42, w * 2, h * 0.4); g.drawImage(far, w * 2 - off, h * 0.42, w * 2, h * 0.4); g.globalAlpha = 1;
        g.fillStyle = `rgba(12,12,28,${0.9 * a})`; g.fillRect(0, h * 0.8, w, h * 0.2);
        for (const l of TOWN) { const k = 0.6 + 0.4 * Math.sin(t * 3 + l.ph); g.fillStyle = `rgba(${l.c},${0.7 * k * a})`; g.fillRect(l.x * w, l.y * h, 2.5, 2.5); }
        const sp = w * 0.55, po = (t * w * 0.6) % sp; // telegraph poles rushing past, wires sagging between them
        g.strokeStyle = `rgba(10,10,20,${0.8 * a})`; g.lineWidth = 3;
        for (let x = w + sp - po; x > -sp; x -= sp) { g.beginPath(); g.moveTo(x, h); g.lineTo(x, h * 0.6); g.moveTo(x - u * 0.03, h * 0.62); g.lineTo(x + u * 0.03, h * 0.62); g.stroke(); }
        g.lineWidth = 1; g.beginPath();
        for (let x = w + sp - po; x > -sp; x -= sp) { g.moveTo(x, h * 0.62); g.quadraticCurveTo(x - sp / 2, h * 0.67, x - sp, h * 0.62); } g.stroke();
        g.fillStyle = `rgba(0,0,0,${0.35 * a})`; g.fillRect(0, h * 0.93, w, h * 0.07); // window sill
      },
    };
  },
});
