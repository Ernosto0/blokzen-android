import { THEMES } from '../catalog.js';
import { hexOf, hexRgb, mixHex, rgba, shade } from '../../core/color.js';
import { KITS, Sfx } from '../../audio/sfx.js';
import { ctx } from '../../ui/dom.js';
import { clamp01, inOut, lerp, rand } from '../../core/util.js';
import { hexPath, poly, rr, sparkle } from '../../render/sprites.js';
import { seeded, STYLES } from '../../render/blocks.js';
import { softGlint, speckle, TEX } from '../../render/textures.js';
import { AMBIENTS } from '../../render/backgrounds.js';
import { PARTS } from '../../render/render.js';
import { carved, gearPath } from './third.js';

/* ---------- Puzzle collection: shapes shared by blocks, backgrounds, particles and gems ---------- */
// a jigsaw piece on the square x0, y0, L. e: [top, right, bottom, left], 1 a knob out, -1 a socket in, 0 flat; kn scales the tab
function jigPath(g, x0, y0, L, e, kn = 0.7) {
  const C = [[x0, y0], [x0 + L, y0], [x0 + L, y0 + L], [x0, y0 + L]], NRM = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  g.beginPath(); g.moveTo(x0, y0);
  for (let k = 0; k < 4; k++) {
    const [ax, ay] = C[k], [bx, by] = C[(k + 1) % 4], dx = bx - ax, dy = by - ay, d = e[k] * kn, [nx, ny] = NRM[k];
    if (d) {
      const P = (u, v) => [ax + dx * u + nx * v * d * L, ay + dy * u + ny * v * d * L]; // the tab is symmetric, so two neighbours trace the same curve
      g.lineTo(...P(0.37, 0));
      g.bezierCurveTo(...P(0.43, 0), ...P(0.4, 0.1), ...P(0.36, 0.15));
      g.bezierCurveTo(...P(0.3, 0.26), ...P(0.42, 0.32), ...P(0.5, 0.32));
      g.bezierCurveTo(...P(0.58, 0.32), ...P(0.7, 0.26), ...P(0.64, 0.15));
      g.bezierCurveTo(...P(0.6, 0.1), ...P(0.57, 0), ...P(0.63, 0));
    }
    g.lineTo(bx, by);
  }
  g.closePath();
}
// chalk laid down in slanted strokes, each a little uneven
function chalkHatch(g, s, col, rnd, a) {
  g.lineCap = 'round'; g.lineWidth = Math.max(1, s * 0.04);
  for (let i = -s; i < s * 1.2; i += s * 0.075) {
    const j = (rnd() - 0.5) * s * 0.03;
    g.strokeStyle = rgba(col, a * (0.6 + rnd() * 0.4));
    g.beginPath(); g.moveTo(i + j, s * 1.02); g.lineTo(i + s + j + (rnd() - 0.5) * s * 0.05, -s * 0.02); g.stroke();
  }
}
// a box drawn twice by hand in chalk, then the dust left on it
function chalkBox(g, s, c, rnd) {
  g.lineCap = 'round'; g.lineJoin = 'round';
  for (let p = 0; p < 2; p++) {
    const j = () => (rnd() - 0.5) * s * 0.035, o = s * 0.1, e = s * 0.9;
    g.strokeStyle = rgba(c, p ? 0.55 : 0.95); g.lineWidth = Math.max(1, s * (p ? 0.03 : 0.05));
    g.beginPath(); g.moveTo(o + j(), o + j()); g.lineTo(e + j(), o + j()); g.lineTo(e + j(), e + j()); g.lineTo(o + j(), e + j()); g.closePath(); g.stroke();
  }
  speckle(g, s, rnd, 24, 0.004, 0.01, () => `rgba(255,255,255,${0.12 + rnd() * 0.25})`);
}
// domino pips laid out on a square of side sz; the colour of a block picks how many
const PIP = [[], [[0.5, 0.5]], [[0.27, 0.27], [0.73, 0.73]], [[0.27, 0.27], [0.5, 0.5], [0.73, 0.73]],
  [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]], [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]],
  [[0.27, 0.24], [0.73, 0.24], [0.27, 0.5], [0.73, 0.5], [0.27, 0.76], [0.73, 0.76]]];
const DOMINO_BLOCKS = THEMES.find(t => t.id === 'domino').blocks;
const pipCount = c => { const i = DOMINO_BLOCKS.indexOf(c); return i < 0 ? 3 : (i % 6) + 1; };
function pips(g, x, y, sz, n, col, rad, sunk = true) {
  for (const [u, v] of PIP[n]) {
    const px = x + u * sz, py = y + v * sz;
    if (sunk) { g.beginPath(); g.arc(px, py + rad * 0.2, rad, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill(); } // the lower lip of the drilled hole catches the light
    g.beginPath(); g.arc(px, py, rad, 0, Math.PI * 2); g.fillStyle = col; g.fill();
  }
}
// the seven pieces of a 4 x 4 tangram square, corners in square units
const TAN = [[[0, 0], [4, 0], [2, 2]], [[0, 0], [2, 2], [0, 4]], [[4, 2], [4, 4], [2, 4]], [[3, 1], [4, 0], [4, 2]],
  [[2, 2], [3, 3], [1, 3]], [[2, 2], [3, 1], [4, 2], [3, 3]], [[0, 4], [1, 3], [3, 3], [2, 4]]];
// a square cut into triangles like tangram pieces: kind 1 and 2 cut along one diagonal, 4 along both
function tanSquare(g, x, y, w, c, lt, dk, kind, seam = 'rgba(255,250,240,.85)') {
  const A = [x, y], B = [x + w, y], C = [x + w, y + w], D = [x, y + w], M = [x + w / 2, y + w / 2];
  if (kind === 4) { poly(g, [A, B, M], lt); poly(g, [B, C, M], c); poly(g, [C, D, M], dk); poly(g, [D, A, M], c); }
  else if (kind === 1) { poly(g, [A, B, D], lt); poly(g, [B, C, D], c); }
  else { poly(g, [A, B, C], lt); poly(g, [A, C, D], c); }
  g.strokeStyle = seam; g.lineWidth = Math.max(1, w * 0.035); g.lineCap = 'round'; g.beginPath();
  if (kind === 4) { g.moveTo(...A); g.lineTo(...C); g.moveTo(...B); g.lineTo(...D); }
  else if (kind === 1) { g.moveTo(...B); g.lineTo(...D); }
  else { g.moveTo(...A); g.lineTo(...C); }
  g.stroke();
}
// a note or photo pinned to the board; rnd picks its handwriting
function memoFace(g, s, c, rnd, k) {
  if (c === '#efe9dc') { // a polaroid: a dark photo of somebody, a caption under it
    const x0 = s * 0.17, y0 = s * 0.2, pw = s * 0.66, ph = s * 0.46;
    const gr = g.createLinearGradient(0, y0, 0, y0 + ph); gr.addColorStop(0, `rgba(44,54,66,${k})`); gr.addColorStop(1, `rgba(82,96,104,${k})`);
    g.fillStyle = gr; g.fillRect(x0, y0, pw, ph);
    g.save(); g.beginPath(); g.rect(x0, y0, pw, ph); g.clip(); g.fillStyle = `rgba(14,16,22,${0.75 * k})`;
    g.beginPath(); g.arc(s * 0.5, y0 + ph * 0.42, s * 0.085, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(s * 0.5, y0 + ph * 1.02, s * 0.2, s * 0.16, 0, 0, Math.PI * 2); g.fill();
    g.restore();
    g.strokeStyle = `rgba(40,40,60,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.022); g.lineCap = 'round';
    g.beginPath(); for (let i = 0; i <= 8; i++) { const x = s * (0.24 + i * 0.05), y = s * 0.8 + Math.sin(i * 1.9 + rnd() * 2) * s * 0.02; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    return;
  }
  g.strokeStyle = `rgba(36,30,48,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.024); g.lineCap = 'round';
  for (let r = 0; r < 3; r++) { // handwriting: a few wobbly lines
    const y0 = s * (0.4 + r * 0.16), x1 = s * (0.55 + rnd() * 0.27), ph = rnd() * 6;
    g.beginPath(); for (let x = s * 0.18; x <= x1; x += s * 0.04) { const y = y0 + Math.sin(x / s * 30 + ph) * s * 0.018; x === s * 0.18 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  }
  if (c === '#c8a274') { // a case file: a red stamp across it
    g.save(); g.translate(s * 0.52, s * 0.6); g.rotate(-0.28);
    g.strokeStyle = `rgba(196,40,36,${0.75 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.strokeRect(-s * 0.3, -s * 0.1, s * 0.6, s * 0.2);
    g.fillStyle = `rgba(196,40,36,${0.75 * k})`; g.font = `800 ${s * 0.15}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('GİZLİ', 0, s * 0.01);
    g.restore();
  }
}
function memoPin(g, x, y, r, col) {
  g.beginPath(); g.ellipse(x + r * 0.35, y + r * 0.5, r * 0.9, r * 0.55, 0.4, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.3)'; g.fill();
  const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r); gr.addColorStop(0, mixHex(col, '#ffffff', 0.55)); gr.addColorStop(1, shade(col, -0.25));
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
}

/* ---------- Puzzle collection: block looks and textures ---------- */
Object.assign(STYLES, {
  jigsaw: { // a cardboard jigsaw piece with two sockets and two knobs, a scrap of the picture printed on it
    block(g, s, c) {
      const kn = 0.6, x0 = s * 0.03, L = s * 0.94 / (1 + 0.32 * kn), E = [-1, 1, 1, -1];
      g.save(); g.translate(0, s * 0.03); jigPath(g, x0, x0, L, E, kn); g.fillStyle = shade(c, -0.4); g.fill(); g.restore();
      jigPath(g, x0, x0, L, E, kn);
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, shade(c, 0.24)); gr.addColorStop(1, shade(c, -0.06));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.jigsawPic(g, s, c, seeded(c), 1); g.restore();
      jigPath(g, x0, x0, L, E, kn); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = Math.max(1, s * 0.022); g.stroke();
    },
  },
  chalk: { // a square hatched in coloured chalk on the blackboard
    block(g, s, c) {
      const rnd = seeded(c);
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.08); g.fillStyle = mixHex(c, '#163224', 0.68); g.fill();
      g.save(); g.clip(); chalkHatch(g, s, c, rnd, 0.85); g.restore();
      chalkBox(g, s, c, rnd);
    },
  },
  domino: { // an ivory domino half, the pips drilled and filled with the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.06, s * 0.92, s * 0.9, s * 0.16); g.fillStyle = 'rgba(0,0,0,.38)'; g.fill();
      rr(g, s * 0.04, s * 0.03, s * 0.92, s * 0.9, s * 0.16); g.fillStyle = mixHex(c, '#cfc3a8', 0.85); g.fill();
      const iv = g.createLinearGradient(0, 0, 0, s); iv.addColorStop(0, '#fffaf0'); iv.addColorStop(1, mixHex(c, '#efe4cc', 0.9));
      rr(g, s * 0.06, s * 0.04, s * 0.88, s * 0.83, s * 0.14); g.fillStyle = iv; g.fill();
      pips(g, s * 0.06, s * 0.035, s * 0.88, pipCount(c), c, s * 0.075);
      g.beginPath(); g.ellipse(s * 0.34, s * 0.12, s * 0.2, s * 0.035, -0.1, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill();
    },
  },
  tangram: { // flat lacquered wood cut into tangram triangles
    block(g, s, c) {
      const rnd = seeded(c), o = s * 0.05, w = s * 0.9, r = rnd();
      g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(o + s * 0.025, o + s * 0.035, w, w);
      tanSquare(g, o, o, w, c, mixHex(c, '#ffffff', 0.26), shade(c, -0.14), r < 0.34 ? 4 : r < 0.67 ? 1 : 2);
      g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = Math.max(1, s * 0.02); g.strokeRect(o, o, w, w);
      softGlint(g, s * 0.3, s * 0.26, s * 0.22, 0.35);
    },
  },
  memo: { // a note or a polaroid pinned to the cork, a little askew
    block(g, s, c) {
      const rnd = seeded(c), rot = (rnd() - 0.5) * 0.12;
      g.save(); g.translate(s / 2, s / 2); g.rotate(rot); g.translate(-s / 2, -s / 2);
      rr(g, s * 0.08, s * 0.1, s * 0.86, s * 0.84, s * 0.03); g.fillStyle = 'rgba(0,0,0,.42)'; g.fill();
      rr(g, s * 0.06, s * 0.06, s * 0.88, s * 0.86, s * 0.03);
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.18)); gr.addColorStop(1, shade(c, -0.05));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); memoFace(g, s, c, rnd, 1);
      poly(g, [[s * 0.94, s * 0.76], [s * 0.94, s * 0.92], [s * 0.76, s * 0.92]], 'rgba(0,0,0,.18)'); // a curled corner
      poly(g, [[s * 0.94, s * 0.76], [s * 0.76, s * 0.92], [s * 0.8, s * 0.79]], mixHex(c, '#ffffff', 0.45));
      g.restore(); g.restore();
      memoPin(g, s * 0.5, s * 0.14, s * 0.075, c === '#ef98ae' ? '#2f6fc8' : '#d6332e');
    },
  },
});

