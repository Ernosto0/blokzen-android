import { hexOf, mixHex, rgba, shade } from '../../core/color.js';
import { KITS, Sfx } from '../../audio/sfx.js';
import { ctx } from '../../ui/dom.js';
import { state } from '../../core/state.js';
import { rand } from '../../core/util.js';
import { hexPath, rr } from '../../render/sprites.js';
import { seeded, STYLES } from '../../render/blocks.js';
import { softGlint, speckle, TEX, texIn } from '../../render/textures.js';
import { AMBIENTS } from '../../render/backgrounds.js';
import { PARTS } from '../../render/render.js';

/* ---------- Third theme set: shapes shared by blocks, backgrounds and particles ---------- */
function fishShape(g, x, y, r, dir, fill, wag = 0) {
  g.save(); g.translate(x, y); g.scale(dir, 1);
  g.beginPath(); g.ellipse(0, 0, r, r * 0.45, 0, 0, Math.PI * 2);
  g.moveTo(-r * 0.75, 0); g.lineTo(-r * 1.5, -r * 0.45 * (1 + 0.25 * wag)); g.lineTo(-r * 1.5, r * 0.45 * (1 - 0.25 * wag)); g.closePath();
  g.fillStyle = fill; g.fill();
  g.restore();
}
// hieroglyphs: eye, water, sun disc, feather (path only, stroked by the caller)
function glyph(g, kind, x, y, r) {
  g.beginPath();
  if (kind === 0) {
    g.moveTo(x - r, y); g.quadraticCurveTo(x, y - r * 0.8, x + r, y); g.quadraticCurveTo(x, y + r * 0.8, x - r, y);
    g.moveTo(x + r * 0.25, y); g.arc(x, y, r * 0.25, 0, Math.PI * 2);
    g.moveTo(x - r * 0.25, y + r * 0.35); g.lineTo(x - r * 0.45, y + r * 0.95);
  } else if (kind === 1) {
    for (let i = 0; i < 3; i++) { const yy = y - r * 0.5 + i * r * 0.5; g.moveTo(x - r, yy); for (let j = 1; j <= 6; j++) g.lineTo(x - r + j * r / 3, yy + (j % 2 ? -r * 0.2 : 0)); }
  } else if (kind === 2) {
    g.moveTo(x + r * 0.7, y); g.arc(x, y, r * 0.7, 0, Math.PI * 2);
    g.moveTo(x + r * 0.15, y); g.arc(x, y, r * 0.15, 0, Math.PI * 2);
  } else {
    g.moveTo(x, y + r); g.quadraticCurveTo(x - r * 0.65, y - r * 0.1, x + r * 0.1, y - r);
    g.quadraticCurveTo(x + r * 0.45, y, x, y + r); g.moveTo(x, y + r * 0.6); g.lineTo(x + r * 0.05, y - r * 0.6);
  }
}
export function rosette(g, x, y, r, petal, center) {
  g.fillStyle = petal;
  for (let i = 0; i < 8; i++) { g.save(); g.translate(x, y); g.rotate(i * Math.PI / 4); g.beginPath(); g.ellipse(r * 0.55, 0, r * 0.45, r * 0.2, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
  g.beginPath(); g.arc(x, y, r * 0.25, 0, Math.PI * 2); g.fillStyle = center; g.fill();
}
function tulipPath(g, x, y, r) {
  g.beginPath(); g.moveTo(x, y + r * 0.35);
  g.quadraticCurveTo(x - r * 0.95, y + r * 0.05, x - r * 0.5, y - r * 0.85);
  g.quadraticCurveTo(x - r * 0.25, y - r * 0.3, x, y - r);
  g.quadraticCurveTo(x + r * 0.25, y - r * 0.3, x + r * 0.5, y - r * 0.85);
  g.quadraticCurveTo(x + r * 0.95, y + r * 0.05, x, y + r * 0.35);
  g.closePath();
}
export function gearPath(g, x, y, r, n, rot = 0, hole = 0.35) {
  g.beginPath();
  const ri = r * 0.78, st = Math.PI * 2 / n;
  for (let i = 0; i < n; i++) {
    const a = rot + i * st;
    [[ri, a], [r, a + st * 0.15], [r, a + st * 0.45], [ri, a + st * 0.6]].forEach(([rad, an], j) => {
      const px = x + Math.cos(an) * rad, py = y + Math.sin(an) * rad;
      if (i === 0 && j === 0) g.moveTo(px, py); else g.lineTo(px, py);
    });
  }
  g.closePath();
  if (hole) { g.moveTo(x + r * hole, y); g.arc(x, y, r * hole, 0, Math.PI * 2); }
}
const MAPLE = (() => {
  const R = [[0, -1], [0.18, -0.62], [0.42, -0.78], [0.4, -0.38], [0.86, -0.42], [0.66, -0.1], [0.9, 0.12], [0.42, 0.22], [0.36, 0.5], [0.08, 0.36], [0.04, 0.6], [0.04, 0.95]];
  return [...R, ...R.slice(1).reverse().map(([x, y]) => [-x, y])];
})();
function mapleShape(g, x, y, r, rot) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); MAPLE.forEach(([px, py], i) => i ? g.lineTo(px * r, py * r) : g.moveTo(px * r, py * r)); g.closePath();
  g.restore();
}
function noteShape(g, x, y, r) { // eighth note, filled with the current fillStyle
  g.save(); g.translate(x, y);
  g.beginPath(); g.ellipse(-r * 0.2, r * 0.55, r * 0.32, r * 0.22, -0.4, 0, Math.PI * 2); g.fill();
  g.fillRect(r * 0.04, -r * 0.75, r * 0.1, r * 1.3);
  g.beginPath(); g.moveTo(r * 0.14, -r * 0.75); g.quadraticCurveTo(r * 0.55, -r * 0.45, r * 0.42, -r * 0.05); g.quadraticCurveTo(r * 0.42, -r * 0.35, r * 0.14, -r * 0.42); g.fill();
  g.restore();
}
const CLOUD = [[0.3, 0.4, 0.2], [0.53, 0.3, 0.24], [0.74, 0.42, 0.2], [0.24, 0.64, 0.2], [0.5, 0.62, 0.26], [0.76, 0.66, 0.2]];
function cloudPath(g, s, dy = 0) {
  g.beginPath();
  for (const [x, y, r] of CLOUD) { g.moveTo(s * x + s * r, s * y + dy); g.arc(s * x, s * y + dy, s * r, 0, Math.PI * 2); }
  g.rect(s * 0.2, s * 0.35 + dy, s * 0.6, s * 0.38);
}
function koiShape(g, x, y, r, ang, body, wag) {
  g.save(); g.translate(x, y); g.rotate(ang);
  g.beginPath(); g.ellipse(0, 0, r, r * 0.36, 0, 0, Math.PI * 2);
  g.moveTo(-r * 0.8, 0); g.quadraticCurveTo(-r * 1.25, -r * 0.2 + wag * r * 0.2, -r * 1.55, -r * 0.42); g.lineTo(-r * 1.4, 0); g.lineTo(-r * 1.55, r * 0.42); g.quadraticCurveTo(-r * 1.25, r * 0.2 + wag * r * 0.2, -r * 0.8, 0);
  g.fillStyle = body; g.fill();
  g.beginPath(); g.ellipse(r * 0.15, -r * 0.05, r * 0.28, r * 0.16, 0.3, 0, Math.PI * 2); g.fillStyle = 'rgba(216,64,40,.55)'; g.fill();
  g.restore();
}
function palm(g, x, y, H, dir, sway, a) {
  const tx = x + dir * H * 0.28 + sway * H, ty = y - H;
  g.strokeStyle = `rgba(90,60,30,${0.55 * a})`; g.lineWidth = H * 0.05; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + dir * H * 0.02, y - H * 0.6, tx, ty); g.stroke();
  g.fillStyle = `rgba(40,120,60,${0.6 * a})`;
  for (let i = 0; i < 6; i++) {
    const an = -Math.PI / 2 + (i - 2.5) * 0.55 + sway * 2, L = H * 0.32;
    const ex = tx + Math.cos(an) * L, ey = ty + Math.sin(an) * L + L * 0.35;
    g.beginPath(); g.moveTo(tx, ty);
    g.quadraticCurveTo(tx + Math.cos(an) * L * 0.6, ty + Math.sin(an) * L * 0.6 - L * 0.15, ex, ey);
    g.quadraticCurveTo(tx + Math.cos(an) * L * 0.5, ty + Math.sin(an) * L * 0.5 + L * 0.05, tx, ty);
    g.fill();
  }
  g.lineCap = 'butt';
}
// stroke the current path twice: a light edge offset down-right, then the dark cut, so it reads as carved
export function carved(g, build, lw, light, dark) {
  g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  g.save(); g.translate(lw * 0.6, lw * 0.6); build(); g.strokeStyle = light; g.stroke(); g.restore();
  build(); g.strokeStyle = dark; g.stroke();
}

/* ---------- Third theme set, part 1: block looks and textures ---------- */
Object.assign(STYLES, {
  aurora: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.16); g.fillStyle = mixHex(c, '#06121e', 0.55); g.fill();
      g.save(); rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.84, s * 0.14); g.clip();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#0a1a2a', 0.2)); gr.addColorStop(1, mixHex(c, '#06121e', 0.62));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      TEX.aurora(g, s, c, seeded(c), 1);
      g.restore();
      rr(g, s * 0.08, s * 0.07, s * 0.84, s * 0.84, s * 0.14); g.strokeStyle = 'rgba(220,255,250,.5)'; g.lineWidth = Math.max(1, s * 0.03); g.stroke();
    },
  },
  coral: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.26); g.fillStyle = shade(c, -0.3); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.35, s * 0.05, s * 0.5, s * 0.5, s * 0.62);
      gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, shade(c, -0.08));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.24); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'coral', 1, 0.07, 0.24);
    },
  },
  tomb: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.06); g.fillStyle = shade(c, -0.45); g.fill();
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, shade(c, 0.22)); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.05); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'tomb', 1, 0.06, 0.05);
    },
  },
  iznik: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = shade(c, -0.3); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.08); g.fillStyle = mixHex(c, '#fbfdff', 0.84); g.fill();
      g.save(); rr(g, s * 0.12, s * 0.11, s * 0.76, s * 0.74, s * 0.05); g.clip();
      g.globalAlpha = 0.4; g.fillStyle = c;
      for (const [x, y] of [[0.12, 0.11], [0.88, 0.11], [0.12, 0.85], [0.88, 0.85]]) { g.beginPath(); g.arc(s * x, s * y, s * 0.14, 0, Math.PI * 2); g.fill(); }
      g.globalAlpha = 1;
      g.strokeStyle = '#2f8a4a'; g.lineWidth = Math.max(1, s * 0.03); g.lineCap = 'round';
      g.beginPath(); g.moveTo(s * 0.5, s * 0.58); g.quadraticCurveTo(s * 0.47, s * 0.7, s * 0.5, s * 0.82); g.stroke();
      g.fillStyle = '#2f8a4a';
      for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(s * (0.5 + sd * 0.11), s * 0.72, s * 0.1, s * 0.035, sd * -0.6, 0, Math.PI * 2); g.fill(); }
      tulipPath(g, s * 0.5, s * 0.5, s * 0.25); g.fillStyle = c; g.fill();
      g.beginPath(); g.arc(s * 0.5, s * 0.45, s * 0.05, 0, Math.PI * 2); g.fillStyle = c === '#d8402e' ? '#1f5fc8' : '#d8402e'; g.fill();
      g.restore();
      rr(g, s * 0.12, s * 0.11, s * 0.76, s * 0.74, s * 0.05); g.strokeStyle = c; g.lineWidth = Math.max(1, s * 0.03); g.stroke();
      g.beginPath(); g.ellipse(s * 0.32, s * 0.18, s * 0.18, s * 0.04, -0.3, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill();
    },
  },
  balloon: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.2); g.fillStyle = shade(c, -0.3); g.fill();
      g.save(); rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.83, s * 0.18); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s);
      TEX.balloon(g, s, c, seeded(c), 1);
      const sh = g.createLinearGradient(0, 0, s, 0); sh.addColorStop(0, 'rgba(0,0,0,.16)'); sh.addColorStop(0.35, 'rgba(255,255,255,.18)'); sh.addColorStop(1, 'rgba(0,0,0,.22)');
      g.fillStyle = sh; g.fillRect(0, 0, s, s);
      g.restore();
    },
  },
  ebru: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.35); g.fill();
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.1); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s);
      TEX.ebru(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
  gear: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.09); g.fillStyle = shade(c, -0.5); g.fill();
      const lg = g.createLinearGradient(0, 0, s, s);
      lg.addColorStop(0, shade(c, 0.45)); lg.addColorStop(0.45, c); lg.addColorStop(0.7, shade(c, -0.15)); lg.addColorStop(1, shade(c, 0.15));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.07); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'gear', 1, 0.07, 0.07);
    },
  },
  storm: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.18); g.fillStyle = mixHex(c, '#05080e', 0.6); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.12)); gr.addColorStop(1, mixHex(c, '#05080e', 0.45));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.16); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'storm', 1, 0.07, 0.16);
    },
  },
  stone: {
    block(g, s, c) {
      g.beginPath(); g.ellipse(s * 0.5, s * 0.56, s * 0.44, s * 0.4, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.16)'; g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.36); g.fillStyle = shade(c, -0.25); g.fill();
      const gr = g.createRadialGradient(s * 0.38, s * 0.32, s * 0.04, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.4)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.8, s * 0.34); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'stone', 1, 0.07, 0.34);
    },
  },
  lamp: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.22); g.fillStyle = mixHex(c, '#120604', 0.6); g.fill();
      g.save(); rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.2); g.clip();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, mixHex(c, '#1a0804', 0.6)); gr.addColorStop(1, mixHex(c, '#1a0804', 0.3));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      TEX.lamp(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
});

