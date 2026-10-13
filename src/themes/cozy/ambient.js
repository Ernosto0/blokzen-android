import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

const BULBS = ['#ffd27a', '#ffb07a', '#ffe6a8', '#f4a0a8', '#ffd27a'];
function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

Object.assign(AMBIENTS, {
  cozy(th) { // a rainy night seen from a warm room: arched window with rain and a moon, fairy lights, a candle, a steaming mug, a knitted blanket, drifting dust in the lamp light
    let land = null, lw = 0, lh = 0, t = 0;
    const win = (w, h) => { const u = Math.min(w, h), ww = u * 0.34; return { x: w * 0.97 - ww, y: h * 0.07, w: ww, h: ww * 1.35 }; };
    const RAIN = [...Array(22)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.5, 0.9), l: rand(0.08, 0.18) }));
    const DROPS = [...Array(7)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.08), r: rand(0.012, 0.022) }));
    const DUST = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.004, 0.012), r: rand(0.6, 1.6), ph: rand(0, 6.3) }));
    const STAR = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random() * 0.5, r: rand(0.5, 1.1), ph: rand(0, 6.3) }));
    function build(w, h) { // the still scenery is drawn once: lamp-lit wall, the window and the blanket
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d'), u = Math.min(w, h), W = win(w, h);
      const wall = g.createLinearGradient(0, 0, 0, h); wall.addColorStop(0, 'rgba(60,34,36,.55)'); wall.addColorStop(1, 'rgba(96,52,40,.5)');
      g.fillStyle = wall; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(255,214,170,.05)'; g.lineWidth = Math.max(1, u * 0.012); // soft wallpaper stripes
      for (let x = u * 0.05; x < w; x += u * 0.09) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      // the window: night sky, a moon, a wooden frame with a cross bar
      const r = W.w / 2;
      g.save(); g.beginPath(); g.moveTo(W.x, W.y + W.h); g.lineTo(W.x, W.y + r); g.arc(W.x + r, W.y + r, r, Math.PI, 0); g.lineTo(W.x + W.w, W.y + W.h); g.closePath(); g.clip();
      const sky = g.createLinearGradient(0, W.y, 0, W.y + W.h); sky.addColorStop(0, '#1c2a44'); sky.addColorStop(1, '#3a4a68');
      g.fillStyle = sky; g.fillRect(W.x, W.y, W.w, W.h);
      const mx = W.x + W.w * 0.66, my = W.y + W.h * 0.3, mr = W.w * 0.13;
      const mg = g.createRadialGradient(mx, my, 0, mx, my, mr * 3); mg.addColorStop(0, 'rgba(255,240,200,.45)'); mg.addColorStop(1, 'rgba(255,240,200,0)');
      g.fillStyle = mg; g.fillRect(W.x, W.y, W.w, W.h);
      g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.fillStyle = '#fff2cf'; g.fill();
      g.beginPath(); g.arc(mx + mr * 0.45, my - mr * 0.1, mr * 0.9, 0, Math.PI * 2); g.fillStyle = '#2a3a58'; g.fill(); // a crescent
      g.fillStyle = 'rgba(18,24,40,.85)'; // far rooftops
      g.fillRect(W.x, W.y + W.h * 0.82, W.w, W.h * 0.18);
      for (const [fx, fw, fh] of [[0.05, 0.2, 0.1], [0.3, 0.16, 0.14], [0.55, 0.24, 0.08], [0.82, 0.14, 0.12]]) g.fillRect(W.x + W.w * fx, W.y + W.h * (0.82 - fh), W.w * fw, W.h * fh);
      g.fillStyle = 'rgba(255,200,120,.8)'; for (const [fx, fy] of [[0.34, 0.74], [0.6, 0.78], [0.87, 0.72]]) g.fillRect(W.x + W.w * fx, W.y + W.h * fy, W.w * 0.025, W.w * 0.03); // lit windows
      g.restore();
      g.strokeStyle = '#6a4228'; g.lineWidth = u * 0.016; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(W.x, W.y + W.h); g.lineTo(W.x, W.y + r); g.arc(W.x + r, W.y + r, r, Math.PI, 0); g.lineTo(W.x + W.w, W.y + W.h); g.closePath(); g.stroke();
      g.lineWidth = u * 0.01; g.beginPath(); g.moveTo(W.x + r, W.y); g.lineTo(W.x + r, W.y + W.h); g.moveTo(W.x, W.y + W.h * 0.55); g.lineTo(W.x + W.w, W.y + W.h * 0.55); g.stroke();
      g.fillStyle = '#7a4e30'; rrect(g, W.x - u * 0.02, W.y + W.h - u * 0.004, W.w + u * 0.04, u * 0.022, u * 0.008); g.fill(); // sill
      // the knitted blanket along the bottom: a wavy edge with ribbed zig-zag rows
      const by = h * 0.945, edge = x => by + Math.sin(x / u * 14) * u * 0.006;
      g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 6; x += 6) g.lineTo(x, edge(x)); g.lineTo(w, h); g.closePath(); g.fillStyle = '#b4604a'; g.fill();
      g.save(); g.clip();
      for (let k = 0; k < 4; k++) { // chevron stripes
        g.beginPath(); for (let x = -u * 0.04; x <= w + u * 0.04; x += u * 0.04) { const y = by + u * 0.018 + k * u * 0.016 + ((x / (u * 0.04)) % 2 ? u * 0.008 : 0); x < 0 ? g.moveTo(x, y) : g.lineTo(x, y); }
        g.strokeStyle = k % 2 ? 'rgba(255,224,170,.5)' : 'rgba(80,28,20,.35)'; g.lineWidth = u * 0.007; g.stroke();
      }
      g.restore();
      g.beginPath(); for (let x = 0; x <= w + 6; x += 6) x ? g.lineTo(x, edge(x)) : g.moveTo(x, edge(x)); g.strokeStyle = 'rgba(255,232,196,.5)'; g.lineWidth = u * 0.006; g.stroke();
    }
    return {
      step(dt) {
        t += dt;
        for (const r of RAIN) { r.y += r.v * dt; if (r.y > 1.1) { r.y = -0.1; r.x = Math.random(); } }
        for (const d of DROPS) { d.y += d.v * dt; if (d.y > 1.05) { d.y = -0.05; d.x = Math.random(); } }
        for (const d of DUST) { d.y -= d.v * dt; d.x += Math.sin(t * 0.5 + d.ph) * 0.004 * dt; if (d.y < -0.05) { d.y = 1.05; d.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), W = win(w, h);
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        // rain and drops on the glass, clipped to the arch
        g.save(); const r = W.w / 2; g.beginPath(); g.moveTo(W.x, W.y + W.h); g.lineTo(W.x, W.y + r); g.arc(W.x + r, W.y + r, r, Math.PI, 0); g.lineTo(W.x + W.w, W.y + W.h); g.closePath(); g.clip();
        for (const s of STAR) { g.fillStyle = `rgba(255,244,220,${(0.25 + 0.3 * Math.sin(t * 1.2 + s.ph)) * a})`; g.beginPath(); g.arc(W.x + s.x * W.w, W.y + s.y * W.h, s.r, 0, Math.PI * 2); g.fill(); }
        g.strokeStyle = `rgba(190,215,255,${0.45 * a})`; g.lineWidth = Math.max(1, u * 0.003); g.lineCap = 'round'; g.beginPath();
        for (const q of RAIN) { const x = W.x + q.x * W.w, y = W.y + q.y * W.h; g.moveTo(x, y); g.lineTo(x - u * 0.004, y + q.l * W.h * 0.5); }
        g.stroke();
        for (const d of DROPS) { const x = W.x + d.x * W.w, y = W.y + d.y * W.h; g.beginPath(); g.ellipse(x, y, u * d.r * 0.45, u * d.r * 0.7, 0, 0, Math.PI * 2); g.fillStyle = `rgba(210,228,255,${0.3 * a})`; g.fill(); g.fillStyle = `rgba(255,255,255,${0.5 * a})`; g.fillRect(x - u * 0.002, y - u * d.r * 0.4, u * 0.003, u * 0.004); }
        g.restore();
        // fairy lights: a sagging wire across the top, bulbs that glow and breathe
        const wy = x => h * 0.012 + Math.sin(x / w * Math.PI * 4) * 0 + Math.abs(Math.sin(x / w * Math.PI * 3)) * h * 0.03;
        g.beginPath(); for (let x = 0; x <= w + 6; x += 6) x ? g.lineTo(x, wy(x)) : g.moveTo(x, wy(x)); g.strokeStyle = `rgba(40,24,20,${0.8 * a})`; g.lineWidth = Math.max(1, u * 0.004); g.stroke();
        const nb = Math.max(6, Math.round(w / (u * 0.11)));
        for (let i = 0; i < nb; i++) {
          const x = (i + 0.5) * w / nb, y = wy(x) + u * 0.014, c = BULBS[i % BULBS.length], k = 0.7 + 0.3 * Math.sin(t * 1.6 + i * 1.7);
          const gl = g.createRadialGradient(x, y, 0, x, y, u * 0.06); gl.addColorStop(0, rgba(c, 0.5 * k * a)); gl.addColorStop(1, rgba(c, 0));
          g.fillStyle = gl; g.fillRect(x - u * 0.06, y - u * 0.06, u * 0.12, u * 0.12);
          g.beginPath(); g.ellipse(x, y, u * 0.0085, u * 0.012, 0, 0, Math.PI * 2); g.fillStyle = rgba(c, (0.6 + 0.4 * k) * a); g.fill();
        }
        // the candle: a warm pool of light, a jar, a flame that wobbles
        const cx = w * 0.13, cb = h * 0.945, fl = 1 + Math.sin(t * 9) * 0.06 + Math.sin(t * 5.3 + 1) * 0.05;
        const pool = g.createRadialGradient(cx, cb - u * 0.05, 0, cx, cb - u * 0.05, u * 0.55); pool.addColorStop(0, rgba('#ffb25a', 0.32 * fl * a)); pool.addColorStop(1, rgba('#ffb25a', 0));
        g.fillStyle = pool; g.fillRect(0, cb - u * 0.6, u * 0.7 + cx, u * 0.7);
        g.fillStyle = `rgba(236,222,200,${a})`; rrect(g, cx - u * 0.028, cb - u * 0.058, u * 0.056, u * 0.062, u * 0.012); g.fill();
        g.fillStyle = `rgba(150,96,70,${0.9 * a})`; g.fillRect(cx - u * 0.028, cb - u * 0.03, u * 0.056, u * 0.016);
        g.strokeStyle = `rgba(40,24,20,${a})`; g.lineWidth = Math.max(1, u * 0.003); g.beginPath(); g.moveTo(cx, cb - u * 0.058); g.lineTo(cx, cb - u * 0.068); g.stroke();
        const fx = cx + Math.sin(t * 4) * u * 0.002, fy = cb - u * 0.07, fh = u * 0.034 * fl;
        g.beginPath(); g.moveTo(fx, fy - fh); g.quadraticCurveTo(fx + u * 0.016, fy - fh * 0.3, fx, fy); g.quadraticCurveTo(fx - u * 0.016, fy - fh * 0.3, fx, fy - fh); g.fillStyle = `rgba(255,170,70,${a})`; g.fill();
        g.beginPath(); g.ellipse(fx, fy - fh * 0.3, u * 0.006, fh * 0.32, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,244,200,${a})`; g.fill();
        // the mug and its steam
        const mx = w * 0.87, mb = h * 0.945, mw = u * 0.075, mh = u * 0.07;
        g.fillStyle = `rgba(240,226,206,${a})`; rrect(g, mx - mw / 2, mb - mh, mw, mh, u * 0.014); g.fill();
        g.fillStyle = `rgba(205,120,92,${0.95 * a})`; g.fillRect(mx - mw / 2, mb - mh * 0.62, mw, mh * 0.16);
        g.beginPath(); g.arc(mx + mw / 2, mb - mh * 0.5, mh * 0.28, -Math.PI / 2, Math.PI / 2); g.strokeStyle = `rgba(240,226,206,${a})`; g.lineWidth = u * 0.009; g.stroke();
        g.beginPath(); g.ellipse(mx, mb - mh, mw / 2, u * 0.008, 0, 0, Math.PI * 2); g.fillStyle = `rgba(110,64,44,${a})`; g.fill();
        g.lineCap = 'round'; g.lineWidth = Math.max(1.5, u * 0.007);
        for (let i = 0; i < 3; i++) {
          const ph = (t * 0.35 + i / 3) % 1, x0 = mx + (i - 1) * mw * 0.22;
          g.beginPath(); for (let k = 0; k <= 12; k++) { const f = k / 12, y = mb - mh - f * u * 0.13 * (0.6 + ph * 0.4), x = x0 + Math.sin(f * 5 + t * 1.5 + i * 2) * u * 0.012 * (0.4 + f); k ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.strokeStyle = `rgba(255,244,230,${0.22 * (1 - ph * 0.6) * a})`; g.stroke();
        }
        // dust motes floating up through the lamp light
        for (const d of DUST) { g.fillStyle = `rgba(255,226,170,${(0.12 + 0.28 * Math.abs(Math.sin(t * 0.9 + d.ph))) * a})`; g.beginPath(); g.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2); g.fill(); }
      },
    };
  },
});