Object.assign(TEX, {
  jigsawPic(g, s, c, rnd, k) { // a scrap of the printed picture: soft patches of light and shade, cardboard fibres
    for (let i = 0; i < 3; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.25 + rnd() * 0.3), gr = g.createRadialGradient(x, y, 0, x, y, r);
      const col = i === 1 ? '#ffffff' : i === 2 ? '#3a2410' : '#fff2c8';
      gr.addColorStop(0, rgba(col, (i === 2 ? 0.14 : 0.24) * k)); gr.addColorStop(1, rgba(col, 0));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
    }
    speckle(g, s, rnd, 26, 0.003, 0.008, () => rnd() < 0.5 ? `rgba(255,255,255,${0.22 * k})` : `rgba(60,40,20,${0.12 * k})`);
  },
  jigsaw(g, s, c, rnd, k) { // the classic tile gets the cut of a piece pressed into it
    TEX.jigsawPic(g, s, c, rnd, k * 0.7);
    carved(g, () => jigPath(g, s * 0.2, s * 0.2, s * 0.5, [-1, 1, 1, -1], 0.6), Math.max(1, s * 0.024), `rgba(255,250,235,${0.5 * k})`, `rgba(60,35,10,${0.45 * k})`);
  },
  chalk(g, s, c, rnd, k) { chalkHatch(g, s, '#ffffff', rnd, 0.2 * k); speckle(g, s, rnd, 22, 0.004, 0.01, () => `rgba(255,255,255,${(0.15 + rnd() * 0.25) * k})`); },
  domino(g, s, c, rnd, k) { pips(g, s * 0.08, s * 0.08, s * 0.84, pipCount(c), rgba('#fff8e8', 0.92 * k), s * 0.07, false); },
  tangram(g, s, c, rnd, k) {
    const one = rnd() < 0.5;
    poly(g, one ? [[0, 0], [s, 0], [0, s]] : [[0, 0], [s, 0], [s, s]], `rgba(255,255,255,${0.22 * k})`);
    g.strokeStyle = `rgba(255,250,240,${0.7 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.beginPath();
    if (one) { g.moveTo(s, 0); g.lineTo(0, s); } else { g.moveTo(0, 0); g.lineTo(s, s); } g.stroke();
  },
  memo(g, s, c, rnd, k) { memoFace(g, s, c, rnd, k * 0.9); memoPin(g, s * 0.5, s * 0.15, s * 0.07, c === '#ef98ae' ? '#2f6fc8' : '#d6332e'); },
});

/* ---------- Puzzle collection: each theme's own gem ---------- */
export const GEM_LOOKS = {
  jigsaw(g, s, th) { // the last missing piece
    const L = s * 0.42, x0 = s * 0.29, E = [1, 1, 1, 1];
    jigPath(g, x0, x0, L, E, 0.55); g.lineWidth = s * 0.08; g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineJoin = 'round'; g.stroke();
    const gr = g.createLinearGradient(0, x0, 0, x0 + L); gr.addColorStop(0, mixHex(th.accent, '#ffffff', 0.45)); gr.addColorStop(1, shade(th.accent, -0.25));
    g.fillStyle = gr; g.fill();
    g.lineWidth = Math.max(1, s * 0.032); g.strokeStyle = 'rgba(255,255,255,.9)'; g.stroke();
    sparkle(g, s * 0.38, s * 0.36, s * 0.1, 0.9);
  },
  chalk(g, s, th) { // a question mark circled in yellow chalk
    g.lineCap = 'round';
    for (const [w, a, dx] of [[0.11, 0.5, 0], [0.065, 1, 0], [0.03, 0.6, s * 0.015]]) {
      g.beginPath(); g.arc(s * 0.5 + dx, s * 0.5, s * 0.29, 0.2, Math.PI * 2.05); g.lineWidth = s * w;
      g.strokeStyle = w > 0.1 ? 'rgba(0,0,0,.5)' : rgba(th.accent, a); g.stroke();
    }
    g.font = `800 ${s * 0.46}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = s * 0.07; g.strokeStyle = 'rgba(0,0,0,.5)'; g.strokeText('?', s * 0.5, s * 0.54);
    g.fillStyle = th.accent; g.fillText('?', s * 0.5, s * 0.54);
  },
  domino(g, s, th) { // the double six
    const w = s * 0.36, h = s * 0.7, x = (s - w) / 2, y = (s - h) / 2;
    rr(g, x - s * 0.03, y - s * 0.02, w + s * 0.06, h + s * 0.06, s * 0.08); g.fillStyle = 'rgba(0,0,0,.55)'; g.fill();
    rr(g, x, y, w, h, s * 0.06); g.fillStyle = '#fbf4e4'; g.fill();
    g.fillStyle = 'rgba(60,40,30,.5)'; g.fillRect(x + w * 0.12, y + h / 2 - s * 0.01, w * 0.76, Math.max(1, s * 0.02));
    for (const yy of [y, y + h / 2]) pips(g, x + w * 0.04, yy + h * 0.03, w * 0.92, 6, th.accent === '#f2c14e' ? '#c8323a' : th.accent, s * 0.03, false);
    g.beginPath(); g.arc(x + w / 2, y + h / 2, s * 0.03, 0, Math.PI * 2); g.fillStyle = th.accent; g.fill(); // the brass spinner
  },
  tangram(g, s, th) { // the tangram square itself, turned on its corner
    g.save(); g.translate(s / 2, s / 2); g.rotate(Math.PI / 4);
    const w = s * 0.46;
    g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(-w / 2 - s * 0.04, -w / 2 - s * 0.04, w + s * 0.08, w + s * 0.08);
    tanSquare(g, -w / 2, -w / 2, w, th.accent, mixHex(th.accent, '#ffffff', 0.4), shade(th.accent, -0.25), 4, 'rgba(255,255,255,.95)');
    g.restore();
  },
  detective(g, s, th) { // a fingerprint lifted in red
    g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.33, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill();
    g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.29, 0, Math.PI * 2); g.fillStyle = '#fbf3e4'; g.fill();
    g.save(); g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.27, 0, Math.PI * 2); g.clip();
    g.strokeStyle = th.accent; g.lineWidth = Math.max(1, s * 0.024); g.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const rx = s * (0.035 + i * 0.038), a0 = 0.3 + (i % 3) * 0.5, a1 = Math.PI * 2 - 0.25 - (i % 2) * 0.6;
      g.beginPath(); g.ellipse(s * 0.5, s * 0.53, rx, rx * 1.3, 0.15, a0, a1); g.stroke();
    }
    g.restore();
  },
};

/* ---------- Puzzle collection: clear-effect particles ---------- */
Object.assign(PARTS, {
  piece(p, s) { ctx.rotate(p.rot); const L = s * 0.75; jigPath(ctx, -L / 2, -L / 2, L, [1, -1, 1, -1], 0.6); ctx.fillStyle = p.color; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = Math.max(1, s * 0.06); ctx.stroke(); },
  chalkdust(p, s, k) {
    const r = p.size * (0.35 + (1 - k) * 1.3); ctx.globalAlpha *= 0.55; ctx.fillStyle = mixHex(p.color, '#ffffff', 0.6);
    ctx.beginPath(); for (const [x, y, q] of [[-0.4, 0.1, 0.55], [0.1, -0.25, 0.7], [0.45, 0.15, 0.5]]) { ctx.moveTo(x * r + q * r, y * r); ctx.arc(x * r, y * r, q * r, 0, Math.PI * 2); } ctx.fill();
  },
  bone(p, s) {
    ctx.rotate(p.rot); rr(ctx, -s * 0.32, -s * 0.6, s * 0.64, s * 1.2, s * 0.12); ctx.fillStyle = '#f8f1e2'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = Math.max(1, s * 0.05); ctx.stroke();
    ctx.fillStyle = 'rgba(60,40,30,.5)'; ctx.fillRect(-s * 0.22, -s * 0.02, s * 0.44, Math.max(1, s * 0.04));
    ctx.fillStyle = p.color; for (const y of [-0.3, 0.3]) { ctx.beginPath(); ctx.arc(0, y * s, s * 0.09, 0, Math.PI * 2); ctx.fill(); }
  },
  tan(p, s) { ctx.rotate(p.rot); poly(ctx, [[-s * 0.6, s * 0.3], [s * 0.6, s * 0.3], [0, -s * 0.3]], p.color); ctx.strokeStyle = 'rgba(255,250,240,.8)'; ctx.lineWidth = Math.max(1, s * 0.05); ctx.stroke(); },
  memo(p, s) {
    ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.25 + 0.75 * Math.abs(Math.sin(p.life * 5 + p.ph)));
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.1); ctx.fillRect(-s * 0.5, -s * 0.5, s, s);
    ctx.fillStyle = 'rgba(36,30,48,.35)'; ctx.fillRect(-s * 0.32, -s * 0.05, s * 0.6, Math.max(1, s * 0.06)); ctx.fillRect(-s * 0.32, s * 0.18, s * 0.4, Math.max(1, s * 0.06));
    ctx.beginPath(); ctx.arc(0, -s * 0.36, s * 0.1, 0, Math.PI * 2); ctx.fillStyle = '#d6332e'; ctx.fill();
  },
});