Object.assign(TEX, {
  aurora(g, s, c, rnd, k) { // curtains of light hanging from a wavy edge, a few stars
    const hi = hexOf(mixHex(c, '#ffffff', 0.55)), ph = rnd() * 6.3, n = 14, sw = s / n;
    const top = i => s * (0.18 + 0.12 * Math.sin(i / n * 5 + ph));
    const gr = g.createLinearGradient(0, 0, 0, s * 0.5); gr.addColorStop(0, rgba(hi, 0.55 * k)); gr.addColorStop(1, rgba(hi, 0));
    g.fillStyle = gr;
    for (let i = 0; i < n; i++) { g.save(); g.translate(i * sw, top(i)); g.fillRect(0, 0, sw + 0.6, s * 0.5); g.restore(); }
    g.beginPath(); for (let i = 0; i <= n; i++) i ? g.lineTo(i * sw, top(i)) : g.moveTo(0, top(0));
    g.strokeStyle = rgba(hi, 0.75 * k); g.lineWidth = Math.max(1, s * 0.02); g.stroke();
    for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(255,255,255,${(0.4 + rnd() * 0.5) * k})`; const r = Math.max(0.6, s * 0.015); g.fillRect(rnd() * s, rnd() * s * 0.16, r, r); }
  },
  coral(g, s, c, rnd, k) { // porous polyp cups
    const dk = shade(c, -0.38), lt = shade(c, 0.45);
    for (let i = 0; i < 16; i++) {
      const x = rnd() * s, y = rnd() * s, r = s * (0.025 + rnd() * 0.035);
      g.globalAlpha = 0.6 * k; g.beginPath(); g.arc(x, y + r * 0.25, r, 0, Math.PI * 2); g.fillStyle = lt; g.fill();
      g.globalAlpha = 0.75 * k; g.beginPath(); g.arc(x, y, r * 0.7, 0, Math.PI * 2); g.fillStyle = dk; g.fill();
    }
    g.globalAlpha = 1;
    softGlint(g, s * 0.32, s * 0.28, s * 0.22, 0.3 * k);
  },
  tomb(g, s, c, rnd, k) { // sandstone grain and one carved glyph
    speckle(g, s, rnd, 40, 0.004, 0.012, () => rnd() < 0.5 ? `rgba(70,40,10,${0.22 * k})` : `rgba(255,240,200,${0.18 * k})`);
    const kind = (rnd() * 4) | 0;
    carved(g, () => glyph(g, kind, s * 0.5, s * 0.5, s * 0.25), Math.max(1, s * 0.045), `rgba(255,240,205,${0.45 * k})`, `rgba(60,30,8,${0.6 * k})`);
  },
  iznik(g, s, c, rnd, k) { // a white rosette and a glazed inner frame
    rosette(g, s * 0.5, s * 0.5, s * 0.3, `rgba(255,255,255,${0.55 * k})`, `rgba(216,64,46,${0.8 * k})`);
    rr(g, s * 0.14, s * 0.14, s * 0.72, s * 0.72, s * 0.05); g.strokeStyle = `rgba(255,255,255,${0.35 * k})`; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
  },
  balloon(g, s, c, rnd, k) { // envelope gores bulging outwards, seams and stitching
    const seams = [0.2, 0.4, 0.6, 0.8], bend = x => s / 2 + (x * s - s / 2) * 1.3;
    g.fillStyle = mixHex(c, '#ffffff', 0.35); g.globalAlpha = 0.75 * k;
    for (let i = 0; i < seams.length - 1; i += 2) {
      const a = seams[i] * s, b = seams[i + 1] * s;
      g.beginPath(); g.moveTo(a, -1); g.quadraticCurveTo(bend(seams[i]), s / 2, a, s + 1); g.lineTo(b, s + 1); g.quadraticCurveTo(bend(seams[i + 1]), s / 2, b, -1); g.closePath(); g.fill();
    }
    g.lineWidth = Math.max(1, s * 0.015);
    for (const x of seams) {
      g.globalAlpha = 0.35 * k; g.strokeStyle = '#3a1a10';
      g.beginPath(); g.moveTo(x * s, 0); g.quadraticCurveTo(bend(x), s / 2, x * s, s); g.stroke();
      g.globalAlpha = 0.5 * k; g.strokeStyle = '#ffffff'; g.setLineDash([s * 0.025, s * 0.03]);
      g.beginPath(); g.moveTo(x * s + s * 0.025, 0); g.quadraticCurveTo(bend(x) + s * 0.025, s / 2, x * s + s * 0.025, s); g.stroke();
      g.setLineDash([]);
    }
    g.globalAlpha = 1;
  },
  ebru(g, s, c, rnd, k) { // dropped paint spreading into rings, then combed through
    const L = hexOf(mixHex(c, '#fff6e6', 0.6)), D = hexOf(mixHex(c, '#101820', 0.35));
    for (let i = 0; i < 4; i++) {
      const x = s * (0.1 + rnd() * 0.8), y = s * (0.1 + rnd() * 0.8), r = s * (0.12 + rnd() * 0.16);
      for (const [q, col, al] of [[1, L, 0.55], [0.72, D, 0.5], [0.45, L, 0.6], [0.22, c, 1]]) { g.beginPath(); g.arc(x, y, r * q, 0, Math.PI * 2); g.fillStyle = rgba(col, al * k); g.fill(); }
    }
    g.lineWidth = Math.max(1, s * 0.018); g.strokeStyle = `rgba(255,250,240,${0.5 * k})`;
    const ph = rnd() * 6.3;
    for (let i = 0; i < 4; i++) {
      const y0 = s * (0.15 + i * 0.24);
      g.beginPath(); for (let j = 0; j <= 16; j++) { const x = j * s / 16, y = y0 + Math.sin(x / s * 9 + ph + i) * s * 0.05; j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    }
  },
  gear(g, s, c, rnd, k) { // an engraved cog and four rivets
    const rot = rnd() * 6.3;
    carved(g, () => gearPath(g, s * 0.5, s * 0.5, s * 0.24, 8, rot, 0.4), Math.max(1, s * 0.03), `rgba(255,245,215,${0.4 * k})`, `rgba(40,25,10,${0.5 * k})`);
    for (const [x, y] of [[0.17, 0.17], [0.83, 0.17], [0.17, 0.83], [0.83, 0.83]]) {
      g.beginPath(); g.arc(s * x, s * y, s * 0.05, 0, Math.PI * 2); g.fillStyle = `rgba(40,25,10,${0.45 * k})`; g.fill();
      g.beginPath(); g.arc(s * x - s * 0.012, s * y - s * 0.012, s * 0.03, 0, Math.PI * 2); g.fillStyle = `rgba(255,245,215,${0.55 * k})`; g.fill();
    }
  },
  storm(g, s, c, rnd, k) { // cloud puffs with a lightning crack running through
    g.fillStyle = `rgba(255,255,255,${0.16 * k})`;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(s * (0.12 + i * 0.19), s * (0.18 + rnd() * 0.12), s * (0.12 + rnd() * 0.08), 0, Math.PI * 2); g.fill(); }
    const pts = []; let x = s * (0.3 + rnd() * 0.4), y = s * 0.04; pts.push([x, y]);
    while (y < s * 0.95) { y += s * (0.12 + rnd() * 0.1); x += s * (rnd() - 0.5) * 0.3; pts.push([x, y]); }
    const line = () => { g.beginPath(); pts.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); };
    g.lineJoin = 'round'; g.lineCap = 'round';
    g.save(); g.shadowColor = '#9fd8ff'; g.shadowBlur = s * 0.12; line(); g.strokeStyle = `rgba(160,220,255,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.05); g.stroke(); g.restore();
    line(); g.strokeStyle = `rgba(255,255,255,${0.9 * k})`; g.lineWidth = Math.max(1, s * 0.018); g.stroke();
  },
  stone(g, s, c, rnd, k) { // river stone: grain, a pale vein, soft shine
    speckle(g, s, rnd, 36, 0.004, 0.012, () => rnd() < 0.5 ? `rgba(0,0,0,${0.12 * k})` : `rgba(255,255,255,${0.2 * k})`);
    const y = s * (0.35 + rnd() * 0.3);
    g.beginPath(); g.moveTo(-s * 0.05, y); g.bezierCurveTo(s * 0.3, y - s * 0.12, s * 0.6, y + s * 0.12, s * 1.05, y - s * 0.04);
    g.strokeStyle = `rgba(255,255,255,${0.28 * k})`; g.lineWidth = Math.max(1, s * 0.025); g.stroke();
    softGlint(g, s * 0.33, s * 0.28, s * 0.2, 0.35 * k);
  },
  lamp(g, s, c, rnd, k) { // glowing wax blobs inside glass
    const hi = hexOf(mixHex(c, '#fff0c0', 0.35));
    for (let i = 0; i < 3; i++) {
      const x = s * (0.2 + rnd() * 0.6), y = s * (0.2 + rnd() * 0.6), rx = s * (0.12 + rnd() * 0.12), ry = rx * (1.1 + rnd() * 0.5);
      const gr = g.createRadialGradient(x - rx * 0.3, y - ry * 0.3, 0, x, y, Math.max(rx, ry));
      gr.addColorStop(0, rgba(hi, 0.95 * k)); gr.addColorStop(0.7, rgba(c, 0.85 * k)); gr.addColorStop(1, rgba(c, 0));
      g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    }
    const sh = g.createLinearGradient(s * 0.12, 0, s * 0.3, 0);
    sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, `rgba(255,255,255,${0.25 * k})`); sh.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sh; g.fillRect(s * 0.12, s * 0.08, s * 0.18, s * 0.84);
  },
});

