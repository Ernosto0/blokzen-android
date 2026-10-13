import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';
import { mapleShape } from '../shared/shapes.js';

function koiShape(g, x, y, r, ang, body, wag) {
  g.save(); g.translate(x, y); g.rotate(ang);
  g.beginPath(); g.ellipse(0, 0, r, r * 0.36, 0, 0, Math.PI * 2);
  g.moveTo(-r * 0.8, 0); g.quadraticCurveTo(-r * 1.25, -r * 0.2 + wag * r * 0.2, -r * 1.55, -r * 0.42); g.lineTo(-r * 1.4, 0); g.lineTo(-r * 1.55, r * 0.42); g.quadraticCurveTo(-r * 1.25, r * 0.2 + wag * r * 0.2, -r * 0.8, 0);
  g.fillStyle = body; g.fill();
  g.beginPath(); g.ellipse(r * 0.15, -r * 0.05, r * 0.28, r * 0.16, 0.3, 0, Math.PI * 2); g.fillStyle = 'rgba(216,64,40,.55)'; g.fill();
  g.restore();
}

Object.assign(AMBIENTS, {
  zen(th) { // raked gravel round the rocks, koi circling a pond, maple leaves drifting
    let sand = null, sw = 0, sh = 0, t = 0;
    const ROCKS = [[0.18, 0.2, 0.06], [0.84, 0.62, 0.08], [0.9, 0.16, 0.045]];
    const POND = { x: 0.2, y: 0.88, rx: 0.34, ry: 0.13 };
    const KOI = [0, 1, 2].map(i => ({ a: i * 2.1, sp: rand(0.25, 0.4) * (i % 2 ? -1 : 1), k: rand(0.55, 0.85), c: i === 1 ? 'rgba(255,248,240,.9)' : 'rgba(255,122,58,.9)' }));
    const LV = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random(), rot: rand(0, 6.3), vr: rand(-1, 1), v: rand(0.02, 0.05), ph: rand(0, 6.3), c: ['#c8442e', '#e0782a', '#d85a3a'][(Math.random() * 3) | 0] }));
    function build(w, h) {
      sw = w; sh = h; sand = document.createElement('canvas'); sand.width = Math.ceil(w); sand.height = Math.ceil(h);
      const g = sand.getContext('2d'), u = Math.min(w, h);
      g.save(); g.beginPath(); g.rect(0, 0, w, h);
      for (const [x, y, r] of ROCKS) { const R = r * u * 2.4; g.moveTo(x * w + R, y * h); g.arc(x * w, y * h, R, 0, Math.PI * 2); }
      g.ellipse(POND.x * w, POND.y * h, POND.rx * w * 1.08, POND.ry * h * 1.25, 0, 0, Math.PI * 2);
      g.clip('evenodd');
      for (let y = 0; y < h; y += u * 0.026) {
        g.beginPath(); for (let x = 0; x <= w + 12; x += 12) { const yy = y + Math.sin(x * 0.01 + y * 0.02) * u * 0.004; x ? g.lineTo(x, yy) : g.moveTo(x, yy); }
        g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.5; g.stroke();
        g.save(); g.translate(0, 2); g.strokeStyle = 'rgba(0,0,0,.05)'; g.stroke(); g.restore();
      }
      g.restore();
      for (const [x, y, r] of ROCKS) {
        for (let k = 1; k <= 4; k++) { g.beginPath(); g.arc(x * w, y * h, r * u * (1.1 + k * 0.32), 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.5; g.stroke(); }
        const gr = g.createRadialGradient(x * w - r * u * 0.3, y * h - r * u * 0.3, 0, x * w, y * h, r * u);
        gr.addColorStop(0, 'rgba(150,156,146,.8)'); gr.addColorStop(1, 'rgba(90,96,88,.8)');
        g.beginPath(); g.ellipse(x * w, y * h, r * u * 1.1, r * u * 0.85, 0.3, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      }
      g.beginPath(); g.ellipse(POND.x * w, POND.y * h, POND.rx * w, POND.ry * h, 0, 0, Math.PI * 2);
      g.fillStyle = 'rgba(70,120,110,.35)'; g.fill(); g.strokeStyle = 'rgba(110,116,104,.35)'; g.lineWidth = 3; g.stroke();
    }
    return {
      step(dt) {
        t += dt;
        for (const f of KOI) f.a += f.sp * dt;
        for (const l of LV) { l.y += l.v * dt; l.x += Math.sin(t * 1.3 + l.ph) * 0.02 * dt; l.rot += l.vr * dt; if (l.y > 1.05) { l.y = -0.05; l.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        if (!sand || Math.abs(w - sw) > 1 || Math.abs(h - sh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(sand, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        g.save(); g.beginPath(); g.ellipse(POND.x * w, POND.y * h, POND.rx * w, POND.ry * h, 0, 0, Math.PI * 2); g.clip();
        g.globalAlpha = a;
        for (const f of KOI) {
          const x = POND.x * w + Math.cos(f.a) * POND.rx * w * f.k, y = POND.y * h + Math.sin(f.a) * POND.ry * h * f.k;
          const ang = Math.atan2(Math.cos(f.a) * POND.ry * h * f.sp, -Math.sin(f.a) * POND.rx * w * f.sp);
          koiShape(g, x, y, u * 0.035, ang, f.c, Math.sin(t * 6 + f.a));
        }
        g.restore();
        for (const l of LV) { mapleShape(g, l.x * w, l.y * h, u * 0.018, l.rot); g.fillStyle = rgba(l.c, 0.7 * a); g.fill(); }
      },
    };
  },
});
