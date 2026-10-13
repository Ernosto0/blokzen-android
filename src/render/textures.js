import { shade } from '../core/color.js';
import { poly, rr } from './sprites.js';
import { caneStripes, FRUIT, glassShine, marbleVeins, seeded, woodGrain } from './blocks.js';

/* ---------- Material textures: each theme's block surface, no symbols. Seeded by block colour so a tile looks the same every frame ---------- */
export function speckle(g, s, rnd, n, r0, r1, col) {
  for (let i = 0; i < n; i++) { g.beginPath(); g.arc(rnd() * s, rnd() * s, Math.max(0.5, s * (r0 + rnd() * (r1 - r0))), 0, Math.PI * 2); g.fillStyle = col(); g.fill(); }
}
export function softGlint(g, x, y, r, a) { // round specular highlight instead of a star
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
// clip to a rounded inset and lay the theme's texture inside it
export function texIn(g, s, c, style, k, x0, r) {
  g.save(); rr(g, s * x0, s * x0, s * (1 - 2 * x0), s * (1 - 2 * x0), s * r); g.clip();
  TEX[style](g, s, c, seeded(c), k);
  g.restore();
}
export const TEX = {
  gloss(g, s, c, rnd, k) { g.globalAlpha = 0.45 * k; rr(g, s * 0.2, s * 0.19, s * 0.6, s * 0.11, s * 0.05); g.fillStyle = '#fff'; g.fill(); g.globalAlpha = 1; },
  jelly(g, s, c, rnd, k) {
    g.save(); g.translate(s * 0.4, s * 0.33); g.rotate(-0.45);
    g.beginPath(); g.ellipse(0, 0, s * 0.17, s * 0.07, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.55 * k})`; g.fill(); g.restore();
    softGlint(g, s * 0.68, s * 0.68, s * 0.12, 0.25 * k);
  },
  neon(g, s, c) {
    rr(g, s * 0.22, s * 0.22, s * 0.56, s * 0.56, s * 0.08);
    g.shadowColor = shade(c, 0.4); g.shadowBlur = s * 0.14;
    g.strokeStyle = shade(c, 0.65); g.lineWidth = Math.max(1, s * 0.05); g.stroke(); g.stroke(); g.shadowBlur = 0;
  },
  candy(g, s, c, rnd, k) {
    g.strokeStyle = `rgba(255,255,255,${0.3 * k})`; g.lineWidth = s * 0.08;
    for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(s * i * 0.36, s); g.lineTo(s * (1 + i * 0.36), 0); g.stroke(); }
  },
  pixel(g, s, c, rnd, k) {
    const p = s / 8;
    g.fillStyle = `rgba(255,255,255,${0.85 * k})`; g.fillRect(p * 2, p * 2, p, p); g.fillRect(p * 3, p * 2, p, p); g.fillRect(p * 2, p * 3, p, p);
    g.fillStyle = `rgba(0,0,0,${0.18 * k})`; // dithered shadow in the lower right
    for (let y = 4; y < 7; y++) for (let x = 4; x < 7; x++) if ((x + y) % 2) g.fillRect(p * x, p * y, p, p);
  },
  leaf(g, s, c, rnd, k) { // leaf surface: midrib, side veins, mottled colour
    speckle(g, s, rnd, 34, 0.01, 0.035, () => rnd() < 0.5 ? `rgba(255,255,210,${0.12 * k})` : `rgba(0,40,0,${0.14 * k})`);
    const off = (rnd() - 0.5) * s * 0.3, P = t => [-s * 0.1 + off + s * 1.2 * t, s * 1.1 - s * 1.2 * t];
    g.lineCap = 'round'; g.strokeStyle = `rgba(255,255,225,${0.3 * k})`;
    g.lineWidth = Math.max(1, s * 0.022); g.beginPath(); g.moveTo(...P(0)); g.lineTo(...P(1)); g.stroke();
    g.lineWidth = Math.max(1, s * 0.011);
    for (let i = 1; i < 8; i++) {
      const [x, y] = P(i / 8);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + s * 0.14, y + s * 0.06, x + s * 0.28, y - s * 0.02); g.stroke();
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - s * 0.06, y - s * 0.14, x + s * 0.02, y - s * 0.28); g.stroke();
    }
  },
  gem(g, s, c, rnd, k) { // facets meeting at an off-centre point, light caught in one corner
    const cx = s * (0.4 + rnd() * 0.2), cy = s * (0.4 + rnd() * 0.2), C = [[0, 0], [s, 0], [s, s], [0, s]];
    C.forEach((p, i) => poly(g, [[cx, cy], p, C[(i + 1) % 4]], i % 2 ? `rgba(0,0,0,${0.12 * k})` : `rgba(255,255,255,${0.16 * k})`));
    g.strokeStyle = `rgba(255,255,255,${0.25 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    for (const p of C) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(...p); g.stroke(); }
    softGlint(g, s * 0.3, s * 0.28, s * 0.22, 0.5 * k);
  },
  frost(g, s, c, rnd, k) { // rime crystals growing across the ice
    speckle(g, s, rnd, 30, 0.004, 0.012, () => `rgba(255,255,255,${(0.2 + rnd() * 0.3) * k})`);
    g.strokeStyle = `rgba(255,255,255,${0.45 * k})`; g.lineWidth = Math.max(1, s * 0.012); g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const x = rnd() * s, y = rnd() * s, an = rnd() * Math.PI * 2, L = s * (0.15 + rnd() * 0.2), dx = Math.cos(an), dy = Math.sin(an);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx * L, y + dy * L); g.stroke();
      for (let j = 1; j <= 3; j++) {
        const bx = x + dx * L * j / 4, by = y + dy * L * j / 4, b = L * 0.25 * (1 - j / 5);
        for (const sg of [1, -1]) { const a2 = an + sg * 0.8; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a2) * b, by + Math.sin(a2) * b); g.stroke(); }
      }
    }
    softGlint(g, s * 0.32, s * 0.28, s * 0.2, 0.35 * k);
  },
  lava(g, s, c, rnd, k) { // cooled crust broken by a network of glowing seams
    speckle(g, s, rnd, 26, 0.01, 0.03, () => `rgba(0,0,0,${0.22 * k})`);
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let w = 0; w < 3; w++) {
      let x = rnd() * s, y = rnd() < 0.5 ? 0 : s, an = y ? -Math.PI / 2 : Math.PI / 2;
      g.beginPath(); g.moveTo(x, y);
      for (let i = 0; i < 6; i++) { an += (rnd() - 0.5) * 1.4; x += Math.cos(an) * s * 0.17; y += Math.sin(an) * s * 0.17; g.lineTo(x, y); }
      g.shadowColor = c; g.shadowBlur = s * 0.15;
      g.strokeStyle = shade(c, 0.45); g.lineWidth = Math.max(1, s * 0.045 * k); g.stroke();
      g.shadowBlur = 0; g.strokeStyle = `rgba(255,240,190,${0.85 * k})`; g.lineWidth = Math.max(1, s * 0.016); g.stroke();
    }
  },
  cosmic(g, s, c, rnd, k) { // drifting nebula clouds and pinpoint stars
    for (let i = 0; i < 3; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.25 + rnd() * 0.25);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, i === 1 ? `rgba(10,10,40,${0.35 * k})` : `rgba(255,255,255,${0.22 * k})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
    }
    for (let i = 0; i < 16; i++) { g.fillStyle = `rgba(255,255,255,${(0.35 + rnd() * 0.6) * k})`; const r = Math.max(0.6, s * (0.006 + rnd() * 0.012)); g.fillRect(rnd() * s, rnd() * s, r, r); }
  },
  honey(g, s, c, rnd, k) { // deep amber with air bubbles caught inside and a liquid sheen
    const deep = g.createLinearGradient(0, 0, 0, s); deep.addColorStop(0, 'rgba(120,50,0,0)'); deep.addColorStop(1, `rgba(120,50,0,${0.3 * k})`);
    g.fillStyle = deep; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 7; i++) {
      const x = s * (0.15 + rnd() * 0.7), y = s * (0.25 + rnd() * 0.65), r = s * (0.012 + rnd() * 0.035);
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = `rgba(255,240,190,${0.4 * k})`; g.lineWidth = Math.max(0.8, r * 0.3); g.stroke();
      g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, Math.max(0.5, r * 0.3), 0, Math.PI * 2); g.fillStyle = `rgba(255,255,240,${0.6 * k})`; g.fill();
    }
    g.beginPath(); g.moveTo(s * 0.12, s * 0.3); g.quadraticCurveTo(s * 0.5, s * 0.14, s * 0.88, s * 0.24);
    g.strokeStyle = `rgba(255,248,210,${0.45 * k})`; g.lineWidth = s * 0.05; g.lineCap = 'round'; g.stroke();
  },
  gold(g, s, c, rnd, k) { // brushed metal with a sweeping highlight
    for (let y = 0; y < s; y += Math.max(1, s / 30)) {
      g.fillStyle = rnd() < 0.5 ? `rgba(255,250,220,${(0.04 + rnd() * 0.12) * k})` : `rgba(90,50,0,${(0.04 + rnd() * 0.1) * k})`;
      g.fillRect(0, y, s, Math.max(1, s / 60));
    }
    const sh = g.createLinearGradient(0, 0, s, s);
    sh.addColorStop(0.2, 'rgba(255,255,240,0)'); sh.addColorStop(0.38, `rgba(255,255,240,${0.4 * k})`); sh.addColorStop(0.5, 'rgba(255,255,240,0)');
    g.fillStyle = sh; g.fillRect(0, 0, s, s);
  },
  glass(g, s, c, rnd, k) { glassShine(g, s, k); },
  choco(g, s, c, rnd, k) { // cocoa surface with a satin sheen
    speckle(g, s, rnd, 28, 0.004, 0.012, () => rnd() < 0.5 ? `rgba(0,0,0,${0.18 * k})` : `rgba(255,220,180,${0.1 * k})`);
    g.beginPath(); g.ellipse(s * 0.42, s * 0.35, s * 0.16, s * 0.045, -0.5, 0, Math.PI * 2); g.fillStyle = `rgba(255,230,200,${0.28 * k})`; g.fill();
  },
  slime(g, s, c, rnd, k) { // trapped bubbles of different sizes and a wet streak
    for (let i = 0; i < 6; i++) {
      const x = s * (0.15 + rnd() * 0.7), y = s * (0.3 + rnd() * 0.55), r = s * (0.015 + rnd() * 0.05);
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = `rgba(240,255,220,${0.5 * k})`; g.lineWidth = Math.max(0.8, s * 0.018); g.stroke();
      g.beginPath(); g.arc(x - r * 0.4, y - r * 0.4, Math.max(0.5, r * 0.25), 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.7 * k})`; g.fill();
    }
    g.beginPath(); g.ellipse(s * 0.34, s * 0.24, s * 0.16, s * 0.05, -0.3, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.5 * k})`; g.fill();
  },
  wood(g, s, c, rnd, k) { woodGrain(g, s, c, k); },
  gum(g, s, c, rnd, k) { // powdered-sugar dusting and a soft matte highlight
    softGlint(g, s * 0.35, s * 0.3, s * 0.3, 0.45 * k);
    speckle(g, s, rnd, 34, 0.004, 0.01, () => `rgba(255,255,255,${(0.25 + rnd() * 0.35) * k})`);
  },
  crystal(g, s, c, rnd, k) { // amethyst cut into irregular facets
    const edge = () => (rnd() < 0.5 ? rnd() * 0.15 : 0.85 + rnd() * 0.15); // facets fan out from near a corner, not the middle
    const cx = s * edge(), cy = s * edge(), pts = [];
    for (let i = 0; i < 8; i++) { const an = (i + rnd() * 0.6) / 8 * Math.PI * 2; pts.push([cx + Math.cos(an) * s, cy + Math.sin(an) * s]); }
    pts.forEach((p, i) => {
      const a = (0.08 + rnd() * 0.25) * k;
      poly(g, [[cx, cy], p, pts[(i + 1) % 8]], i % 2 ? `rgba(255,255,255,${a})` : `rgba(20,0,40,${a})`);
    });
    g.strokeStyle = `rgba(255,240,255,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    for (const p of pts) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(...p); g.stroke(); }
    softGlint(g, cx, cy, s * 0.18, 0.5 * k);
  },
  bean(g, s, c, rnd, k) { // espresso crema: marbled swirls and fine foam
    g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const y0 = rnd() * s, y1 = rnd() * s;
      g.beginPath(); g.moveTo(-s * 0.1, y0); g.bezierCurveTo(s * 0.35, y0 + (rnd() - 0.5) * s, s * 0.65, y1 + (rnd() - 0.5) * s, s * 1.1, y1);
      g.strokeStyle = i % 2 ? `rgba(70,35,12,${0.28 * k})` : `rgba(255,236,210,${0.32 * k})`; g.lineWidth = s * (0.03 + rnd() * 0.04); g.stroke();
    }
    speckle(g, s, rnd, 26, 0.004, 0.01, () => `rgba(255,245,230,${(0.2 + rnd() * 0.3) * k})`);
  },
  pumpkin(g, s, c, rnd, k) { // ribbed rind with a waxy shine and skin flecks
    g.strokeStyle = `rgba(120,40,0,${0.32 * k})`; g.lineWidth = Math.max(1, s * 0.028);
    for (const x of [0.22, 0.4, 0.6, 0.78]) { g.beginPath(); g.moveTo(s * x, 0); g.quadraticCurveTo(s * (x + (x - 0.5) * 0.5), s * 0.5, s * x, s); g.stroke(); }
    speckle(g, s, rnd, 20, 0.004, 0.01, () => `rgba(255,220,150,${0.3 * k})`);
    for (const x of [0.31, 0.5, 0.69]) { const gr = g.createLinearGradient(s * (x - 0.06), 0, s * (x + 0.06), 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,240,200,${0.22 * k})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(s * (x - 0.06), s * 0.1, s * 0.12, s * 0.5); }
  },
  cane(g, s, c, rnd, k) { caneStripes(g, s, '#ffffff', 0.75 * k); },
  marble(g, s, c, rnd, k) { marbleVeins(g, s, c, k); },
  paper(g, s, c, rnd, k) { // paper fibres and a crease with a light and a dark side
    g.lineCap = 'round';
    for (let i = 0; i < 50; i++) {
      const x = rnd() * s, y = rnd() * s, an = rnd() * Math.PI, L = s * (0.02 + rnd() * 0.06);
      g.strokeStyle = rnd() < 0.5 ? `rgba(255,255,255,${0.18 * k})` : `rgba(0,0,0,${0.07 * k})`; g.lineWidth = Math.max(0.6, s * 0.008);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * L, y + Math.sin(an) * L); g.stroke();
    }
    const y0 = s * (0.2 + rnd() * 0.6), y1 = s * (0.2 + rnd() * 0.6), d = Math.max(1, s * 0.012);
    g.lineWidth = Math.max(1, s * 0.014);
    g.strokeStyle = `rgba(255,255,255,${0.5 * k})`; g.beginPath(); g.moveTo(0, y0); g.lineTo(s, y1); g.stroke();
    g.strokeStyle = `rgba(0,0,0,${0.16 * k})`; g.beginPath(); g.moveTo(0, y0 + d); g.lineTo(s, y1 + d); g.stroke();
  },
  fruit(g, s, c, rnd, k) { // the fruit's own flesh: pulp, seeds or skin bloom
    const kind = (FRUIT[c] || {}).kind || 'dots';
    if (kind === 'citrus') {
      for (let i = 0; i < 26; i++) { g.save(); g.translate(rnd() * s, rnd() * s); g.rotate(rnd() * Math.PI); g.beginPath(); g.ellipse(0, 0, s * 0.06, s * 0.016, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,230,${0.3 * k})`; g.fill(); g.restore(); }
    } else if (kind === 'seeds') {
      speckle(g, s, rnd, 30, 0.006, 0.014, () => `rgba(255,230,230,${0.28 * k})`);
      for (let i = 0; i < 4; i++) { g.save(); g.translate(s * (0.18 + rnd() * 0.64), s * (0.18 + rnd() * 0.64)); g.rotate(rnd() * Math.PI); g.beginPath(); g.ellipse(0, 0, s * 0.055, s * 0.032, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(26,16,16,.9)'; g.fill(); g.restore(); }
    } else if (kind === 'kiwi') {
      for (let i = 0; i < 16; i++) { g.save(); g.translate(rnd() * s, rnd() * s); g.rotate(rnd() * Math.PI); g.fillStyle = `rgba(250,255,215,${0.25 * k})`; g.fillRect(-s * 0.06, -s * 0.008, s * 0.12, s * 0.016); g.restore(); }
      speckle(g, s, rnd, 18, 0.008, 0.016, () => 'rgba(26,20,8,.85)');
    } else if (kind === 'black') {
      speckle(g, s, rnd, 34, 0.006, 0.013, () => 'rgba(26,16,16,.8)');
    } else {
      g.fillStyle = `rgba(255,255,255,${0.12 * k})`; g.fillRect(0, 0, s, s);
      speckle(g, s, rnd, 24, 0.006, 0.016, () => `rgba(255,255,255,${0.22 * k})`);
    }
    g.beginPath(); g.ellipse(s * 0.32, s * 0.26, s * 0.12, s * 0.04, -0.5, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.4 * k})`; g.fill();
  },
};