/* ---------- Puzzle collection: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  jigsawtable(th) { // a puzzle mat with the cut lines printed on it; loose pieces drift about and every few seconds one flies home
    let mat = null, mw = 0, mh = 0, q = 0, t = 0, acc = 1.2;
    const hsh = (i, j, k) => (Math.imul(i + 101, 73856093) ^ Math.imul(j + 37, 19349663) ^ Math.imul(k, 83492791)) >>> 0;
    const hor = (i, j) => (hsh(i, j, 1) >>> 4) & 1 ? 1 : -1, ver = (i, j) => (hsh(i, j, 2) >>> 4) & 1 ? 1 : -1;
    const edges = (i, j) => [-ver(i, j - 1), hor(i, j), ver(i, j), -hor(i - 1, j)];
    const mk = init => ({ x: init ? Math.random() : (Math.random() < 0.5 ? -0.1 : 1.1), y: Math.random(), vx: rand(-0.012, 0.012), vy: rand(-0.01, 0.01), rot: rand(0, 6.3), vr: rand(-0.3, 0.3),
      c: th.blocks[(Math.random() * 7) | 0], e: [0, 1, 2, 3].map(() => (Math.random() < 0.5 ? 1 : -1)), s: rand(0.8, 1.05), fly: null });
    const P = [...Array(8)].map(() => mk(true));
    let placed = [];
    function build(w, h) {
      mw = w; mh = h; q = Math.max(44, Math.min(w, h) * 0.11);
      mat = document.createElement('canvas'); mat.width = Math.ceil(w); mat.height = Math.ceil(h);
      const g = mat.getContext('2d');
      g.strokeStyle = 'rgba(90,60,30,.11)'; g.lineWidth = 1.5; g.lineJoin = 'round';
      for (let j = 0; j * q < h + q; j++) for (let i = 0; i * q < w + q; i++) { jigPath(g, i * q, j * q, q, edges(i, j)); g.stroke(); }
      placed = [];
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        for (const p of P) if (!p.fly) { p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; if (p.x < -0.15) p.x = 1.15; if (p.x > 1.15) p.x = -0.15; if (p.y < -0.15) p.y = 1.15; if (p.y > 1.15) p.y = -0.15; }
        if (acc > 2.6 && q) {
          acc = 0;
          const p = P.find(o => !o.fly), cols = Math.floor(mw / q), rows = Math.floor(mh / q);
          if (p && cols > 0 && rows > 0) {
            for (let tries = 0; tries < 12; tries++) {
              const i = (Math.random() * cols) | 0, j = (Math.random() * rows) | 0;
              if (placed.some(o => o.i === i && o.j === j)) continue;
              const r0 = ((p.rot % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI; // turn the short way round
              p.fly = { t: 0, r0, i, j }; p.e = edges(i, j);
              break;
            }
          }
        }
        P.forEach((p, k) => {
          if (!p.fly) return;
          p.fly.t += dt / 1.6;
          if (p.fly.t >= 1) { placed.push({ i: p.fly.i, j: p.fly.j, c: p.c, t0: t }); P[k] = mk(false); }
        });
        placed = placed.filter(o => t - o.t0 < 30);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const lamp = g.createRadialGradient(w * 0.15, 0, 0, w * 0.15, 0, Math.max(w, h) * 0.8); lamp.addColorStop(0, `rgba(255,236,190,${0.4 * a})`); lamp.addColorStop(1, 'rgba(255,236,190,0)');
        g.fillStyle = lamp; g.fillRect(0, 0, w, h);
        if (!mat || Math.abs(w - mw) > 1 || Math.abs(h - mh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(mat, 0, 0, w, h); g.globalAlpha = 1;
        g.lineJoin = 'round';
        for (const o of placed) {
          const age = t - o.t0, fade = age > 26 ? 1 - (age - 26) / 4 : 1, pop = clamp01(age / 0.35);
          jigPath(g, o.i * q, o.j * q, q, edges(o.i, o.j));
          g.fillStyle = rgba(o.c, 0.3 * a * fade); g.fill();
          g.strokeStyle = rgba(th.accent, (1 - pop) * 0.8 * a); g.lineWidth = 3; g.stroke();
        }
        for (const p of P) {
          let x = p.x * w, y = p.y * h, rot = p.rot, L = q * p.s;
          if (p.fly) { const e = inOut(clamp01(p.fly.t)); x = lerp(x, p.fly.i * q + q / 2, e); y = lerp(y, p.fly.j * q + q / 2, e); rot = lerp(p.fly.r0, 0, e); L = lerp(L, q, e); }
          const lift = p.fly ? Math.sin(Math.PI * clamp01(p.fly.t)) * u * 0.02 : 0;
          g.save(); g.translate(x, y - lift); g.rotate(rot);
          g.save(); g.translate(u * 0.008 + lift * 0.5, u * 0.012 + lift); jigPath(g, -L / 2, -L / 2, L, p.e); g.fillStyle = `rgba(60,40,20,${0.14 * a})`; g.fill(); g.restore();
          jigPath(g, -L / 2, -L / 2, L, p.e); g.fillStyle = rgba(p.c, 0.55 * a); g.fill();
          g.strokeStyle = `rgba(255,255,255,${0.55 * a})`; g.lineWidth = 1.5; g.stroke();
          g.restore();
        }
      },
    };
  },
  blackboard(th) { // sums and drawings appear in chalk, stay a while, then an eraser wipes them; a ledge with chalk below
    let base = null, bw = 0, bh = 0, t = 0, next = 0.4;
    const TX = ['a² + b² = c²', 'x + 7 = 12', 'π ≈ 3,14', 'E = mc²', '√64 = 8', 'y = 2x + 1', '8 × 8 = 64', '∠A = 90°', '(a + b)²', 'Σ n', 'f(x) = x²', '3 · 4 = 12'];
    const SLOTS = [[0.05, 0.19], [0.55, 0.18], [0.03, 0.4], [0.82, 0.36], [0.03, 0.6], [0.82, 0.62], [0.06, 0.91], [0.56, 0.9], [0.3, 0.23], [0.3, 0.95]]; // clear of the score and level name at the top
    const items = [];
    const LIFE = 10.7;
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h);
      g.lineCap = 'round';
      for (let i = 0; i < 9; i++) { // old eraser swirls
        g.strokeStyle = `rgba(255,255,255,${rand(0.015, 0.035)})`; g.lineWidth = u * rand(0.05, 0.1);
        const x = Math.random() * w, y = Math.random() * h, r = u * rand(0.1, 0.25);
        g.beginPath(); g.arc(x, y, r, rand(0, 3), rand(3.5, 6)); g.stroke();
      }
      const lh = u * 0.03; // the wooden chalk ledge along the bottom
      g.fillStyle = 'rgba(112,74,42,.9)'; g.fillRect(0, h - lh, w, lh);
      g.fillStyle = 'rgba(255,230,190,.25)'; g.fillRect(0, h - lh, w, 2);
      const sticks = ['#f6f4ea', '#ffe27a', '#f5a3cf', '#8ecdf0'];
      for (let i = 0; i < 4; i++) { const x = w * (0.2 + i * 0.07); rr(g, x, h - lh - u * 0.012, u * 0.05, u * 0.012, u * 0.006); g.fillStyle = sticks[i]; g.fill(); }
      rr(g, w * 0.7, h - lh - u * 0.03, u * 0.11, u * 0.03, u * 0.006); g.fillStyle = 'rgba(150,110,70,.95)'; g.fill();
      g.fillStyle = 'rgba(60,60,64,.95)'; g.fillRect(w * 0.7, h - lh - u * 0.012, u * 0.11, u * 0.012);
      g.strokeStyle = 'rgba(90,60,34,.8)'; g.lineWidth = u * 0.018; g.strokeRect(u * 0.009, u * 0.009, w - u * 0.018, h - u * 0.018); // the frame
    }
    function add() {
      const used = new Set(items.map(o => o.slot)), free = SLOTS.map((_, i) => i).filter(i => !used.has(i));
      if (!free.length) return;
      const r = Math.random(), slot = free[(Math.random() * free.length) | 0];
      items.push({ slot, age: 0, kind: r < 0.6 ? 'text' : r < 0.8 ? 'circle' : 'tri', text: TX[(Math.random() * TX.length) | 0],
        col: Math.random() < 0.75 ? '#f6f4ea' : th.blocks[(Math.random() * 7) | 0] });
    }
    return {
      step(dt) {
        t += dt; next -= dt;
        if (next <= 0) { next = rand(2.2, 3.4); add(); }
        for (const o of items) o.age += dt;
        for (let i = items.length - 1; i >= 0; i--) if (items[i].age > LIFE) items.splice(i, 1);
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), fs = u * 0.055;
        g.font = `700 ${fs}px "Baloo 2", sans-serif`; g.textBaseline = 'middle'; g.textAlign = 'left'; g.lineCap = 'round'; g.lineJoin = 'round';
        for (const o of items) {
          const [sx, sy] = SLOTS[o.slot], x = sx * w, y = sy * h;
          const wr = clamp01(o.age / 1.6), er = clamp01((o.age - (LIFE - 1.1)) / 1.1);
          const R = u * 0.055, W = o.kind === 'text' ? g.measureText(o.text).width : o.kind === 'circle' ? R * 2 : R * 2.4, top = y - (o.kind === 'text' ? fs * 0.7 : 0), H = o.kind === 'text' ? fs * 1.4 : R * 2.2;
          g.save(); g.beginPath(); g.rect(x - 4 + er * (W + 8), top - 4, (W + 8) * (1 - er), H + 8); g.clip();
          if (o.kind === 'text') {
            g.beginPath(); g.rect(x - 4, top - 4, (W + 8) * wr, H + 8); g.clip();
            g.fillStyle = rgba(o.col, 0.55 * a); g.fillText(o.text, x, y);
            g.fillStyle = rgba(o.col, 0.22 * a); g.fillText(o.text, x + 1.2, y + 0.8);
          } else {
            g.strokeStyle = rgba(o.col, 0.55 * a); g.lineWidth = 2.5;
            if (o.kind === 'circle') {
              const L = Math.PI * 2 * R; g.setLineDash([L * wr, L + 1]);
              g.beginPath(); g.arc(x + R, y + R, R, -Math.PI / 2, Math.PI * 1.5); g.stroke(); g.setLineDash([]);
              if (wr >= 1) { g.beginPath(); g.moveTo(x + R, y + R); g.lineTo(x + R * 1.7, y + R * 0.3); g.stroke(); g.beginPath(); g.arc(x + R, y + R, 2.5, 0, Math.PI * 2); g.fillStyle = rgba(o.col, 0.6 * a); g.fill(); }
            } else {
              const A = [x, y], B = [x, y + R * 2], C = [x + R * 2.4, y + R * 2], L = R * 2 + R * 2.4 + Math.hypot(R * 2.4, R * 2);
              g.setLineDash([L * wr, L + 1]); g.beginPath(); g.moveTo(...A); g.lineTo(...B); g.lineTo(...C); g.closePath(); g.stroke(); g.setLineDash([]);
              if (wr >= 1) { g.strokeRect(x, y + R * 2 - R * 0.35, R * 0.35, R * 0.35); }
            }
          }
          g.restore();
          if (er > 0 && er < 1) { // the eraser passing over, a smear of dust behind it
            g.fillStyle = `rgba(255,255,255,${0.06 * a * (1 - er)})`; g.fillRect(x - 4, top - 4, (W + 8) * er, H + 8);
            const ex = x - 4 + er * (W + 8), eh = H + 12;
            rr(g, ex - u * 0.015, top - 6, u * 0.04, eh, u * 0.008); g.fillStyle = `rgba(150,110,70,${0.9 * a})`; g.fill();
            g.fillStyle = `rgba(60,60,64,${0.95 * a})`; g.fillRect(ex - u * 0.015, top - 6, u * 0.015, eh);
          }
        }
      },
    };
  },
  dominorun(th) { // a long line of dominoes snaking over the felt; a wave knocks them down one after another, then they stand up again
    let felt = null, fw = 0, fh = 0, path = [], t = 0, phase = 0, head = 0, wait = 0, rise = 0;
    function build(w, h) {
      fw = w; fh = h; felt = document.createElement('canvas'); felt.width = Math.ceil(w); felt.height = Math.ceil(h);
      const g = felt.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 1800; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.025)' : 'rgba(0,0,0,.07)'; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
      const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)');
      g.fillStyle = v; g.fillRect(0, 0, w, h);
      const ys = [0.2, 0.43, 0.68, 0.955], pts = [], x0 = w * 0.06, x1 = w * 0.94;
      ys.forEach((yf, r) => { // rows across the table joined by turns at the ends
        const y = yf * h, ltr = r % 2 === 0, a0 = ltr ? x0 : x1, a1 = ltr ? x1 : x0;
        for (let k = 0; k <= 60; k++) pts.push([lerp(a0, a1, k / 60), y + Math.sin(k / 60 * Math.PI * 3 + r) * u * 0.015]);
        if (r < ys.length - 1) { const R = (ys[r + 1] * h - y) / 2; for (let k = 1; k < 24; k++) { const an = -Math.PI / 2 + k / 24 * Math.PI; pts.push([a1 + (ltr ? 1 : -1) * Math.cos(an) * Math.min(R * 0.4, w * 0.05), y + R + Math.sin(an) * R]); } }
      });
      path = []; const d = u * 0.034; let acc = 0;
      for (let i = 1; i < pts.length; i++) { // resample at even spacing
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i], seg = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax);
        while (acc <= seg) { const k = acc / seg; path.push({ x: lerp(ax, bx, k), y: lerp(ay, by, k), ang }); acc += d; }
        acc -= seg;
      }
    }
    return {
      step(dt) {
        t += dt;
        if (!path.length) return;
        if (phase === 0) { head += dt * 22; if (head > path.length + 3) { phase = 1; wait = 2.2; } }
        else if (phase === 1) { wait -= dt; if (wait <= 0) { phase = 2; rise = 0; } }
        else { rise += dt * 0.9; if (rise >= 1) { phase = 0; head = 0; } }
      },
      draw(g, w, h, a) {
        if (!felt || Math.abs(w - fw) > 1 || Math.abs(h - fh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(felt, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        const lamp = g.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.6); lamp.addColorStop(0, rgba(th.accent, 0.1 * a)); lamp.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = lamp; g.fillRect(0, 0, w, h);
        const T = u * 0.009, W = u * 0.022, L = u * 0.046, n = path.length;
        for (let i = 0; i < n; i++) {
          const d = path[i];
          const f = phase === 0 ? inOut(clamp01((head - i) / 2.5)) : phase === 1 ? 1 : 1 - inOut(clamp01(rise * 1.6 - (i / n) * 0.6));
          const len = lerp(T, L, f), off = lerp(0, L / 2 - T / 2, f);
          g.save(); g.translate(d.x, d.y); g.rotate(d.ang);
          g.fillStyle = `rgba(0,0,0,${0.25 * a})`; g.fillRect(off - len / 2 + 2, -W / 2 + 2, len, W);
          g.fillStyle = `rgba(246,238,222,${(0.42 + 0.18 * f) * a})`; g.fillRect(off - len / 2, -W / 2, len, W);
          if (f > 0.6) { // lying face up: the dividing line and a pip on each half
            g.fillStyle = `rgba(40,20,20,${0.45 * a})`; g.fillRect(off - 0.5, -W * 0.35, 1, W * 0.7);
            g.beginPath(); g.arc(off - len * 0.25, 0, W * 0.12, 0, Math.PI * 2); g.arc(off + len * 0.25, 0, W * 0.12, 0, Math.PI * 2); g.fillStyle = rgba(th.blocks[i % 7], 0.6 * a); g.fill();
          } else { g.fillStyle = `rgba(255,255,255,${0.25 * a})`; g.fillRect(off - len / 2, -W / 2, len, 1.5); }
          g.restore();
        }
      },
    };
  },
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
  corkboard(th) { // a cork board of clues: notes and photos pinned up, red string drawn between them one by one, a magnifying glass passing over
    let cork = null, cw = 0, ch = 0, t = 0, pins = [], links = [], drawn = 0, prog = 0;
    const SPOTS = [[0.12, 0.22], [0.46, 0.2], [0.85, 0.23], [0.93, 0.47], [0.06, 0.5], [0.12, 0.89], [0.5, 0.95], [0.87, 0.88], [0.66, 0.6], [0.3, 0.64]]; // clear of the score and level name at the top
    function build(w, h) {
      cw = w; ch = h; cork = document.createElement('canvas'); cork.width = Math.ceil(w); cork.height = Math.ceil(h);
      const g = cork.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 2600; i++) { const r = rand(0.6, 2); g.fillStyle = Math.random() < 0.6 ? 'rgba(20,10,0,.2)' : 'rgba(255,215,160,.08)'; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2); g.fill(); }
      pins = [];
      SPOTS.forEach(([fx, fy], i) => {
        const x = fx * w, y = fy * h, s = u * rand(0.12, 0.16), rot = rand(-0.18, 0.18), kind = i % 3, c = th.blocks[(i * 3) % 7];
        g.save(); g.translate(x, y); g.rotate(rot);
        g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-s / 2 + 3, -s * 0.4 + 4, s, s * 0.85);
        if (kind === 0) { // a photo
          g.fillStyle = '#efe9dc'; g.fillRect(-s / 2, -s * 0.4, s, s * 0.85);
          g.fillStyle = 'rgba(44,54,66,.9)'; g.fillRect(-s * 0.4, -s * 0.32, s * 0.8, s * 0.55);
          g.fillStyle = 'rgba(14,16,22,.6)'; g.beginPath(); g.arc(0, -s * 0.1, s * 0.1, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(0, s * 0.18, s * 0.22, s * 0.14, 0, Math.PI, 0); g.fill();
        } else if (kind === 1) { // a note
          g.fillStyle = c; g.fillRect(-s / 2, -s * 0.4, s, s * 0.85);
          g.strokeStyle = 'rgba(36,30,48,.4)'; g.lineWidth = 1.5;
          for (let r = 0; r < 4; r++) { g.beginPath(); g.moveTo(-s * 0.36, -s * 0.15 + r * s * 0.15); g.lineTo(s * (0.1 + Math.random() * 0.25), -s * 0.15 + r * s * 0.15); g.stroke(); }
        } else { // a scrap of map
          g.fillStyle = '#e8dcc0'; g.fillRect(-s / 2, -s * 0.4, s, s * 0.85);
          g.strokeStyle = 'rgba(80,120,150,.45)'; g.lineWidth = 1;
          for (let r = 1; r < 5; r++) { g.beginPath(); g.moveTo(-s / 2, -s * 0.4 + r * s * 0.17); g.lineTo(s / 2, -s * 0.4 + r * s * 0.17); g.moveTo(-s / 2 + r * s * 0.2, -s * 0.4); g.lineTo(-s / 2 + r * s * 0.2, s * 0.45); g.stroke(); }
          g.strokeStyle = 'rgba(196,40,36,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(s * 0.08, s * 0.05, s * 0.12, 0, Math.PI * 2); g.stroke();
        }
        g.restore();
        pins.push({ x: x + Math.sin(rot) * s * 0.3, y: y - Math.cos(rot) * s * 0.3 });
      });
      g.strokeStyle = 'rgba(70,44,22,.85)'; g.lineWidth = u * 0.02; g.strokeRect(u * 0.01, u * 0.01, w - u * 0.02, h - u * 0.02); // the board's frame
      const order = [0, 9, 1, 8, 2, 3, 7, 6, 5, 4, 9, 8];
      links = []; for (let i = 1; i < order.length; i++) links.push([order[i - 1], order[i]]);
    }
    return {
      step(dt) { t += dt; prog += dt / 1.4; if (prog >= 1) { prog = 0; drawn++; if (drawn > links.length + 3) drawn = 0; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const lamp = g.createRadialGradient(w * 0.85, 0, 0, w * 0.85, 0, Math.max(w, h) * 0.75); lamp.addColorStop(0, `rgba(255,214,150,${0.22 * a})`); lamp.addColorStop(1, 'rgba(255,214,150,0)');
        g.fillStyle = lamp; g.fillRect(0, 0, w, h);
        if (!cork || Math.abs(w - cw) > 1 || Math.abs(h - ch) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(cork, 0, 0, w, h); g.globalAlpha = 1;
        const fade = drawn > links.length ? 1 - clamp01((drawn - links.length - 1 + prog) / 2) : 1;
        g.lineCap = 'round';
        links.forEach(([i, j], k) => {
          if (k > drawn) return;
          const A = pins[i], B = pins[j], part = k === drawn ? prog : 1;
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 + Math.hypot(B.x - A.x, B.y - A.y) * 0.1 + Math.sin(t * 0.8 + k) * u * 0.005;
          const pt = s => [(1 - s) * (1 - s) * A.x + 2 * (1 - s) * s * mx + s * s * B.x, (1 - s) * (1 - s) * A.y + 2 * (1 - s) * s * my + s * s * B.y];
          for (const [dx, col, lw] of [[2, `rgba(0,0,0,${0.25 * a * fade})`, 2], [0, rgba(th.accent, 0.8 * a * fade), 2]]) {
            g.strokeStyle = col; g.lineWidth = lw; g.beginPath();
            for (let s = 0; s <= 24; s++) { const [x, y] = pt(s / 24 * part); s ? g.lineTo(x + dx, y + dx) : g.moveTo(x + dx, y + dx); }
            g.stroke();
          }
        });
        for (const p of pins) { g.save(); g.globalAlpha = a; memoPin(g, p.x, p.y, u * 0.011, '#d6332e'); g.restore(); }
        const lx = (0.5 + 0.38 * Math.sin(t * 0.13)) * w, ly = (0.5 + 0.4 * Math.sin(t * 0.17 + 1)) * h, lr = u * 0.07; // the magnifying glass
        g.save(); g.globalAlpha = a;
        g.strokeStyle = 'rgba(40,24,12,.85)'; g.lineWidth = u * 0.018; g.beginPath(); g.moveTo(lx + lr * 0.75, ly + lr * 0.75); g.lineTo(lx + lr * 1.7, ly + lr * 1.7); g.stroke();
        g.beginPath(); g.arc(lx, ly, lr, 0, Math.PI * 2); g.fillStyle = 'rgba(255,250,235,.1)'; g.fill();
        g.strokeStyle = 'rgba(30,20,10,.75)'; g.lineWidth = u * 0.012; g.stroke();
        g.strokeStyle = 'rgba(214,176,96,.7)'; g.lineWidth = u * 0.005; g.beginPath(); g.arc(lx, ly, lr * 0.93, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = u * 0.006; g.beginPath(); g.arc(lx, ly, lr * 0.72, Math.PI * 1.1, Math.PI * 1.45); g.stroke();
        g.restore();
      },
    };
  },
});

/* ---------- Puzzle collection: sound kits ---------- */
Object.assign(KITS, (S => {
  const scratch = (when, dur, vol) => S.hiss({ dur, vol, type: 'bandpass', freq: rand(2500, 4200), to: rand(2000, 5000), q: 4, when });
  const clack = (f, when, vol) => { S.knock(f, { when, vol }); S.tink(f * 1.9, { when, vol: vol * 0.22, dur: 0.05 }); };
  const pizz = (f, when, vol) => { S.tone(f, { dur: 0.38, vol, when, attack: 0.003, to: f * 0.995 }); S.tone(f * 2, { dur: 0.12, vol: vol * 0.35, when, attack: 0.002 }); };
  const WALK = [0, 3, 5, 7, 10, 12];
  return {
    jigsaw: { // cardboard lifted off the table, a piece clicking into place, a run of them snapping in
      pick() { S.rustle({ vol: 0.035, dur: 0.05 }); },
      place() { S.knock(1150, { vol: 0.17 }); S.thud({ vol: 0.18, f: 150 }); S.hiss({ dur: 0.03, vol: 0.05, type: 'bandpass', freq: 2800, q: 2 }); },
      clear(n) { for (let i = 0; i < n + 3; i++) S.knock(rand(1000, 1400), { when: i * 0.06, vol: 0.1 }); S.pop({ when: (n + 3) * 0.06, vol: 0.12, f: 620 }); },
      deal() { S.rustle({ vol: 0.05, dur: 0.18 }); S.knock(1300, { vol: 0.04, when: 0.1 }); },
    },
    chalk: { // chalk tapped on the board, a few strokes scratched, then the eraser
      pick() { S.knock(2400, { vol: 0.04 }); },
      place() { S.knock(1900, { vol: 0.13 }); scratch(0.01, 0.06, 0.05); S.thud({ vol: 0.14, f: 160 }); },
      clear(n) { const m = Math.min(n + 2, 5); for (let i = 0; i < m; i++) scratch(i * 0.09, 0.12, 0.06); S.hissL({ dur: 0.45, vol: 0.06, type: 'lowpass', freq: 900, to: 380, q: 0.7, when: m * 0.09 + 0.05 }); },
      deal() { S.knock(2100, { vol: 0.05 }); S.knock(2100, { vol: 0.04, when: 0.08 }); },
    },
    domino: { // ivory tiles: a clack when one is set down, a chain of them toppling faster and longer with the combo
      pick() { clack(2100, 0, 0.06); },
      place() { clack(1500, 0, 0.18); clack(1300, 0.035, 0.12); S.thud({ vol: 0.16, f: 140 }); },
      clear(n, combo) {
        const m = 6 + n * 3 + Math.min(combo || 1, 6) * 2; let w = 0, gap = 0.07;
        for (let i = 0; i < m; i++) { clack(rand(1400, 1800), w, 0.09); w += gap; gap = Math.max(0.025, gap * 0.93); }
      },
      deal() { for (let i = 0; i < 6; i++) S.knock(rand(1200, 1700), { when: i * 0.04 + Math.random() * 0.02, vol: 0.05 }); S.rustle({ vol: 0.04, dur: 0.2 }); },
    },
    tangram: { // lacquered wooden pieces: a soft tak, a clatter on a clear and a little chime
      pick() { S.knock(1600, { vol: 0.05 }); },
      place() { S.knock(820, { vol: 0.2 }); S.tink(1640, { vol: 0.03, dur: 0.1 }); S.thud({ vol: 0.15, f: 150 }); },
      clear(n) { for (let i = 0; i < n * 2 + 4; i++) S.knock(rand(700, 1200), { when: i * 0.045 + Math.random() * 0.02, vol: 0.08 }); S.tink(S.snd.root * 2, { when: 0.3, vol: 0.04, dur: 0.6 }); },
      deal() { for (let i = 0; i < 3; i++) S.hiss({ dur: 0.06, vol: 0.04, type: 'lowpass', freq: 1200, when: i * 0.05 }); },
    },
    detective: { // a pin pushed into cork, paper, a string snapping, a double bass walking under it
      pick() { S.rustle({ vol: 0.04, dur: 0.05 }); },
      place() { S.knock(2700, { vol: 0.07 }); S.thud({ vol: 0.22, f: 130 }); },
      clear(n, combo) {
        S.tone(900, { type: 'triangle', dur: 0.12, vol: 0.06, to: 380 }); S.rustle({ vol: 0.07, dur: 0.3, when: 0.05 });
        const r = S.snd.root / 4;
        for (let i = 0; i < Math.min(n + 1, 4); i++) pizz(r * Math.pow(2, WALK[(i + (combo || 0)) % 6] / 12), 0.1 + i * 0.14, 0.16);
      },
      deal() { S.rustle({ vol: 0.05, dur: 0.2 }); S.rustle({ vol: 0.04, dur: 0.15, when: 0.12 }); },
    },
  };
})(Sfx));

