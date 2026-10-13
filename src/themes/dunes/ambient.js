import { rgba } from '../../core/color.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

const tri = (g, x, y, w, h) => { g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x, y - h); g.lineTo(x + w / 2, y); g.closePath(); };
function cactus(g, x, y, s, col) { // a saguaro silhouette
  g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
  g.lineWidth = s * 0.16; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - s); g.stroke();
  g.lineWidth = s * 0.1;
  g.beginPath(); g.moveTo(x, y - s * 0.4); g.lineTo(x - s * 0.3, y - s * 0.4); g.lineTo(x - s * 0.3, y - s * 0.7); g.stroke();
  g.beginPath(); g.moveTo(x, y - s * 0.55); g.lineTo(x + s * 0.28, y - s * 0.55); g.lineTo(x + s * 0.28, y - s * 0.82); g.stroke();
}

Object.assign(AMBIENTS, {
  dunes(th) { // a desert evening: a huge low sun, pyramids and mesas far off, four layers of lit dunes, cacti, blowing sand and a few birds
    let land = null, lw = 0, lh = 0, t = 0;
    const WI = [...Array(70)].map(() => ({ x: Math.random(), y: rand(0.45, 1), v: rand(0.06, 0.22), l: rand(0.01, 0.035) }));
    const BI = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.08, 0.3), v: rand(0.01, 0.03), ph: rand(0, 6.3) }));
    const ST = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random() * 0.4, r: rand(0.5, 1.3), ph: rand(0, 6.3) }));
    function build(w, h) { // the still scenery is drawn once
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d'), u = Math.min(w, h), hz = h * 0.62;
      g.fillStyle = 'rgba(70,30,40,.5)'; // far silhouettes: two pyramids and a mesa
      tri(g, w * 0.2, hz, u * 0.3, u * 0.2); g.fill(); tri(g, w * 0.34, hz, u * 0.18, u * 0.12); g.fill();
      g.beginPath(); g.moveTo(w * 0.7, hz); g.lineTo(w * 0.72, hz - u * 0.07); g.lineTo(w * 0.8, hz - u * 0.07); g.lineTo(w * 0.83, hz); g.fill();
      const layers = [[0.66, 'rgba(236,150,90,.55)', 'rgba(255,214,150,.7)', 0.004, 0.05], [0.75, 'rgba(206,114,62,.7)', 'rgba(255,190,120,.7)', 0.006, 0.06], [0.84, 'rgba(150,76,40,.85)', 'rgba(240,160,96,.75)', 0.008, 0.05], [0.93, 'rgba(96,46,26,.95)', 'rgba(210,120,70,.8)', 0.011, 0.04]];
      layers.forEach(([y0, col, crest, f, amp], i) => {
        const yAt = x => h * y0 - Math.abs(Math.sin(x * f + i * 2.1)) * h * amp;
        g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 6; x += 6) g.lineTo(x, yAt(x)); g.lineTo(w, h); g.closePath(); g.fillStyle = col; g.fill();
        g.beginPath(); for (let x = 0; x <= w + 6; x += 6) x ? g.lineTo(x, yAt(x)) : g.moveTo(x, yAt(x)); g.strokeStyle = crest; g.lineWidth = Math.max(1, u * 0.004); g.stroke(); // the sunlit ridge
        g.strokeStyle = 'rgba(40,16,8,.14)'; g.lineWidth = Math.max(1, u * 0.005); // faint wind ripples down the slope
        for (let k = 1; k <= 2; k++) { g.beginPath(); for (let x = 0; x <= w + 6; x += 6) { const y = yAt(x) + k * h * 0.02; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      });
      cactus(g, w * 0.9, h * 0.8, u * 0.13, 'rgba(60,28,22,.9)'); cactus(g, w * 0.07, h * 0.9, u * 0.1, 'rgba(40,18,14,.95)');
    }
    return {
      step(dt) {
        t += dt;
        for (const p of WI) { p.x += p.v * dt; if (p.x > 1.05) { p.x = -0.05; p.y = rand(0.45, 1); } }
        for (const b of BI) { b.x += b.v * dt; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.08, 0.3); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sx = w * 0.62, sy = h * 0.58;
        const sky = g.createLinearGradient(0, 0, 0, h * 0.66); sky.addColorStop(0, rgba('#1a1030', 0.85 * a)); sky.addColorStop(0.5, rgba('#7a3548', 0.55 * a)); sky.addColorStop(1, rgba('#ff9a4a', 0.5 * a));
        g.fillStyle = sky; g.fillRect(0, 0, w, h * 0.7);
        for (const s of ST) { g.fillStyle = `rgba(255,240,220,${(0.25 + 0.4 * Math.sin(t * 1.4 + s.ph)) * a * (1 - s.y * 2)})`; g.beginPath(); g.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2); g.fill(); }
        const gl = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.8); gl.addColorStop(0, rgba('#ffb25a', 0.55 * a)); gl.addColorStop(1, rgba('#ffb25a', 0));
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
        const sun = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.19); sun.addColorStop(0, rgba('#fff2c0', a)); sun.addColorStop(0.75, rgba('#ffc060', a)); sun.addColorStop(1, rgba('#ff8a3a', a));
        g.beginPath(); g.arc(sx, sy, u * 0.19, 0, Math.PI * 2); g.fillStyle = sun; g.fill();
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        g.strokeStyle = `rgba(40,16,24,${0.6 * a})`; g.lineWidth = Math.max(1, u * 0.004); g.lineCap = 'round'; // birds
        for (const b of BI) { const x = b.x * w, y = b.y * h + Math.sin(t * 0.8 + b.ph) * u * 0.01, f = Math.sin(t * 5 + b.ph) * u * 0.008; g.beginPath(); g.moveTo(x - u * 0.016, y + f); g.quadraticCurveTo(x - u * 0.007, y - u * 0.008, x, y); g.quadraticCurveTo(x + u * 0.007, y - u * 0.008, x + u * 0.016, y + f); g.stroke(); }
        g.strokeStyle = `rgba(255,224,170,${0.3 * a})`; g.lineWidth = 1; g.beginPath();
        for (const p of WI) { const x = p.x * w, y = p.y * h + Math.sin(t * 2 + p.y * 30) * 2; g.moveTo(x, y); g.lineTo(x - p.l * w, y + 1); }
        g.stroke();
      },
    };
  },
});
