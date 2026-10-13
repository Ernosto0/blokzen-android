import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  tides(th) { // a big moon going through its phases over the sea, light on the water, clouds passing
    let t = 0;
    const ST = [...Array(80)].map(() => ({ x: Math.random(), y: Math.random() * 0.62, ph: rand(0, 6.3), s: rand(0.6, 1.6) }));
    const CL = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.08, 0.35), v: rand(0.006, 0.012), s: rand(0.8, 1.3) }));
    return {
      step(dt) { t += dt; for (const c of CL) { c.x += c.v * dt; if (c.x > 1.3) c.x = -0.3; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), hy = h * 0.68, mx = w * 0.5, my = h * 0.2, mr = u * 0.12;
        for (const s2 of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * s2.s + s2.ph))) * a})`; g.fillRect(s2.x * w, s2.y * h, s2.s, s2.s); }
        const gl = g.createRadialGradient(mx, my, mr, mx, my, mr * 3.5); gl.addColorStop(0, `rgba(220,232,255,${0.22 * a})`); gl.addColorStop(1, 'rgba(220,232,255,0)');
        g.fillStyle = gl; g.fillRect(mx - mr * 3.5, my - mr * 3.5, mr * 7, mr * 7);
        g.save(); g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.clip();
        g.fillStyle = `rgba(236,240,250,${0.92 * a})`; g.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
        g.fillStyle = `rgba(180,190,210,${0.5 * a})`; for (const [dx, dy, r] of [[-0.3, -0.2, 0.2], [0.25, 0.2, 0.26], [-0.1, 0.45, 0.13], [0.4, -0.35, 0.1]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2); g.fill(); }
        const ph = (t / 40) % 1, off = (ph * 2 - 1) * mr * 2.1; // one full cycle of phases every 40 seconds
        g.beginPath(); g.arc(mx + off, my, mr * 1.02, 0, Math.PI * 2); g.fillStyle = `rgba(8,16,34,${0.88 * a})`; g.fill();
        g.restore();
        for (const c of CL) {
          const cx = c.x * w, cy = c.y * h, r = u * 0.05 * c.s;
          g.beginPath(); for (const [dx, dy, q] of [[-1, 0.1, 0.7], [0, -0.15, 1], [1, 0.1, 0.7]]) { g.moveTo(cx + dx * r + q * r, cy + dy * r); g.arc(cx + dx * r, cy + dy * r, q * r, 0, Math.PI * 2); }
          g.fillStyle = `rgba(40,56,86,${0.6 * a})`; g.fill();
        }
        const sea = g.createLinearGradient(0, hy, 0, h); sea.addColorStop(0, `rgba(20,40,70,${0.65 * a})`); sea.addColorStop(1, `rgba(6,14,28,${0.75 * a})`);
        g.fillStyle = sea; g.fillRect(0, hy, w, h - hy);
        g.strokeStyle = `rgba(230,238,255,${0.4 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 10; i++) { const y = hy + (h - hy) * (0.05 + i * 0.1), len = u * (0.05 + i * 0.03) * (0.7 + 0.3 * Math.sin(t * 1.5 + i)); g.beginPath(); g.moveTo(mx - len / 2 + Math.sin(t + i * 2) * u * 0.01, y); g.lineTo(mx + len / 2 + Math.sin(t + i * 2) * u * 0.01, y); g.stroke(); }
        g.strokeStyle = `rgba(200,215,240,${0.12 * a})`; g.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) { const y0 = hy + (h - hy) * (0.15 + i * 0.22); g.beginPath(); for (let x = 0; x <= w + 10; x += 10) { const y = y0 + Math.sin(x * 0.02 + t * (0.8 + i * 0.2) + i) * u * 0.006; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      },
    };
  },
});
