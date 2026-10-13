import { hexOf, hexRgb, mixHex, rgba, shade } from '../../core/color.js';
import { KITS, Sfx } from '../../audio/sfx.js';
import { ctx } from '../../ui/dom.js';
import { state } from '../../core/state.js';
import { clamp01, inOut, rand } from '../../core/util.js';
import { poly, rr } from '../../render/sprites.js';
import { seeded, STYLES } from '../../render/blocks.js';
import { softGlint, speckle, TEX, texIn } from '../../render/textures.js';
import { AMBIENTS } from '../../render/backgrounds.js';
import { PARTS } from '../../render/render.js';
import { rosette } from './third.js';

/* ---------- Zen collection: shapes shared by blocks, backgrounds and particles ---------- */
// eight-pointed star (two squares at 45°), the heart of zellige tilework
function star8(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 16; i++) {
    const an = i * Math.PI / 8 - Math.PI / 2, rad = i % 2 ? r * 0.765 : r;
    i ? g.lineTo(x + Math.cos(an) * rad, y + Math.sin(an) * rad) : g.moveTo(x + Math.cos(an) * rad, y + Math.sin(an) * rad);
  }
  g.closePath();
}
// four ovals round a centre, the kawung motif of Javanese batik (filled with the current fillStyle)
function kawung(g, x, y, r) {
  for (let i = 0; i < 4; i++) {
    const an = Math.PI / 4 + i * Math.PI / 2;
    g.beginPath(); g.ellipse(x + Math.cos(an) * r * 0.5, y + Math.sin(an) * r * 0.5, r * 0.46, r * 0.26, an, 0, Math.PI * 2); g.fill();
  }
}
// a Greek key running along a strip (path only, stroked by the caller)
function meander(g, x, y, w, h) {
  g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + w, y + h);
  for (let x0 = x; x0 < x + w - h * 0.2; x0 += h) {
    [[0, 1], [0, 0], [0.8, 0], [0.8, 0.68], [0.32, 0.68], [0.32, 0.34], [0.56, 0.34]].forEach(([px, py], i) => i ? g.lineTo(x0 + px * h, y + py * h) : g.moveTo(x0 + px * h, y + py * h));
  }
}
// a papel picado flag: zigzag hem and cut-out holes (fill with 'evenodd')
function papelPath(g, x, y, fw, fh) {
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + fw, y); g.lineTo(x + fw, y + fh * 0.82);
  for (let i = 5; i >= 0; i--) g.lineTo(x + fw * i / 6, y + fh * (i % 2 ? 1 : 0.82));
  g.closePath();
  const cx = x + fw / 2, cy = y + fh * 0.42, r = fw * 0.16;
  g.moveTo(cx, cy - r); g.lineTo(cx + r, cy); g.lineTo(cx, cy + r); g.lineTo(cx - r, cy); g.closePath();
  for (const dx of [-0.32, 0.32]) { g.moveTo(cx + dx * fw + fw * 0.06, cy); g.arc(cx + dx * fw, cy, fw * 0.06, 0, Math.PI * 2); }
}
// a hand-painted Puebla flower: four petals, leaves on the diagonals, quarter circles in the corners, a yellow eye
function talaveraFlower(g, s, col, eye) {
  const cx = s / 2, cy = s / 2;
  g.fillStyle = col;
  for (let i = 0; i < 4; i++) {
    g.save(); g.translate(cx, cy); g.rotate(i * Math.PI / 2);
    g.beginPath(); g.ellipse(0, -s * 0.16, s * 0.085, s * 0.14, 0, 0, Math.PI * 2); g.fill();
    g.rotate(Math.PI / 4); g.beginPath(); g.ellipse(0, -s * 0.27, s * 0.035, s * 0.07, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) { g.beginPath(); g.arc(x, y, s * 0.14, 0, Math.PI * 2); g.fill(); }
  g.beginPath(); g.arc(cx, cy, s * 0.065, 0, Math.PI * 2); g.fillStyle = eye; g.fill();
}
const paleHex = c => { const [r, g, b] = hexRgb(c); return r + g + b > 560; }; // a light block colour needs dark ornament
// soft bands of mist drifting slowly sideways; rgb is "r,g,b"
function mistBands(g, w, h, a, t, ys, rgb) {
  ys.forEach((yf, i) => {
    const y = h * yf, off = Math.sin(t * 0.1 + i * 2) * w * 0.15, gr = g.createLinearGradient(0, y - h * 0.06, 0, y + h * 0.06);
    gr.addColorStop(0, `rgba(${rgb},0)`); gr.addColorStop(0.5, `rgba(${rgb},${0.1 * a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(off - w * 0.2, y - h * 0.06, w * 1.4, h * 0.12);
  });
}

/* ---------- Zen collection: block looks and textures ---------- */
// a framed tile: dark rim, the block colour, then the theme's texture clipped inside
function framedTile(g, s, c, style, r = 0.08) {
  rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * r); g.fillStyle = shade(c, -0.45); g.fill();
  rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * r * 0.9); g.fillStyle = c; g.fill();
  g.save(); g.clip(); TEX[style](g, s, c, seeded(c), 1); g.restore();
}
Object.assign(STYLES, {
  zellige: { // a glazed tile set in cream mortar, an eight-pointed star cut into it
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.08); g.fillStyle = '#d8ccb0'; g.fill();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, shade(c, 0.25)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.2));
      rr(g, s * 0.07, s * 0.07, s * 0.86, s * 0.86, s * 0.06); g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.zellige(g, s, c, seeded(c), 1); g.restore();
    },
  },
  bojagi: { // patches of translucent silk sewn together
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.globalAlpha = 0.92; g.fillStyle = mixHex(c, '#ffffff', 0.15); g.fill(); g.globalAlpha = 1;
      g.save(); g.clip(); TEX.bojagi(g, s, c, seeded(c), 1); g.restore();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.strokeStyle = shade(c, -0.25); g.lineWidth = Math.max(1, s * 0.025); g.stroke();
    },
  },
  rangoli: { // a soft mound of coloured powder with a flower laid out in white dots
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.22); g.fillStyle = shade(c, -0.3); g.fill();
      const gr = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.03, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, shade(c, 0.25)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.1));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.2); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'rangoli', 1, 0.07, 0.2);
    },
  },
  kente: { block(g, s, c) { framedTile(g, s, c, 'kente', 0.06); } }, // a strip of woven kente cloth
  talavera: { // a glazed white tile with a flower painted in the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.fillStyle = shade(c, -0.45); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.07); g.fillStyle = '#fbf6ea'; g.fill();
      g.save(); g.clip();
      talaveraFlower(g, s, c, '#f0b020');
      g.strokeStyle = c; g.lineWidth = Math.max(1, s * 0.03); g.strokeRect(s * 0.13, s * 0.12, s * 0.74, s * 0.74);
      softGlint(g, s * 0.3, s * 0.26, s * 0.22, 0.6);
      g.restore();
    },
  },
  andean: { block(g, s, c) { framedTile(g, s, c, 'andean', 0.1); } }, // Andean weaving with a stepped diamond
  batik: { block(g, s, c) { framedTile(g, s, c, 'batik', 0.12); } },   // wax-resist cloth with the kawung motif
  cycladic: { // a whitewashed, rounded tile like a Cycladic wall, painted in the block colour
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.07, s * 0.9, s * 0.9, s * 0.18); g.fillStyle = shade(c, -0.28); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.25)); gr.addColorStop(1, c);
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.18); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'cycladic', 1, 0.05, 0.18);
    },
  },
  carpet: { block(g, s, c) { framedTile(g, s, c, 'carpet', 0.06); } }, // a square of hand-knotted Persian carpet
  inkwash: { // a square of rice paper soaked with ink in the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.92, s * 0.05); g.fillStyle = 'rgba(0,0,0,.18)'; g.fill();
      rr(g, s * 0.04, s * 0.03, s * 0.92, s * 0.92, s * 0.05); g.fillStyle = '#f4efe2'; g.fill();
      g.save(); g.clip();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, rgba(c, 0.95)); gr.addColorStop(1, rgba(c, 0.62));
      g.fillStyle = gr; g.fillRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      TEX.inkwash(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  zellige(g, s, c, rnd, k) { // a pale star in the glaze, mortar lines out to the corners, an uneven shine
    star8(g, s * 0.5, s * 0.5, s * 0.34); g.fillStyle = rgba(hexOf(mixHex(c, '#ffffff', 0.5)), 0.45 * k); g.fill();
    g.strokeStyle = `rgba(232,224,204,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.028); g.stroke();
    g.beginPath(); for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) { g.moveTo(x, y); g.lineTo(s * 0.5 + (x - s * 0.5) * 0.48, s * 0.5 + (y - s * 0.5) * 0.48); } g.stroke();
    speckle(g, s, rnd, 12, 0.006, 0.016, () => `rgba(255,255,255,${0.22 * k})`);
    softGlint(g, s * 0.3, s * 0.27, s * 0.22, 0.45 * k);
  },
  bojagi(g, s, c, rnd, k) { // three patches of silk in slightly different shades, the seams stitched and showing
    const x0 = s * (0.3 + rnd() * 0.4), y0 = s * (0.3 + rnd() * 0.4);
    g.fillStyle = `rgba(255,255,255,${0.2 * k})`; g.fillRect(0, 0, x0, s);
    g.fillStyle = `rgba(0,0,0,${0.06 * k})`; g.fillRect(x0, 0, s - x0, y0);
    g.fillStyle = `rgba(255,255,255,${0.36 * k})`; g.fillRect(x0, y0, s - x0, s - y0);
    const seam = (x1, y1, x2, y2) => {
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2);
      g.strokeStyle = `rgba(255,255,255,${0.75 * k})`; g.lineWidth = Math.max(1.2, s * 0.035); g.stroke();
      g.strokeStyle = `rgba(0,0,0,${0.14 * k})`; g.lineWidth = Math.max(0.6, s * 0.01); g.setLineDash([s * 0.035, s * 0.03]); g.stroke(); g.setLineDash([]);
    };
    seam(x0, 0, x0, s); seam(x0, y0, s, y0);
    const sh = g.createLinearGradient(0, 0, s, s); sh.addColorStop(0, `rgba(255,255,255,${0.25 * k})`); sh.addColorStop(0.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, `rgba(255,255,255,${0.12 * k})`);
    g.fillStyle = sh; g.fillRect(0, 0, s, s);
  },
  rangoli(g, s, c, rnd, k) { // powder grain and a flower of eight petals drawn in dotted white lines
    speckle(g, s, rnd, 50, 0.003, 0.009, () => rnd() < 0.5 ? `rgba(255,255,255,${0.22 * k})` : `rgba(0,0,0,${0.18 * k})`);
    const cx = s / 2, cy = s / 2;
    g.save(); g.lineCap = 'round'; g.setLineDash([0.1, s * 0.05]); g.lineWidth = Math.max(1.2, s * 0.035); g.strokeStyle = `rgba(255,250,235,${0.9 * k})`;
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; g.beginPath(); g.ellipse(cx + Math.cos(an) * s * 0.2, cy + Math.sin(an) * s * 0.2, s * 0.12, s * 0.055, an, 0, Math.PI * 2); g.stroke(); }
    g.beginPath(); g.arc(cx, cy, s * 0.4, 0, Math.PI * 2); g.stroke();
    g.restore();
    g.beginPath(); g.arc(cx, cy, s * 0.07, 0, Math.PI * 2); g.fillStyle = `rgba(255,250,235,${0.95 * k})`; g.fill();
  },
  kente(g, s, c, rnd, k) { // a dark band with a zigzag, thin stripes, check rows and the warp showing through
    const acc = c === '#e8b818' ? '#2a9a3a' : '#f0c020', q = s / 8;
    g.fillStyle = `rgba(16,12,4,${0.78 * k})`; g.fillRect(0, s * 0.38, s, s * 0.24);
    g.strokeStyle = rgba(acc, 0.95 * k); g.lineWidth = Math.max(1, s * 0.045); g.lineJoin = 'miter';
    g.beginPath(); for (let j = 0; j <= 8; j++) { const x = j / 8 * s, y = s * (j % 2 ? 0.43 : 0.57); j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.fillStyle = rgba(acc, 0.85 * k); g.fillRect(0, s * 0.29, s, s * 0.035); g.fillRect(0, s * 0.675, s, s * 0.035);
    g.fillStyle = `rgba(16,12,4,${0.55 * k})`;
    for (let i = 0; i < 8; i++) for (const y of [0.06, 0.76]) g.fillRect(i * q, s * y + (i % 2) * q, q, q);
    g.strokeStyle = `rgba(0,0,0,${0.1 * k})`; g.lineWidth = 1; g.beginPath();
    for (let x = 0; x < s; x += Math.max(2, s / 16)) { g.moveTo(x, 0); g.lineTo(x, s); } g.stroke();
  },
  talavera(g, s, c, rnd, k) { talaveraFlower(g, s, `rgba(255,250,235,${0.85 * k})`, `rgba(240,176,32,${0.95 * k})`); },
  andean(g, s, c, rnd, k) { // a stepped diamond woven in, fringe stripes top and bottom, the weft lines
    const q = s / 10;
    for (let r = 0; r < 10; r++) for (let cc = 0; cc < 10; cc++) {
      const d = Math.abs(cc - 4.5) + Math.abs(r - 4.5);
      if (d < 1.5) g.fillStyle = `rgba(30,10,0,${0.45 * k})`;
      else if (d >= 3 && d < 4) g.fillStyle = `rgba(255,248,230,${0.8 * k})`;
      else if (d >= 5 && d < 6) g.fillStyle = `rgba(30,10,0,${0.3 * k})`;
      else continue;
      g.fillRect(cc * q, r * q, q + 0.5, q + 0.5);
    }
    g.fillStyle = `rgba(255,248,230,${0.5 * k})`; g.fillRect(0, s * 0.06, s, Math.max(1, s * 0.03)); g.fillRect(0, s * 0.91, s, Math.max(1, s * 0.03));
    g.fillStyle = `rgba(0,0,0,${0.07 * k})`; for (let y = 0; y < s; y += Math.max(2, s / 18)) g.fillRect(0, y, s, 1);
  },
  batik(g, s, c, rnd, k) { // kawung ovals left pale by the wax, dots inside, fine cracks where the wax broke
    g.fillStyle = `rgba(255,240,210,${0.55 * k})`;
    kawung(g, s * 0.5, s * 0.5, s * 0.36);
    for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) kawung(g, x, y, s * 0.36);
    g.fillStyle = `rgba(40,20,5,${0.45 * k})`;
    for (let i = 0; i < 4; i++) { const an = Math.PI / 4 + i * Math.PI / 2; g.beginPath(); g.arc(s * 0.5 + Math.cos(an) * s * 0.18, s * 0.5 + Math.sin(an) * s * 0.18, s * 0.03, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = `rgba(40,20,5,${0.35 * k})`; g.lineWidth = Math.max(0.7, s * 0.01);
    for (let i = 0; i < 4; i++) {
      let x = rnd() * s, y = rnd() * s; g.beginPath(); g.moveTo(x, y);
      for (let j = 0; j < 5; j++) { x += (rnd() - 0.5) * s * 0.3; y += (rnd() - 0.5) * s * 0.3; g.lineTo(x, y); }
      g.stroke();
    }
  },
  cycladic(g, s, c, rnd, k) { // whitewash grain, a Greek key along the bottom, sun on the plaster
    speckle(g, s, rnd, 30, 0.004, 0.01, () => rnd() < 0.5 ? `rgba(255,255,255,${0.25 * k})` : `rgba(0,0,0,${0.08 * k})`);
    g.strokeStyle = paleHex(c) ? `rgba(30,94,200,${0.85 * k})` : `rgba(255,255,255,${0.85 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.lineJoin = 'miter';
    meander(g, s * 0.1, s * 0.66, s * 0.8, s * 0.17); g.stroke();
    softGlint(g, s * 0.3, s * 0.24, s * 0.24, 0.45 * k);
  },
  carpet(g, s, c, rnd, k) { // the knot grid of the pile, a border, a dotted inner border and a medallion
    const lt = paleHex(c) ? '#1e2a5a' : '#f6ecd4', au = c === '#e8c06a' ? '#b8283e' : '#e8c06a', q = s / 14;
    g.fillStyle = `rgba(0,0,0,${0.08 * k})`;
    for (let y = 0; y < 14; y++) for (let x = y % 2; x < 14; x += 2) g.fillRect(x * q, y * q, q, q);
    g.strokeStyle = rgba(lt, 0.7 * k); g.lineWidth = Math.max(1, s * 0.03); g.strokeRect(s * 0.12, s * 0.12, s * 0.76, s * 0.76);
    g.setLineDash([Math.max(1, s * 0.03), Math.max(1, s * 0.03)]); g.lineWidth = Math.max(1, s * 0.02); g.strokeStyle = rgba(au, 0.75 * k);
    g.strokeRect(s * 0.19, s * 0.19, s * 0.62, s * 0.62); g.setLineDash([]);
    poly(g, [[s * 0.5, s * 0.27], [s * 0.73, s * 0.5], [s * 0.5, s * 0.73], [s * 0.27, s * 0.5]], rgba(au, 0.85 * k));
    rosette(g, s * 0.5, s * 0.5, s * 0.13, rgba(lt, 0.85 * k), rgba(c, 1));
  },
  inkwash(g, s, c, rnd, k) { // darker pools in the wet ink, dry-brush streaks at the edges, sometimes a red seal
    for (let i = 0; i < 3; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.2 + rnd() * 0.25), gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(10,10,8,${0.22 * k})`); gr.addColorStop(1, 'rgba(10,10,8,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s);
    }
    for (let i = 0; i < 16; i++) {
      const y = rnd() < 0.5 ? s * (0.04 + rnd() * 0.14) : s * (0.82 + rnd() * 0.14);
      g.fillStyle = `rgba(242,236,220,${(0.35 + rnd() * 0.35) * k})`; g.fillRect(s * rnd() * 0.4, y, s * (0.3 + rnd() * 0.6), Math.max(0.6, s * 0.014));
    }
    if (rnd() < 0.45) {
      rr(g, s * 0.66, s * 0.64, s * 0.2, s * 0.2, s * 0.02); g.fillStyle = `rgba(196,42,34,${0.9 * k})`; g.fill();
      g.strokeStyle = `rgba(255,240,230,${0.85 * k})`; g.lineWidth = Math.max(0.8, s * 0.018);
      g.beginPath(); g.moveTo(s * 0.7, s * 0.69); g.lineTo(s * 0.82, s * 0.69); g.moveTo(s * 0.76, s * 0.67); g.lineTo(s * 0.76, s * 0.82); g.moveTo(s * 0.7, s * 0.78); g.lineTo(s * 0.82, s * 0.78); g.stroke();
    }
  },
});

