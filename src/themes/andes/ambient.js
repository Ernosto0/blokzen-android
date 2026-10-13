import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';
import { mistBands } from '../shared/shapes.js';

Object.assign(AMBIENTS, {
  terraces(th) { // terraced slopes in the mist, a condor circling, llamas walking along a ledge
    let land = null, lw = 0, lh = 0, t = 0;
    const LL = [0, 1, 2].map(i => ({ x: i * 0.12, s: rand(0.85, 1.1) }));
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d');
      [[0.42, 'rgba(120,90,80,.18)', 0.006, 0.12], [0.56, 'rgba(100,110,70,.26)', 0.009, 0.1], [0.72, 'rgba(70,90,50,.34)', 0.012, 0.08]].forEach(([y0, col, f, amp], L) => {
        const top = x => h * y0 - (Math.sin(x * f + L) * 0.5 + 0.5) * h * amp;
        g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, top(x)); g.lineTo(w, h); g.closePath(); g.fillStyle = col; g.fill();
        g.strokeStyle = 'rgba(255,240,210,.08)'; g.lineWidth = 1.2;
        for (let k = 1; k < 7; k++) { g.beginPath(); for (let x = 0; x <= w + 8; x += 8) { const y = top(x) + k * h * 0.025; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      });
    }
    return {
      step(dt) { t += dt; for (const l of LL) { l.x += 0.012 * dt; if (l.x > 1.15) l.x -= 1.4; } },
      draw(g, w, h, a) {
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        mistBands(g, w, h, a, t, [0.4, 0.55, 0.7], '255,245,235');
        const cx = w * 0.7 + Math.cos(t * 0.15) * w * 0.15, cy = h * 0.15 + Math.sin(t * 0.15) * h * 0.05, cs = u * 0.05, fl = Math.sin(t * 0.8) * 0.08;
        g.fillStyle = `rgba(30,20,16,${0.6 * a})`; g.beginPath(); g.moveTo(cx - cs, cy - cs * (0.25 + fl));
        g.quadraticCurveTo(cx - cs * 0.4, cy - cs * 0.1, cx, cy); g.quadraticCurveTo(cx + cs * 0.4, cy - cs * 0.1, cx + cs, cy - cs * (0.25 + fl));
        g.quadraticCurveTo(cx + cs * 0.4, cy + cs * 0.05, cx, cy + cs * 0.1); g.quadraticCurveTo(cx - cs * 0.4, cy + cs * 0.05, cx - cs, cy - cs * (0.25 + fl)); g.fill();
        const ly = h * 0.9;
        for (const l of LL) { // llamas: body, long neck, ears, legs stepping
          const x = l.x * w, s = u * 0.03 * l.s, st = Math.sin(t * 5 + l.x * 40) * s * 0.18;
          g.fillStyle = g.strokeStyle = `rgba(250,236,214,${0.55 * a})`; g.lineWidth = Math.max(1.5, s * 0.16); g.lineCap = 'round';
          g.beginPath(); g.ellipse(x, ly - s * 1.1, s * 0.75, s * 0.42, 0, 0, Math.PI * 2); g.fill();
          g.fillRect(x + s * 0.45, ly - s * 2.4, s * 0.26, s * 1.3);
          g.beginPath(); g.ellipse(x + s * 0.68, ly - s * 2.42, s * 0.3, s * 0.15, 0, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.moveTo(x + s * 0.52, ly - s * 2.5); g.lineTo(x + s * 0.5, ly - s * 2.85); g.moveTo(x + s * 0.64, ly - s * 2.5); g.lineTo(x + s * 0.66, ly - s * 2.85);
          for (const [lx, sg] of [[-0.5, 1], [-0.3, -1], [0.35, -1], [0.55, 1]]) { g.moveTo(x + lx * s, ly - s * 0.8); g.lineTo(x + lx * s + st * sg, ly); }
          g.stroke(); g.lineCap = 'butt';
        }
      },
    };
  },
});