/* ---------- Third theme set, part 1: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  aurora(th) { // light curtains rippling over snowy hills
    const ST = [...Array(90)].map(() => ({ x: Math.random(), y: Math.random() * 0.7, r: rand(0.5, 1.5), ph: rand(0, 6.3), f: rand(0.5, 2) }));
    const CU = [0, 1, 2].map(i => ({ y: 0.1 + i * 0.1, amp: rand(0.04, 0.08), f: rand(3, 6), sp: rand(0.15, 0.3) * (i % 2 ? -1 : 1), ph: rand(0, 6.3), c: [th.blocks[0], th.blocks[2], th.blocks[4]][i], len: rand(0.25, 0.4) }));
    let t = 0, hills = null, hw = 0, hh = 0;
    function build(w, h) {
      hw = w; hh = h; hills = document.createElement('canvas'); hills.width = Math.ceil(w); hills.height = Math.ceil(h * 0.3);
      const g = hills.getContext('2d'), H = hills.height;
      for (let L = 0; L < 2; L++) {
        g.beginPath(); g.moveTo(0, H);
        for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, H * (0.35 + L * 0.25) + Math.sin(x * 0.006 + L * 2) * H * 0.12 + Math.sin(x * 0.017 + L) * H * 0.05);
        g.lineTo(w, H); g.closePath(); g.globalAlpha = L ? 0.22 : 0.15; g.fillStyle = L ? '#e8f4fa' : '#9fbccc'; g.fill();
      }
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        for (const s of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * s.f + s.ph))) * a})`; g.fillRect(s.x * w, s.y * h, s.r, s.r); }
        g.save(); g.globalCompositeOperation = 'lighter';
        const n = Math.ceil(w / 10), sw = w / n;
        for (const cu of CU) {
          const L = cu.len * h, gr = g.createLinearGradient(0, 0, 0, L);
          gr.addColorStop(0, rgba(cu.c, 0.02 * a)); gr.addColorStop(0.15, rgba(cu.c, 0.22 * a)); gr.addColorStop(1, rgba(cu.c, 0));
          g.fillStyle = gr;
          for (let i = 0; i < n; i++) {
            const x = i * sw, y = h * (cu.y + cu.amp * Math.sin(x / w * cu.f + t * cu.sp + cu.ph) + 0.02 * Math.sin(x / w * 17 + t * 0.7));
            g.globalAlpha = 0.6 + 0.4 * Math.sin(x / w * 9 - t * 0.5 + cu.ph);
            g.translate(x, y); g.fillRect(0, 0, sw + 0.6, L); g.translate(-x, -y);
          }
        }
        g.restore();
        if (!hills || Math.abs(w - hw) > 1 || Math.abs(h - hh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(hills, 0, h * 0.7, w, h * 0.3); g.globalAlpha = 1;
      },
    };
  },
  reef(th) { // shafts of light, schools of fish, swaying seaweed, rising bubbles
    const WEED = [...Array(10)].map((_, i) => ({ x: (i + rand(0.1, 0.9)) / 10, hg: rand(0.12, 0.3), ph: rand(0, 6.3), c: i % 3 ? '#2f9a6a' : '#e0708a', n: 2 + ((Math.random() * 2) | 0) }));
    const school = init => {
      const dir = Math.random() < 0.5 ? 1 : -1;
      return { x: init ? Math.random() : (dir > 0 ? -0.25 : 1.25), y: rand(0.12, 0.62), v: rand(0.03, 0.06), dir, c: th.blocks[(Math.random() * 7) | 0],
        F: [...Array(6 + ((Math.random() * 6) | 0))].map(() => [rand(-0.07, 0.07), rand(-0.04, 0.04), rand(0, 6.3)]) };
    };
    const SC = [school(true), school(true), school(true)];
    const BU = [...Array(18)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.003, 0.009), v: rand(0.04, 0.09), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        SC.forEach((s, i) => { s.x += s.v * s.dir * dt; if (s.x < -0.3 || s.x > 1.3) SC[i] = school(false); });
        for (const b of BU) { b.y -= b.v * dt; if (b.y < -0.02) { b.y = 1.02; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (let i = 0; i < 3; i++) {
          const x = w * (0.2 + i * 0.3) + Math.sin(t * 0.4 + i * 2) * w * 0.06;
          const gr = g.createLinearGradient(0, 0, 0, h * 0.7); gr.addColorStop(0, `rgba(255,255,230,${0.08 * a})`); gr.addColorStop(1, 'rgba(255,255,230,0)');
          g.fillStyle = gr; g.beginPath(); g.moveTo(x - w * 0.05, 0); g.lineTo(x + w * 0.06, 0); g.lineTo(x + w * 0.18, h * 0.7); g.lineTo(x - w * 0.03, h * 0.7); g.fill();
        }
        const fr = u * 0.014;
        for (const s of SC) for (const [ox, oy, ph] of s.F) fishShape(g, (s.x + ox) * w, (s.y + oy + Math.sin(t * 2 + ph) * 0.006) * h, fr, s.dir, rgba(s.c, 0.6 * a), Math.sin(t * 9 + ph));
        g.lineCap = 'round'; g.lineWidth = u * 0.016;
        for (const wd of WEED) {
          const x0 = wd.x * w, H = wd.hg * h;
          for (let k = 0; k < wd.n; k++) {
            const sw = Math.sin(t * 0.9 + wd.ph + k) * u * 0.05, xo = (k - (wd.n - 1) / 2) * u * 0.02;
            g.beginPath(); g.moveTo(x0 + xo, h); g.bezierCurveTo(x0 + xo - sw, h - H * 0.35, x0 + xo + sw, h - H * 0.7, x0 + xo + sw * 1.4, h - H * (0.85 + 0.1 * k));
            g.strokeStyle = rgba(wd.c, 0.5 * a); g.stroke();
          }
        }
        g.lineCap = 'butt'; g.lineWidth = 1;
        g.strokeStyle = `rgba(255,255,255,${0.35 * a})`;
        for (const b of BU) { g.beginPath(); g.arc((b.x + Math.sin(t + b.ph) * 0.006) * w, b.y * h, b.r * u, 0, Math.PI * 2); g.stroke(); }
      },
    };
  },
  tomb(th) { // carved stone wall, two torches, trickles of sand, dust
    let wall = null, ww = 0, wh = 0, t = 0;
    const DUST = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.01, 0.01), ph: rand(0, 6.3) }));
    const SAND = [0, 1, 2].map(() => ({ x: rand(0.15, 0.85), on: rand(0, 3), wait: rand(0, 3), acc: 0, G: [] }));
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), u = Math.min(w, h), rh = u * 0.085, bw = rh * 2.2;
      g.strokeStyle = 'rgba(255,214,150,.07)'; g.lineWidth = 1.5;
      for (let r = 0, y = 0; y < h; r++, y += rh) { const off = (r % 2) * bw / 2; for (let x = -off; x < w; x += bw) g.strokeRect(x + 1, y + 1, bw - 2, rh - 2); }
      g.lineWidth = Math.max(1.5, u * 0.008); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,200,120,.09)';
      for (const cx of [0.28, 0.72]) for (let i = 0, y = h * 0.12; y < h * 0.9; i++, y += u * 0.12) { glyph(g, (i + (cx > 0.5 ? 2 : 0)) % 4, cx * w, y, u * 0.035); g.stroke(); }
    }
    return {
      step(dt) {
        t += dt;
        for (const s of SAND) {
          if (s.on > 0) { s.on -= dt; s.acc += dt; while (s.acc > 0.03) { s.acc -= 0.03; s.G.push({ y: 0, v: rand(0.05, 0.15), dx: rand(-0.004, 0.004) }); } }
          else { s.wait -= dt; if (s.wait <= 0) { s.on = rand(1.5, 4); s.wait = rand(2, 6); s.x = rand(0.15, 0.85); } }
          for (const p of s.G) { p.v += 1.2 * dt; p.y += p.v * dt; }
          s.G = s.G.filter(p => p.y < 1.05);
        }
        for (const d of DUST) { d.x += d.v * dt; d.y -= 0.006 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const tx of [0.08, 0.92]) {
          const x = tx * w, y = h * 0.34, fl = 0.85 + 0.15 * Math.sin(t * 13 + tx * 9) * Math.sin(t * 7.3), R = u * 0.32 * fl;
          const gl = g.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba(th.accent, 0.3 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - R, 2 * R, 2 * R);
          g.fillStyle = `rgba(60,36,16,${0.9 * a})`; g.fillRect(x - u * 0.008, y, u * 0.016, u * 0.09);
          const fh = u * 0.05 * fl;
          g.beginPath(); g.moveTo(x, y - fh); g.quadraticCurveTo(x + u * 0.022, y - fh * 0.2, x, y + u * 0.006); g.quadraticCurveTo(x - u * 0.022, y - fh * 0.2, x, y - fh);
          g.fillStyle = `rgba(255,190,80,${0.9 * a})`; g.fill();
        }
        g.fillStyle = `rgba(230,190,120,${0.55 * a})`;
        const gs2 = Math.max(1, u * 0.004);
        for (const s of SAND) for (const p of s.G) g.fillRect((s.x + p.dx) * w, p.y * h, gs2, gs2);
        for (const d of DUST) { g.fillStyle = `rgba(255,220,160,${(0.2 + 0.15 * Math.sin(t + d.ph)) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
  iznik(th) { // tiled wall, a pointed arch window letting light in, floating motes
    let wall = null, ww = 0, wh = 0, t = 0;
    const M = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.012, -0.004), ph: rand(0, 6.3) }));
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), ts = Math.max(48, Math.min(w, h) * 0.16);
      for (let y = 0; y < h + ts; y += ts) for (let x = 0; x < w + ts; x += ts) {
        g.strokeStyle = 'rgba(160,200,255,.07)'; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, ts - 1, ts - 1);
        rosette(g, x + ts / 2, y + ts / 2, ts * 0.28, 'rgba(90,170,255,.09)', 'rgba(255,120,90,.12)');
        g.fillStyle = 'rgba(40,200,210,.06)';
        for (const [cx, cy] of [[x, y], [x + ts, y], [x, y + ts], [x + ts, y + ts]]) { g.beginPath(); g.arc(cx, cy, ts * 0.12, 0, Math.PI * 2); g.fill(); }
      }
    }
    return {
      step(dt) { t += dt; for (const m of M) { m.y += m.v * dt; m.x += Math.sin(t * 0.5 + m.ph) * 0.003 * dt; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), cx = w / 2, aw = u * 0.16, top = h * 0.02, bot = h * 0.2;
        const beam = g.createLinearGradient(0, bot, 0, h); beam.addColorStop(0, `rgba(255,236,190,${0.13 * a})`); beam.addColorStop(1, 'rgba(255,236,190,0)');
        g.fillStyle = beam; g.beginPath(); g.moveTo(cx - aw, bot); g.lineTo(cx + aw, bot); g.lineTo(cx + aw * 3, h); g.lineTo(cx - aw * 0.4, h); g.fill();
        g.beginPath(); g.moveTo(cx - aw, bot); g.lineTo(cx - aw, top + aw); g.quadraticCurveTo(cx - aw, top + aw * 0.2, cx, top);
        g.quadraticCurveTo(cx + aw, top + aw * 0.2, cx + aw, top + aw); g.lineTo(cx + aw, bot); g.closePath();
        g.fillStyle = `rgba(255,240,205,${0.16 * a})`; g.fill(); g.strokeStyle = `rgba(255,200,120,${0.3 * a})`; g.lineWidth = 2; g.stroke();
        for (const m of M) { const k = 0.5 + 0.5 * Math.sin(t * 2 + m.ph); g.fillStyle = `rgba(255,236,190,${(0.15 + 0.35 * k) * a})`; g.fillRect(m.x * w, m.y * h, 2, 2); }
      },
    };
  },
  cappadocia(th) { // hot air balloons drifting up behind fairy chimneys
    let land = null, lw = 0, lh = 0, t = 0;
    const mkB = init => ({ x: rand(0.05, 0.95), y: init ? rand(0.05, 0.85) : 1.1, v: rand(0.008, 0.02), s: rand(0.6, 1.3), c1: th.blocks[(Math.random() * 7) | 0], c2: th.blocks[(Math.random() * 7) | 0], ph: rand(0, 6.3), burn: 0 });
    const B = [...Array(7)].map(() => mkB(true)).sort((p, q) => p.s - q.s);
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h * 0.32);
      const g = land.getContext('2d'), H = land.height, u = Math.min(w, h);
      g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= w + 10; x += 10) g.lineTo(x, H * 0.45 + Math.sin(x * 0.008) * H * 0.1 + Math.sin(x * 0.023) * H * 0.05); g.lineTo(w, H); g.closePath();
      g.fillStyle = 'rgba(160,90,70,.22)'; g.fill();
      for (let i = 0; i < 10; i++) {
        const x = (i + 0.2 + Math.random() * 0.6) / 10 * w, hh = H * rand(0.35, 0.75), bw = u * rand(0.035, 0.065);
        g.beginPath(); g.moveTo(x - bw, H); g.quadraticCurveTo(x - bw * 0.6, H - hh * 0.6, x - bw * 0.25, H - hh); g.lineTo(x + bw * 0.25, H - hh); g.quadraticCurveTo(x + bw * 0.6, H - hh * 0.6, x + bw, H); g.closePath();
        g.fillStyle = 'rgba(176,116,86,.42)'; g.fill();
        g.beginPath(); g.ellipse(x, H - hh, bw * 0.45, bw * 0.25, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(96,56,44,.5)'; g.fill();
      }
      g.fillStyle = 'rgba(140,80,60,.3)'; g.fillRect(0, H * 0.88, w, H * 0.12);
    }
    return {
      step(dt) {
        t += dt;
        B.forEach((b, i) => {
          b.y -= b.v * dt; b.burn = Math.max(0, b.burn - dt);
          if (!b.burn && Math.random() < dt * 0.15) b.burn = 0.7;
          if (b.y < -0.2) { B[i] = mkB(false); B.sort((p, q) => p.s - q.s); }
        });
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const b of B) {
          const x = (b.x + Math.sin(t * 0.2 + b.ph) * 0.01) * w, y = b.y * h, r = u * 0.045 * b.s;
          const env = () => {
            g.beginPath(); g.arc(x, y, r, Math.PI * 0.85, Math.PI * 0.15);
            g.quadraticCurveTo(x + r * 0.55, y + r * 1.15, x + r * 0.28, y + r * 1.45); g.lineTo(x - r * 0.28, y + r * 1.45);
            g.quadraticCurveTo(x - r * 0.55, y + r * 1.15, x + Math.cos(Math.PI * 0.85) * r, y + Math.sin(Math.PI * 0.85) * r); g.closePath();
          };
          env(); g.fillStyle = rgba(b.c1, 0.8 * a); g.fill();
          g.save(); env(); g.clip(); g.fillStyle = rgba(b.c2, 0.8 * a);
          for (let k = -2; k <= 2; k += 2) g.fillRect(x + k * r * 0.4 - r * 0.1, y - r, r * 0.2, r * 2.5);
          const sh = g.createRadialGradient(x - r * 0.4, y - r * 0.4, 0, x, y, r * 1.5); sh.addColorStop(0, `rgba(255,255,255,${0.35 * a})`); sh.addColorStop(1, `rgba(0,0,0,${0.15 * a})`);
          g.fillStyle = sh; g.fillRect(x - r, y - r, r * 2, r * 2.6); g.restore();
          g.strokeStyle = `rgba(80,50,30,${0.6 * a})`; g.lineWidth = 1;
          g.beginPath(); g.moveTo(x - r * 0.28, y + r * 1.45); g.lineTo(x - r * 0.16, y + r * 1.75); g.moveTo(x + r * 0.28, y + r * 1.45); g.lineTo(x + r * 0.16, y + r * 1.75); g.stroke();
          g.fillStyle = `rgba(110,70,40,${0.85 * a})`; g.fillRect(x - r * 0.18, y + r * 1.75, r * 0.36, r * 0.26);
          if (b.burn) { const fl = 0.6 + 0.4 * Math.sin(t * 40); g.beginPath(); g.ellipse(x, y + r * 1.55, r * 0.08, r * 0.18 * fl, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,170,60,${0.9 * a})`; g.fill(); }
        }
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, h * 0.68, w, h * 0.32); g.globalAlpha = 1;
      },
    };
  },
  ebru(th) { // paint dropped on water spreading into rings, slow combed waves
    const D = []; let t = 0, next = 0;
    const add = init => D.push({ x: Math.random(), y: Math.random(), max: rand(0.12, 0.28), life: init ? rand(0, 0.6) : 0, cs: [0, 1, 2].map(() => th.blocks[(Math.random() * 7) | 0]) });
    for (let i = 0; i < 6; i++) add(true);
    return {
      step(dt) {
        t += dt; next -= dt;
        if (next <= 0) { add(false); next = rand(1.2, 2.4); }
        for (const d of D) d.life += dt / 16;
        for (let i = D.length - 1; i >= 0; i--) if (D[i].life >= 1) D.splice(i, 1);
      },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const d of D) {
          const grow = 1 - Math.pow(1 - Math.min(1, d.life * 4), 3), fade = d.life < 0.7 ? 1 : 1 - (d.life - 0.7) / 0.3;
          const R = d.max * u * grow, x = d.x * w + Math.sin(t * 0.1 + d.max * 40) * u * 0.02 * d.life, y = d.y * h;
          for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(x, y, R * (1 - k * 0.3), R * (1 - k * 0.3) * (0.9 + 0.08 * Math.sin(t * 0.3 + k)), d.life, 0, Math.PI * 2); g.fillStyle = rgba(d.cs[k], 0.12 * a * fade); g.fill(); }
          g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2); g.strokeStyle = `rgba(255,250,235,${0.12 * a * fade})`; g.lineWidth = 1.5; g.stroke();
        }
        g.strokeStyle = `rgba(255,250,235,${0.06 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const y0 = h * (0.1 + i * 0.2);
          g.beginPath(); for (let x = 0; x <= w + 12; x += 12) { const y = y0 + Math.sin(x * 0.015 + t * 0.25 + i) * u * 0.03; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        }
      },
    };
  },
  clockwork(th) { // big meshing gears, a swinging pendulum, puffs of steam
    const G = [[0.06, 0.85, 0.24, 16, 1], [0.3, 0.97, 0.13, 9, -1], [0.95, 0.12, 0.2, 14, -1], [0.78, 0.02, 0.11, 8, 1], [0.98, 0.62, 0.15, 11, 1]];
    let t = 0, acc = 0, P = [];
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.6) { acc = 0; P.push({ x: rand(0.12, 0.24), y: 1.02, life: 0 }); }
        for (const p of P) { p.y -= 0.08 * dt; p.life += dt / 6; }
        P = P.filter(p => p.life < 1);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const [x, y, r, n, dir] of G) {
          gearPath(g, x * w, y * h, r * u, n, t * 0.35 * (12 / n) * dir, 0.25);
          g.fillStyle = rgba(th.accent, 0.08 * a); g.fill('evenodd');
          g.strokeStyle = rgba(th.accent, 0.16 * a); g.lineWidth = 2; g.stroke();
        }
        const px = w * 0.5, L = h * 0.3, an = 0.32 * Math.sin(t * 1.8), bx = px + Math.sin(an) * L, by = Math.cos(an) * L;
        g.strokeStyle = rgba(th.accent, 0.22 * a); g.lineWidth = 3; g.beginPath(); g.moveTo(px, 0); g.lineTo(bx, by); g.stroke();
        const bg = g.createRadialGradient(bx - u * 0.01, by - u * 0.01, 0, bx, by, u * 0.04); bg.addColorStop(0, rgba('#fff2c0', 0.5 * a)); bg.addColorStop(1, rgba(th.accent, 0.3 * a));
        g.beginPath(); g.arc(bx, by, u * 0.04, 0, Math.PI * 2); g.fillStyle = bg; g.fill();
        for (const p of P) {
          const r = u * (0.04 + p.life * 0.12), al = Math.sin(p.life * Math.PI) * 0.08 * a;
          const gr = g.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, r); gr.addColorStop(0, `rgba(255,248,235,${al})`); gr.addColorStop(1, 'rgba(255,248,235,0)');
          g.fillStyle = gr; g.fillRect(p.x * w - r, p.y * h - r, 2 * r, 2 * r);
        }
      },
    };
  },
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
  zen(th) { // raked gravel round the rocks, koi circling a pond, maple leaves drifting
    let sand = null, sw = 0, sh = 0, t = 0;
    const ROCKS = [[0.18, 0.2, 0.06], [0.84, 0.62, 0.08], [0.9, 0.16, 0.045]];
    const POND = { x: 0.2, y: 0.88, rx: 0.34, ry: 0.13 };
    const KOI = [0, 1, 2].map(i => ({ a: i * 2.1, sp: rand(0.25, 0.4) * (i % 2 ? -1 : 1), k: rand(0.55, 0.85), c: i === 1 ? 'rgba(255,248,240,.9)' : 'rgba(255,122,58,.9)' }));
    const LV = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random(), rot: rand(0, 6.3), vr: rand(-1, 1), v: rand(0.02, 0.05), ph: rand(0, 6.3), c: ['#c8442e', '#e0782a', '#d85a3a'][(Math.random() * 3) | 0] }));
    function build(w, h) {
      sw = w; sh = h; sand = document.createElement('canvas'); sand.width = Math.ceil(w); sand.height = Math.ceil(h);
      const g = sand.getContext('2d'), u = Math.min(w, h);
      g.save(); g.beginPath(); g.rect(0, 0, w, h);
      for (const [x, y, r] of ROCKS) { const R = r * u * 2.4; g.moveTo(x * w + R, y * h); g.arc(x * w, y * h, R, 0, Math.PI * 2); }
      g.ellipse(POND.x * w, POND.y * h, POND.rx * w * 1.08, POND.ry * h * 1.25, 0, 0, Math.PI * 2);
      g.clip('evenodd');
      for (let y = 0; y < h; y += u * 0.026) {
        g.beginPath(); for (let x = 0; x <= w + 12; x += 12) { const yy = y + Math.sin(x * 0.01 + y * 0.02) * u * 0.004; x ? g.lineTo(x, yy) : g.moveTo(x, yy); }
        g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.5; g.stroke();
        g.save(); g.translate(0, 2); g.strokeStyle = 'rgba(0,0,0,.05)'; g.stroke(); g.restore();
      }
      g.restore();
      for (const [x, y, r] of ROCKS) {
        for (let k = 1; k <= 4; k++) { g.beginPath(); g.arc(x * w, y * h, r * u * (1.1 + k * 0.32), 0, Math.PI * 2); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.5; g.stroke(); }
        const gr = g.createRadialGradient(x * w - r * u * 0.3, y * h - r * u * 0.3, 0, x * w, y * h, r * u);
        gr.addColorStop(0, 'rgba(150,156,146,.8)'); gr.addColorStop(1, 'rgba(90,96,88,.8)');
        g.beginPath(); g.ellipse(x * w, y * h, r * u * 1.1, r * u * 0.85, 0.3, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      }
      g.beginPath(); g.ellipse(POND.x * w, POND.y * h, POND.rx * w, POND.ry * h, 0, 0, Math.PI * 2);
      g.fillStyle = 'rgba(70,120,110,.35)'; g.fill(); g.strokeStyle = 'rgba(110,116,104,.35)'; g.lineWidth = 3; g.stroke();
    }
    return {
      step(dt) {
        t += dt;
        for (const f of KOI) f.a += f.sp * dt;
        for (const l of LV) { l.y += l.v * dt; l.x += Math.sin(t * 1.3 + l.ph) * 0.02 * dt; l.rot += l.vr * dt; if (l.y > 1.05) { l.y = -0.05; l.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        if (!sand || Math.abs(w - sw) > 1 || Math.abs(h - sh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(sand, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        g.save(); g.beginPath(); g.ellipse(POND.x * w, POND.y * h, POND.rx * w, POND.ry * h, 0, 0, Math.PI * 2); g.clip();
        g.globalAlpha = a;
        for (const f of KOI) {
          const x = POND.x * w + Math.cos(f.a) * POND.rx * w * f.k, y = POND.y * h + Math.sin(f.a) * POND.ry * h * f.k;
          const ang = Math.atan2(Math.cos(f.a) * POND.ry * h * f.sp, -Math.sin(f.a) * POND.rx * w * f.sp);
          koiShape(g, x, y, u * 0.035, ang, f.c, Math.sin(t * 6 + f.a));
        }
        g.restore();
        for (const l of LV) { mapleShape(g, l.x * w, l.y * h, u * 0.018, l.rot); g.fillStyle = rgba(l.c, 0.7 * a); g.fill(); }
      },
    };
  },
  lavalamp(th) { // groovy seventies bands and big slow blobs of light
    let bands = null, bw = 0, bh = 0, t = 0;
    const BL = [...Array(7)].map((_, i) => ({ x: rand(0.05, 0.95), ph: rand(0, 6.3), sp: rand(0.12, 0.25), r: rand(0.1, 0.18), c: th.blocks[i % 7] }));
    function build(w, h) {
      bw = w; bh = h; bands = document.createElement('canvas'); bands.width = Math.ceil(w); bands.height = Math.ceil(h);
      const g = bands.getContext('2d'), u = Math.max(w, h), cols = ['rgba(255,138,42,.1)', 'rgba(232,176,58,.09)', 'rgba(168,64,42,.1)'];
      g.lineWidth = u * 0.07;
      cols.forEach((c, i) => {
        g.strokeStyle = c;
        g.beginPath(); g.arc(0, h, u * (0.42 + i * 0.08), -Math.PI / 2, 0); g.stroke();
        g.beginPath(); g.arc(w, 0, u * (0.3 + i * 0.08), Math.PI / 2, Math.PI); g.stroke();
      });
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        if (!bands || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(bands, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const b of BL) {
          const x = (b.x + Math.sin(t * 0.1 + b.ph) * 0.04) * w, y = (0.5 + 0.45 * Math.sin(t * b.sp + b.ph)) * h, r = b.r * u * (1 + 0.15 * Math.cos(t * b.sp * 2 + b.ph));
          const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(b.c, 0.32 * a)); gr.addColorStop(0.6, rgba(b.c, 0.16 * a)); gr.addColorStop(1, rgba(b.c, 0));
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
});

/* ---------- Third theme set, part 2: block looks and textures ---------- */
Object.assign(STYLES, {
  cloud: {
    block(g, s, c) {
      cloudPath(g, s, s * 0.045); g.fillStyle = shade(c, -0.22); g.fill();
      cloudPath(g, s);
      const gr = g.createLinearGradient(0, s * 0.08, 0, s * 0.88); gr.addColorStop(0, mixHex(c, '#ffffff', 0.55)); gr.addColorStop(1, c);
      g.fillStyle = gr; g.fill();
      g.save(); cloudPath(g, s); g.clip(); TEX.cloud(g, s, c, seeded(c), 1); g.restore();
    },
  },
  metal: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.07); g.fillStyle = shade(c, -0.5); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.06); g.fillStyle = c; g.fill();
      g.save(); g.clip(); TEX.metal(g, s, c, seeded(c), 1);
      g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(0, 0, s, s * 0.07); g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(0, s * 0.84, s, s * 0.16);
      g.restore();
    },
  },
  tiki: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.14); g.fillStyle = shade(c, -0.35); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.12); g.fillStyle = c; g.fill();
      g.save(); g.clip(); TEX.tiki(g, s, c, seeded(c), 1); g.restore();
    },
  },
  fossil: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = shade(c, -0.45); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.08); g.fillStyle = c; g.fill();
      g.save(); g.clip(); TEX.fossil(g, s, c, seeded(c), 1); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(0, 0, s, s * 0.08); g.restore();
    },
  },
  lacquer: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.14);
      const gl = g.createLinearGradient(0, 0, s, s); gl.addColorStop(0, '#f6e08a'); gl.addColorStop(0.5, '#b8902c'); gl.addColorStop(1, '#e8c860');
      g.fillStyle = gl; g.fill();
      rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.82, s * 0.1);
      const gr = g.createRadialGradient(s * 0.38, s * 0.3, s * 0.04, s * 0.5, s * 0.55, s * 0.65);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.25)); gr.addColorStop(0.5, c); gr.addColorStop(1, shade(c, -0.45));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.lacquer(g, s, c, seeded(c), 1); g.restore();
    },
  },
  maple: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.16); g.fillStyle = shade(c, -0.38); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, shade(c, 0.18)); gr.addColorStop(1, shade(c, -0.1));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.14); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'maple', 1, 0.07, 0.14);
    },
  },
  sushi: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.06, s * 0.92, s * 0.9, s * 0.24); g.fillStyle = '#c9bca8'; g.fill();
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.24); g.fillStyle = '#f7f2ea'; g.fill();
      g.save(); g.clip();
      const rnd = seeded(c);
      g.strokeStyle = 'rgba(170,158,136,.55)'; g.lineWidth = Math.max(0.6, s * 0.01);
      for (let i = 0; i < 34; i++) { g.save(); g.translate(rnd() * s, rnd() * s); g.rotate(rnd() * 3.14); g.beginPath(); g.ellipse(0, 0, s * 0.035, s * 0.016, 0, 0, Math.PI * 2); g.stroke(); g.restore(); }
      g.restore();
      rr(g, s * 0.13, s * 0.12, s * 0.74, s * 0.7, s * 0.2);
      const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, mixHex(c, '#ffffff', 0.25)); gr.addColorStop(0.5, c); gr.addColorStop(1, shade(c, -0.15));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.sushi(g, s, c, seeded(c), 1); g.restore();
      if (rnd() < 0.45) { // a strip of nori round the middle
        g.fillStyle = '#1c281e'; g.fillRect(s * 0.42, s * 0.05, s * 0.16, s * 0.87);
        g.fillStyle = 'rgba(120,150,110,.25)'; for (let y = s * 0.1; y < s * 0.9; y += s * 0.08) g.fillRect(s * 0.42, y, s * 0.16, Math.max(0.6, s * 0.01));
      }
    },
  },
  spray: {
    block(g, s, c) {
      const rnd = seeded(c);
      for (let i = 0; i < 70; i++) { g.globalAlpha = 0.25 + rnd() * 0.35; g.fillStyle = c; const r = Math.max(0.6, s * (0.006 + rnd() * 0.012)); g.fillRect(s * (0.02 + rnd() * 0.96), s * (0.02 + rnd() * 0.96), r, r); }
      g.globalAlpha = 1;
      for (let i = 0; i < 1 + ((rnd() * 2) | 0); i++) { // paint drips
        const x = s * (0.2 + rnd() * 0.6), len = s * (0.06 + rnd() * 0.08), dw = s * 0.05;
        g.fillStyle = c; g.fillRect(x - dw / 2, s * 0.8, dw, len); g.beginPath(); g.arc(x, s * 0.8 + len, dw * 0.65, 0, Math.PI * 2); g.fill();
      }
      rr(g, s * 0.09, s * 0.08, s * 0.82, s * 0.78, s * 0.12); g.fillStyle = c; g.fill();
      g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = Math.max(1, s * 0.03); g.stroke();
      g.save(); g.clip(); TEX.spray(g, s, c, seeded(c), 1); g.restore();
    },
  },
  marquee: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.5); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.1); g.fillStyle = shade(c, -0.2); g.fill();
      const gr = g.createLinearGradient(0, s * 0.2, 0, s * 0.8); gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, c);
      rr(g, s * 0.21, s * 0.2, s * 0.58, s * 0.56, s * 0.06); g.fillStyle = gr; g.fill();
      TEX.marquee(g, s, c, seeded(c), 1);
    },
  },
  gelato: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.06, s * 0.9, s * 0.88, s * 0.3); g.fillStyle = shade(c, -0.2); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.32, s * 0.05, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.45)); gr.addColorStop(0.65, c); gr.addColorStop(1, shade(c, -0.06));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.84, s * 0.3); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'gelato', 1, 0.06, 0.3);
    },
  },
});