/* ---------- Puzzle collection, part 2: shapes shared by blocks, backgrounds, particles and gems ---------- */
// cipher keys: each block colour wears its own letter
const CIPHER_BLOCKS = THEMES.find(t => t.id === 'cipher').blocks;
const cipherLetter = c => 'XKQZRVJ'[Math.max(0, CIPHER_BLOCKS.indexOf(c))];
// a chess piece as a filled silhouette, standing on its base at y + h/2; kind 0 pawn, 1 rook, 2 knight, 3 bishop, 4 queen, 5 king
const CHESS_BLOCKS = THEMES.find(t => t.id === 'chess').blocks;
const ALCHEMY_BLOCKS = THEMES.find(t => t.id === 'alchemy').blocks;
const chessKind = c => [0, 1, 2, 3, 4, 5, 0][Math.max(0, CHESS_BLOCKS.indexOf(c))];
function chessPiece(g, kind, x, y, h, flip = false) {
  const P = (u, v) => [x + (flip ? -u : u) * h, y + v * h];
  const shape = pts => { g.beginPath(); pts.forEach(([u, v], i) => i ? g.lineTo(...P(u, v)) : g.moveTo(...P(u, v))); g.closePath(); g.fill(); };
  const disc = (u, v, r) => { g.beginPath(); g.arc(...P(u, v), r * h, 0, Math.PI * 2); g.fill(); };
  const oval = (u, v, rx, ry) => { g.beginPath(); g.ellipse(...P(u, v), rx * h, ry * h, 0, 0, Math.PI * 2); g.fill(); };
  shape([[-0.32, 0.5], [0.32, 0.5], [0.32, 0.41], [0.22, 0.35], [-0.22, 0.35], [-0.32, 0.41]]); // the base, the same for every piece
  if (kind === 0) { shape([[-0.17, 0.36], [-0.07, 0.0], [0.07, 0.0], [0.17, 0.36]]); oval(0, 0.0, 0.14, 0.04); disc(0, -0.15, 0.14); }
  else if (kind === 1) {
    shape([[-0.18, 0.36], [-0.14, -0.12], [0.14, -0.12], [0.18, 0.36]]);
    shape([[-0.21, -0.1], [-0.21, -0.36], [-0.12, -0.36], [-0.12, -0.28], [-0.04, -0.28], [-0.04, -0.36], [0.04, -0.36], [0.04, -0.28], [0.12, -0.28], [0.12, -0.36], [0.21, -0.36], [0.21, -0.1]]);
  } else if (kind === 2) {
    shape([[-0.2, 0.36], [-0.15, 0.1], [-0.05, -0.04], [-0.2, 0.0], [-0.28, -0.08], [-0.18, -0.24], [-0.04, -0.36], [0.0, -0.46], [0.06, -0.37], [0.16, -0.3], [0.24, -0.12], [0.25, 0.1], [0.21, 0.36]]);
  } else if (kind === 3) {
    shape([[-0.16, 0.36], [-0.07, 0.02], [0.07, 0.02], [0.16, 0.36]]); oval(0, 0.01, 0.15, 0.045);
    oval(0, -0.17, 0.13, 0.18); disc(0, -0.39, 0.05);
  } else {
    shape([[-0.18, 0.36], [-0.09, -0.06], [0.09, -0.06], [0.18, 0.36]]); oval(0, -0.06, 0.17, 0.045);
    if (kind === 4) {
      shape([[-0.19, -0.08], [-0.25, -0.31], [-0.12, -0.17], [-0.06, -0.35], [0, -0.19], [0.06, -0.35], [0.12, -0.17], [0.25, -0.31], [0.19, -0.08]]);
      for (const [u, v] of [[-0.25, -0.33], [-0.06, -0.37], [0.06, -0.37], [0.25, -0.33]]) disc(u, v, 0.04);
    } else {
      shape([[-0.17, -0.08], [-0.21, -0.26], [0.21, -0.26], [0.17, -0.08]]);
      shape([[-0.035, -0.26], [-0.035, -0.38], [-0.1, -0.38], [-0.1, -0.44], [-0.035, -0.44], [-0.035, -0.5], [0.035, -0.5], [0.035, -0.44], [0.1, -0.44], [0.1, -0.38], [0.035, -0.38], [0.035, -0.26]]);
    }
  }
}
// alchemical signs, stroked with the current strokeStyle: fire, water, air, earth, sun, moon, salt
function alchemySign(g, kind, x, y, r) {
  g.beginPath();
  const tri = up => { const d = up ? -1 : 1; g.moveTo(x, y + d * r); g.lineTo(x + r * 0.9, y - d * r * 0.6); g.lineTo(x - r * 0.9, y - d * r * 0.6); g.closePath(); };
  if (kind < 4) { tri(kind % 2 === 0); if (kind >= 2) { const d = kind === 2 ? 1 : -1; g.moveTo(x - r * 0.75, y + d * r * 0.1); g.lineTo(x + r * 0.75, y + d * r * 0.1); } }
  else if (kind === 4) { g.arc(x, y, r * 0.85, 0, Math.PI * 2); g.moveTo(x + r * 0.16, y); g.arc(x, y, r * 0.16, 0, Math.PI * 2); }
  else if (kind === 5) { g.arc(x, y, r * 0.85, Math.PI * 0.35, Math.PI * 1.65); g.arc(x + r * 0.42, y, r * 0.62, Math.PI * 1.25, Math.PI * 0.75, true); }
  else { g.arc(x, y, r * 0.85, 0, Math.PI * 2); g.moveTo(x - r * 0.85, y); g.lineTo(x + r * 0.85, y); }
  g.stroke();
}
// a round-bottomed potion flask with its liquid, a couple of bubbles (lt: [dx, dy, r]) and a cork
function flask(g, x, y, w, c, lt) {
  const r = w * 0.36, by = y + w * 0.1, nw = w * 0.11;
  g.save(); g.beginPath(); g.arc(x, by, r, 0, Math.PI * 2); g.rect(x - nw, y - w * 0.46, nw * 2, w * 0.3); g.clip();
  g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x - r, y - w, r * 2, w * 2);
  const ly = by - r * 0.15, gr = g.createLinearGradient(0, ly, 0, by + r);
  gr.addColorStop(0, mixHex(c, '#ffffff', 0.35)); gr.addColorStop(1, shade(c, -0.25));
  g.fillStyle = gr; g.fillRect(x - r, ly, r * 2, r * 2);
  g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x - r, ly, r * 2, Math.max(1, w * 0.02));
  for (const [dx, dy, br] of lt) { g.beginPath(); g.arc(x + dx * r, by + dy * r, br * w, 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = Math.max(0.7, w * 0.012); g.stroke(); }
  g.restore();
  g.beginPath(); g.arc(x, by, r, 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = Math.max(1, w * 0.03); g.stroke();
  g.strokeRect(x - nw, y - w * 0.46, nw * 2, w * 0.25);
  rr(g, x - nw * 1.25, y - w * 0.53, nw * 2.5, w * 0.11, w * 0.02); g.fillStyle = '#9a6a3c'; g.fill(); // the cork
  g.beginPath(); g.ellipse(x - r * 0.42, by - r * 0.38, r * 0.14, r * 0.3, 0.5, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.45)'; g.fill();
}
// one face of a 3 x 3 puzzle cube seen straight on
function cubeFace(g, x, y, w, cols, gap = 0.07) {
  rr(g, x, y, w, w, w * 0.1); g.fillStyle = '#101014'; g.fill();
  const q = w / 3;
  cols.forEach((c, i) => {
    const cx = x + (i % 3) * q, cy = y + ((i / 3) | 0) * q;
    rr(g, cx + q * gap, cy + q * gap, q * (1 - 2 * gap), q * (1 - 2 * gap), q * 0.18); g.fillStyle = c; g.fill();
  });
}
// a datum target from a technical drawing: a circle quartered, two quarters filled
function datum(g, x, y, r, col, lw) {
  g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, -Math.PI / 2, 0); g.closePath(); g.fillStyle = col; g.fill();
  g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, Math.PI / 2, Math.PI); g.closePath(); g.fill();
  g.strokeStyle = col; g.lineWidth = lw;
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.moveTo(x - r * 1.35, y); g.lineTo(x + r * 1.35, y); g.moveTo(x, y - r * 1.35); g.lineTo(x, y + r * 1.35); g.stroke();
}