/* ---------- Zen collection: clear-effect particles ---------- */
Object.assign(PARTS, {
  zillij(p, s) { ctx.rotate(p.rot); star8(ctx, 0, 0, s * 0.6); ctx.fillStyle = p.color; ctx.fill(); ctx.lineWidth = Math.max(1, s * 0.1); ctx.strokeStyle = '#efe6d2'; ctx.stroke(); },
  silk(p, s) {
    ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.25 + 0.75 * Math.abs(Math.sin(p.life * 5 + p.ph))); ctx.globalAlpha *= 0.85;
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.25); ctx.fillRect(-s * 0.55, -s * 0.45, s * 1.1, s * 0.9);
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = Math.max(1, s * 0.06); ctx.strokeRect(-s * 0.55, -s * 0.45, s * 1.1, s * 0.9);
  },
  powder(p, s, k) { const r = p.size * (0.5 + (1 - k) * 1.6), gr = ctx.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, rgba(p.color, 0.7)); gr.addColorStop(1, rgba(p.color, 0)); ctx.fillStyle = gr; ctx.fillRect(-r, -r, 2 * r, 2 * r); },
  thread(p, s) {
    const wv = s * 0.4 * Math.sin(p.life * 8 + p.ph);
    ctx.rotate(p.rot); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.2, s * 0.2); ctx.strokeStyle = p.color;
    ctx.beginPath(); ctx.moveTo(-s * 0.8, 0); ctx.quadraticCurveTo(-s * 0.4, -wv, 0, 0); ctx.quadraticCurveTo(s * 0.4, wv, s * 0.8, 0); ctx.stroke();
  },
  flag(p, s) { ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.3 + 0.7 * Math.abs(Math.sin(p.life * 6 + p.ph))); papelPath(ctx, -s * 0.5, -s * 0.55, s, s * 1.1); ctx.fillStyle = p.color; ctx.fill('evenodd'); },
  wool(p, s) { ctx.fillStyle = mixHex(p.color, '#ffffff', 0.2); for (let i = 0; i < 6; i++) { const an = i * 1.05 + p.ph; ctx.beginPath(); ctx.arc(Math.cos(an) * s * 0.25, Math.sin(an) * s * 0.25, s * 0.28, 0, Math.PI * 2); ctx.fill(); } },
  inkdrop(p, s) {
    ctx.fillStyle = mixHex(p.color, '#141210', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 4; i++) { const an = p.ph + i * 1.7, d = s * (i % 2 ? 0.8 : 0.62); ctx.beginPath(); ctx.arc(Math.cos(an) * d, Math.sin(an) * d, s * 0.1, 0, Math.PI * 2); ctx.fill(); }
  },
});

