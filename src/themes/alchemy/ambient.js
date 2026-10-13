import { rgba } from '../../core/color.js';
import { clamp01, rand } from '../../core/util.js';
import { rr } from '../../render/sprites.js';
import { alchemySign } from './helpers.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  alchemylab(th) { // a bubbling cauldron, shelves of jars, alchemical signs drifting up through the vapour
    let base = null, bw = 0, bh = 0, t = 0, acc = 0, B = [], V = [];
    const SG = [...Array(12)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.012, 0.03), k: (Math.random() * 7) | 0, ph: rand(0, 6.3), s: rand(0.7, 1.3) }));
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h);
      for (const [x0, x1] of [[0, w * 0.2], [w * 0.8, w]]) for (const y of [0.3, 0.55]) { // two shelves of jars on each wall
        const sy = h * y;
        g.fillStyle = 'rgba(80,50,30,.55)'; g.fillRect(x0, sy, x1 - x0, u * 0.014);
        for (let x = x0 + u * 0.02; x < x1 - u * 0.03; x += u * rand(0.045, 0.065)) {
          const jw = u * rand(0.028, 0.042), jh = jw * rand(1.1, 1.8), c = th.blocks[(Math.random() * 7) | 0];
          rr(g, x, sy - jh, jw, jh, jw * 0.25); g.fillStyle = 'rgba(255,255,255,.08)'; g.fill();
          rr(g, x, sy - jh * 0.6, jw, jh * 0.6, jw * 0.2); g.fillStyle = rgba(c, 0.35); g.fill();
          g.fillStyle = 'rgba(120,80,50,.6)'; g.fillRect(x + jw * 0.15, sy - jh - jw * 0.15, jw * 0.7, jw * 0.18);
        }
      }
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.18) { acc = 0; B.push({ x: rand(-0.09, 0.09), life: 0, r: rand(0.006, 0.014) }); if (Math.random() < 0.45) V.push({ x: rand(-0.06, 0.06), y: 0, life: 0 }); }
        for (const b of B) b.life += dt / 0.9;
        B = B.filter(b => b.life < 1);
        for (const v of V) { v.life += dt / 5; v.y -= 0.05 * dt; v.x += Math.sin(t + v.life * 6) * 0.01 * dt; }
        V = V.filter(v => v.life < 1);
        for (const s of SG) { s.y -= s.v * dt; s.ph += dt; if (s.y < 0.15) { s.y = 1.0; s.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), cx = w / 2, cy = h * 0.97, cr = u * 0.17;
        const gl = g.createRadialGradient(cx, cy - cr * 0.6, 0, cx, cy - cr * 0.6, u * 0.6); gl.addColorStop(0, rgba(th.accent, 0.22 * a)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
        for (const v of V) { const r = u * (0.03 + v.life * 0.1), x = cx + v.x * w, y = cy - cr * 0.7 + v.y * h, al = Math.sin(v.life * Math.PI) * 0.12 * a; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(th.accent, al)); gr.addColorStop(1, rgba(th.accent, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
        g.beginPath(); g.ellipse(cx, cy - cr * 0.62, cr * 0.95, cr * 0.2, 0, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.6 * a); g.fill(); // the brew
        for (const b of B) { const x = cx + b.x * w, y = cy - cr * 0.65 - b.life * cr * 0.25, r = b.r * u * (0.6 + b.life); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = `rgba(230,255,235,${0.7 * (1 - b.life) * a})`; g.lineWidth = 1.5; g.stroke(); }
        g.beginPath(); g.moveTo(cx - cr, cy - cr * 0.62); g.quadraticCurveTo(cx - cr * 1.15, cy + cr * 0.2, cx - cr * 0.6, cy + cr * 0.35); g.lineTo(cx + cr * 0.6, cy + cr * 0.35); g.quadraticCurveTo(cx + cr * 1.15, cy + cr * 0.2, cx + cr, cy - cr * 0.62);
        g.quadraticCurveTo(cx, cy - cr * 0.38, cx - cr, cy - cr * 0.62); g.fillStyle = `rgba(16,12,18,${0.95 * a})`; g.fill(); // the cauldron in front of its brew
        g.beginPath(); g.ellipse(cx, cy - cr * 0.62, cr, cr * 0.2, 0, 0, Math.PI); g.strokeStyle = `rgba(90,80,100,${0.8 * a})`; g.lineWidth = u * 0.012; g.stroke();
        g.lineWidth = 1.8; g.lineJoin = 'round';
        for (const s of SG) { const k = Math.sin(clamp01((1 - s.y) / 0.85) * Math.PI); g.strokeStyle = rgba(th.accent, 0.5 * k * a); alchemySign(g, s.k, (s.x + Math.sin(t * 0.5 + s.ph) * 0.02) * w, s.y * h, u * 0.022 * s.s); }
      },
    };
  },
});