/* ---------- Puzzle collection, part 2: block looks and textures ---------- */
Object.assign(STYLES, {
  cipherkey: { // a round typewriter key in a chrome ring, its letter printed on top, set in the dark machine
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.12); g.fillStyle = '#121618'; g.fill();
      g.beginPath(); g.arc(s * 0.5, s * 0.54, s * 0.4, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.6)'; g.fill();
      const ring = g.createLinearGradient(0, s * 0.1, 0, s * 0.9); ring.addColorStop(0, '#f2f4f2'); ring.addColorStop(0.5, '#7c8482'); ring.addColorStop(1, '#d4d8d6');
      g.beginPath(); g.arc(s * 0.5, s * 0.49, s * 0.4, 0, Math.PI * 2); g.fillStyle = ring; g.fill();
      const cap = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.02, s * 0.5, s * 0.5, s * 0.36);
      cap.addColorStop(0, mixHex(c, '#ffffff', 0.35)); cap.addColorStop(1, shade(c, -0.3));
      g.beginPath(); g.arc(s * 0.5, s * 0.49, s * 0.33, 0, Math.PI * 2); g.fillStyle = cap; g.fill();
      TEX.cipherkey(g, s, c, seeded(c), 1);
    },
  },
  cubeface: { // a sticker on the black plastic of a puzzle cube
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.14); g.fillStyle = '#0c0c10'; g.fill();
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.14); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
      const gr = g.createLinearGradient(0, s * 0.1, 0, s * 0.9); gr.addColorStop(0, mixHex(c, '#ffffff', 0.22)); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.12, s * 0.12, s * 0.76, s * 0.76, s * 0.14); g.fillStyle = gr; g.fill();
      g.save(); rr(g, s * 0.12, s * 0.12, s * 0.76, s * 0.76, s * 0.14); g.clip();
      poly(g, [[s * 0.12, s * 0.12], [s * 0.88, s * 0.12], [s * 0.12, s * 0.62]], 'rgba(255,255,255,.18)');
      g.restore();
    },
  },
  draft: { // a part drawn on blueprint paper: tinted fill, white outline, hatching and a dimension line
    block(g, s, c) {
      g.fillStyle = rgba(c, 0.62); g.fillRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      g.save(); g.beginPath(); g.rect(s * 0.08, s * 0.08, s * 0.84, s * 0.84); g.clip();
      TEX.draft(g, s, c, seeded(c), 1);
      g.restore();
      g.strokeStyle = '#f4f9ff'; g.lineWidth = Math.max(1, s * 0.04); g.strokeRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      g.strokeStyle = 'rgba(244,249,255,.7)'; g.lineWidth = Math.max(1, s * 0.015);
      g.beginPath(); for (const [x, y] of [[0.08, 0.08], [0.92, 0.08], [0.08, 0.92], [0.92, 0.92]]) { g.moveTo(s * x - s * 0.06, s * y); g.lineTo(s * x + s * 0.06, s * y); g.moveTo(s * x, s * y - s * 0.06); g.lineTo(s * x, s * y + s * 0.06); } g.stroke();
    },
  },
  flask: { // a glowing potion on a dark wooden shelf
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = '#1c1220'; g.fill();
      const glow = g.createRadialGradient(s * 0.5, s * 0.6, 0, s * 0.5, s * 0.6, s * 0.5); glow.addColorStop(0, rgba(c, 0.45)); glow.addColorStop(1, rgba(c, 0));
      g.fillStyle = glow; g.fillRect(0, 0, s, s);
      g.fillStyle = '#4a2e1c'; g.fillRect(s * 0.04, s * 0.86, s * 0.92, s * 0.1); g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(s * 0.04, s * 0.86, s * 0.92, Math.max(1, s * 0.015));
      const rnd = seeded(c);
      flask(g, s * 0.5, s * 0.5, s * 0.78, c, [[-0.2 + rnd() * 0.4, 0.3 + rnd() * 0.3, 0.025], [0.1 + rnd() * 0.2, 0.15 + rnd() * 0.2, 0.017]]);
    },
  },
  chesstile: { // a polished square of the board with a piece inlaid in it
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.05, s * 0.94, s * 0.92, s * 0.08); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.2)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.22));
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.9, s * 0.08); g.fillStyle = gr; g.fill();
      g.strokeStyle = 'rgba(255,240,200,.35)'; g.lineWidth = Math.max(1, s * 0.02); g.strokeRect(s * 0.11, s * 0.1, s * 0.78, s * 0.74);
      TEX.chesstile(g, s, c, seeded(c), 1);
      g.beginPath(); g.ellipse(s * 0.3, s * 0.13, s * 0.18, s * 0.035, -0.2, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.35)'; g.fill();
    },
  },
});