Object.assign(TEX, {
  cloud(g, s, c, rnd, k) { // sunlit puffs on top, a soft shadowed base
    g.fillStyle = `rgba(255,255,255,${0.45 * k})`;
    for (const [x, y, r] of CLOUD.slice(0, 3)) { g.beginPath(); g.arc(s * (x - r * 0.25), s * (y - r * 0.3), s * r * 0.45, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = `rgba(0,0,0,${0.06 * k})`; g.fillRect(0, s * 0.78, s, s * 0.22);
  },
  metal(g, s, c, rnd, k) { // brushed plate with four slotted screws
    for (let y = 0; y < s; y += Math.max(1, s / 36)) {
      g.fillStyle = rnd() < 0.5 ? `rgba(255,255,255,${(0.03 + rnd() * 0.08) * k})` : `rgba(0,0,0,${(0.03 + rnd() * 0.08) * k})`;
      g.fillRect(0, y, s, Math.max(0.6, s / 72));
    }
    for (const [x, y] of [[0.16, 0.16], [0.84, 0.16], [0.16, 0.8], [0.84, 0.8]]) {
      g.beginPath(); g.arc(s * x, s * y, s * 0.07, 0, Math.PI * 2); g.fillStyle = `rgba(30,34,40,${0.45 * k})`; g.fill();
      g.beginPath(); g.arc(s * x - s * 0.01, s * y - s * 0.01, s * 0.052, 0, Math.PI * 2); g.fillStyle = `rgba(230,236,242,${0.6 * k})`; g.fill();
      g.save(); g.translate(s * x - s * 0.01, s * y - s * 0.01); g.rotate(0.7 + rnd()); g.fillStyle = `rgba(30,34,40,${0.6 * k})`; g.fillRect(-s * 0.042, -s * 0.009, s * 0.084, s * 0.018); g.restore();
    }
  },
  tiki(g, s, c, rnd, k) { // two bamboo stalks side by side: round shading, fibres, a node each
    const sw = s / 2;
    for (let i = 0; i < 2; i++) {
      const x = i * sw, gr = g.createLinearGradient(x, 0, x + sw, 0);
      gr.addColorStop(0, `rgba(0,0,0,${0.22 * k})`); gr.addColorStop(0.35, `rgba(255,255,230,${0.22 * k})`); gr.addColorStop(1, `rgba(0,0,0,${0.25 * k})`);
      g.fillStyle = gr; g.fillRect(x, 0, sw, s);
      const ny = s * (0.3 + rnd() * 0.4);
      g.fillStyle = `rgba(60,30,0,${0.35 * k})`; g.fillRect(x, ny, sw, Math.max(1, s * 0.035));
      g.fillStyle = `rgba(255,250,220,${0.35 * k})`; g.fillRect(x, ny + s * 0.035, sw, Math.max(1, s * 0.02));
      g.strokeStyle = `rgba(60,30,0,${0.12 * k})`; g.lineWidth = Math.max(0.6, s * 0.008);
      for (let f = 0; f < 3; f++) { const fx = x + sw * (0.25 + f * 0.25); g.beginPath(); g.moveTo(fx, 0); g.lineTo(fx, s); g.stroke(); }
    }
  },
  fossil(g, s, c, rnd, k) { // rock strata with an ammonite or a bone pressed into it
    for (let i = 0; i < 4; i++) {
      const y = s * (0.15 + i * 0.24 + rnd() * 0.05);
      g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(s * 0.3, y + (rnd() - 0.5) * s * 0.1, s * 0.6, y + (rnd() - 0.5) * s * 0.1, s, y);
      g.lineTo(s, y + s * 0.07); g.lineTo(0, y + s * 0.07); g.closePath();
      g.fillStyle = i % 2 ? `rgba(0,0,0,${0.1 * k})` : `rgba(255,240,210,${0.1 * k})`; g.fill();
    }
    speckle(g, s, rnd, 24, 0.004, 0.01, () => `rgba(40,20,0,${0.2 * k})`);
    const kind = rnd() < 0.6 ? 0 : 1, rot = rnd() * 6.3;
    const shape = () => {
      g.beginPath();
      if (kind === 0) {
        for (let an = 0; an < Math.PI * 5; an += 0.2) { const r = s * 0.27 * Math.exp(-0.17 * an), x = Math.cos(an + rot) * r, y = Math.sin(an + rot) * r; an ? g.lineTo(s * 0.5 + x, s * 0.52 + y) : g.moveTo(s * 0.5 + x, s * 0.52 + y); }
        for (let an = 0; an < Math.PI * 2; an += 0.45) { const r = s * 0.27 * Math.exp(-0.17 * an), cx = Math.cos(an + rot), cy = Math.sin(an + rot); g.moveTo(s * 0.5 + cx * r, s * 0.52 + cy * r); g.lineTo(s * 0.5 + cx * r * 0.72, s * 0.52 + cy * r * 0.72); }
      } else {
        const L = s * 0.24, kr = s * 0.05, ca = Math.cos(rot), sa = Math.sin(rot), P = (x, y) => [s * 0.5 + x * ca - y * sa, s * 0.52 + x * sa + y * ca];
        g.moveTo(...P(-L, 0)); g.lineTo(...P(L, 0));
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const [x, y] = P(sx * L, sy * kr * 0.8); g.moveTo(x + kr, y); g.arc(x, y, kr, 0, Math.PI * 2); }
      }
    };
    carved(g, shape, Math.max(1, s * 0.03), `rgba(255,245,220,${0.45 * k})`, `rgba(50,30,15,${0.55 * k})`);
  },
  lacquer(g, s, c, rnd, k) { // glossy shine, a gold note and a gold inner line
    g.beginPath(); g.ellipse(s * 0.38, s * 0.2, s * 0.26, s * 0.06, -0.2, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.35 * k})`; g.fill();
    g.fillStyle = `rgba(255,214,110,${0.75 * k})`; noteShape(g, s * 0.5, s * 0.52, s * 0.26);
    rr(g, s * 0.16, s * 0.16, s * 0.68, s * 0.68, s * 0.06); g.strokeStyle = `rgba(255,214,110,${0.5 * k})`; g.lineWidth = Math.max(1, s * 0.02); g.stroke();
  },
  maple(g, s, c, rnd, k) { // mottled autumn colour and a pale maple leaf with its veins
    speckle(g, s, rnd, 30, 0.01, 0.04, () => rnd() < 0.5 ? `rgba(255,220,120,${0.12 * k})` : `rgba(80,20,0,${0.14 * k})`);
    const rot = (rnd() - 0.5) * 0.8, r = s * 0.36;
    mapleShape(g, s * 0.5, s * 0.5, r, rot); g.fillStyle = `rgba(255,236,190,${0.32 * k})`; g.fill();
    g.save(); g.translate(s * 0.5, s * 0.5); g.rotate(rot);
    g.strokeStyle = `rgba(110,40,10,${0.4 * k})`; g.lineWidth = Math.max(1, s * 0.015); g.beginPath();
    for (const [x, y] of [[0, -0.85], [0.75, -0.35], [0.7, 0.2], [-0.75, -0.35], [-0.7, 0.2], [0, 0.95]]) { g.moveTo(0, r * 0.3); g.lineTo(x * r, y * r); }
    g.stroke(); g.restore();
  },
  sushi(g, s, c, rnd, k) { // the white lines of fat running through raw fish, a glaze
    g.strokeStyle = `rgba(255,255,255,${0.45 * k})`; g.lineWidth = Math.max(1, s * 0.035); g.lineCap = 'round';
    for (let i = -2; i <= 3; i++) { const x = s * (i * 0.2 + rnd() * 0.05); g.beginPath(); g.moveTo(x, s); g.quadraticCurveTo(x + s * 0.25, s * 0.5, x + s * 0.45, 0); g.stroke(); }
    g.beginPath(); g.ellipse(s * 0.36, s * 0.26, s * 0.2, s * 0.05, -0.4, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.3 * k})`; g.fill();
  },
  spray(g, s, c, rnd, k) { // spray grain, a darker lower edge, a white shine stroke
    speckle(g, s, rnd, 40, 0.003, 0.008, () => rnd() < 0.5 ? `rgba(255,255,255,${0.25 * k})` : `rgba(0,0,0,${0.2 * k})`);
    const gr = g.createLinearGradient(0, s * 0.4, 0, s); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${0.22 * k})`);
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
    g.strokeStyle = `rgba(255,255,255,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.045); g.lineCap = 'round';
    g.beginPath(); g.moveTo(s * 0.2, s * 0.36); g.quadraticCurveTo(s * 0.22, s * 0.2, s * 0.38, s * 0.18); g.stroke();
    g.beginPath(); g.arc(s * 0.48, s * 0.18, Math.max(0.8, s * 0.025), 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.8 * k})`; g.fill();
  },
  marquee(g, s, c, rnd, k) { // a ring of light bulbs, every other one lit
    const P = [0.13, 0.37, 0.63, 0.87], pts = [];
    for (const v of P) pts.push([v, 0.13]); for (const v of P.slice(1)) pts.push([0.87, v]);
    for (const v of P.slice(0, 3).reverse()) pts.push([v, 0.87]); for (const v of [0.63, 0.37]) pts.push([0.13, v]);
    const r = s * 0.045;
    pts.forEach(([x, y], i) => {
      const lit = i % 2 === 0;
      if (lit) { const gl = g.createRadialGradient(s * x, s * y, 0, s * x, s * y, r * 2.6); gl.addColorStop(0, `rgba(255,240,170,${0.7 * k})`); gl.addColorStop(1, 'rgba(255,240,170,0)'); g.fillStyle = gl; g.fillRect(s * x - r * 2.6, s * y - r * 2.6, r * 5.2, r * 5.2); }
      g.beginPath(); g.arc(s * x, s * y, r, 0, Math.PI * 2); g.fillStyle = lit ? `rgba(255,250,215,${k})` : `rgba(255,240,200,${0.35 * k})`; g.fill();
    });
    g.beginPath(); g.ellipse(s * 0.4, s * 0.3, s * 0.14, s * 0.04, -0.2, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.35 * k})`; g.fill();
  },
  gelato(g, s, c, rnd, k) { // ridges left by the spatula, flecks of vanilla or nut, a creamy shine
    g.lineCap = 'round'; g.lineWidth = Math.max(1, s * 0.03);
    for (let i = 0; i < 3; i++) {
      const y = s * (0.3 + i * 0.2 + rnd() * 0.04);
      const ridge = dy => { g.beginPath(); g.moveTo(s * 0.12, y + s * 0.04 + dy); g.quadraticCurveTo(s * 0.5, y - s * 0.12 + dy, s * 0.88, y + s * 0.02 + dy); };
      ridge(s * 0.035); g.strokeStyle = `rgba(0,0,0,${0.08 * k})`; g.stroke();
      ridge(0); g.strokeStyle = `rgba(255,255,255,${0.4 * k})`; g.stroke();
    }
    speckle(g, s, rnd, 14, 0.006, 0.012, () => `rgba(80,40,20,${0.35 * k})`);
    g.beginPath(); g.ellipse(s * 0.34, s * 0.22, s * 0.16, s * 0.05, -0.4, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.4 * k})`; g.fill();
  },
});

/* ---------- Third theme set, part 2: living backgrounds ---------- */
Object.assign(AMBIENTS, {
  sky(th) { // a faint rainbow, drifting clouds, a few birds
    const CL = [...Array(7)].map(() => ({ x: Math.random() * 1.4 - 0.2, y: rand(0.05, 0.85), s: rand(0.5, 1.2), v: rand(0.006, 0.018), P: [...Array(5)].map((_, i) => [(i - 2) * 0.3 + rand(-0.06, 0.06), (i % 2 ? rand(-0.14, -0.04) : rand(-0.02, 0.04)), rand(0.22, 0.34)]) }));
    const BD = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.1, 0.45), v: rand(0.02, 0.04), ph: rand(0, 6.3), s: rand(0.7, 1.2) }));
    const RB = ['#ff6a6a', '#ffb04a', '#ffe46a', '#7ae08a', '#6ab8ff', '#a88aff'];
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const c of CL) { c.x += c.v * dt; if (c.x > 1.4) c.x = -0.4; }
        for (const b of BD) { b.x += b.v * dt; b.ph += dt * 8; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.1, 0.45); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h);
        g.lineWidth = M * 0.025;
        RB.forEach((c, i) => { g.beginPath(); g.arc(w * 0.5, h * 1.05, M * (0.75 - i * 0.025), Math.PI, Math.PI * 2); g.strokeStyle = rgba(c, 0.1 * a); g.stroke(); });
        for (const c of CL) {
          const cx = c.x * w, cy = c.y * h, base = u * 0.12 * c.s;
          g.beginPath(); for (const [px, py, pr] of c.P) { const x = cx + px * base * 2, y = cy + py * base * 2; g.moveTo(x + pr * base * 2, y); g.arc(x, y, pr * base * 2, 0, Math.PI * 2); }
          g.fillStyle = `rgba(255,255,255,${0.6 * a})`; g.fill();
        }
        g.strokeStyle = `rgba(40,60,90,${0.45 * a})`; g.lineWidth = 1.6;
        for (const b of BD) {
          const x = b.x * w, y = b.y * h, bs = u * 0.018 * b.s, f = Math.sin(b.ph) * 0.5 + 0.5;
          g.beginPath(); g.moveTo(x - bs, y - bs * 0.3 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.6 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.6 * f, x + bs, y - bs * 0.3 * f); g.stroke();
        }
      },
    };
  },
  factory(th) { // a rotating beacon, a welding robot arm, a conveyor belt of crates
    let t = 0, spk = [], swait = rand(1, 3);
    const BOX = [...Array(6)].map((_, i) => ({ x: i / 6, c: th.blocks[(Math.random() * 7) | 0], s: rand(0.7, 1) }));
    return {
      step(dt) {
        t += dt;
        for (const b of BOX) { b.x += 0.05 * dt; if (b.x > 1.1) { b.x -= 1.2; b.c = th.blocks[(Math.random() * 7) | 0]; } }
        swait -= dt;
        if (swait < 0) { swait = rand(1.5, 4); if (!state.REDUCED) for (let i = 0; i < 22; i++) spk.push({ x: 0, y: 0, vx: rand(-0.25, 0.25), vy: rand(-0.35, 0.05), life: 0, max: rand(0.4, 0.9) }); }
        for (const p of spk) { p.life += dt; p.vy += 0.9 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        spk = spk.filter(p => p.life < p.max);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const bx = w * 0.1, by = h * 0.06, R = u * 0.5;
        g.save(); g.translate(bx, by); g.rotate(t * 2.4);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, R); gr.addColorStop(0, rgba(th.accent, 0.2 * a)); gr.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, -0.3, 0.3); g.closePath(); g.fill(); g.restore();
        g.beginPath(); g.arc(bx, by, u * 0.02, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.8 * a); g.fill();
        const ax = w * 0.86, ay = h * 0.74, a1 = -1.9 + 0.35 * Math.sin(t * 0.7), a2 = a1 + 1.2 + 0.5 * Math.sin(t * 0.7 + 1), L1 = u * 0.22, L2 = u * 0.17;
        const ex = ax + Math.cos(a1) * L1, ey = ay + Math.sin(a1) * L1, tx = ex + Math.cos(a2) * L2, ty = ey + Math.sin(a2) * L2;
        g.fillStyle = `rgba(150,160,175,${0.3 * a})`; g.fillRect(ax - u * 0.05, ay, u * 0.1, h - ay);
        g.lineCap = 'round'; g.strokeStyle = `rgba(150,160,175,${0.35 * a})`; g.lineWidth = u * 0.035;
        g.beginPath(); g.moveTo(ax, ay); g.lineTo(ex, ey); g.lineTo(tx, ty); g.stroke();
        g.fillStyle = `rgba(170,180,195,${0.45 * a})`; for (const [x, y] of [[ax, ay], [ex, ey]]) { g.beginPath(); g.arc(x, y, u * 0.03, 0, Math.PI * 2); g.fill(); }
        const cl = 0.4 + 0.2 * Math.sin(t * 2);
        g.strokeStyle = rgba(th.accent, 0.5 * a); g.lineWidth = u * 0.012;
        g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a2 - cl) * u * 0.04, ty + Math.sin(a2 - cl) * u * 0.04); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a2 + cl) * u * 0.04, ty + Math.sin(a2 + cl) * u * 0.04); g.stroke();
        g.lineCap = 'butt';
        for (const p of spk) { const k = 1 - p.life / p.max; g.fillStyle = `rgba(255,${(180 + 70 * k) | 0},90,${k * a})`; g.fillRect(tx + p.x * u, ty + p.y * u, 2, 2); }
        const cy = h * 0.9, ch = h * 0.035, sp = u * 0.05, off = (t * 0.05 * w) % sp;
        g.fillStyle = `rgba(20,22,26,${0.85 * a})`; g.fillRect(0, cy, w, ch);
        g.strokeStyle = `rgba(120,130,140,${0.35 * a})`; g.lineWidth = 2;
        g.beginPath(); for (let x = -sp + off; x < w + sp; x += sp) { g.moveTo(x, cy); g.lineTo(x, cy + ch); } g.stroke();
        g.lineWidth = 1;
        for (const b of BOX) { const bs = u * 0.06 * b.s; g.fillStyle = rgba(b.c, 0.55 * a); g.fillRect(b.x * w, cy - bs, bs, bs); g.strokeStyle = `rgba(0,0,0,${0.3 * a})`; g.strokeRect(b.x * w, cy - bs, bs, bs); }
        g.save(); g.beginPath(); g.rect(0, cy + ch, w, h - cy - ch); g.clip();
        g.fillStyle = rgba(th.accent, 0.22 * a); const hh = h - cy;
        for (let x = -hh; x < w; x += u * 0.06) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + u * 0.03, h); g.lineTo(x + u * 0.03 + hh, cy); g.lineTo(x + hh, cy); g.fill(); }
        g.restore();
      },
    };
  },
  island(th) { // sun, rolling sea, palms leaning in from both sides, gulls
    let t = 0;
    const GU = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.08, 0.3), v: rand(0.02, 0.04), ph: rand(0, 6.3) }));
    return {
      step(dt) { t += dt; for (const b of GU) { b.x += b.v * dt; b.ph += dt * 6; if (b.x > 1.1) b.x = -0.1; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sy = h * 0.74, sx = w * 0.78, sr = u * 0.09, syy = h * 0.14;
        const gl = g.createRadialGradient(sx, syy, 0, sx, syy, sr * 3.5); gl.addColorStop(0, `rgba(255,240,180,${0.7 * a})`); gl.addColorStop(1, 'rgba(255,240,180,0)');
        g.fillStyle = gl; g.fillRect(sx - sr * 3.5, syy - sr * 3.5, sr * 7, sr * 7);
        g.beginPath(); g.arc(sx, syy, sr, 0, Math.PI * 2); g.fillStyle = `rgba(255,250,220,${0.9 * a})`; g.fill();
        const sea = g.createLinearGradient(0, sy, 0, h); sea.addColorStop(0, `rgba(30,150,170,${0.35 * a})`); sea.addColorStop(1, `rgba(20,110,140,${0.5 * a})`);
        g.fillStyle = sea; g.fillRect(0, sy, w, h - sy);
        g.strokeStyle = `rgba(255,255,255,${0.45 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const y0 = sy + (h - sy) * (0.1 + i * 0.2);
          g.beginPath(); for (let x = 0; x <= w + 10; x += 10) { const y = y0 + Math.sin(x * 0.03 + t * (1 + i * 0.2) + i) * u * 0.006; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        }
        palm(g, w * 0.04, h * 0.98, u * 0.5, 1, Math.sin(t * 0.8) * 0.05, a);
        palm(g, w * 0.96, h * 0.98, u * 0.45, -1, Math.sin(t * 0.8 + 2) * 0.05, a);
        g.strokeStyle = `rgba(40,60,60,${0.5 * a})`; g.lineWidth = 1.6;
        for (const b of GU) {
          const x = b.x * w, y = b.y * h, bs = u * 0.02, f = Math.sin(b.ph) * 0.5 + 0.5;
          g.beginPath(); g.moveTo(x - bs, y - bs * 0.3 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.6 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.6 * f, x + bs, y - bs * 0.3 * f); g.stroke();
        }
      },
    };
  },
  prehistoric(th) { // a smoking volcano on the horizon, ferns, gliding pterosaurs
    let land = null, lw = 0, lh = 0, t = 0, acc = 0, SM = [];
    const PT = [0, 1].map(i => ({ x: Math.random(), y: rand(0.1, 0.32), v: rand(0.015, 0.03) * (i ? -1 : 1), ph: rand(0, 6.3), s: rand(0.8, 1.2) }));
    const CR = [0.78, 0.46];
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d'), u = Math.min(w, h), hy = h * 0.72;
      g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w + 10; x += 10) g.lineTo(x, hy - Math.abs(Math.sin(x * 0.006)) * h * 0.08 - Math.sin(x * 0.02) * h * 0.015); g.lineTo(w, h); g.closePath();
      g.fillStyle = 'rgba(90,60,40,.28)'; g.fill();
      g.beginPath(); g.moveTo(w * 0.58, hy); g.lineTo(w * (CR[0] - 0.05), h * CR[1]); g.lineTo(w * (CR[0] + 0.05), h * CR[1]); g.lineTo(w * 1.02, hy); g.closePath();
      g.fillStyle = 'rgba(70,45,30,.5)'; g.fill();
      g.strokeStyle = 'rgba(30,50,25,.5)'; g.lineCap = 'round';
      for (let i = 0; i < 14; i++) {
        const x = (i + Math.random()) / 14 * w, dir = Math.random() < 0.5 ? -1 : 1, H = u * rand(0.14, 0.26), ex = x + dir * H * 0.45, ey = h - H;
        g.lineWidth = 2; g.beginPath(); g.moveTo(x, h); g.quadraticCurveTo(x, h - H * 0.7, ex, ey); g.stroke();
        g.lineWidth = 1.5;
        for (let j = 1; j < 9; j++) {
          const q = j / 9, px = (1 - q) * (1 - q) * x + 2 * (1 - q) * q * x + q * q * ex, py = (1 - q) * (1 - q) * h + 2 * (1 - q) * q * (h - H * 0.7) + q * q * ey, L = H * 0.22 * (1 - q * 0.7);
          g.beginPath(); g.moveTo(px - L, py - L * 0.3); g.lineTo(px, py); g.lineTo(px + L, py - L * 0.3); g.stroke();
        }
      }
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.5) { acc = 0; SM.push({ x: CR[0] + rand(-0.01, 0.01), y: CR[1], life: 0 }); }
        for (const p of SM) { p.y -= 0.025 * dt; p.x += 0.008 * dt; p.life += dt / 8; }
        SM = SM.filter(p => p.life < 1);
        for (const p of PT) { p.x += p.v * dt; p.ph += dt * 3; if (p.x > 1.2) p.x = -0.2; if (p.x < -0.2) p.x = 1.2; }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const p of SM) {
          const r = u * (0.03 + p.life * 0.12), al = Math.sin(p.life * Math.PI) * 0.16 * a;
          const gr = g.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, r); gr.addColorStop(0, `rgba(120,100,90,${al})`); gr.addColorStop(1, 'rgba(120,100,90,0)');
          g.fillStyle = gr; g.fillRect(p.x * w - r, p.y * h - r, 2 * r, 2 * r);
        }
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        const pulse = 0.7 + 0.3 * Math.sin(t * 1.5), cx = CR[0] * w, cy = CR[1] * h, R = u * 0.12;
        const gl = g.createRadialGradient(cx, cy, 0, cx, cy, R); gl.addColorStop(0, rgba(th.accent, 0.45 * a * pulse)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        g.fillStyle = `rgba(40,25,15,${0.6 * a})`;
        for (const p of PT) {
          const x = p.x * w, y = p.y * h, bs = u * 0.04 * p.s, f = Math.sin(p.ph) * 0.4, dir = p.v > 0 ? 1 : -1;
          g.save(); g.translate(x, y); g.scale(dir, 1);
          g.beginPath(); g.moveTo(-bs * 0.1, 0); g.quadraticCurveTo(-bs * 0.5, -bs * (0.3 + f), -bs * 1.4, -bs * (0.15 + f)); g.lineTo(-bs * 0.25, bs * 0.12); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(bs * 0.1, 0); g.quadraticCurveTo(bs * 0.5, -bs * (0.3 + f), bs * 1.4, -bs * (0.15 + f)); g.lineTo(bs * 0.25, bs * 0.12); g.closePath(); g.fill();
          g.beginPath(); g.ellipse(0, bs * 0.04, bs * 0.32, bs * 0.1, 0, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.moveTo(bs * 0.28, 0); g.lineTo(bs * 0.6, bs * 0.06); g.lineTo(bs * 0.3, bs * 0.1); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(bs * 0.3, -bs * 0.02); g.lineTo(bs * 0.12, -bs * 0.22); g.lineTo(bs * 0.22, -bs * 0.02); g.closePath(); g.fill();
          g.restore();
        }
      },
    };
  },
  musicbox(th) { // a turning pin cylinder under its comb, notes rising
    const N2 = [...Array(14)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.02, 0.05), ph: rand(0, 6.3), s: rand(0.6, 1.2), c: Math.random() < 0.5 ? th.accent : th.blocks[(Math.random() * 7) | 0] }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const n of N2) { n.y -= n.v * dt; if (n.y < -0.05) { n.y = 1.05; n.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h);
        const sp = g.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, M * 0.6); sp.addColorStop(0, rgba(th.accent, 0.08 * a)); sp.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = sp; g.fillRect(0, 0, w, h);
        for (const n of N2) { g.fillStyle = rgba(n.c, 0.4 * a); noteShape(g, (n.x + Math.sin(t + n.ph) * 0.02) * w, n.y * h, u * 0.03 * n.s); }
        const cy = h * 0.9, ch = u * 0.07;
        const cg = g.createLinearGradient(0, cy - ch / 2, 0, cy + ch / 2); cg.addColorStop(0, `rgba(246,224,138,${0.35 * a})`); cg.addColorStop(0.5, `rgba(184,144,44,${0.35 * a})`); cg.addColorStop(1, `rgba(120,90,30,${0.35 * a})`);
        g.fillStyle = cg; g.fillRect(0, cy - ch / 2, w, ch);
        const gap = u * 0.035, pos = t * u * 0.06, base = Math.floor(pos / gap), off = pos - base * gap;
        g.fillStyle = `rgba(255,240,190,${0.6 * a})`;
        for (let j = -1; j * gap < w + gap; j++) for (let r = 0; r < 4; r++) if (((j + base) * 7 + r * 3) % 5 === 0) g.fillRect(j * gap - off, cy - ch * 0.35 + r * ch * 0.22, 2.5, 2.5);
        g.strokeStyle = `rgba(220,220,230,${0.25 * a})`; g.lineWidth = 2;
        g.beginPath(); for (let x = u * 0.04; x < w; x += u * 0.025) { g.moveTo(x, cy - ch * 1.3); g.lineTo(x, cy - ch * 0.55); } g.stroke();
      },
    };
  },
  autumn(th) { // misty tree trunks, maple leaves blown about by gusts
    let trees = null, tw = 0, th2 = 0, t = 0;
    const LV = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), rot: rand(0, 6.3), vr: rand(-1.5, 1.5), v: rand(0.03, 0.07), ph: rand(0, 6.3), s: rand(0.6, 1.2), c: th.blocks[(Math.random() * 7) | 0] }));
    function build(w, h) {
      tw = w; th2 = h; trees = document.createElement('canvas'); trees.width = Math.ceil(w); trees.height = Math.ceil(h);
      const g = trees.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 9; i++) {
        const x = (i + Math.random()) / 9 * w, tw2 = u * rand(0.03, 0.07), al = rand(0.15, 0.35);
        g.fillStyle = `rgba(20,10,4,${al})`; g.strokeStyle = `rgba(20,10,4,${al})`;
        g.beginPath(); g.moveTo(x - tw2, h); g.lineTo(x - tw2 * 0.4, 0); g.lineTo(x + tw2 * 0.4, 0); g.lineTo(x + tw2, h); g.closePath(); g.fill();
        g.lineCap = 'round';
        for (let j = 0; j < 3; j++) { const by = h * rand(0.1, 0.5), dir = Math.random() < 0.5 ? -1 : 1; g.lineWidth = tw2 * 0.3; g.beginPath(); g.moveTo(x, by); g.quadraticCurveTo(x + dir * u * 0.08, by - u * 0.04, x + dir * u * 0.16, by - u * 0.12); g.stroke(); }
      }
    }
    return {
      step(dt) {
        t += dt;
        const wind = 0.05 * Math.sin(t * 0.3) + 0.03 * Math.sin(t * 1.1);
        for (const l of LV) { l.y += l.v * dt; l.x += (wind + Math.sin(t * 1.5 + l.ph) * 0.02) * dt; l.rot += l.vr * dt; if (l.y > 1.05) { l.y = -0.05; l.x = Math.random(); } if (l.x > 1.05) l.x = -0.05; if (l.x < -0.05) l.x = 1.05; }
      },
      draw(g, w, h, a) {
        if (!trees || Math.abs(w - tw) > 1 || Math.abs(h - th2) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(trees, 0, 0, w, h); g.globalAlpha = 1;
        for (let i = 0; i < 2; i++) {
          const y = h * (0.7 + i * 0.15), off = Math.sin(t * 0.15 + i) * w * 0.1;
          const fg = g.createLinearGradient(0, y - h * 0.1, 0, y + h * 0.1); fg.addColorStop(0, 'rgba(255,220,180,0)'); fg.addColorStop(0.5, `rgba(255,220,180,${0.08 * a})`); fg.addColorStop(1, 'rgba(255,220,180,0)');
          g.fillStyle = fg; g.fillRect(off - w * 0.2, y - h * 0.1, w * 1.4, h * 0.2);
        }
        const u = Math.min(w, h);
        for (const l of LV) { mapleShape(g, l.x * w, l.y * h, u * 0.022 * l.s, l.rot); g.fillStyle = rgba(l.c, 0.75 * a); g.fill(); }
      },
    };
  },
  sushibar(th) { // paper lanterns over a conveyor of sushi plates
    let t = 0;
    const PL = [...Array(8)].map((_, i) => ({ x: i / 8, c: th.blocks[(Math.random() * 7) | 0], rim: ['#d8344a', '#3a8ad8', '#e8b030'][(Math.random() * 3) | 0] }));
    const LN = [0.12, 0.38, 0.62, 0.88].map(x => ({ x, ph: rand(0, 6.3) }));
    return {
      step(dt) { t += dt; for (const p of PL) { p.x += 0.04 * dt; if (p.x > 1.1) { p.x -= 1.2; p.c = th.blocks[(Math.random() * 7) | 0]; } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), by = h * 0.86;
        const wood = g.createLinearGradient(0, by, 0, h); wood.addColorStop(0, `rgba(140,84,46,${0.4 * a})`); wood.addColorStop(1, `rgba(90,50,26,${0.5 * a})`);
        g.fillStyle = wood; g.fillRect(0, by, w, h - by);
        g.fillStyle = `rgba(60,60,66,${0.7 * a})`; g.fillRect(0, by - u * 0.03, w, u * 0.03);
        g.strokeStyle = `rgba(150,150,160,${0.3 * a})`; g.lineWidth = 1; const sp = u * 0.03, off = (t * 0.04 * w) % sp;
        g.beginPath(); for (let x = -sp + off; x < w + sp; x += sp) { g.moveTo(x, by - u * 0.03); g.lineTo(x, by); } g.stroke();
        for (const p of PL) {
          const x = p.x * w, y = by - u * 0.035;
          g.beginPath(); g.ellipse(x, y, u * 0.05, u * 0.016, 0, 0, Math.PI * 2); g.fillStyle = `rgba(250,248,244,${0.75 * a})`; g.fill();
          g.strokeStyle = rgba(p.rim, 0.7 * a); g.lineWidth = 2; g.stroke();
          rr(g, x - u * 0.028, y - u * 0.028, u * 0.056, u * 0.022, u * 0.008); g.fillStyle = `rgba(247,242,234,${0.9 * a})`; g.fill();
          rr(g, x - u * 0.03, y - u * 0.04, u * 0.06, u * 0.016, u * 0.008); g.fillStyle = rgba(p.c, 0.9 * a); g.fill();
        }
        for (const l of LN) {
          const sw = Math.sin(t * 0.9 + l.ph) * 0.06, x0 = l.x * w, L = h * 0.08, x = x0 + Math.sin(sw) * L, y = Math.cos(sw) * L, lr = u * 0.035;
          const gl = g.createRadialGradient(x, y + lr, 0, x, y + lr, lr * 4); gl.addColorStop(0, `rgba(255,140,80,${0.25 * a})`); gl.addColorStop(1, 'rgba(255,140,80,0)');
          g.fillStyle = gl; g.fillRect(x - lr * 4, y + lr - lr * 4, lr * 8, lr * 8);
          g.strokeStyle = `rgba(30,20,20,${0.6 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x, y); g.stroke();
          g.beginPath(); g.ellipse(x, y + lr * 1.2, lr, lr * 1.25, 0, 0, Math.PI * 2); g.fillStyle = `rgba(216,52,42,${0.75 * a})`; g.fill();
          g.strokeStyle = `rgba(120,20,16,${0.5 * a})`; for (let k = -2; k <= 2; k++) { g.beginPath(); g.ellipse(x, y + lr * 1.2 + k * lr * 0.4, lr * Math.sqrt(Math.max(0.05, 1 - (k * 0.32) ** 2)), lr * 0.08, 0, 0, Math.PI * 2); g.stroke(); }
          g.fillStyle = `rgba(30,20,20,${0.8 * a})`; g.fillRect(x - lr * 0.4, y - lr * 0.1, lr * 0.8, lr * 0.15); g.fillRect(x - lr * 0.4, y + lr * 2.4, lr * 0.8, lr * 0.15);
        }
      },
    };
  },
  graffiti(th) { // a brick wall covered in old tags under a flickering street lamp
    let wall = null, ww = 0, wh = 0, t = 0, fwait = rand(3, 7);
    function build(w, h) {
      ww = w; wh = h; wall = document.createElement('canvas'); wall.width = Math.ceil(w); wall.height = Math.ceil(h);
      const g = wall.getContext('2d'), u = Math.min(w, h), bh = u * 0.045, bw = bh * 2.6;
      for (let r = 0, y = 0; y < h; r++, y += bh) {
        const off = (r % 2) * bw / 2;
        for (let x = -off; x < w; x += bw) { g.fillStyle = `rgba(140,70,56,${0.05 + Math.random() * 0.08})`; g.fillRect(x + 1, y + 1, bw - 2, bh - 2); }
      }
      g.lineCap = 'round'; g.lineJoin = 'round';
      for (let i = 0; i < 10; i++) {
        const c = th.blocks[(Math.random() * 7) | 0], x = Math.random() * w, y = Math.random() * h, L = u * rand(0.15, 0.35);
        g.strokeStyle = rgba(c, rand(0.1, 0.16)); g.lineWidth = u * rand(0.015, 0.035);
        g.beginPath(); g.moveTo(x, y);
        for (let j = 0; j < 3; j++) g.bezierCurveTo(x + rand(-L, L), y + rand(-L, L) * 0.5, x + rand(-L, L), y + rand(-L, L) * 0.5, x + rand(-L, L), y + rand(-L, L) * 0.4);
        g.stroke();
        g.lineWidth = u * 0.006;
        for (let j = 0; j < 3; j++) { const dx = x + rand(-L, L) * 0.6, dy = y + rand(-L, L) * 0.3; g.beginPath(); g.moveTo(dx, dy); g.lineTo(dx, dy + u * rand(0.03, 0.08)); g.stroke(); }
      }
    }
    return {
      step(dt) { t += dt; fwait -= dt; if (fwait < -0.5) fwait = rand(3, 7); },
      draw(g, w, h, a) {
        if (!wall || Math.abs(w - ww) > 1 || Math.abs(h - wh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(wall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h), lx = w * 0.84, fl = fwait < 0 && !state.REDUCED ? (Math.sin(t * 60) > 0 ? 0.35 : 1) : 1;
        const cone = g.createLinearGradient(0, u * 0.05, 0, h); cone.addColorStop(0, `rgba(255,220,150,${0.18 * fl * a})`); cone.addColorStop(1, 'rgba(255,220,150,0)');
        g.fillStyle = cone; g.beginPath(); g.moveTo(lx - u * 0.03, u * 0.05); g.lineTo(lx + u * 0.03, u * 0.05); g.lineTo(lx + w * 0.35, h); g.lineTo(lx - w * 0.35, h); g.fill();
        g.fillStyle = `rgba(40,40,44,${0.9 * a})`; g.fillRect(lx - u * 0.04, u * 0.02, u * 0.08, u * 0.03);
        g.fillStyle = `rgba(255,236,190,${0.9 * fl * a})`; g.fillRect(lx - u * 0.03, u * 0.05, u * 0.06, u * 0.008);
      },
    };
  },
  carnival(th) { // a turning ferris wheel, bulb strings, bursts of fireworks
    let t = 0, fw = [], fwait = rand(1, 3);
    const BUL = [...Array(14)].map((_, i) => th.blocks[i % 7]);
    return {
      step(dt) {
        t += dt; fwait -= dt;
        if (fwait < 0) {
          fwait = rand(1.5, 3.5);
          if (!state.REDUCED) { const x = rand(0.25, 0.85), y = rand(0.08, 0.3), c = th.blocks[(Math.random() * 7) | 0]; for (let i = 0; i < 28; i++) { const an = i / 28 * Math.PI * 2, v = rand(0.12, 0.22); fw.push({ x, y, vx: Math.cos(an) * v, vy: Math.sin(an) * v, life: 0, c }); } }
        }
        for (const p of fw) { p.life += dt / 1.4; p.vx *= Math.exp(-1.5 * dt); p.vy = p.vy * Math.exp(-1.5 * dt) + 0.08 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        fw = fw.filter(p => p.life < 1);
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), cx = w * 0.16, cy = h * 0.66, R = u * 0.34, rot = t * 0.15;
        g.strokeStyle = `rgba(200,180,230,${0.25 * a})`; g.lineWidth = 4;
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx - R * 0.5, h); g.moveTo(cx, cy); g.lineTo(cx + R * 0.5, h); g.stroke();
        g.strokeStyle = `rgba(255,220,150,${0.28 * a})`; g.lineWidth = 3;
        g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(cx, cy, R * 0.9, 0, Math.PI * 2); g.stroke();
        g.lineWidth = 1.5; g.beginPath();
        for (let i = 0; i < 12; i++) { const an = rot + i * Math.PI / 6; g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); }
        g.stroke();
        const step = Math.floor(t * 4);
        for (let i = 0; i < 24; i++) { const an = rot + i * Math.PI / 12, on = (i + step) % 3 === 0; g.beginPath(); g.arc(cx + Math.cos(an) * R, cy + Math.sin(an) * R, on ? 3 : 2, 0, Math.PI * 2); g.fillStyle = on ? `rgba(255,246,200,${0.9 * a})` : `rgba(255,220,150,${0.35 * a})`; g.fill(); }
        for (let i = 0; i < 8; i++) {
          const an = rot + i * Math.PI / 4, x = cx + Math.cos(an) * R, y = cy + Math.sin(an) * R, gs2 = u * 0.035;
          g.strokeStyle = `rgba(255,220,150,${0.4 * a})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + gs2 * 0.5); g.stroke();
          rr(g, x - gs2 * 0.5, y + gs2 * 0.5, gs2, gs2 * 0.7, gs2 * 0.2); g.fillStyle = rgba(th.blocks[i % 7], 0.6 * a); g.fill();
        }
        const sag = h * 0.05, wy = x => h * 0.02 + Math.pow(Math.sin(x * Math.PI * 2), 2) * sag;
        g.strokeStyle = `rgba(30,10,40,${0.8 * a})`; g.lineWidth = 1.5; g.beginPath();
        for (let i = 0; i <= 40; i++) { const x = i / 40; i ? g.lineTo(x * w, wy(x)) : g.moveTo(0, wy(0)); } g.stroke();
        BUL.forEach((c, i) => { const fx = (i + 0.5) / BUL.length, k = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.3); g.beginPath(); g.arc(fx * w, wy(fx) + u * 0.012, u * 0.009, 0, Math.PI * 2); g.fillStyle = rgba(c, (0.4 + 0.5 * k) * a); g.fill(); });
        g.save(); g.globalCompositeOperation = 'lighter';
        for (const p of fw) { g.fillStyle = rgba(p.c, (1 - p.life) * 0.9 * a); g.fillRect(p.x * w - 1.5, p.y * h - 1.5, 3, 3); }
        g.restore();
      },
    };
  },
  gelateria(th) { // a striped awning, pastel bokeh, sprinkles and waffle crumbs falling
    let awn = null, aw = 0, ah = 0, t = 0;
    const SP = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(0.03, 0.07), rot: rand(0, 6.3), vr: rand(-2, 2), c: th.blocks[(Math.random() * 7) | 0], waffle: Math.random() < 0.3 }));
    const BK = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.04, 0.09), v: rand(0.005, 0.015), c: th.blocks[(Math.random() * 6) | 0] }));
    function build(w, h) {
      aw = w; ah = h; const u = Math.min(w, h), H = Math.ceil(u * 0.13), sw = u * 0.07, base = H * 0.68;
      awn = document.createElement('canvas'); awn.width = Math.ceil(w); awn.height = H;
      const g = awn.getContext('2d');
      g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, base);
      for (let x = Math.ceil(w / sw) * sw; x > 0; x -= sw) g.arc(x - sw / 2, base, sw / 2, 0, Math.PI);
      g.closePath(); g.save(); g.clip();
      for (let i = 0, x = 0; x < w; i++, x += sw) { g.fillStyle = i % 2 ? '#fff8f2' : th.accent; g.fillRect(x, 0, sw, H); }
      const sh = g.createLinearGradient(0, 0, 0, H); sh.addColorStop(0, 'rgba(0,0,0,.12)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sh; g.fillRect(0, 0, w, H);
      g.restore();
    }
    return {
      step(dt) {
        t += dt;
        for (const p of SP) { p.y += p.v * dt; p.rot += p.vr * dt; if (p.y > 1.03) { p.y = 0.08; p.x = Math.random(); } }
        for (const b of BK) { b.y -= b.v * dt; if (b.y < -0.1) { b.y = 1.1; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const b of BK) { const r = b.r * u, gr = g.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, r); gr.addColorStop(0, rgba(b.c, 0.22 * a)); gr.addColorStop(1, rgba(b.c, 0)); g.fillStyle = gr; g.fillRect(b.x * w - r, b.y * h - r, 2 * r, 2 * r); }
        g.lineCap = 'round';
        for (const p of SP) {
          const x = p.x * w, y = p.y * h;
          g.save(); g.translate(x, y); g.rotate(p.rot);
          if (p.waffle) { const q = u * 0.014; g.fillStyle = `rgba(216,160,96,${0.8 * a})`; g.fillRect(-q, -q, q * 2, q * 2); g.strokeStyle = `rgba(150,100,50,${0.6 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(-q, 0); g.lineTo(q, 0); g.moveTo(0, -q); g.lineTo(0, q); g.stroke(); }
          else { g.strokeStyle = rgba(p.c, 0.85 * a); g.lineWidth = Math.max(2, u * 0.006); g.beginPath(); g.moveTo(-u * 0.008, 0); g.lineTo(u * 0.008, 0); g.stroke(); }
          g.restore();
        }
        g.lineCap = 'butt';
        if (!awn || Math.abs(w - aw) > 1 || Math.abs(h - ah) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(awn, 0, 0); g.globalAlpha = 1;
      },
    };
  },
});

/* ---------- Third theme set: clear-effect particles ---------- */
Object.assign(PARTS, {
  fish(p, s) { ctx.rotate(Math.atan2(p.vy, p.vx)); fishShape(ctx, 0, 0, s * 0.6, 1, shade(p.color, 0.15), Math.sin(p.life * 30 + p.ph)); },
  tile(p, s) {
    ctx.rotate(p.rot); rr(ctx, -s * 0.45, -s * 0.45, s * 0.9, s * 0.9, s * 0.12); ctx.fillStyle = '#f4f8ff'; ctx.fill();
    ctx.lineWidth = Math.max(1, s * 0.12); ctx.strokeStyle = p.color; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
  },
  balloon(p, s) {
    const r = s * 0.5;
    ctx.beginPath(); ctx.arc(0, -r * 0.2, r, Math.PI * 0.85, Math.PI * 0.15); ctx.lineTo(0, r * 1.1); ctx.closePath(); ctx.fillStyle = p.color; ctx.fill();
    ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.5, r * 0.25, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fill();
    ctx.fillStyle = '#6a4020'; ctx.fillRect(-r * 0.18, r * 1.25, r * 0.36, r * 0.3);
  },
  cog(p, s) { ctx.rotate(p.rot); gearPath(ctx, 0, 0, s * 0.6, 8, 0, 0.3); ctx.fillStyle = shade(p.color, 0.1); ctx.fill('evenodd'); },
  leaf(p, s) { ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.4 + 0.6 * Math.abs(Math.sin(p.life * 5 + p.ph))); mapleShape(ctx, 0, 0, s * 0.7, 0); ctx.fillStyle = shade(p.color, 0.05); ctx.fill(); },
  blob(p, s) {
    const r = s * 0.6, gr = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
    gr.addColorStop(0, mixHex(p.color, '#fff0c0', 0.5)); gr.addColorStop(1, p.color);
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * (1 + 0.2 * Math.sin(p.life * 8 + p.ph)), 0, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
  },
  puff(p, s, k) {
    const r = p.size * (0.4 + (1 - k) * 1.2); ctx.fillStyle = mixHex(p.color, '#ffffff', 0.6);
    ctx.beginPath(); for (const [x, y, q] of [[-0.5, 0.1, 0.6], [0, -0.2, 0.8], [0.5, 0.1, 0.6]]) { ctx.moveTo(x * r + q * r, y * r); ctx.arc(x * r, y * r, q * r, 0, Math.PI * 2); } ctx.fill();
  },
  nut(p, s) { ctx.rotate(p.rot); hexPath(ctx, 0, 0, s * 0.6); ctx.moveTo(s * 0.25, 0); ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2); ctx.fillStyle = mixHex('#c8d0d8', p.color, 0.3); ctx.fill('evenodd'); },
  note(p, s) { ctx.rotate(Math.sin(p.life * 4 + p.ph) * 0.3); ctx.fillStyle = shade(p.color, 0.2); noteShape(ctx, 0, 0, s * 0.8); },
  rice(p, s) { ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, s * 0.4, s * 0.2, 0, 0, Math.PI * 2); ctx.fillStyle = '#fbf6ec'; ctx.fill(); },
  confetti(p, s) { ctx.rotate(p.rot); ctx.scale(1, 0.15 + 0.85 * Math.abs(Math.sin(p.life * 9 + p.ph))); ctx.fillStyle = p.color; ctx.fillRect(-s * 0.5, -s * 0.28, s, s * 0.56); },
  sprinkle(p, s) { ctx.rotate(p.rot); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.5, s * 0.3); ctx.strokeStyle = p.color; ctx.beginPath(); ctx.moveTo(-s * 0.4, 0); ctx.lineTo(s * 0.4, 0); ctx.stroke(); },
});

/* ---------- Third theme set: sound kits ---------- */
Object.assign(Sfx, {
  // like hiss(), but the noise loops so a sound can outlast the half-second buffer (thunder, waves)
  hissL({ dur = 1, vol = 0.1, type = 'lowpass', freq = 1200, to = null, when = 0, q = 0.7 } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.08, dur * 0.2)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.out);
    s.start(t); s.stop(t + dur + 0.02);
  },
  // a sawtooth through a sweeping band-pass: the funk guitar "wah"
  wah(f, { when = 0, vol = 0.05, dur = 0.5 } = {}) {
    const c = this.ctx, t = c.currentTime + when;
    const o = c.createOscillator(), bp = c.createBiquadFilter(), g = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t);
    bp.type = 'bandpass'; bp.Q.value = 6; bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(2200, t + dur * 0.35); bp.frequency.exponentialRampToValueAtTime(500, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(bp); bp.connect(g); g.connect(this.out);
    o.start(t); o.stop(t + dur + 0.05);
  },
});
Object.assign(KITS, (S => {
  const gong = (f, when, vol) => { S.tone(f, { dur: 1.8, vol, when, attack: 0.005, wet: true }); S.tone(f * 2.76, { dur: 0.9, vol: vol * 0.4, when }); S.tone(f * 1.52, { dur: 1.3, vol: vol * 0.5, when, detune: -12 }); };
  const burner = (when, dur, vol) => { S.hissL({ dur, vol, type: 'bandpass', freq: 350, to: 900, q: 0.8, when }); S.hissL({ dur: dur * 0.8, vol: vol * 0.6, type: 'lowpass', freq: 300, when }); };
  const MEL = [0, 4, 7, 12, 7, 4, 5, 9, 12, 9, 5, 4, 2, 7, 11, 14, 11, 7, 0, 4, 7, 12, 16, 12];
  let mi = 0;
  const comb = (st, { when = 0, vol = 0.08 } = {}) => { const f = S.snd.root * 0.5 * Math.pow(2, st / 12); S.tone(f, { dur: 0.7, vol, when, attack: 0.002, wet: true }); S.tone(f * 3, { dur: 0.2, vol: vol * 0.25, when, attack: 0.002 }); };
  const kick = (when, vol) => S.tone(130, { dur: 0.18, vol, to: 45, when });
  const snare = (when, vol) => { S.hiss({ dur: 0.12, vol, type: 'bandpass', freq: 1800, q: 0.8, when }); S.tone(210, { dur: 0.08, vol: vol * 0.8, to: 150, when }); };
  const hat = when => S.hiss({ dur: 0.03, vol: 0.04, type: 'highpass', freq: 7000, when });
  return {
    aurora: {
      pick() { S.tink(2600, { vol: 0.04, dur: 0.3 }); },
      place() { S.thud({ vol: 0.2, f: 140 }); S.tone(S.snd.root * 0.5, { dur: 0.5, vol: 0.05, attack: 0.03, wet: true }); },
      clear(n) {
        const r = S.snd.root * 0.5;
        [0, 7, 12].forEach(st => { const f = r * Math.pow(2, st / 12); S.tone(f, { dur: 1.2, vol: 0.05, attack: 0.12, wet: true, when: 0.02 }); S.tone(f, { dur: 1.2, vol: 0.04, attack: 0.12, detune: 9, when: 0.02 }); });
        for (let i = 0; i < n + 2; i++) S.tink(r * 4 * Math.pow(2, [0, 4, 7, 11, 14, 19, 23][i % 7] / 12), { when: 0.08 + i * 0.06, vol: 0.035, dur: 0.5 });
      },
      deal() { S.tink(3100, { vol: 0.03, dur: 0.4 }); },
    },
    reef: {
      pick() { S.plop(260, { vol: 0.07, dur: 0.06 }); },
      place() { S.thud({ vol: 0.3, f: 100 }); S.plop(180, { vol: 0.12, dur: 0.1, when: 0.02 }); S.hiss({ dur: 0.12, vol: 0.05, type: 'lowpass', freq: 500 }); },
      clear(n) {
        S.tone(280, { dur: 1.1, vol: 0.07, to: 520, attack: 0.15, wet: true }); S.tone(520, { dur: 0.8, vol: 0.05, to: 360, attack: 0.1, when: 0.9, wet: true });
        for (let i = 0; i < n + 2; i++) S.plop(rand(300, 700), { when: 0.05 + i * 0.07, vol: 0.08 });
      },
      deal() { S.plop(420, { vol: 0.05 }); S.plop(560, { vol: 0.04, when: 0.06 }); },
    },
    tomb: {
      pick() { S.hiss({ dur: 0.07, vol: 0.05, type: 'bandpass', freq: 900, q: 1.5 }); },
      place() { S.knock(260, { vol: 0.3 }); S.hiss({ dur: 0.15, vol: 0.07, type: 'bandpass', freq: 700, to: 300, q: 1.2, when: 0.01 }); },
      clear(n) { gong(110 + n * 6, 0, 0.16); S.hissL({ dur: 0.9, vol: 0.05, type: 'lowpass', freq: 2500, to: 400, when: 0.15 }); },
      deal() { S.hiss({ dur: 0.25, vol: 0.05, type: 'bandpass', freq: 600, to: 1400, q: 1.2 }); },
    },
    iznik: {
      pick() { S.tink(2300, { vol: 0.05, dur: 0.12 }); },
      place() { S.thud({ vol: 0.22, f: 160 }); S.tink(rand(1700, 2000), { vol: 0.1, dur: 0.2 }); },
      clear(n) { // a quick kanun run in a hijaz scale
        const H = [0, 1, 4, 5, 7, 8, 11, 12];
        for (let i = 0; i < n + 3; i++) { const f = S.snd.root * Math.pow(2, H[i % 8] / 12); S.tone(f, { type: 'triangle', dur: 0.18, vol: 0.09, when: i * 0.07, attack: 0.002 }); S.tone(f * 2, { dur: 0.1, vol: 0.03, when: i * 0.07 }); }
        S.tink(2600, { vol: 0.05, when: 0.05 });
      },
      deal() { S.tink(2000, { vol: 0.04, dur: 0.1 }); S.tink(2500, { vol: 0.03, dur: 0.1, when: 0.05 }); },
    },
    balloon: {
      pick() { S.rustle({ vol: 0.04, dur: 0.06 }); },
      place() { S.thud({ vol: 0.22, f: 130 }); burner(0.02, 0.18, 0.06); },
      clear(n) { burner(0, 0.5 + n * 0.08, 0.1); S.tone(S.snd.root * 0.5, { dur: 0.8, vol: 0.05, to: S.snd.root, attack: 0.1, wet: true }); S.hissL({ dur: 1, vol: 0.03, type: 'bandpass', freq: 500, to: 1500, q: 0.5, when: 0.3 }); },
      deal() { S.hissL({ dur: 0.4, vol: 0.04, type: 'bandpass', freq: 400, to: 900, q: 0.6 }); },
    },
    ebru: {
      pick() { S.tone(1400, { dur: 0.05, vol: 0.05, to: 2200 }); },
      place() { S.plop(220, { vol: 0.2, dur: 0.09 }); S.thud({ vol: 0.15, f: 120 }); S.tone(900, { dur: 0.25, vol: 0.03, to: 500, when: 0.05, wet: true }); },
      clear(n) { S.hiss({ dur: 0.45, vol: 0.07, type: 'bandpass', freq: 800, to: 2600, q: 1 }); for (let i = 0; i < n + 1; i++) S.plop(rand(350, 650), { when: 0.12 + i * 0.09, vol: 0.08 }); },
      deal() { S.tone(700, { dur: 0.3, vol: 0.03, to: 450, wet: true }); },
    },
    clock: {
      pick() { S.knock(2200, { vol: 0.05 }); },
      place() { S.knock(1600, { vol: 0.14 }); S.knock(1250, { vol: 0.12, when: 0.09 }); S.thud({ vol: 0.2, f: 120 }); },
      clear(n) { S.hiss({ dur: 0.45, vol: 0.08, type: 'highpass', freq: 2500, to: 6000 }); [880, 659.25, 783.99, 523.25].slice(0, Math.max(2, Math.min(4, n))).forEach((f, i) => S.tink(f, { when: 0.15 + i * 0.22, vol: 0.08, dur: 1 })); },
      deal() { for (let i = 0; i < 4; i++) S.knock(2400, { vol: 0.05, when: i * 0.04 }); },
    },
    storm: {
      pick() { S.hiss({ dur: 0.03, vol: 0.05, type: 'highpass', freq: 5000 }); },
      place() { S.thud({ vol: 0.28, f: 100 }); for (let i = 0; i < 3; i++) S.hiss({ dur: 0.02, vol: 0.04, type: 'highpass', freq: 4000, when: 0.02 + i * 0.04 * Math.random() }); },
      clear(n) { // a crack, then thunder that grows with the lines cleared
        const k = Math.min(1, 0.4 + n * 0.15);
        S.hiss({ dur: 0.08, vol: 0.16 * k, type: 'highpass', freq: 2000 });
        S.hissL({ dur: 1.2 + n * 0.25, vol: 0.22 * k, type: 'lowpass', freq: 500, to: 70, q: 1, when: 0.05 });
        S.tone(60, { dur: 1, vol: 0.22 * k, to: 35, when: 0.05 });
      },
      deal() { S.hissL({ dur: 0.5, vol: 0.03, type: 'highpass', freq: 3000 }); },
    },
    zen: {
      pick() { S.tone(1300, { dur: 0.06, vol: 0.04, to: 2000 }); },
      place() { S.knock(320, { vol: 0.3 }); S.tone(160, { dur: 0.12, vol: 0.12, to: 120 }); },
      clear(n) { // wind chimes on a pentatonic scale and a drop in the pond
        const P = [0, 2, 4, 7, 9, 12, 14, 16];
        for (let i = 0; i < n + 3; i++) S.tink(S.snd.root * 2 * Math.pow(2, P[(Math.random() * 8) | 0] / 12), { when: 0.05 + i * 0.09 + Math.random() * 0.04, vol: 0.04, dur: 0.8 });
        S.plop(400, { when: 0.1, vol: 0.06 });
      },
      deal() { S.tone(1100, { dur: 0.08, vol: 0.03, to: 1700 }); },
    },
    funk: {
      pick() { S.tone(300, { dur: 0.08, vol: 0.08, to: 600 }); },
      place() { S.tone(180, { dur: 0.12, vol: 0.2, to: 110 }); S.thud({ vol: 0.15, f: 90 }); },
      clear(n) {
        const r = S.snd.root * 0.5;
        [0, 4, 7, 10].forEach(st => S.wah(r * Math.pow(2, st / 12), { vol: 0.035, dur: 0.5 }));
        if (n > 2) [0, 4, 7, 10].forEach(st => S.wah(r * Math.pow(2, (st + 5) / 12), { vol: 0.03, dur: 0.4, when: 0.25 }));
        S.tone(110, { dur: 0.25, vol: 0.2, to: 70 });
      },
      deal() { S.tone(260, { dur: 0.07, vol: 0.06, to: 520 }); S.tone(330, { dur: 0.07, vol: 0.05, to: 660, when: 0.07 }); },
    },
    cloud: {
      pick() { S.hiss({ dur: 0.06, vol: 0.04, type: 'lowpass', freq: 1200 }); },
      place() { S.hiss({ dur: 0.12, vol: 0.08, type: 'lowpass', freq: 900, to: 300 }); S.thud({ vol: 0.12, f: 160 }); },
      clear(n) { S.hissL({ dur: 0.6, vol: 0.06, type: 'bandpass', freq: 500, to: 1800, q: 0.5 }); for (let i = 0; i < n + 3; i++) S.tink(rand(2200, 3800), { when: 0.08 + Math.random() * 0.5, vol: 0.03, dur: 0.6 }); },
      deal() { S.hiss({ dur: 0.15, vol: 0.04, type: 'lowpass', freq: 1000 }); },
    },
    factory: {
      pick() { S.tone(500, { type: 'square', dur: 0.06, vol: 0.02, to: 800 }); },
      place() { S.hiss({ dur: 0.09, vol: 0.1, type: 'bandpass', freq: 900, q: 1.5 }); S.thud({ vol: 0.35, f: 70 }); S.knock(800, { vol: 0.08, when: 0.02 }); },
      clear(n) { // welding crackle and a two-tone alarm
        for (let i = 0; i < 8 + n * 3; i++) S.hiss({ dur: rand(0.01, 0.04), vol: rand(0.04, 0.1), type: 'highpass', freq: rand(3000, 7000), when: Math.random() * 0.5 });
        S.blip(880, { when: 0.05, dur: 0.09, vol: 0.05 }); S.blip(660, { when: 0.22, dur: 0.09, vol: 0.05 });
      },
      deal() { S.knock(500, { vol: 0.1 }); S.knock(500, { vol: 0.08, when: 0.12 }); },
    },
    ukulele: {
      pick() { S.tone(1046, { type: 'triangle', dur: 0.06, vol: 0.05, attack: 0.002 }); },
      place() { S.knock(700, { vol: 0.2 }); S.thud({ vol: 0.15, f: 140 }); },
      clear() { // one strum of a ukulele, then a wave washing in
        [392, 261.63, 329.63, 440].forEach((f, i) => { S.tone(f * 1.5, { type: 'triangle', dur: 0.35, vol: 0.07, when: i * 0.025, attack: 0.002 }); S.tone(f * 3, { dur: 0.15, vol: 0.02, when: i * 0.025 }); });
        S.hissL({ dur: 1.2, vol: 0.06, type: 'lowpass', freq: 700, to: 200, when: 0.15 });
      },
      deal() { S.hissL({ dur: 0.7, vol: 0.03, type: 'lowpass', freq: 600, to: 250 }); },
    },
    fossil: {
      pick() { S.tink(2600, { vol: 0.03, dur: 0.08 }); },
      place() { S.knock(220, { vol: 0.3 }); S.crunch({ vol: 0.08, n: 3 }); },
      clear(n) { // rocks breaking and a distant roar
        S.crunch({ vol: 0.12, n: 6 });
        S.hissL({ dur: 1 + n * 0.1, vol: 0.1, type: 'bandpass', freq: 260, to: 140, q: 2.5, when: 0.1 });
        S.tone(85, { type: 'sawtooth', dur: 0.9, vol: 0.04, to: 60, when: 0.1, attack: 0.1 });
      },
      deal() { S.crunch({ vol: 0.05, n: 2 }); },
    },
    musicbox: {
      pick() { comb(24, { vol: 0.03 }); },
      place() { comb(MEL[mi++ % MEL.length], { vol: 0.09 }); S.thud({ vol: 0.1, f: 180 }); }, // each block plays the next note of the tune
      clear(n) { for (let i = 0; i < Math.min(n, 5); i++) comb(MEL[mi++ % MEL.length] + 12, { when: i * 0.1, vol: 0.07 }); comb(0, { when: 0.02, vol: 0.05 }); comb(7, { when: 0.02, vol: 0.04 }); },
      deal() { for (let i = 0; i < 4; i++) S.knock(3000, { vol: 0.03, when: i * 0.035 }); },
    },
    autumn: {
      pick() { S.crunch({ vol: 0.04, n: 2 }); },
      place() { S.thud({ vol: 0.25, f: 110 }); S.crunch({ vol: 0.09, n: 4 }); },
      clear(n) { S.hissL({ dur: 0.9, vol: 0.08, type: 'bandpass', freq: 300, to: 1400, q: 0.7 }); for (let i = 0; i < n + 1; i++) S.crunch({ when: 0.1 + i * 0.08, vol: 0.07, n: 4 }); },
      deal() { S.rustle({ vol: 0.05, dur: 0.15 }); },
    },
    sushi: {
      pick() { S.knock(2100, { vol: 0.05 }); S.knock(2300, { vol: 0.04, when: 0.04 }); },
      place() { S.thud({ vol: 0.18, f: 150 }); S.tink(rand(1700, 1900), { vol: 0.07, dur: 0.15 }); },
      clear(n) { S.tink(1320, { vol: 0.1, dur: 1.1 }); S.tink(1980, { vol: 0.05, dur: 0.8, when: 0.15 }); for (let i = 0; i < n; i++) S.knock(2200, { vol: 0.05, when: 0.1 + i * 0.06 }); },
      deal() { S.tink(1800, { vol: 0.04, dur: 0.1 }); S.tink(2100, { vol: 0.03, dur: 0.1, when: 0.06 }); },
    },
    spray: {
      pick() { S.knock(1800, { vol: 0.06 }); S.knock(1700, { vol: 0.05, when: 0.05 }); },
      place() { S.hiss({ dur: 0.1, vol: 0.07, type: 'highpass', freq: 3500 }); kick(0, 0.25); },
      clear(n) { // a spray burst over a boom-bap beat
        S.hiss({ dur: 0.3, vol: 0.08, type: 'highpass', freq: 3000, to: 6000 });
        kick(0, 0.3); hat(0.12); snare(0.24, 0.12);
        if (n > 2) { hat(0.36); kick(0.42, 0.25); snare(0.6, 0.12); }
      },
      deal() { for (let i = 0; i < 3; i++) S.knock(1900, { vol: 0.05, when: i * 0.06 }); },
    },
    carnival: {
      pick() { S.tink(2100, { vol: 0.04, dur: 0.12 }); },
      place() { S.thud({ vol: 0.2, f: 150 }); S.tone(S.snd.root, { type: 'square', dur: 0.12, vol: 0.03 }); },
      clear(n) { S.pop({ vol: 0.15, f: 800 }); S.tink(1760, { vol: 0.07, dur: 0.6, when: 0.05 }); [0, 4, 7, 12].slice(0, Math.max(2, Math.min(4, n))).forEach((st, i) => S.tone(S.snd.root * Math.pow(2, st / 12), { type: 'square', dur: 0.12, vol: 0.025, when: 0.1 + i * 0.08 })); },
      deal() { S.tink(2000, { vol: 0.04, dur: 0.15 }); S.tink(2000, { vol: 0.03, dur: 0.15, when: 0.12 }); },
    },
    gelato: {
      pick() { S.tink(2500, { vol: 0.03, dur: 0.08 }); },
      place() { S.squelch({ vol: 0.07, dur: 0.12 }); S.thud({ vol: 0.15, f: 150 }); },
      clear(n) { S.crunch({ vol: 0.11, n: 5 }); for (let i = 0; i < n + 1; i++) S.tink(rand(2400, 3600), { when: 0.12 + i * 0.05, vol: 0.03, dur: 0.2 }); },
      deal() { S.tink(2600, { vol: 0.03, dur: 0.1 }); },
    },
  };
})(Sfx));