/* ---------- Zen collection: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  riad(th) { // a riad courtyard at night: star-tiled walls, horseshoe arches, a fountain, brass lanterns
    let wall = null, ww = 0, wh = 0, t = 0, acc = 0, D = [];
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), u = Math.min(w, h), q = Math.max(46, u * 0.15);
      g.lineWidth = 1.5; g.strokeStyle = 'rgba(232,224,204,.07)';
      for (let y = 0; y < h + q; y += q) for (let x = 0; x < w + q; x += q) {
        star8(g, x, y, q * 0.42); g.fillStyle = 'rgba(232,184,74,.04)'; g.fill(); g.stroke();
        g.save(); g.translate(x + q / 2, y + q / 2); g.rotate(Math.PI / 4); g.strokeRect(-q * 0.13, -q * 0.13, q * 0.26, q * 0.26); g.restore();
      }
      const ah = h * 0.22, aw = Math.max(70, w / 4.5);
      g.fillStyle = 'rgba(0,0,0,.28)';
      for (let x = aw / 2; x < w + aw; x += aw) {
        g.beginPath(); g.moveTo(x - aw * 0.36, h); g.lineTo(x - aw * 0.36, h - ah * 0.55);
        g.arc(x, h - ah * 0.55, aw * 0.4, Math.PI * 0.85, Math.PI * 2.15); g.lineTo(x + aw * 0.36, h); g.closePath(); g.fill();
      }
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        while (acc > 0.04) { acc -= 0.04; if (!state.REDUCED || Math.random() < 0.3) D.push({ x: 0, y: 0, vx: rand(-0.09, 0.09), vy: rand(-0.32, -0.22) }); }
        for (const p of D) { p.vy += 0.9 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        D = D.filter(p => p.y < 0.02);
      },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), fx = w / 2, fy = h * 0.95;
        g.beginPath(); g.ellipse(fx, fy, u * 0.2, u * 0.035, 0, 0, Math.PI * 2); g.fillStyle = `rgba(40,150,150,${0.35 * a})`; g.fill();
        g.strokeStyle = `rgba(232,224,204,${0.35 * a})`; g.lineWidth = 2; g.stroke();
        g.fillStyle = `rgba(180,240,235,${0.6 * a})`;
        for (const p of D) g.fillRect(fx + p.x * u, fy - u * 0.02 + p.y * u, 2, 2);
        for (const [lx, ph] of [[0.12, 0], [0.88, 2]]) {
          const x = lx * w, y = h * 0.12 + Math.sin(t * 0.9 + ph) * 3, r = u * 0.035, fl = 0.85 + 0.15 * Math.sin(t * 9 + ph) * Math.sin(t * 5.3);
          g.strokeStyle = `rgba(200,160,90,${0.5 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y - r); g.stroke();
          const gl = g.createRadialGradient(x, y, 0, x, y, u * 0.3 * fl); gl.addColorStop(0, rgba(th.accent, 0.3 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - u * 0.3, y - u * 0.3, u * 0.6, u * 0.6);
          star8(g, x, y, r); g.fillStyle = `rgba(255,210,120,${0.85 * fl * a})`; g.fill(); g.strokeStyle = `rgba(120,80,30,${0.8 * a})`; g.lineWidth = 1.5; g.stroke();
        }
      },
    };
  },
  hanok(th) { // the curved eave of a hanok, bojagi cloths swaying on a line, plum blossoms drifting
    let t = 0;
    const CL = [...Array(6)].map((_, i) => ({ c: th.blocks[(i * 3) % 7], c2: th.blocks[(i * 3 + 2) % 7], ph: rand(0, 6.3), s: rand(0.85, 1.15), sx: rand(0.35, 0.65) }));
    const PE = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.02, 0.05), rot: rand(0, 6.3), vr: rand(-1.2, 1.2), ph: rand(0, 6.3) }));
    return {
      step(dt) { t += dt; for (const p of PE) { p.y += p.v * dt; p.x += Math.sin(t * 0.7 + p.ph) * 0.012 * dt; p.rot += p.vr * dt; if (p.y > 1.04) { p.y = -0.04; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), eave = x => h * (0.03 + 0.06 * Math.sin(x / w * Math.PI)); // lowest in the middle, lifting at both ends
        g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); for (let x = w; x >= 0; x -= 10) g.lineTo(x, eave(x)); g.closePath();
        g.fillStyle = `rgba(58,52,64,${0.6 * a})`; g.fill();
        g.strokeStyle = `rgba(255,255,255,${0.25 * a})`; g.lineWidth = 1.5; g.beginPath();
        for (let x = 6; x < w; x += u * 0.03) { g.moveTo(x, eave(x) - u * 0.04); g.lineTo(x, eave(x)); } g.stroke(); // roof tile ends
        const ly = x => h * 0.2 + Math.sin(x / w * Math.PI) * h * 0.03;
        g.strokeStyle = `rgba(80,60,60,${0.45 * a})`; g.lineWidth = 1.2; g.beginPath();
        for (let x = 0; x <= w; x += 10) x ? g.lineTo(x, ly(x)) : g.moveTo(0, ly(0)); g.stroke();
        CL.forEach((c, i) => {
          const x = (i + 0.5) / CL.length * w, cw = u * 0.12 * c.s, ch = cw * 1.15, sx = -cw / 2 + cw * c.sx;
          g.save(); g.translate(x, ly(x)); g.rotate(Math.sin(t * 0.8 + c.ph) * 0.07);
          g.fillStyle = rgba(c.c, 0.32 * a); g.fillRect(-cw / 2, 0, cw, ch);
          g.fillStyle = rgba(c.c2, 0.3 * a); g.fillRect(sx, ch * 0.45, cw / 2 - sx, ch * 0.55);
          g.strokeStyle = `rgba(255,255,255,${0.6 * a})`; g.lineWidth = 1.2; g.strokeRect(-cw / 2, 0, cw, ch);
          g.beginPath(); g.moveTo(sx, ch * 0.45); g.lineTo(sx, ch); g.moveTo(-cw / 2, ch * 0.45); g.lineTo(cw / 2, ch * 0.45); g.stroke();
          g.fillStyle = `rgba(80,60,60,${0.6 * a})`; g.fillRect(-1.5, -3, 3, 5);
          g.restore();
        });
        for (const p of PE) { // plum blossoms: five round petals and a dark heart
          const r = u * 0.008;
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.fillStyle = `rgba(255,214,226,${0.85 * a})`;
          for (let k = 0; k < 5; k++) { const an = k * Math.PI * 0.4; g.beginPath(); g.arc(Math.cos(an) * r, Math.sin(an) * r, r * 0.8, 0, Math.PI * 2); g.fill(); }
          g.fillStyle = `rgba(200,58,90,${0.8 * a})`; g.beginPath(); g.arc(0, 0, r * 0.45, 0, Math.PI * 2); g.fill(); g.restore();
        }
      },
    };
  },
  diya(th) { // a great rangoli on the floor turning very slowly, clay lamps flickering in a row, marigold petals falling
    let man = null, mu = 0, t = 0;
    const MG = [...Array(28)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.06), ph: rand(0, 6.3), c: Math.random() < 0.6 ? '#ff9a1a' : '#ffd83a' }));
    function build(u) {
      mu = u; const S = Math.ceil(u * 1.3); man = document.createElement('canvas'); man.width = man.height = S;
      const g = man.getContext('2d'), c = S / 2;
      for (let ring = 6; ring >= 1; ring--) {
        const n = 6 + ring * 4, R = S * 0.075 * ring, col = th.blocks[ring % 7];
        for (let i = 0; i < n; i++) {
          const an = i / n * Math.PI * 2 + ring * 0.3;
          g.save(); g.translate(c + Math.cos(an) * R, c + Math.sin(an) * R); g.rotate(an);
          g.beginPath(); g.ellipse(0, 0, S * 0.035, S * 0.016 * (1 + ring * 0.15), 0, 0, Math.PI * 2); g.fillStyle = rgba(col, 0.22); g.fill(); g.restore();
        }
        g.setLineDash([0.1, S * 0.012]); g.lineCap = 'round'; g.lineWidth = S * 0.006; g.strokeStyle = 'rgba(255,250,235,.16)';
        g.beginPath(); g.arc(c, c, R + S * 0.035, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
      }
      g.beginPath(); g.arc(c, c, S * 0.045, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.3); g.fill();
    }
    return {
      step(dt) { t += dt; for (const m of MG) { m.y += m.v * dt; m.ph += dt * 2; if (m.y > 1.04) { m.y = -0.04; m.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        if (!man || Math.abs(u - mu) > 1) build(u);
        const S = man.width;
        g.save(); g.globalAlpha = a; g.translate(w / 2, h * 0.5); g.rotate(t * 0.015); g.drawImage(man, -S / 2, -S / 2); g.restore();
        const n = Math.max(5, Math.round(w / 70));
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) / n * w, y = h * 0.97, fl = 0.8 + 0.2 * Math.sin(t * 10 + i * 1.9) * Math.sin(t * 6.1 + i);
          const gl = g.createRadialGradient(x, y - u * 0.03, 0, x, y - u * 0.03, u * 0.12 * fl); gl.addColorStop(0, rgba(th.accent, 0.35 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - u * 0.12, y - u * 0.15, u * 0.24, u * 0.24);
          g.beginPath(); g.moveTo(x - u * 0.03, y - u * 0.012); g.quadraticCurveTo(x, y + u * 0.02, x + u * 0.03, y - u * 0.012); g.closePath(); g.fillStyle = `rgba(170,80,40,${0.85 * a})`; g.fill();
          const fh = u * 0.03 * fl;
          g.beginPath(); g.moveTo(x, y - u * 0.012 - fh); g.quadraticCurveTo(x + u * 0.009, y - u * 0.016, x, y - u * 0.01); g.quadraticCurveTo(x - u * 0.009, y - u * 0.016, x, y - u * 0.012 - fh);
          g.fillStyle = `rgba(255,200,90,${0.95 * a})`; g.fill();
        }
        for (const m of MG) { g.beginPath(); g.ellipse((m.x + Math.sin(m.ph) * 0.01) * w, m.y * h, u * 0.009, u * 0.006 * (0.4 + 0.6 * Math.abs(Math.sin(m.ph))), m.ph, 0, Math.PI * 2); g.fillStyle = rgba(m.c, 0.75 * a); g.fill(); }
      },
    };
  },
  loom(th) { // narrow strips of kente coming off the loom one block at a time, warp threads, a shuttle passing
    let t = 0;
    const NS = 5, B = th.blocks, at = m => B[((m % 7) + 7) % 7];
    const seg = (g, x, y, sw, sh, k, i) => { // one block of a strip, in one of three weaves
      const c = at(k * 3 + i * 2), c2 = at(k * 3 + i * 2 + 3), kind = (((k + i) % 3) + 3) % 3;
      g.fillStyle = rgba(c, 0.2); g.fillRect(x, y, sw, sh);
      if (kind === 0) { g.fillStyle = 'rgba(10,8,4,.25)'; for (let j = 1; j < 4; j++) g.fillRect(x, y + sh * j / 4 - sh * 0.03, sw, sh * 0.06); }
      else if (kind === 1) { g.fillStyle = rgba(c2, 0.18); const q = sw / 4; for (let r = 0; r < 4; r++) for (let cc = 0; cc < 4; cc++) if ((r + cc) % 2) g.fillRect(x + cc * q, y + r * sh / 4, q, sh / 4); }
      else {
        g.fillStyle = 'rgba(10,8,4,.3)'; g.fillRect(x, y + sh * 0.3, sw, sh * 0.4);
        g.strokeStyle = rgba(c2, 0.35); g.lineWidth = 2; g.beginPath();
        for (let j = 0; j <= 6; j++) { const px = x + j / 6 * sw, py = y + sh * (j % 2 ? 0.38 : 0.62); j ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.stroke();
      }
    };
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        const u = Math.min(w, h), gap = w / NS, sw = gap * 0.62, sh = sw * 1.1, run = t * u * 0.012, off = run % sh, base = Math.floor(run / sh);
        g.globalAlpha = a * 0.6; // kept faint so the cloth does not compete with the board
        g.strokeStyle = 'rgba(255,240,200,.06)'; g.lineWidth = 1; g.beginPath();
        for (let x = 0; x < w; x += 6) { g.moveTo(x, 0); g.lineTo(x, h); } g.stroke();
        for (let i = 0; i < NS; i++) {
          const x = gap * (i + 0.5) - sw / 2;
          for (let j = -1; j * sh < h + sh; j++) seg(g, x, j * sh + off, sw, sh, j - base + i * 5, i);
        }
        const sx = (0.5 + 0.46 * Math.sin(t * 0.6)) * w, sy = h * 0.05;
        g.fillStyle = 'rgba(200,150,80,.5)'; g.beginPath(); g.ellipse(sx, sy, u * 0.045, u * 0.011, 0, 0, Math.PI * 2); g.fill();
        g.globalAlpha = 1;
      },
    };
  },
  plaza(th) { // strings of papel picado over the square, an adobe arcade, confetti in the air
    let t = 0;
    const CF = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.07), rot: rand(0, 6.3), vr: rand(-2, 2), c: th.blocks[(Math.random() * 7) | 0] }));
    return {
      step(dt) { t += dt; for (const p of CF) { p.y += p.v * dt; p.rot += p.vr * dt; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), aw = Math.max(80, w / 4), ah = h * 0.2;
        g.fillStyle = `rgba(200,110,70,${0.18 * a})`; g.fillRect(0, h - ah, w, ah);
        g.fillStyle = `rgba(10,20,50,${0.4 * a})`;
        for (let x = aw / 2; x < w + aw; x += aw) { g.beginPath(); g.moveTo(x - aw * 0.32, h); g.lineTo(x - aw * 0.32, h - ah * 0.5); g.arc(x, h - ah * 0.5, aw * 0.32, Math.PI, 0); g.lineTo(x + aw * 0.32, h); g.closePath(); g.fill(); }
        for (const [y0, sag, n, sh] of [[0.03, 0.04, 9, 0], [0.13, 0.05, 7, 3]]) {
          const ly = x => h * y0 + Math.sin(x / w * Math.PI) * h * sag;
          g.strokeStyle = `rgba(255,255,255,${0.35 * a})`; g.lineWidth = 1; g.beginPath(); for (let x = 0; x <= w; x += 10) x ? g.lineTo(x, ly(x)) : g.moveTo(0, ly(0)); g.stroke();
          for (let i = 0; i < n; i++) {
            const x = (i + 0.5) / n * w, fw = Math.min(w / n * 0.8, u * 0.11);
            g.save(); g.translate(x, ly(x)); g.rotate(Math.sin(t * 1.4 + i * 0.9 + sh) * 0.12); g.scale(1, 0.9 + 0.1 * Math.cos(t * 2 + i));
            papelPath(g, -fw / 2, 0, fw, fw * 1.1); g.fillStyle = rgba(th.blocks[(i + sh) % 7], 0.7 * a); g.fill('evenodd');
            g.restore();
          }
        }
        for (const p of CF) { g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.fillStyle = rgba(p.c, 0.7 * a); g.fillRect(-u * 0.006, -u * 0.003, u * 0.012, u * 0.006); g.restore(); }
      },
    };
  },
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
  paddy(th) { // rice terraces holding water at dawn, a stupa on the far hill, mist, egrets crossing
    let land = null, lw = 0, lh = 0, t = 0;
    const EG = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.1, 0.3), v: rand(0.02, 0.035), ph: rand(0, 6.3) }));
    const bend = (x, w, h, k) => Math.sin(x / w * Math.PI * 1.3 + k * 0.6) * h * 0.02;
    const hill = (x, w, h) => h * (0.46 - 0.08 * Math.sin(x / w * Math.PI));
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d'), u = Math.min(w, h);
      g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, hill(x, w, h)); g.lineTo(w, h); g.closePath(); g.fillStyle = 'rgba(70,50,36,.3)'; g.fill();
      const sx = w * 0.62, sy = hill(sx, w, h), su = u * 0.05; // a bell-shaped stupa on stepped platforms
      g.fillStyle = 'rgba(60,42,30,.45)';
      for (let i = 0; i < 3; i++) g.fillRect(sx - su * (1.6 - i * 0.35), sy - su * 0.3 * (i + 1), su * 2 * (1.6 - i * 0.35), su * 0.3);
      g.beginPath(); g.arc(sx, sy - su * 0.9, su * 0.6, Math.PI, 0); g.fill(); g.fillRect(sx - su * 0.08, sy - su * 2, su * 0.16, su * 0.6);
      for (let k = 0; k < 9; k++) {
        const y0 = h * (0.56 + k * 0.05), y1 = y0 + h * 0.05;
        g.beginPath(); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, y0 + bend(x, w, h, k)); for (let x = w + 8; x >= 0; x -= 8) g.lineTo(x, y1 + bend(x, w, h, k + 1)); g.closePath();
        g.fillStyle = k % 2 ? 'rgba(220,190,140,.12)' : 'rgba(90,150,60,.22)'; g.fill();
        g.strokeStyle = 'rgba(30,20,10,.25)'; g.lineWidth = 1.5; g.beginPath(); for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, y0 + bend(x, w, h, k)); g.stroke();
      }
    }
    return {
      step(dt) { t += dt; for (const e of EG) { e.x += e.v * dt; e.ph += dt * 5; if (e.x > 1.1) { e.x = -0.1; e.y = rand(0.1, 0.3); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const sun = g.createRadialGradient(w * 0.8, h * 0.3, 0, w * 0.8, h * 0.3, u * 0.6); sun.addColorStop(0, rgba(th.accent, 0.3 * a)); sun.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = sun; g.fillRect(0, 0, w, h);
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        g.strokeStyle = `rgba(255,230,180,${0.35 * a})`; g.lineWidth = 1.5; g.beginPath(); // light on the flooded terraces
        for (let k = 1; k < 9; k += 2) for (let i = 0; i < 4; i++) {
          const x = ((i * 0.27 + k * 0.13 + t * 0.01) % 1) * w, y = h * (0.585 + k * 0.05) + bend(x, w, h, k), l = u * 0.04 * (0.6 + 0.4 * Math.sin(t + i + k));
          g.moveTo(x - l, y); g.lineTo(x + l, y);
        }
        g.stroke();
        mistBands(g, w, h, a, t, [0.5, 0.62], '255,240,220');
        g.strokeStyle = `rgba(255,255,250,${0.75 * a})`; g.lineWidth = 2;
        for (const e of EG) { // egrets: white, slow wing beats
          const x = e.x * w, y = e.y * h, bs = u * 0.022, f = Math.sin(e.ph) * 0.5 + 0.5;
          g.beginPath(); g.moveTo(x - bs, y - bs * 0.4 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.7 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.7 * f, x + bs, y - bs * 0.4 * f); g.stroke();
        }
      },
    };
  },
  caldera(th) { // the caldera at sunset: white houses and blue domes on the cliff, a windmill, the sea and a sail
    let cliff = null, cw = 0, ch = 0, t = 0, bx0 = 0.5;
    function build(w, h) {
      cw = w; ch = h; cliff = document.createElement('canvas'); cliff.width = Math.ceil(w); cliff.height = Math.ceil(h);
      const g = cliff.getContext('2d'), u = Math.min(w, h), edge = y => w * (0.06 + 0.3 * Math.max(0, (y - h * 0.26) / (h * 0.5)));
      g.beginPath(); g.moveTo(0, h * 0.24); for (let y = h * 0.24; y <= h; y += 10) g.lineTo(edge(y) + Math.sin(y * 0.05) * u * 0.01, y); g.lineTo(0, h); g.closePath();
      g.fillStyle = 'rgba(160,100,80,.4)'; g.fill();
      const H = [];
      for (let i = 0; i < 40; i++) { const y = h * (0.26 + Math.random() * 0.36); H.push({ y, x: Math.random() * edge(y) * 0.9 }); }
      H.sort((p, q) => p.y - q.y);
      for (const p of H) { // whitewashed cubes, a shaded side, a blue door, now and then a blue dome
        const hw = u * rand(0.03, 0.05), hh = hw * rand(0.6, 0.9);
        g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(p.x, p.y - hh, hw, hh);
        g.fillStyle = 'rgba(120,150,190,.35)'; g.fillRect(p.x + hw * 0.75, p.y - hh, hw * 0.25, hh);
        g.fillStyle = 'rgba(30,94,200,.8)'; g.fillRect(p.x + hw * 0.3, p.y - hh * 0.55, hw * 0.18, hh * 0.55);
        if (Math.random() < 0.25) { g.beginPath(); g.arc(p.x + hw / 2, p.y - hh, hw * 0.38, Math.PI, 0); g.fillStyle = 'rgba(30,94,200,.9)'; g.fill(); }
      }
    }
    return {
      step(dt) { t += dt; bx0 += 0.01 * dt; if (bx0 > 1.15) bx0 = 0.3; },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sea = h * 0.6, sx = w * 0.78, sy = h * 0.56;
        const gl = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.55); gl.addColorStop(0, `rgba(255,190,120,${0.55 * a})`); gl.addColorStop(1, 'rgba(255,190,120,0)');
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
        g.beginPath(); g.arc(sx, sy, u * 0.06, 0, Math.PI * 2); g.fillStyle = `rgba(255,214,150,${0.9 * a})`; g.fill();
        const sg = g.createLinearGradient(0, sea, 0, h); sg.addColorStop(0, `rgba(40,110,170,${0.55 * a})`); sg.addColorStop(1, `rgba(20,70,130,${0.7 * a})`);
        g.fillStyle = sg; g.fillRect(0, sea, w, h - sea);
        g.strokeStyle = `rgba(255,220,170,${0.5 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 8; i++) { const y = sea + (h - sea) * (0.05 + i * 0.12), l = u * (0.04 + i * 0.025) * (0.7 + 0.3 * Math.sin(t * 1.4 + i)); g.beginPath(); g.moveTo(sx - l, y); g.lineTo(sx + l, y); g.stroke(); }
        const bx = bx0 * w, by = sea + (h - sea) * 0.25 + Math.sin(t * 1.2) * 2, bs = u * 0.04;
        g.fillStyle = `rgba(40,40,50,${0.7 * a})`; g.beginPath(); g.moveTo(bx - bs, by); g.lineTo(bx + bs, by); g.lineTo(bx + bs * 0.7, by + bs * 0.3); g.lineTo(bx - bs * 0.7, by + bs * 0.3); g.closePath(); g.fill();
        g.fillStyle = `rgba(255,255,255,${0.85 * a})`; g.beginPath(); g.moveTo(bx, by - bs * 1.6); g.lineTo(bx, by - bs * 0.1); g.lineTo(bx + bs * 0.8, by - bs * 0.1); g.closePath(); g.fill();
        if (!cliff || Math.abs(w - cw) > 1 || Math.abs(h - ch) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(cliff, 0, 0, w, h); g.globalAlpha = 1;
        const mx = w * 0.05, my = h * 0.2, mh = u * 0.1; // the windmill on the cliff top
        g.fillStyle = `rgba(255,255,255,${0.9 * a})`; g.fillRect(mx - mh * 0.2, my, mh * 0.4, mh * 0.6);
        poly(g, [[mx - mh * 0.24, my], [mx, my - mh * 0.25], [mx + mh * 0.24, my]], `rgba(120,80,60,${0.8 * a})`);
        g.save(); g.translate(mx, my - mh * 0.05); g.strokeStyle = `rgba(80,60,50,${0.7 * a})`; g.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          g.rotate(Math.PI / 3 + (i ? 0 : t * 0.6));
          g.beginPath(); g.moveTo(0, 0); g.lineTo(mh * 0.6, 0); g.stroke();
          poly(g, [[mh * 0.2, 0], [mh * 0.6, 0], [mh * 0.55, mh * 0.12], [mh * 0.22, mh * 0.08]], `rgba(255,255,255,${0.75 * a})`);
        }
        g.restore();
      },
    };
  },
  charbagh(th) { // a Persian garden seen from above: a carpet border, water channels quartering it, cypresses, a fountain, rose petals
    let base = null, bw = 0, bh = 0, t = 0;
    const PE = [...Array(22)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.02, 0.045), rot: rand(0, 6.3), vr: rand(-1, 1), ph: rand(0, 6.3) }));
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h), cx = w / 2, cy = h / 2, ch = u * 0.05, m = u * 0.03, bd = u * 0.05, i0 = m + bd;
      g.strokeStyle = rgba(th.accent, 0.2); g.lineWidth = 2; g.strokeRect(m, m, w - 2 * m, h - 2 * m); g.strokeRect(i0, i0, w - 2 * i0, h - 2 * i0);
      const dm = (x, y) => poly(g, [[x, y - bd * 0.3], [x + bd * 0.3, y], [x, y + bd * 0.3], [x - bd * 0.3, y]], rgba(th.blocks[0], 0.22));
      for (let x = i0; x < w - i0; x += bd) { dm(x, m + bd / 2); dm(x, h - m - bd / 2); }
      for (let y = i0; y < h - i0; y += bd) { dm(m + bd / 2, y); dm(w - m - bd / 2, y); }
      for (let i = 0; i < 220; i++) { // flower beds in the four quarters
        const x = i0 + Math.random() * (w - 2 * i0), y = i0 + Math.random() * (h - 2 * i0);
        if (Math.abs(x - cx) < ch * 2.2 || Math.abs(y - cy) < ch * 2.2) continue;
        g.beginPath(); g.arc(x, y, u * 0.006, 0, Math.PI * 2); g.fillStyle = rgba(th.blocks[(Math.random() * 7) | 0], 0.25); g.fill();
      }
      g.fillStyle = 'rgba(60,150,180,.2)'; g.fillRect(cx - ch / 2, i0, ch, h - 2 * i0); g.fillRect(i0, cy - ch / 2, w - 2 * i0, ch);
      const cyp = (x, y) => { const r = u * 0.014; g.beginPath(); g.moveTo(x, y - r * 2.4); g.quadraticCurveTo(x + r * 1.2, y, x, y + r); g.quadraticCurveTo(x - r * 1.2, y, x, y - r * 2.4); g.fillStyle = 'rgba(20,60,40,.45)'; g.fill(); };
      for (let y = i0 + u * 0.05; y < h - i0; y += u * 0.08) if (Math.abs(y - cy) > ch * 2) { cyp(cx - ch * 1.5, y); cyp(cx + ch * 1.5, y); }
      for (let x = i0 + u * 0.05; x < w - i0; x += u * 0.08) if (Math.abs(x - cx) > ch * 2) { cyp(x, cy - ch * 1.5); cyp(x, cy + ch * 1.5); }
      g.beginPath(); for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + Math.PI / 8; i ? g.lineTo(cx + Math.cos(an) * ch * 1.6, cy + Math.sin(an) * ch * 1.6) : g.moveTo(cx + Math.cos(an) * ch * 1.6, cy + Math.sin(an) * ch * 1.6); } g.closePath();
      g.fillStyle = 'rgba(60,150,180,.28)'; g.fill(); g.strokeStyle = rgba(th.accent, 0.3); g.stroke();
    }
    return {
      step(dt) { t += dt; for (const p of PE) { p.y += p.v * dt; p.x += Math.sin(t * 0.8 + p.ph) * 0.01 * dt; p.rot += p.vr * dt; if (p.y > 1.04) { p.y = -0.04; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), cx = w / 2, cy = h / 2, ch = u * 0.05, i0 = u * 0.08;
        g.fillStyle = `rgba(230,250,255,${0.35 * a})`; // light running along the channels, out from the fountain
        for (let k = 0; k < 5; k++) {
          const f = (t * 0.04 + k / 5) % 1;
          for (const [dx, dy, L] of [[0, -1, cy - i0], [0, 1, h - i0 - cy], [-1, 0, cx - i0], [1, 0, w - i0 - cx]]) {
            const d = ch * 1.6 + f * (L - ch * 1.6);
            g.beginPath(); g.ellipse(cx + dx * d, cy + dy * d, dx ? u * 0.018 : ch * 0.18, dy ? u * 0.018 : ch * 0.18, 0, 0, Math.PI * 2); g.fill();
          }
        }
        g.lineWidth = 1.5;
        for (let k = 0; k < 3; k++) { const f = ((t * 0.35 + k / 3) % 1 + 1) % 1; /* t can be negative */ g.beginPath(); g.arc(cx, cy, ch * 1.4 * f, 0, Math.PI * 2); g.strokeStyle = `rgba(230,250,255,${0.4 * (1 - f) * a})`; g.stroke(); }
        for (const p of PE) {
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.scale(1, 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + p.ph)));
          g.beginPath(); g.ellipse(0, 0, u * 0.009, u * 0.006, 0, 0, Math.PI * 2); g.fillStyle = `rgba(214,60,90,${0.65 * a})`; g.fill(); g.restore();
        }
      },
    };
  },
  shanshui(th) { // ink mountains brushed in one layer at a time, mist between them, a boat on the river, birds, a red seal
    let layers = null, lw = 0, lh = 0, t = 0;
    const BD = [...Array(5)].map(() => ({ x: Math.random(), y: rand(0.08, 0.25), v: rand(0.015, 0.03), ph: rand(0, 6.3) }));
    function build(w, h) {
      lw = w; lh = h; layers = [];
      [[0.36, 0.16, 0.14], [0.5, 0.24, 0.22], [0.64, 0.28, 0.32], [0.8, 0.2, 0.45]].forEach(([y0, ph, ink], L) => {
        const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h);
        const g = c.getContext('2d');
        const P = [...Array(2 + L)].map(() => ({ x: Math.random() * w, hg: ph * h * rand(0.6, 1.2), wd: w * rand(0.15, 0.32) }));
        const top = x => { let y = h * y0; for (const p of P) { const d = (x - p.x) / p.wd; if (Math.abs(d) < 1) y = Math.min(y, h * y0 - p.hg * (1 - d * d) * (0.9 + 0.1 * Math.cos(d * 11))); } return y; };
        g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 6; x += 6) g.lineTo(x, top(x)); g.lineTo(w, h); g.closePath();
        const gr = g.createLinearGradient(0, h * y0 - ph * h * 1.2, 0, h * y0 + h * 0.14); gr.addColorStop(0, `rgba(28,26,22,${ink})`); gr.addColorStop(1, 'rgba(28,26,22,0)');
        g.fillStyle = gr; g.fill();
        g.strokeStyle = `rgba(28,26,22,${Math.min(0.8, ink * 1.6)})`; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 1.8;
        g.beginPath(); let on = false;
        for (let x = 0; x <= w + 6; x += 6) { const y = top(x); if (y < h * y0 - 1) { on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; } else on = false; }
        g.stroke();
        for (let i = 0; i < 30 + L * 10; i++) { // texture strokes running down the slopes
          const x = Math.random() * w, y = top(x); if (y >= h * y0 - 4) continue;
          g.lineWidth = rand(0.8, 2.2); g.beginPath(); g.moveTo(x, y + 2); g.quadraticCurveTo(x + rand(-8, 8), y + rand(8, 18), x + rand(-14, 14), y + rand(16, 34)); g.stroke();
        }
        layers.push(c);
      });
    }
    return {
      step(dt) { t += dt; for (const b of BD) { b.x += b.v * dt; b.ph += dt * 6; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.08, 0.25); } } },
      draw(g, w, h, a) {
        if (!layers || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        const u = Math.min(w, h), ct = t % 64, fade = state.REDUCED ? 1 : ct > 58 ? 1 - (ct - 58) / 6 : 1;
        layers.forEach((c, L) => { // far layers first, each painted in from left to right
          const r = state.REDUCED ? 1 : clamp01((ct - L * 5) / 8); if (r <= 0) return;
          g.save(); g.beginPath(); g.rect(0, 0, w * inOut(r), h); g.clip(); g.globalAlpha = a * fade; g.drawImage(c, 0, 0, w, h); g.restore();
        });
        mistBands(g, w, h, a, t, [0.42, 0.58, 0.74], '250,247,239');
        g.strokeStyle = `rgba(28,26,22,${0.18 * a})`; g.lineWidth = 1.5; g.beginPath(); // the river, a few dry strokes
        for (let i = 0; i < 4; i++) { const y = h * (0.87 + i * 0.03), x0 = w * (0.1 + i * 0.13 + 0.05 * Math.sin(t * 0.2 + i)); g.moveTo(x0, y); g.lineTo(x0 + w * 0.3, y); }
        g.stroke();
        const bx = (((t * 0.008) % 1.3) - 0.15) * w, by = h * 0.9, bs = u * 0.04;
        g.fillStyle = `rgba(28,26,22,${0.7 * a})`;
        g.beginPath(); g.moveTo(bx - bs, by); g.quadraticCurveTo(bx, by + bs * 0.35, bx + bs, by); g.closePath(); g.fill();
        g.fillRect(bx - bs * 0.1, by - bs * 0.45, bs * 0.12, bs * 0.45); g.beginPath(); g.arc(bx - bs * 0.04, by - bs * 0.5, bs * 0.1, 0, Math.PI * 2); g.fill();
        g.strokeStyle = `rgba(28,26,22,${0.5 * a})`; g.lineWidth = 1.4;
        for (const b of BD) { const x = b.x * w, y = b.y * h, s2 = u * 0.012, f = Math.sin(b.ph) * 0.5 + 0.5; g.beginPath(); g.moveTo(x - s2, y - s2 * 0.5 * f); g.quadraticCurveTo(x - s2 * 0.4, y - s2 * 0.6 * f, x, y); g.quadraticCurveTo(x + s2 * 0.4, y - s2 * 0.6 * f, x + s2, y - s2 * 0.5 * f); g.stroke(); }
        const sx = u * 0.05, sy = h * 0.8, ss = u * 0.06; // the painter's red seal
        rr(g, sx, sy, ss, ss * 1.3, ss * 0.08); g.fillStyle = `rgba(196,42,34,${0.75 * a})`; g.fill();
        g.strokeStyle = `rgba(255,240,230,${0.8 * a})`; g.lineWidth = Math.max(1, ss * 0.07); g.beginPath();
        g.moveTo(sx + ss * 0.2, sy + ss * 0.3); g.lineTo(sx + ss * 0.8, sy + ss * 0.3); g.moveTo(sx + ss * 0.5, sy + ss * 0.2); g.lineTo(sx + ss * 0.5, sy + ss * 1.1);
        g.moveTo(sx + ss * 0.22, sy + ss * 0.75); g.lineTo(sx + ss * 0.78, sy + ss * 0.75); g.stroke();
      },
    };
  },
});

