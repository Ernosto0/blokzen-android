import { rgba } from '../../core/color.js';
import { inOut, rand } from '../../core/util.js';
import { AMBIENTS } from '../registry.js';

// the seven pieces of a 4 x 4 tangram square, corners in square units
const TAN = [[[0, 0], [4, 0], [2, 2]], [[0, 0], [2, 2], [0, 4]], [[4, 2], [4, 4], [2, 4]], [[3, 1], [4, 0], [4, 2]],
  [[2, 2], [3, 3], [1, 3]], [[2, 2], [3, 1], [4, 2], [3, 3]], [[0, 4], [1, 3], [3, 3], [2, 4]]];

Object.assign(AMBIENTS, {
  tans(th) { // tangram sets on rice paper: each one sits as a square, falls apart into its seven pieces, then finds its way back
    let paper = null, pw = 0, ph = 0, t = 0;
    const CEN = TAN.map(p => [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length]);
    const scatter = () => TAN.map(() => ({ dx: rand(-3.2, 3.2), dy: rand(-2.6, 2.6), r: ((Math.random() * 8) | 0) * Math.PI / 4 }));
    const SETS = [[0.22, 0.205, 0.04, 0], [0.8, 0.9, 0.05, 5], [0.1, 0.62, 0.034, 9], [0.9, 0.38, 0.034, 3]].map(([x, y, s, ph0]) => ({ x, y, s, ph0, sc: scatter(), cyc: -1 }));
    function build(w, h) {
      pw = w; ph = h; paper = document.createElement('canvas'); paper.width = Math.ceil(w); paper.height = Math.ceil(h);
      const g = paper.getContext('2d');
      g.lineCap = 'round';
      for (let i = 0; i < 260; i++) {
        const x = Math.random() * w, y = Math.random() * h, an = Math.random() * Math.PI, l = rand(6, 22);
        g.strokeStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.4)' : 'rgba(120,100,70,.08)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(an) * l * 0.5 + rand(-3, 3), y + Math.sin(an) * l * 0.5 + rand(-3, 3), x + Math.cos(an) * l, y + Math.sin(an) * l); g.stroke();
      }
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        if (!paper || Math.abs(w - pw) > 1 || Math.abs(h - ph) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(paper, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const S of SETS) {
          const ct = t + S.ph0, cyc = Math.floor(ct / 16), k = ct % 16;
          if (cyc !== S.cyc) { S.cyc = cyc; S.sc = scatter(); }
          const e = k < 5 ? 0 : k < 7.5 ? inOut((k - 5) / 2.5) : k < 12 ? 1 : k < 15 ? 1 - inOut((k - 12) / 3) : 0;
          const U = S.s * u, cx = S.x * w, cy = S.y * h, spin = Math.sin(t * 0.1 + S.ph0) * 0.15;
          g.save(); g.translate(cx, cy); g.rotate(spin);
          TAN.forEach((pc, i) => {
            const [mx, my] = CEN[i], sc = S.sc[i], drift = e * Math.sin(t * 0.4 + i) * 0.15;
            g.save(); g.translate((mx - 2 + sc.dx * e + drift) * U, (my - 2 + sc.dy * e) * U); g.rotate(sc.r * e);
            g.beginPath(); pc.forEach(([px, py], j) => j ? g.lineTo((px - mx) * U, (py - my) * U) : g.moveTo((px - mx) * U, (py - my) * U)); g.closePath();
            g.fillStyle = rgba(th.blocks[i], 0.38 * a); g.fill();
            g.strokeStyle = `rgba(255,250,240,${0.8 * a})`; g.lineWidth = 1.5; g.lineJoin = 'round'; g.stroke();
            g.restore();
          });
          g.restore();
        }
      },
    };
  },
});
