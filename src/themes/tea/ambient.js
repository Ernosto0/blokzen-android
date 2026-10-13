import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  bosphorus(th) { // the Istanbul skyline at sunrise over the water, a ferry crossing, gulls, steam from a tea glass
    let sky = null, sw = 0, sh = 0, t = 0, acc = 0, steam = [];
    const ferry = { x: -0.2, v: 0.02, puffs: [] };
    const GU = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.12, 0.38), v: rand(0.02, 0.04), ph: rand(0, 6.3) }));
    function build(w, h) {
      sw = w; sh = h; sky = document.createElement('canvas'); sky.width = Math.ceil(w); sky.height = Math.ceil(h * 0.2);
      const g = sky.getContext('2d'), H = sky.height, u = Math.min(w, h);
      g.fillStyle = 'rgba(16,26,40,.55)';
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, H * 0.7 - Math.sin(x * 0.004) * H * 0.18 - Math.sin(x * 0.013) * H * 0.06);
      g.lineTo(w, H); g.closePath(); g.fill();
      const dome = (x, r) => { // a dome with half domes and two minarets
        const base = H * 0.66;
        g.beginPath(); g.arc(x, base, r, Math.PI, 0); g.fill();
        g.beginPath(); g.arc(x - r * 1.1, base + r * 0.1, r * 0.55, Math.PI, 0); g.arc(x + r * 1.1, base + r * 0.1, r * 0.55, Math.PI, 0); g.fill();
        g.fillRect(x - r * 1.7, base, r * 3.4, H - base);
        for (const mx of [x - r * 2, x + r * 2]) { g.fillRect(mx - r * 0.07, base - r * 2.2, r * 0.14, r * 2.2 + H); g.beginPath(); g.moveTo(mx - r * 0.1, base - r * 2.2); g.lineTo(mx, base - r * 2.6); g.lineTo(mx + r * 0.1, base - r * 2.2); g.fill(); }
      };
      dome(w * 0.32, u * 0.05); dome(w * 0.7, u * 0.04);
      g.fillRect(w * 0.88, H * 0.3, u * 0.025, H); g.beginPath(); g.moveTo(w * 0.88 - u * 0.01, H * 0.3); g.lineTo(w * 0.88 + u * 0.0125, H * 0.18); g.lineTo(w * 0.88 + u * 0.035, H * 0.3); g.fill(); // a tower on the far hill
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        ferry.x += ferry.v * dt; if (ferry.x > 1.25) ferry.x = -0.25;
        if (acc > 0.35) { acc = 0; ferry.puffs.push({ x: ferry.x, y: 0, life: 0 }); steam.push({ x: rand(0.42, 0.58), y: 1.02, life: 0, ph: rand(0, 6.3) }); }
        for (const p of ferry.puffs) p.life += dt / 3;
        ferry.puffs = ferry.puffs.filter(p => p.life < 1);
        for (const p of steam) { p.y -= 0.07 * dt; p.life += dt / 7; }
        steam = steam.filter(p => p.life < 1);
        for (const b of GU) { b.x += b.v * dt; b.ph += dt * 6; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.12, 0.38); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), hy = h * 0.82, sx = w * 0.82, sy = h * 0.3; // the shore sits low so the board does not hide it
        const sun = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.5);
        sun.addColorStop(0, `rgba(255,214,150,${0.45 * a})`); sun.addColorStop(1, 'rgba(255,214,150,0)');
        g.fillStyle = sun; g.fillRect(0, 0, w, h);
        g.beginPath(); g.arc(sx, sy, u * 0.06, 0, Math.PI * 2); g.fillStyle = `rgba(255,236,200,${0.7 * a})`; g.fill();
        if (!sky || Math.abs(w - sw) > 1 || Math.abs(h - sh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(sky, 0, hy - h * 0.2, w, h * 0.2); g.globalAlpha = 1;
        const sea = g.createLinearGradient(0, hy, 0, h); sea.addColorStop(0, `rgba(60,110,140,${0.5 * a})`); sea.addColorStop(1, `rgba(20,46,66,${0.6 * a})`);
        g.fillStyle = sea; g.fillRect(0, hy, w, h - hy);
        g.strokeStyle = `rgba(255,220,170,${0.3 * a})`; g.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) { const y = hy + (h - hy) * (0.12 + i * 0.15), len = u * (0.1 + i * 0.05), x0 = sx - len / 2 + Math.sin(t + i) * u * 0.02; g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + len, y); g.stroke(); }
        const fx = ferry.x * w, fy = hy + (h - hy) * 0.3, fs = u * 0.045;
        for (const p of ferry.puffs) { const r = fs * (0.25 + p.life * 0.8); g.beginPath(); g.arc(p.x * w + p.life * fs * 0.6, fy - fs * 0.9 - p.life * fs * 1.2, r, 0, Math.PI * 2); g.fillStyle = `rgba(230,230,235,${0.28 * (1 - p.life) * a})`; g.fill(); }
        g.fillStyle = `rgba(20,24,30,${0.85 * a})`; g.beginPath(); g.moveTo(fx - fs * 1.4, fy - fs * 0.2); g.lineTo(fx + fs * 1.5, fy - fs * 0.2); g.lineTo(fx + fs * 1.2, fy + fs * 0.25); g.lineTo(fx - fs * 1.2, fy + fs * 0.25); g.closePath(); g.fill();
        g.fillStyle = `rgba(245,242,235,${0.85 * a})`; g.fillRect(fx - fs, fy - fs * 0.6, fs * 2, fs * 0.4);
        g.fillStyle = `rgba(20,24,30,${0.85 * a})`; g.fillRect(fx - fs * 0.15, fy - fs * 0.95, fs * 0.22, fs * 0.36);
        g.strokeStyle = `rgba(20,30,40,${0.5 * a})`; g.lineWidth = 1.6;
        for (const b of GU) { const x = b.x * w, y = b.y * h, bs = u * 0.018, f = Math.sin(b.ph) * 0.5 + 0.5; g.beginPath(); g.moveTo(x - bs, y - bs * 0.3 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.6 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.6 * f, x + bs, y - bs * 0.3 * f); g.stroke(); }
        for (const p of steam) {
          const x = (p.x + Math.sin(p.y * 8 + t * 0.6 + p.ph) * 0.03) * w, y = p.y * h, r = u * (0.03 + p.life * 0.08), al = Math.sin(p.life * Math.PI) * 0.07 * a;
          const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,245,235,${al})`); gr.addColorStop(1, 'rgba(255,245,235,0)');
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
});
