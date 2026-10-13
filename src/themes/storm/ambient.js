import { state } from '../../core/state.js';
import { rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  storm(th) { // dark clouds, slanting rain, now and then a lightning strike
    const R = [...Array(140)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.9, 1.4), l: rand(0.02, 0.04) }));
    const CL = [...Array(6)].map(() => ({ x: Math.random(), y: rand(-0.05, 0.12), r: rand(0.2, 0.35), v: rand(0.004, 0.012) }));
    let t = 0, bolt = null, wait = rand(3, 7);
    const mkBolt = () => {
      const P = []; let x = rand(0.15, 0.85), y = 0; P.push([x, y]);
      while (y < 0.55) { y += rand(0.04, 0.08); x += rand(-0.05, 0.05); P.push([x, y]); }
      const bi = 2 + ((Math.random() * (P.length - 3)) | 0), Bp = [P[bi]]; let bx = P[bi][0], by = P[bi][1];
      for (let i = 0; i < 4; i++) { by += rand(0.03, 0.06); bx += rand(0.02, 0.06) * (Math.random() < 0.5 ? -1 : 1); Bp.push([bx, by]); }
      return { P, Bp, life: 0 };
    };
    return {
      step(dt) {
        t += dt;
        for (const d of R) { d.y += d.v * dt; d.x += 0.25 * dt; if (d.y > 1.05) { d.y = -0.05; d.x = Math.random() - 0.1; } if (d.x > 1.05) d.x -= 1.1; }
        for (const c of CL) { c.x += c.v * dt; if (c.x > 1.4) c.x = -0.4; }
        wait -= dt;
        if (!bolt && wait < 0 && !state.REDUCED) { bolt = mkBolt(); wait = rand(4, 9); }
        if (bolt) { bolt.life += dt / 0.45; if (bolt.life >= 1) bolt = null; }
      },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const c of CL) {
          const gr = g.createRadialGradient(c.x * w, c.y * h, 0, c.x * w, c.y * h, c.r * u);
          gr.addColorStop(0, `rgba(8,12,20,${0.5 * a})`); gr.addColorStop(1, 'rgba(8,12,20,0)');
          g.fillStyle = gr; g.fillRect(0, 0, w, h);
        }
        if (bolt) {
          const f = 1 - bolt.life, fl = f * (0.6 + 0.4 * Math.sin(bolt.life * 40));
          g.fillStyle = `rgba(200,225,255,${0.1 * fl * a})`; g.fillRect(0, 0, w, h);
          const line = P => { g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x * w, y * h) : g.moveTo(x * w, y * h)); };
          g.save(); g.shadowColor = '#bfe4ff'; g.shadowBlur = 18; g.lineJoin = 'round'; g.strokeStyle = `rgba(230,245,255,${0.9 * fl * a})`;
          g.lineWidth = 2.5; line(bolt.P); g.stroke(); g.lineWidth = 1.5; line(bolt.Bp); g.stroke(); g.restore();
        }
        g.strokeStyle = `rgba(170,195,230,${0.28 * a})`; g.lineWidth = 1; g.beginPath();
        for (const d of R) { const x = d.x * w, y = d.y * h, l = d.l * h; g.moveTo(x, y); g.lineTo(x - l * 0.25, y - l); }
        g.stroke();
      },
    };
  },
});