/* ---------- Zen collection: sound kits, one instrument from each culture ---------- */
Object.assign(KITS, (S => {
  const pluck = (f, { when = 0, vol = 0.08, dur = 0.6, type = 'triangle', to = null } = {}) => {
    S.tone(f, { type, dur, vol, when, attack: 0.002, to, wet: true });
    S.tone(f * 2, { dur: dur * 0.3, vol: vol * 0.3, when, attack: 0.002 });
  };
  const at = (sc, i, base) => base * Math.pow(2, sc[i % sc.length] / 12) * (i >= sc.length ? 2 : 1); // i-th note of a scale, the next octave after the last
  return {
    oud: { // a plucked oud in maqam hijaz over a darbuka "doum tek tek"
      pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.15 }); },
      place() { S.thud({ vol: 0.2, f: 120 }); pluck(S.snd.root * 0.5, { vol: 0.09, dur: 0.45 }); },
      clear(n) {
        const H = [0, 1, 4, 5, 7, 8, 11];
        for (let i = 0; i < n + 3; i++) pluck(at(H, i, S.snd.root * 0.5), { when: i * 0.075, vol: 0.06, dur: 0.35 });
        S.tone(110, { dur: 0.22, vol: 0.22, to: 70 }); S.knock(1700, { vol: 0.1, when: 0.2 }); S.knock(1700, { vol: 0.08, when: 0.3 });
      },
      deal() { pluck(S.snd.root, { vol: 0.03, dur: 0.2 }); },
    },
    gayageum: { // silk strings on a pentatonic scale, each note bent a little as it fades
      pick() { pluck(S.snd.root * 2, { type: 'sine', vol: 0.03, dur: 0.2 }); },
      place() { S.thud({ vol: 0.16, f: 140 }); pluck(S.snd.root * 0.5, { type: 'sine', vol: 0.08, dur: 0.7, to: S.snd.root * 0.49 }); },
      clear(n) {
        const P = [0, 2, 5, 7, 9];
        for (let i = 0; i < n + 3; i++) { const f = at(P, i, S.snd.root * 0.5); pluck(f, { type: 'sine', when: i * 0.1, vol: 0.06, dur: 0.8, to: f * 0.985 }); }
      },
      deal() { pluck(S.snd.root * 1.5, { type: 'sine', vol: 0.03, dur: 0.3 }); },
    },
    sitar: { // tabla strokes, and a sitar run in raag yaman with a slide into each note
      pick() { S.tone(520, { dur: 0.08, vol: 0.06, to: 470 }); },
      place() { S.tone(95, { dur: 0.35, vol: 0.22, to: 140 }); S.tone(520, { dur: 0.1, vol: 0.06, to: 480, when: 0.05 }); },
      clear(n) {
        const Y = [0, 2, 4, 6, 7, 9, 11];
        for (let i = 0; i < n + 3; i++) { const f = at(Y, i, S.snd.root * 0.5); pluck(f, { when: i * 0.09, vol: 0.06, dur: 0.5, to: f * 1.015 }); S.tink(f * 3, { when: i * 0.09 + 0.02, vol: 0.012, dur: 0.6 }); }
        S.tone(95, { dur: 0.35, vol: 0.2, to: 140 }); S.tone(560, { dur: 0.1, vol: 0.07, to: 500, when: 0.18 });
      },
      deal() { S.tink(S.snd.root * 3, { vol: 0.02, dur: 0.8 }); },
    },
    djembe: { // djembe bass and tone strokes, and a balafon: wooden keys over gourds
      pick() { S.hiss({ dur: 0.03, vol: 0.05, type: 'highpass', freq: 3000 }); },
      place() { S.tone(78, { dur: 0.25, vol: 0.32, to: 55 }); S.hiss({ dur: 0.05, vol: 0.05, type: 'bandpass', freq: 800, q: 1 }); },
      clear(n) {
        const P = [0, 2, 4, 7, 9];
        for (let i = 0; i < n + 3; i++) {
          const f = at(P, i, S.snd.root), w = i * 0.08;
          S.tone(f, { dur: 0.2, vol: 0.09, attack: 0.001, when: w }); S.tone(f * 3.9, { dur: 0.05, vol: 0.025, when: w }); S.hiss({ dur: 0.03, vol: 0.03, type: 'bandpass', freq: f * 2, q: 3, when: w });
        }
        S.tone(78, { dur: 0.25, vol: 0.3, to: 55 }); S.tone(240, { dur: 0.1, vol: 0.14, to: 200, when: 0.16 }); S.hiss({ dur: 0.06, vol: 0.08, type: 'highpass', freq: 2500, when: 0.3 });
      },
      deal() { S.tone(240, { dur: 0.08, vol: 0.1, to: 200 }); S.tone(240, { dur: 0.08, vol: 0.08, to: 200, when: 0.1 }); },
    },
    mariachi: { // guitarrón bass, a guitar strum, two trumpets
      pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.12 }); },
      place() { S.tone(98, { type: 'triangle', dur: 0.3, vol: 0.18, attack: 0.003 }); S.thud({ vol: 0.12, f: 140 }); },
      clear(n) {
        const r = S.snd.root * 0.5;
        [0, 4, 7, 12].forEach((st, i) => pluck(r * Math.pow(2, st / 12), { when: i * 0.02, vol: 0.05, dur: 0.4 }));
        [0, 4, 7, 12].slice(0, Math.max(2, Math.min(4, n))).forEach((st, i) => {
          const f = r * 2 * Math.pow(2, st / 12), w = 0.18 + i * 0.13;
          S.tone(f, { type: 'square', dur: 0.2, vol: 0.022, attack: 0.02, when: w }); S.tone(f * 1.003, { type: 'square', dur: 0.2, vol: 0.018, attack: 0.02, when: w });
        });
      },
      deal() { [0, 4, 7].forEach((st, i) => pluck(S.snd.root * Math.pow(2, st / 12), { when: i * 0.02, vol: 0.025, dur: 0.2 })); },
    },
    panflute: { // a breathy zampoña and the doubled strings of a charango
      pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.1 }); pluck(S.snd.root * 2.01, { vol: 0.025, dur: 0.1 }); },
      place() { S.thud({ vol: 0.2, f: 110 }); S.hiss({ dur: 0.08, vol: 0.04, type: 'lowpass', freq: 700 }); },
      clear(n) {
        const P = [0, 3, 5, 7, 10];
        for (let i = 0; i < n + 2; i++) { const f = at(P, i, S.snd.root), w = i * 0.14; S.tone(f, { dur: 0.45, vol: 0.07, attack: 0.04, when: w, wet: true }); S.hiss({ dur: 0.3, vol: 0.025, type: 'bandpass', freq: f * 2, q: 6, when: w }); }
      },
      deal() { S.hiss({ dur: 0.25, vol: 0.03, type: 'bandpass', freq: S.snd.root * 2, q: 5 }); },
    },
    gamelan: { // bronze keys in pelog, tuned in pairs a hair apart so they shimmer, and the big gong
      pick() { S.tone(S.snd.root * 2, { dur: 0.3, vol: 0.03, attack: 0.003 }); },
      place() { S.thud({ vol: 0.18, f: 120 }); S.tone(S.snd.root * 0.5, { dur: 0.9, vol: 0.05, attack: 0.003, wet: true }); S.tone(S.snd.root * 0.503, { dur: 0.9, vol: 0.04, attack: 0.003 }); },
      clear(n) {
        const P = [0, 1, 3, 7, 8];
        for (let i = 0; i < n + 3; i++) { const f = at(P, i, S.snd.root), w = i * 0.12; S.tone(f, { dur: 1.1, vol: 0.05, attack: 0.003, when: w, wet: true }); S.tone(f * 1.007, { dur: 1.1, vol: 0.04, attack: 0.003, when: w }); S.tone(f * 2.7, { dur: 0.25, vol: 0.015, when: w }); }
        S.tone(70, { dur: 2, vol: 0.12, attack: 0.01, when: 0.05, wet: true }); S.tone(70.6, { dur: 2, vol: 0.1, attack: 0.01, when: 0.05 });
      },
      deal() { S.tone(S.snd.root * 1.5, { dur: 0.6, vol: 0.025, attack: 0.003, wet: true }); },
    },
    bouzouki: { // a bouzouki tremolo on each note, then a wave on the shore
      pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.1 }); },
      place() { S.thud({ vol: 0.16, f: 140 }); pluck(S.snd.root, { vol: 0.06, dur: 0.25 }); },
      clear(n) {
        const P = [0, 2, 4, 5, 7, 9, 10];
        for (let i = 0; i < Math.min(n + 2, 6); i++) for (let j = 0; j < 4; j++) pluck(at(P, i, S.snd.root), { when: i * 0.16 + j * 0.04, vol: 0.035, dur: 0.1 });
        S.hissL({ dur: 1.1, vol: 0.05, type: 'lowpass', freq: 700, to: 220, when: 0.2 });
      },
      deal() { S.hissL({ dur: 0.6, vol: 0.03, type: 'lowpass', freq: 600, to: 250 }); },
    },
    santur: { // the hammered strings of a santur in dastgah-e shur, with its in-between koron steps
      pick() { S.tink(S.snd.root * 4, { vol: 0.02, dur: 0.2 }); },
      place() { S.thud({ vol: 0.16, f: 130 }); S.tone(S.snd.root, { dur: 0.4, vol: 0.05, attack: 0.001, wet: true }); S.tone(S.snd.root * 1.004, { dur: 0.4, vol: 0.04, attack: 0.001 }); },
      clear(n) {
        const D = [0, 1.5, 3, 5, 7, 8.5, 10];
        for (let i = 0; i < n + 3; i++) { const f = at(D, i, S.snd.root), w = i * 0.085; S.tone(f, { dur: 0.55, vol: 0.05, attack: 0.001, when: w, wet: true }); S.tone(f * 1.004, { dur: 0.5, vol: 0.04, attack: 0.001, when: w }); S.tone(f * 2, { dur: 0.2, vol: 0.015, when: w }); }
      },
      deal() { S.tone(S.snd.root * 2, { dur: 0.3, vol: 0.025, attack: 0.001, wet: true }); },
    },
    guqin: { // a guqin: low strings with the finger sliding, and bell-like harmonics
      pick() { S.tone(S.snd.root * 4, { dur: 0.4, vol: 0.02, attack: 0.002 }); },
      place() { S.thud({ vol: 0.14, f: 120 }); S.tone(S.snd.root * 0.25, { dur: 1, vol: 0.08, attack: 0.003, to: S.snd.root * 0.26, wet: true }); },
      clear(n) {
        const P = [0, 2, 4, 7, 9];
        for (let i = 0; i < n + 2; i++) { const f = at(P, i, S.snd.root * 0.5); S.tone(f, { dur: 1.2, vol: 0.06, attack: 0.003, when: i * 0.22, to: f * (i % 2 ? 1.03 : 0.98), wet: true }); }
        S.tone(S.snd.root * 4, { dur: 0.9, vol: 0.025, attack: 0.002, when: 0.1 + (n + 2) * 0.22 });
      },
      deal() { S.tone(S.snd.root * 3, { dur: 0.5, vol: 0.02, attack: 0.002 }); },
    },
  };
})(Sfx));