Object.assign(TEX, {
  cipherkey(g, s, c, rnd, k) { // the key's letter, dark on pale caps and white on dark ones
    const light = hexRgb(c).reduce((a, b) => a + b, 0) > 560;
    g.font = `800 ${s * 0.38}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = light ? `rgba(30,30,34,${0.85 * k})` : `rgba(255,255,255,${0.92 * k})`;
    g.fillText(cipherLetter(c), s * 0.5, s * 0.53);
  },
  cubeface(g, s, c, rnd, k) { // the classic tile is cut into a cube face of nine stickers
    g.strokeStyle = `rgba(0,0,0,${0.4 * k})`; g.lineWidth = Math.max(1, s * 0.035);
    g.beginPath(); for (const v of [1 / 3, 2 / 3]) { g.moveTo(s * v, s * 0.1); g.lineTo(s * v, s * 0.9); g.moveTo(s * 0.1, s * v); g.lineTo(s * 0.9, s * v); } g.stroke();
  },
  draft(g, s, c, rnd, k) { // 45° hatching, a centre mark and a little dimension line
    g.strokeStyle = `rgba(255,255,255,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.018);
    g.beginPath(); for (let i = -s; i < s; i += s * 0.14) { g.moveTo(i, s); g.lineTo(i + s, 0); } g.stroke();
    g.strokeStyle = `rgba(244,249,255,${0.9 * k})`; g.lineWidth = Math.max(1, s * 0.02); g.setLineDash([s * 0.08, s * 0.04, s * 0.02, s * 0.04]);
    g.beginPath(); g.moveTo(s * 0.5, s * 0.2); g.lineTo(s * 0.5, s * 0.8); g.moveTo(s * 0.2, s * 0.5); g.lineTo(s * 0.8, s * 0.5); g.stroke(); g.setLineDash([]);
    const r = s * (0.12 + rnd() * 0.08);
    g.beginPath(); g.arc(s * 0.5, s * 0.5, r, 0, Math.PI * 2); g.stroke();
  },
  flask(g, s, c, rnd, k) { g.strokeStyle = `rgba(255,248,230,${0.6 * k})`; g.lineWidth = Math.max(1, s * 0.04); g.lineJoin = 'round'; alchemySign(g, Math.max(0, ALCHEMY_BLOCKS.indexOf(c)), s * 0.5, s * 0.52, s * 0.26); },
  chesstile(g, s, c, rnd, k) { // the piece inlaid in a lighter or darker wood than the square
    const light = hexRgb(c).reduce((a, b) => a + b, 0) > 520;
    g.fillStyle = light ? `rgba(40,28,20,${0.62 * k})` : `rgba(255,246,226,${0.7 * k})`;
    chessPiece(g, chessKind(c), s * 0.5, s * 0.47, s * 0.62);
  },
});

/* ---------- Puzzle collection, part 2: each theme's own gem ---------- */
Object.assign(GEM_LOOKS, {
  cipher(g, s, th) { // a lamp on the lampboard, lit with the coded letter
    const gl = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s * 0.48); gl.addColorStop(0, rgba(th.accent, 0.9)); gl.addColorStop(0.55, rgba(th.accent, 0.35)); gl.addColorStop(1, rgba(th.accent, 0));
    g.fillStyle = gl; g.fillRect(0, 0, s, s);
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.3, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.55)'; g.fill();
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.26, 0, Math.PI * 2); g.fillStyle = mixHex(th.accent, '#fff6d8', 0.45); g.fill();
    g.fillStyle = '#2a1a06'; g.strokeStyle = '#2a1a06'; g.lineWidth = s * 0.05; g.lineCap = 'round'; // the key that breaks the code
    g.beginPath(); g.arc(s * 0.4, s * 0.5, s * 0.09, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(s * 0.49, s * 0.5); g.lineTo(s * 0.68, s * 0.5); g.moveTo(s * 0.62, s * 0.5); g.lineTo(s * 0.62, s * 0.58); g.moveTo(s * 0.68, s * 0.5); g.lineTo(s * 0.68, s * 0.6); g.stroke();
  },
  cube(g, s, th) { // a little cube in three-quarter view, solved on every side
    const cx = s / 2, cy = s * 0.5, r = s * 0.3, h = r * Math.sqrt(3) / 2;
    const top = [[cx, cy - r], [cx + h, cy - r / 2], [cx, cy], [cx - h, cy - r / 2]], left = [[cx - h, cy - r / 2], [cx, cy], [cx, cy + r], [cx - h, cy + r / 2]], right = [[cx, cy], [cx + h, cy - r / 2], [cx + h, cy + r / 2], [cx, cy + r]];
    g.lineJoin = 'round'; g.beginPath(); [[cx, cy - r], [cx + h, cy - r / 2], [cx + h, cy + r / 2], [cx, cy + r], [cx - h, cy + r / 2], [cx - h, cy - r / 2]].forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
    g.fillStyle = '#0c0c10'; g.fill(); g.lineWidth = s * 0.05; g.strokeStyle = 'rgba(0,0,0,.6)'; g.stroke();
    const face = (Q, col) => { // nine stickers on a parallelogram
      const [A, B, , D] = Q, ux = (B[0] - A[0]) / 3, uy = (B[1] - A[1]) / 3, vx = (D[0] - A[0]) / 3, vy = (D[1] - A[1]) / 3;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        const P = (a, b) => [A[0] + ux * (i + a) + vx * (j + b), A[1] + uy * (i + a) + vy * (j + b)];
        poly(g, [P(0.12, 0.12), P(0.88, 0.12), P(0.88, 0.88), P(0.12, 0.88)], col);
      }
    };
    face(top, th.accent); face(left, '#e8333a'); face(right, '#2a6ce8');
  },
  blueprint(g, s, th) { // a datum target, the reference every dimension is measured from
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.36, 0, Math.PI * 2); g.fillStyle = 'rgba(10,30,60,.6)'; g.fill();
    datum(g, s / 2, s / 2, s * 0.24, th.accent, Math.max(1, s * 0.04));
  },
  alchemy(g, s, th) { // the philosopher's stone: a red stone engraved with circle, square, triangle and circle
    const gr = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.02, s / 2, s / 2, s * 0.34); gr.addColorStop(0, '#ff8a8a'); gr.addColorStop(0.6, '#c8202a'); gr.addColorStop(1, '#5a0810');
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.36, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.5)'; g.fill();
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.32, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    g.strokeStyle = '#ffd86a'; g.lineWidth = Math.max(1, s * 0.022); g.lineJoin = 'round';
    const R = s * 0.27, a = R * Math.SQRT1_2;
    g.beginPath(); g.arc(s / 2, s / 2, R, 0, Math.PI * 2); g.stroke();
    g.strokeRect(s / 2 - a, s / 2 - a, a * 2, a * 2);
    g.beginPath(); g.moveTo(s / 2, s / 2 - a); g.lineTo(s / 2 + a, s / 2 + a); g.lineTo(s / 2 - a, s / 2 + a); g.closePath(); g.stroke();
    g.beginPath(); g.arc(s / 2, s / 2 + a * 0.33, a * 0.42, 0, Math.PI * 2); g.stroke();
    sparkle(g, s * 0.36, s * 0.32, s * 0.09, 0.9);
  },
  chess(g, s, th) { // the king in gold
    g.beginPath(); g.arc(s / 2, s / 2, s * 0.38, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.4)'; g.fill();
    g.save(); g.translate(s * 0.02, s * 0.03); g.fillStyle = 'rgba(0,0,0,.55)'; chessPiece(g, 5, s / 2, s * 0.5, s * 0.62); g.restore();
    const gr = g.createLinearGradient(0, s * 0.18, 0, s * 0.82); gr.addColorStop(0, '#fff2b0'); gr.addColorStop(0.5, th.accent); gr.addColorStop(1, '#8a5a12');
    g.fillStyle = gr; chessPiece(g, 5, s / 2, s * 0.5, s * 0.62);
    sparkle(g, s * 0.4, s * 0.3, s * 0.08, 0.9);
  },
});

