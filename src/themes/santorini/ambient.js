import { rand } from '../../core/util.js';
import { poly } from '../../render/sprites.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  caldera(th) { // the caldera at sunset: white houses and blue domes on the cliff, a windmill, the sea and a sail
    let cliff = null, cw = 0, ch = 0, t = 0, bx0 = 0.5;
    function build(w, h) {
      cw = w; ch = h; cliff = document.createElement('canvas'); cliff.width = Math.ceil(w); cliff.height = Math.ceil(h);
      const g = cliff.getContext('2d'), u = Math.min(w, h), edge = y => w * (0.06 + 0.3 * Math.max(0, (y - h * 0.26) / (h * 0.5)));
      g.beginPath(); g.moveTo(0, h * 0.24); for (let y = h * 0.24; y <= h; y += 10) g.lineTo(edge(y) + Math.sin(y * 0.05) * u * 0.01, y); g.lineTo(0, h); g.closePath();
      g.fillStyle = 'rgba(160,100,80,.4)'; g.fill();
      const H = [];
      for (let i = 0; i < 40; i++) { const y = h * (0.26 + Math.random() * 0.36); H.push({ y, x: Math.random() * edge(y) * 0.9 }); }
      H.sort((p, q) => p.y - q.y);
      for (const p of H) { // whitewashed cubes, a shaded side, a blue door, now and then a blue dome
        const hw = u * rand(0.03, 0.05), hh = hw * rand(0.6, 0.9);
        g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(p.x, p.y - hh, hw, hh);
        g.fillStyle = 'rgba(120,150,190,.35)'; g.fillRect(p.x + hw * 0.75, p.y - hh, hw * 0.25, hh);
        g.fillStyle = 'rgba(30,94,200,.8)'; g.fillRect(p.x + hw * 0.3, p.y - hh * 0.55, hw * 0.18, hh * 0.55);
        if (Math.random() < 0.25) { g.beginPath(); g.arc(p.x + hw / 2, p.y - hh, hw * 0.38, Math.PI, 0); g.fillStyle = 'rgba(30,94,200,.9)'; g.fill(); }
      }
    }
    return {
      step(dt) { t += dt; bx0 += 0.01 * dt; if (bx0 > 1.15) bx0 = 0.3; },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sea = h * 0.6, sx = w * 0.78, sy = h * 0.56;
        const gl = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.55); gl.addColorStop(0, `rgba(255,190,120,${0.55 * a})`); gl.addColorStop(1, 'rgba(255,190,120,0)');
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
        g.beginPath(); g.arc(sx, sy, u * 0.06, 0, Math.PI * 2); g.fillStyle = `rgba(255,214,150,${0.9 * a})`; g.fill();
        const sg = g.createLinearGradient(0, sea, 0, h); sg.addColorStop(0, `rgba(40,110,170,${0.55 * a})`); sg.addColorStop(1, `rgba(20,70,130,${0.7 * a})`);
        g.fillStyle = sg; g.fillRect(0, sea, w, h - sea);
        g.strokeStyle = `rgba(255,220,170,${0.5 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 8; i++) { const y = sea + (h - sea) * (0.05 + i * 0.12), l = u * (0.04 + i * 0.025) * (0.7 + 0.3 * Math.sin(t * 1.4 + i)); g.beginPath(); g.moveTo(sx - l, y); g.lineTo(sx + l, y); g.stroke(); }
        const bx = bx0 * w, by = sea + (h - sea) * 0.25 + Math.sin(t * 1.2) * 2, bs = u * 0.04;
        g.fillStyle = `rgba(40,40,50,${0.7 * a})`; g.beginPath(); g.moveTo(bx - bs, by); g.lineTo(bx + bs, by); g.lineTo(bx + bs * 0.7, by + bs * 0.3); g.lineTo(bx - bs * 0.7, by + bs * 0.3); g.closePath(); g.fill();
        g.fillStyle = `rgba(255,255,255,${0.85 * a})`; g.beginPath(); g.moveTo(bx, by - bs * 1.6); g.lineTo(bx, by - bs * 0.1); g.lineTo(bx + bs * 0.8, by - bs * 0.1); g.closePath(); g.fill();
        if (!cliff || Math.abs(w - cw) > 1 || Math.abs(h - ch) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(cliff, 0, 0, w, h); g.globalAlpha = 1;
        const mx = w * 0.05, my = h * 0.2, mh = u * 0.1; // the windmill on the cliff top
        g.fillStyle = `rgba(255,255,255,${0.9 * a})`; g.fillRect(mx - mh * 0.2, my, mh * 0.4, mh * 0.6);
        poly(g, [[mx - mh * 0.24, my], [mx, my - mh * 0.25], [mx + mh * 0.24, my]], `rgba(120,80,60,${0.8 * a})`);
        g.save(); g.translate(mx, my - mh * 0.05); g.strokeStyle = `rgba(80,60,50,${0.7 * a})`; g.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          g.rotate(Math.PI / 3 + (i ? 0 : t * 0.6));
          g.beginPath(); g.moveTo(0, 0); g.lineTo(mh * 0.6, 0); g.stroke();
          poly(g, [[mh * 0.2, 0], [mh * 0.6, 0], [mh * 0.55, mh * 0.12], [mh * 0.22, mh * 0.08]], `rgba(255,255,255,${0.75 * a})`);
        }
        g.restore();
      },
    };
  },
});