/* ---------- Puzzle collection, part 2: clear-effect particles ---------- */
Object.assign(PARTS, {
  cipherchar(p, s) { // a typed letter flying off the tape
    ctx.rotate(p.rot * 0.5); rr(ctx, -s * 0.45, -s * 0.5, s * 0.9, s, s * 0.1); ctx.fillStyle = '#f4efe0'; ctx.fill();
    ctx.font = `800 ${s * 0.8}px "Baloo 2", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = shade(p.color, -0.35);
    ctx.fillText('XKQZRVJ'[(p.ph * 7 | 0) % 7], 0, s * 0.06);
  },
  sticker(p, s) { ctx.rotate(p.rot); ctx.scale(1, 0.3 + 0.7 * Math.abs(Math.cos(p.life * 7 + p.ph))); rr(ctx, -s * 0.5, -s * 0.5, s, s, s * 0.18); ctx.fillStyle = '#0c0c10'; ctx.fill(); rr(ctx, -s * 0.38, -s * 0.38, s * 0.76, s * 0.76, s * 0.14); ctx.fillStyle = p.color; ctx.fill(); },
  dimension(p, s) { // a dimension line with its two arrowheads
    ctx.rotate(p.rot * 0.4); ctx.strokeStyle = '#f4f9ff'; ctx.fillStyle = '#f4f9ff'; ctx.lineWidth = Math.max(1, s * 0.08);
    ctx.beginPath(); ctx.moveTo(-s * 0.7, 0); ctx.lineTo(s * 0.7, 0); ctx.moveTo(-s * 0.7, -s * 0.25); ctx.lineTo(-s * 0.7, s * 0.25); ctx.moveTo(s * 0.7, -s * 0.25); ctx.lineTo(s * 0.7, s * 0.25); ctx.stroke();
    poly(ctx, [[-s * 0.7, 0], [-s * 0.45, -s * 0.12], [-s * 0.45, s * 0.12]], '#f4f9ff'); poly(ctx, [[s * 0.7, 0], [s * 0.45, -s * 0.12], [s * 0.45, s * 0.12]], '#f4f9ff');
  },
  rune(p, s) { ctx.rotate(Math.sin(p.life * 3 + p.ph) * 0.4); ctx.strokeStyle = mixHex(p.color, '#ffffff', 0.45); ctx.lineWidth = Math.max(1.2, s * 0.14); ctx.lineJoin = 'round'; alchemySign(ctx, (p.ph * 7 | 0) % 7, 0, 0, s * 0.6); },
  chessman(p, s) { ctx.rotate(p.rot * 0.4); ctx.fillStyle = 'rgba(0,0,0,.35)'; chessPiece(ctx, (p.ph * 6 | 0) % 6, s * 0.06, s * 0.08, s * 1.3); ctx.fillStyle = mixHex(p.color, '#ffffff', 0.15); chessPiece(ctx, (p.ph * 6 | 0) % 6, 0, 0, s * 1.3); },
});

/* ---------- Puzzle collection, part 2: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  enigma(th) { // a cipher machine: rotors stepping at the sides, letters lighting on the lampboard, coded tape running out below
    const ROWS = ['QWERTZUIO', 'ASDFGHJK', 'PYXCVBNML'], ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let t = 0, keyT = 0.5, lit = null, rot = [3, 17, 9], step = [0, 0, 0], tape = '', off = 0, base = null, bw = 0, bh = 0;
    for (let i = 0; i < 60; i++) tape += (i % 6 === 5) ? ' ' : ABC[(Math.random() * 26) | 0];
    const lamps = [];
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 1400; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.02)' : 'rgba(0,0,0,.12)'; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } // crackle paint
      lamps.length = 0;
      const lr = Math.min(u * 0.026, w / 28), top = h * 0.885; // low, under the tray
      ROWS.forEach((row, ri) => [...row].forEach((ch, ci) => {
        const x = w / 2 + (ci - (row.length - 1) / 2) * lr * 2.6, y = top + ri * lr * 2.3;
        g.beginPath(); g.arc(x, y, lr, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.5)'; g.fill();
        g.beginPath(); g.arc(x, y, lr * 0.82, 0, Math.PI * 2); g.fillStyle = 'rgba(240,230,200,.05)'; g.fill();
        g.font = `700 ${lr}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(240,230,200,.2)'; g.fillText(ch, x, y + lr * 0.08);
        lamps.push({ ch, x, y, r: lr });
      }));
    }
    return {
      step(dt) {
        t += dt; keyT -= dt; off += dt * 26;
        if (keyT <= 0 && lamps.length) {
          keyT = rand(0.35, 0.9); lit = { i: (Math.random() * lamps.length) | 0, t0: t };
          step[2] = 1; rot[2] = (rot[2] + 1) % 26; // the fast rotor steps on every key, the next one every full turn
          if (rot[2] === 0) { step[1] = 1; rot[1] = (rot[1] + 1) % 26; if (rot[1] === 0) { step[0] = 1; rot[0] = (rot[0] + 1) % 26; } }
        }
        for (let k = 0; k < 3; k++) step[k] = Math.max(0, step[k] - dt * 5);
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        if (lit) { // the lit lamp glows, then fades
          const L = lamps[lit.i], k = clamp01(1 - (t - lit.t0) / 0.8);
          const gl = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r * 4); gl.addColorStop(0, rgba(th.accent, 0.55 * k * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(L.x - L.r * 4, L.y - L.r * 4, L.r * 8, L.r * 8);
          g.beginPath(); g.arc(L.x, L.y, L.r * 0.82, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.85 * k * a); g.fill();
          g.font = `800 ${L.r}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(40,24,4,${k * a})`; g.fillText(L.ch, L.x, L.y + L.r * 0.08);
        }
        const rw = u * 0.075, rh = u * 0.26; // three rotors standing at the edges, ridged, a window showing the letter
        [[0.035, 0], [0.965, 1], [0.035, 2]].forEach(([fx, k], idx) => {
          const x = fx * w - rw / 2, y = h * (idx === 2 ? 0.52 : 0.3) - rh / 2 + (idx === 1 ? h * 0.1 : 0);
          const gr = g.createLinearGradient(x, 0, x + rw, 0); gr.addColorStop(0, `rgba(40,44,46,${0.9 * a})`); gr.addColorStop(0.5, `rgba(120,126,124,${0.9 * a})`); gr.addColorStop(1, `rgba(40,44,46,${0.9 * a})`);
          g.fillStyle = gr; g.fillRect(x, y, rw, rh);
          const sp = rh / 12, ro = (rot[k] + 1 - step[k]) * sp;
          g.fillStyle = `rgba(0,0,0,${0.35 * a})`;
          for (let j = -1; j < 13; j++) { const yy = y + ((j * sp + ro) % rh + rh) % rh; g.fillRect(x, yy, rw, Math.max(1, sp * 0.25)); }
          rr(g, x + rw * 0.15, y + rh / 2 - rw * 0.4, rw * 0.7, rw * 0.8, rw * 0.1); g.fillStyle = `rgba(245,238,220,${0.85 * a})`; g.fill();
          g.font = `800 ${rw * 0.5}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(30,24,16,${a})`;
          g.fillText(ABC[rot[k]], x + rw / 2, y + rh / 2 + rw * 0.04 - step[k] * rw * 0.3);
        });
        const ty = h * 0.965, th2 = u * 0.04, cw = th2 * 0.62; // the coded tape running out along the bottom
        g.fillStyle = `rgba(240,232,210,${0.7 * a})`; g.fillRect(0, ty - th2 / 2, w, th2);
        g.font = `700 ${th2 * 0.7}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(40,30,20,${0.75 * a})`;
        const n = tape.length, shift = off % (n * cw);
        for (let i = 0; i * cw < w + cw * n; i++) { const x = i * cw - shift; if (x < -cw || x > w + cw) continue; g.fillText(tape[i % n], x, ty + th2 * 0.05); }
      },
    };
  },
  cubes(th) { // puzzle cubes turning in space; now and then their stickers get shuffled
    const FACES = [[[1, 0, 0], [0, 0, -1], [0, 1, 0]], [[-1, 0, 0], [0, 0, 1], [0, 1, 0]], [[0, 1, 0], [1, 0, 0], [0, 0, 1]], [[0, -1, 0], [1, 0, 0], [0, 0, -1]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]], [[0, 0, -1], [-1, 0, 0], [0, 1, 0]]];
    const COLS = th.blocks.slice(0, 6);
    const mk = (x, y, s) => ({ x, y, s, ax: rand(0, 6.3), ay: rand(0, 6.3), vx: rand(0.1, 0.25), vy: rand(0.15, 0.35), st: FACES.map((_, f) => Array(9).fill(f)), flip: Array(54).fill(1), wait: rand(2, 6) });
    const C = [mk(0.12, 0.88, 0.075), mk(0.87, 0.83, 0.06), mk(0.9, 0.26, 0.045), mk(0.1, 0.27, 0.04)];
    const rot = (v, ax, ay) => { const [x, y, z] = v, cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax); const x1 = x * cy + z * sy, z1 = -x * sy + z * cy; return [x1, y * cx - z1 * sx, y * sx + z1 * cx]; };
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const c of C) {
          c.ax += c.vx * dt; c.ay += c.vy * dt; c.wait -= dt;
          for (let i = 0; i < 54; i++) c.flip[i] = Math.min(1, c.flip[i] + dt * 3);
          if (c.wait <= 0) { // shuffle a few stickers, or solve the cube again after a while
            c.wait = rand(3, 6);
            const solve = Math.random() < 0.25;
            c.st.forEach((f, fi) => f.forEach((_, i) => { if (solve ? f[i] !== fi : Math.random() < 0.35) { f[i] = solve ? fi : (Math.random() * 6) | 0; c.flip[fi * 9 + i] = 0; } }));
          }
        }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const c of C) {
          const S = c.s * u * 2, cx = c.x * w, cy = c.y * h;
          const faces = FACES.map(([n, uu, vv], fi) => ({ fi, n: rot(n, c.ax, c.ay), uu: rot(uu, c.ax, c.ay), vv: rot(vv, c.ax, c.ay) })).filter(f => f.n[2] > 0.02).sort((p, q) => p.n[2] - q.n[2]);
          for (const f of faces) {
            const at = (a2, b2) => [cx + (f.n[0] * 0.5 + f.uu[0] * (a2 - 0.5) + f.vv[0] * (b2 - 0.5)) * S, cy + (f.n[1] * 0.5 + f.uu[1] * (a2 - 0.5) + f.vv[1] * (b2 - 0.5)) * S];
            poly(g, [at(0, 0), at(1, 0), at(1, 1), at(0, 1)], `rgba(12,12,16,${0.85 * a})`);
            const lightK = 0.55 + 0.45 * f.n[2];
            for (let i = 0; i < 9; i++) {
              const q = (i % 3) / 3, r2 = ((i / 3) | 0) / 3, d = 0.025 + (1 - c.flip[f.fi * 9 + i]) * 0.13; // a sticker that just changed grows back in
              poly(g, [at(q + d, r2 + d), at(q + 1 / 3 - d, r2 + d), at(q + 1 / 3 - d, r2 + 1 / 3 - d), at(q + d, r2 + 1 / 3 - d)], rgba(hexOf(mixHex(COLS[c.st[f.fi][i]], '#000000', 1 - lightK)), 0.75 * a));
            }
          }
        }
        const glow = g.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, Math.max(w, h) * 0.6); glow.addColorStop(0, rgba(th.accent, 0.06 * a)); glow.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = glow; g.fillRect(0, 0, w, h);
      },
    };
  },
  drafting(th) { // blueprint paper: parts drawn line by line with dimensions, a compass swinging round, a title block in the corner
    let base = null, bw = 0, bh = 0, t = 0, next = 0.3;
    const SLOTS = [[0.06, 0.2], [0.62, 0.2], [0.08, 0.76], [0.58, 0.74], [0.3, 0.86], [0.04, 0.48], [0.74, 0.48]];
    const KINDS = ['circle', 'rect', 'hex', 'gear', 'angle'];
    const items = [], LIFE = 11;
    function build(w, h) {
      bw = w; bh = h; base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d'), u = Math.min(w, h), q = u * 0.035;
      g.lineWidth = 1;
      for (let i = 0, x = 0; x < w; i++, x += q) { g.strokeStyle = i % 5 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.11)'; g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, h); g.stroke(); }
      for (let i = 0, y = 0; y < h; i++, y += q) { g.strokeStyle = i % 5 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.11)'; g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(w, y + 0.5); g.stroke(); }
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.strokeRect(u * 0.02, u * 0.02, w - u * 0.04, h - u * 0.04);
      const tw = Math.min(w * 0.42, u * 0.5), tbh = u * 0.09, tx = w - u * 0.02 - tw, ty = h - u * 0.02 - tbh; // title block
      g.fillStyle = 'rgba(10,40,80,.5)'; g.fillRect(tx, ty, tw, tbh); g.strokeRect(tx, ty, tw, tbh);
      g.lineWidth = 1; g.beginPath(); g.moveTo(tx, ty + tbh / 2); g.lineTo(tx + tw, ty + tbh / 2); g.moveTo(tx + tw * 0.6, ty); g.lineTo(tx + tw * 0.6, ty + tbh); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.55)'; g.font = `700 ${tbh * 0.3}px "Baloo 2", sans-serif`; g.textBaseline = 'middle'; g.textAlign = 'left';
      g.fillText('BLOKZEN', tx + tw * 0.04, ty + tbh * 0.27); g.fillText('PAFTA 8×8', tx + tw * 0.04, ty + tbh * 0.76);
      g.fillText('ÖLÇEK 1:1', tx + tw * 0.64, ty + tbh * 0.27); g.fillText('A-01', tx + tw * 0.64, ty + tbh * 0.76);
    }
    function add() {
      const used = new Set(items.map(o => o.slot)), free = SLOTS.map((_, i) => i).filter(i => !used.has(i));
      if (!free.length) return;
      items.push({ slot: free[(Math.random() * free.length) | 0], age: 0, kind: KINDS[(Math.random() * KINDS.length) | 0], n: 10 + ((Math.random() * 90) | 0) });
    }
    return {
      step(dt) { t += dt; next -= dt; if (next <= 0) { next = rand(2.4, 3.6); add(); } for (const o of items) o.age += dt; for (let i = items.length - 1; i >= 0; i--) if (items[i].age > LIFE) items.splice(i, 1); },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), R = u * 0.06;
        g.lineCap = 'round'; g.lineJoin = 'round';
        for (const o of items) {
          const [sx, sy] = SLOTS[o.slot], x = sx * w + R * 1.2, y = sy * h + R * 1.2;
          const wr = clamp01(o.age / 2), fade = clamp01((LIFE - o.age) / 1.2), al = 0.6 * a * fade;
          g.strokeStyle = `rgba(244,249,255,${al})`; g.fillStyle = `rgba(244,249,255,${al})`; g.lineWidth = 1.8;
          const dash = L => g.setLineDash([L * wr, L + 1]);
          g.beginPath();
          if (o.kind === 'circle') { dash(Math.PI * 2 * R); g.arc(x, y, R, -Math.PI / 2, Math.PI * 1.5); }
          else if (o.kind === 'rect') { dash(R * 7.2); g.rect(x - R * 1.1, y - R * 0.7, R * 2.2, R * 1.4); }
          else if (o.kind === 'hex') { dash(R * 6.2); hexPath(g, x, y, R); }
          else if (o.kind === 'gear') { dash(R * 14); gearPath(g, x, y, R, 10, 0, 0.3); }
          else { dash(R * 4.4); g.moveTo(x - R, y + R * 0.6); g.lineTo(x + R * 1.2, y + R * 0.6); g.moveTo(x - R, y + R * 0.6); g.lineTo(x + R * 0.6, y - R * 0.9); }
          g.stroke(); g.setLineDash([]);
          if (wr >= 1) { // dimensions and a centre mark once the part is drawn
            g.lineWidth = 1;
            g.beginPath(); g.moveTo(x - R * 0.25, y); g.lineTo(x + R * 0.25, y); g.moveTo(x, y - R * 0.25); g.lineTo(x, y + R * 0.25); g.stroke();
            const dy = y + R * 1.45, x0 = x - R * 1.1, x1 = x + R * 1.1;
            g.beginPath(); g.moveTo(x0, dy); g.lineTo(x1, dy); g.moveTo(x0, dy - R * 0.2); g.lineTo(x0, dy + R * 0.2); g.moveTo(x1, dy - R * 0.2); g.lineTo(x1, dy + R * 0.2); g.stroke();
            poly(g, [[x0, dy], [x0 + R * 0.2, dy - R * 0.08], [x0 + R * 0.2, dy + R * 0.08]], `rgba(244,249,255,${al})`); poly(g, [[x1, dy], [x1 - R * 0.2, dy - R * 0.08], [x1 - R * 0.2, dy + R * 0.08]], `rgba(244,249,255,${al})`);
            g.font = `700 ${R * 0.42}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillStyle = `rgba(244,249,255,${al})`;
            g.fillText(o.kind === 'circle' ? `Ø${o.n}` : o.kind === 'angle' ? `${30 + (o.n % 4) * 15}°` : String(o.n), x, dy - R * 0.06);
          } else if (o.kind === 'circle') { // the compass swinging round while it draws
            const an = -Math.PI / 2 + wr * Math.PI * 2, px = x + Math.cos(an) * R, py = y + Math.sin(an) * R, hx = (x + px) / 2 - Math.sin(an) * R * 0.1, hy = Math.min(y, py) - R * 1.4;
            g.strokeStyle = `rgba(255,255,255,${0.75 * a})`; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x, y); g.lineTo(hx, hy); g.lineTo(px, py); g.stroke();
            g.beginPath(); g.arc(hx, hy, 3.5, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.9 * a); g.fill();
          }
        }
      },
    };
  },
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
  chessboard(th) { // a big board under the game; pieces make their moves one after another, the last move marked
    let q = 0, cols = 0, rows = 0, r0 = 0, base = null, bw = 0, bh = 0, t = 0, wait = 1, mv = null, last = null;
    let P = [];
    const DIRS = { 1: [[1, 0], [-1, 0], [0, 1], [0, -1]], 3: [[1, 1], [1, -1], [-1, 1], [-1, -1]] };
    function build(w, h) {
      bw = w; bh = h; q = Math.max(42, Math.min(w, h) * 0.13); cols = Math.ceil(w / q); rows = Math.ceil(h / q); r0 = Math.ceil(h * 0.18 / q); // pieces stay below the score
      base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d');
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { g.fillStyle = (r + c) % 2 ? 'rgba(0,0,0,.18)' : 'rgba(255,236,200,.05)'; g.fillRect(c * q, r * q, q, q); }
      P = [];
      const kinds = [0, 0, 1, 2, 3, 4, 5, 0, 2, 3];
      kinds.forEach((k, i) => { for (let tries = 0; tries < 30; tries++) { const c = (Math.random() * cols) | 0, r = r0 + ((Math.random() * (rows - r0)) | 0); if (!P.some(p => p.c === c && p.r === r)) { P.push({ k, side: i % 2, c, r, x: c, y: r, gone: 0 }); break; } } });
    }
    function plan() {
      const p = P[(Math.random() * P.length) | 0]; if (!p || p.gone) return;
      const ok = (c, r) => c >= 0 && r >= r0 && c < cols && r < rows && !P.some(o => o !== p && !o.gone && o.c === c && o.r === r && o.side === p.side);
      let opts = [];
      if (p.k === 2) opts = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].map(([dc, dr]) => [p.c + dc, p.r + dr]);
      else if (p.k === 0) opts = [[p.c, p.r + (p.side ? 1 : -1)], [p.c + 1, p.r + (p.side ? 1 : -1)], [p.c - 1, p.r + (p.side ? 1 : -1)]];
      else if (p.k === 5) for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) { if (dc || dr) opts.push([p.c + dc, p.r + dr]); }
      else { const D = p.k === 4 ? [...DIRS[1], ...DIRS[3]] : DIRS[p.k]; for (const [dc, dr] of D) for (let n = 1; n <= 3; n++) opts.push([p.c + dc * n, p.r + dr * n]); }
      opts = opts.filter(([c, r]) => ok(c, r));
      if (!opts.length) { if (p.k === 0) p.side ^= 1; return; } // a pawn stuck at the edge turns round
      const [c, r] = opts[(Math.random() * opts.length) | 0];
      const victim = P.find(o => o !== p && !o.gone && o.c === c && o.r === r);
      mv = { p, c0: p.c, r0: p.r, c, r, t: 0, victim };
    }
    return {
      step(dt) {
        t += dt;
        for (const p of P) if (p.gone) { p.gone += dt; if (p.gone > 3) { p.gone = 0; for (let tries = 0; tries < 30; tries++) { const c = (Math.random() * cols) | 0, r = r0 + ((Math.random() * (rows - r0)) | 0); if (!P.some(o => o !== p && o.c === c && o.r === r)) { p.c = p.x = c; p.r = p.y = r; break; } } } }
        if (mv) {
          mv.t += dt / 0.7; const e = inOut(clamp01(mv.t));
          mv.p.x = lerp(mv.c0, mv.c, e); mv.p.y = lerp(mv.r0, mv.r, e);
          if (mv.t >= 1) { mv.p.c = mv.c; mv.p.r = mv.r; if (mv.victim) mv.victim.gone = 0.001; last = mv; mv = null; wait = rand(0.8, 1.6); }
        } else if (q) { wait -= dt; if (wait <= 0) plan(); }
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const hl = mv || last;
        if (hl) { g.fillStyle = rgba(th.accent, 0.13 * a); g.fillRect(hl.c0 * q, hl.r0 * q, q, q); g.fillRect(hl.c * q, hl.r * q, q, q); }
        for (const p of P) {
          const hop = mv && mv.p === p && p.k === 2 ? Math.sin(Math.PI * clamp01(mv.t)) * q * 0.35 : 0;
          const fade = p.gone ? Math.max(0, 1 - p.gone * 2) : 1; if (fade <= 0) continue;
          const x = (p.x + 0.5) * q, y = (p.y + 0.5) * q - hop;
          g.fillStyle = `rgba(0,0,0,${0.25 * a * fade})`; chessPiece(g, p.k, x + q * 0.04, y + q * 0.05, q * 0.7, p.side === 1);
          g.fillStyle = p.side ? `rgba(30,22,16,${0.75 * a * fade})` : `rgba(250,240,220,${0.55 * a * fade})`; chessPiece(g, p.k, x, y, q * 0.7, p.side === 1);
        }
      },
    };
  },
});

/* ---------- Puzzle collection, part 2: sound kits ---------- */
Object.assign(KITS, (S => {
  const key = (when, vol) => { S.knock(rand(1500, 1800), { when, vol }); S.hiss({ dur: 0.02, vol: vol * 0.5, type: 'highpass', freq: 3500, when }); };
  const click = (when, vol, f = 2600) => { S.tone(f, { type: 'square', dur: 0.012, vol: vol * 0.25, when, attack: 0.001 }); S.hiss({ dur: 0.015, vol, type: 'bandpass', freq: f * 1.4, q: 3, when }); };
  const pencil = (when, dur, vol) => S.hiss({ dur, vol, type: 'bandpass', freq: rand(3200, 4800), to: rand(2600, 5200), q: 3, when });
  return {
    cipher: { // typewriter keys, the rotors ratcheting on, a bell at the end of the line
      pick() { S.knock(2600, { vol: 0.04 }); },
      place() { key(0, 0.15); click(0.05, 0.06, 3200); S.thud({ vol: 0.14, f: 150 }); },
      clear(n) { for (let i = 0; i < n + 3; i++) { key(i * 0.07, 0.1); click(i * 0.07 + 0.03, 0.04, 3200); } S.tink(2640, { when: (n + 3) * 0.07 + 0.05, vol: 0.08, dur: 0.6 }); },
      deal() { for (let i = 0; i < 3; i++) click(i * 0.05, 0.07, 2800 + i * 200); },
    },
    cube: { // the plastic of a speed cube: snaps, a quick run of turns on a clear, a little chord when it all lines up
      pick() { click(0, 0.05, 3000); },
      place() { S.knock(2200, { vol: 0.12 }); S.knock(1800, { vol: 0.1, when: 0.03 }); S.thud({ vol: 0.14, f: 170 }); },
      clear(n) { let w = 0; for (let i = 0; i < 6 + n * 3; i++) { click(w, 0.06, rand(2200, 3000)); w += 0.028; } S.hiss({ dur: 0.25, vol: 0.04, type: 'bandpass', freq: 1500, to: 3500, q: 1 }); [0, 4, 7].forEach((st, i) => S.tink(S.snd.root * 2 * Math.pow(2, st / 12), { when: w + 0.05 + i * 0.03, vol: 0.04, dur: 0.5 })); },
      deal() { for (let i = 0; i < 4; i++) click(i * 0.03, 0.05, 2600); },
    },
    blueprint: { // pencil on drafting paper, a ruler set down, the approval stamp on a clear
      pick() { pencil(0, 0.04, 0.04); },
      place() { S.knock(900, { vol: 0.14 }); pencil(0.02, 0.07, 0.05); S.thud({ vol: 0.12, f: 160 }); },
      clear(n) { for (let i = 0; i < Math.min(n + 2, 5); i++) pencil(i * 0.08, 0.1, 0.06); S.thud({ vol: 0.32, f: 95, when: Math.min(n + 2, 5) * 0.08 + 0.05 }); S.knock(420, { vol: 0.12, when: Math.min(n + 2, 5) * 0.08 + 0.05 }); },
      deal() { S.rustle({ vol: 0.05, dur: 0.18 }); },
    },
    alchemy: { // glass clinking on glass, the brew bubbling, a shimmer when it turns
      pick() { S.tink(2900, { vol: 0.03, dur: 0.15 }); },
      place() { S.tink(rand(1900, 2200), { vol: 0.07, dur: 0.3 }); S.plop(260, { vol: 0.12, when: 0.02 }); S.thud({ vol: 0.1, f: 140 }); },
      clear(n) { for (let i = 0; i < n + 3; i++) S.plop(rand(250, 520), { when: i * 0.06, vol: 0.08 }); for (let i = 0; i < 5; i++) S.tink(S.snd.root * 2 * Math.pow(2, [0, 3, 7, 10, 12][i] / 12), { when: 0.18 + i * 0.05, vol: 0.03, dur: 0.7 }); S.hissL({ dur: 0.7, vol: 0.05, type: 'bandpass', freq: 600, to: 3000, q: 0.8, when: 0.1 }); },
      deal() { S.plop(380, { vol: 0.06 }); S.tink(2500, { vol: 0.03, dur: 0.2, when: 0.05 }); },
    },
    chess: { // a weighted wooden piece set down, the chess clock pressed, a bell for check on a bigger clear
      pick() { S.knock(1150, { vol: 0.05 }); },
      place() { S.thud({ vol: 0.3, f: 190 }); S.knock(640, { vol: 0.15 }); },
      clear(n, combo) {
        S.knock(700, { vol: 0.16 }); S.thud({ vol: 0.28, f: 170 }); S.knock(560, { vol: 0.12, when: 0.09 }); // a capture: one piece off, the other in its place
        click(0.3, 0.1, 2400); S.knock(1800, { vol: 0.08, when: 0.3 });
        if (n > 1 || (combo || 0) > 2) S.tink(1568, { vol: 0.07, dur: 1, when: 0.42 });
      },
      deal() { for (let i = 0; i < 3; i++) S.knock(rand(900, 1300), { vol: 0.05, when: i * 0.06 }); },
    },
  };
})(Sfx));
