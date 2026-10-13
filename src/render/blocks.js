import { hexOf, mixHex, rgba, shade } from '../core/color.js';
import { poly, rr } from './sprites.js';
import { TEX, texIn } from './textures.js';

/* ---------- Extra block looks: block() is the Soft look, motif() decorates a Classic tile, tint() shifts the Classic tile colour ---------- */
export const seeded = c => { let x = (parseInt(c.slice(1), 16) % 2147483646) + 1; return () => (x = (x * 16807) % 2147483647) / 2147483647; };
function inner(g, s, k = 0.13) { rr(g, s * k, s * k, s * (1 - 2 * k), s * (1 - 2 * k), s * 0.04); g.clip(); }
export function beanMark(g, x, y, r, rot, fill, crease) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); g.ellipse(0, 0, r * 0.72, r, 0, 0, Math.PI * 2); g.fillStyle = fill; g.fill();
  g.beginPath(); g.moveTo(0, -r * 0.85); g.bezierCurveTo(r * 0.38, -r * 0.3, -r * 0.38, r * 0.3, 0, r * 0.85);
  g.strokeStyle = crease; g.lineWidth = Math.max(1, r * 0.14); g.lineCap = 'round'; g.stroke();
  g.restore();
}
export function woodGrain(g, s, c, a = 1) {
  const rnd = seeded(c);
  g.strokeStyle = `rgba(90,52,20,${0.3 * a})`; g.lineWidth = Math.max(1, s * 0.022);
  for (let i = 0; i < 5; i++) {
    const y = s * (0.14 + i * 0.18) + (rnd() - 0.5) * s * 0.05;
    g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(s * 0.3, y - s * 0.06, s * 0.62, y + s * 0.07, s, y - s * 0.02); g.stroke();
  }
  g.beginPath(); g.ellipse(s * (0.5 + rnd() * 0.2), s * 0.46, s * 0.08, s * 0.045, 0, 0, Math.PI * 2); g.stroke();
}
export function marbleVeins(g, s, c, a = 1) {
  const rnd = seeded(c);
  g.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const y0 = s * rnd(), y1 = s * rnd();
    g.beginPath(); g.moveTo(-s * 0.05, y0);
    g.bezierCurveTo(s * 0.3, y0 + (rnd() - 0.5) * s * 0.6, s * 0.7, y1 + (rnd() - 0.5) * s * 0.6, s * 1.05, y1);
    g.strokeStyle = i === 2 ? `rgba(206,166,60,${0.85 * a})` : `rgba(90,96,100,${0.32 * a})`;
    g.lineWidth = Math.max(1, s * (i === 2 ? 0.026 : 0.018)); g.stroke();
  }
  g.fillStyle = `rgba(214,178,70,${0.9 * a})`;
  for (let i = 0; i < 3; i++) g.fillRect(s * (0.2 + rnd() * 0.6), s * (0.2 + rnd() * 0.6), s * 0.03, s * 0.03);
}
export function caneStripes(g, s, c, a = 1) {
  g.save(); g.globalAlpha = a; g.lineWidth = s * 0.13; g.strokeStyle = c;
  for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(s * k * 0.34, s * 1.05); g.lineTo(s * (1 + k * 0.34), -s * 0.05); g.stroke(); }
  g.restore();
}
export function glassShine(g, s, a) {
  g.fillStyle = `rgba(255,255,255,${0.32 * a})`;
  g.beginPath(); g.moveTo(0, s * 0.6); g.lineTo(s * 0.6, 0); g.lineTo(s * 0.8, 0); g.lineTo(0, s * 0.8); g.closePath(); g.fill();
  g.fillStyle = `rgba(255,255,255,${0.2 * a})`;
  g.beginPath(); g.moveTo(0, s * 0.9); g.lineTo(s * 0.9, 0); g.lineTo(s * 0.97, 0); g.lineTo(0, s * 0.97); g.closePath(); g.fill();
}
function slimePath(g, s) {
  g.beginPath(); g.moveTo(s * 0.06, s * 0.3); g.quadraticCurveTo(s * 0.06, s * 0.05, s * 0.3, s * 0.05); g.lineTo(s * 0.7, s * 0.05);
  g.quadraticCurveTo(s * 0.94, s * 0.05, s * 0.94, s * 0.3); g.lineTo(s * 0.94, s * 0.78); g.quadraticCurveTo(s * 0.94, s * 0.9, s * 0.84, s * 0.88);
  g.quadraticCurveTo(s * 0.78, s * 0.87, s * 0.75, s * 0.9); g.arc(s * 0.69, s * 0.9, s * 0.06, 0, Math.PI);
  g.quadraticCurveTo(s * 0.58, s * 0.84, s * 0.46, s * 0.88); g.quadraticCurveTo(s * 0.36, s * 0.92, s * 0.3, s * 0.87);
  g.quadraticCurveTo(s * 0.22, s * 0.82, s * 0.15, s * 0.88); g.quadraticCurveTo(s * 0.06, s * 0.92, s * 0.06, s * 0.78); g.closePath();
}
// fruit cross-sections: rind, pith and the pattern of the flesh, keyed by block colour
export const FRUIT = {
  '#ff4d5e': { rind: '#2f9e44', pith: '#e8ffd8', kind: 'seeds' },  // watermelon
  '#ff9a2a': { rind: '#e07810', kind: 'citrus' },                  // orange
  '#ffe14a': { rind: '#e8c220', kind: 'citrus' },                  // lemon
  '#8ccf3a': { rind: '#7a5a2e', pith: '#cfe8a0', kind: 'kiwi' },   // kiwi
  '#ff5ab4': { rind: '#d8247e', pith: '#ffffff', kind: 'black' },  // dragon fruit
  '#8a4ad8': { rind: '#5a2a9a', pith: '#d8c8f0', kind: 'dots' },   // grape
  '#3fbf6a': { rind: '#2a8a48', kind: 'citrus' },                  // lime
};
function fruitPattern(g, r, kind) { // centred on 0,0
  g.save();
  if (kind === 'citrus') {
    g.strokeStyle = 'rgba(255,255,240,.7)'; g.lineWidth = Math.max(1, r * 0.07);
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * r * 0.92, Math.sin(an) * r * 0.92); g.stroke(); }
    g.beginPath(); g.arc(0, 0, r * 0.12, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,240,.85)'; g.fill();
  } else if (kind === 'seeds') {
    g.fillStyle = '#1a1010';
    for (const [an, d] of [[0.3, 0.55], [1.5, 0.6], [2.6, 0.5], [3.7, 0.62], [4.9, 0.55], [5.8, 0.3]]) {
      g.save(); g.rotate(an); g.translate(d * r, 0); g.beginPath(); g.ellipse(0, 0, r * 0.11, r * 0.065, 0, 0, Math.PI * 2); g.fill(); g.restore();
    }
  } else if (kind === 'kiwi') {
    g.beginPath(); g.ellipse(0, 0, r * 0.32, r * 0.24, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(250,255,220,.9)'; g.fill();
    g.fillStyle = '#1a1408';
    for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6; g.beginPath(); g.arc(Math.cos(an) * r * 0.45, Math.sin(an) * r * 0.38, Math.max(0.7, r * 0.045), 0, Math.PI * 2); g.fill(); }
  } else {
    g.fillStyle = kind === 'black' ? '#1a1010' : 'rgba(255,255,255,.7)';
    for (let i = 0; i < 14; i++) { const an = i * 2.4, d = Math.sqrt((i + 0.5) / 14) * 0.85; g.beginPath(); g.arc(Math.cos(an) * d * r, Math.sin(an) * d * r, Math.max(0.6, r * 0.045), 0, Math.PI * 2); g.fill(); }
  }
  g.restore();
}
export function fruitSlice(g, x, y, r, c, rot = 0) {
  const F = FRUIT[c] || { rind: shade(c, -0.35), kind: 'dots' };
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fillStyle = F.rind; g.fill();
  g.beginPath(); g.arc(0, 0, r * 0.88, 0, Math.PI * 2); g.fillStyle = F.pith || '#fffbe8'; g.fill();
  g.beginPath(); g.arc(0, 0, r * 0.8, 0, Math.PI * 2); g.fillStyle = c; g.fill();
  fruitPattern(g, r * 0.8, F.kind);
  g.restore();
}

export const STYLES = {
  gold: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.9, s * 0.1); g.fillStyle = shade(c, -0.5); g.fill();
      const lg = g.createLinearGradient(0, 0, s, s);
      lg.addColorStop(0, shade(c, 0.6)); lg.addColorStop(0.3, c); lg.addColorStop(0.5, shade(c, -0.18)); lg.addColorStop(0.72, shade(c, 0.3)); lg.addColorStop(1, shade(c, -0.25));
      rr(g, s * 0.06, s * 0.06, s * 0.88, s * 0.82, s * 0.09); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'gold', 1, 0.06, 0.09);
    },
  },
  glass: {
    tint: c => hexOf(mixHex(c, '#ffffff', 0.18)),
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.12); g.fillStyle = rgba(c, 0.36); g.fill();
      g.lineWidth = Math.max(1, s * 0.05); g.strokeStyle = mixHex(c, '#ffffff', 0.6); g.stroke();
      g.save(); g.clip(); glassShine(g, s, 1); g.restore();
    },
  },
  choco: {
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.08); g.fillStyle = shade(c, -0.5); g.fill();
      const o = s * 0.06, e = s * 0.94, b = s * 0.17;
      poly(g, [[o, o], [e, o], [e - b, o + b], [o + b, o + b]], shade(c, 0.22));
      poly(g, [[o, o], [o + b, o + b], [o + b, e - b], [o, e]], shade(c, 0.08));
      poly(g, [[e, o], [e, e], [e - b, e - b], [e - b, o + b]], shade(c, -0.25));
      poly(g, [[o, e], [o + b, e - b], [e - b, e - b], [e, e]], shade(c, -0.38));
      g.fillStyle = c; g.fillRect(o + b, o + b, e - o - 2 * b, e - o - 2 * b);
      texIn(g, s, c, 'choco', 1, 0.06, 0.02);
    },
  },
  slime: {
    block(g, s, c) {
      slimePath(g, s); g.fillStyle = shade(c, -0.35); g.fill();
      g.save(); g.translate(s * 0.5, s * 0.47); g.scale(0.93, 0.92); g.translate(-s * 0.5, -s * 0.5); slimePath(g, s); g.restore();
      const gr = g.createRadialGradient(s * 0.4, s * 0.33, s * 0.03, s * 0.5, s * 0.5, s * 0.6);
      gr.addColorStop(0, shade(c, 0.5)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.15));
      g.fillStyle = gr; g.fill();
      g.save(); slimePath(g, s); g.clip(); TEX.slime(g, s, c, seeded(c), 1); g.restore();
    },
  },
  wood: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.1); g.fillStyle = shade(c, -0.4); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.85, s * 0.09); g.fillStyle = c; g.fill();
      g.save(); g.clip(); woodGrain(g, s, c); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(0, 0, s, s * 0.1); g.restore();
    },
  },
  gum: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.34); g.fillStyle = shade(c, -0.22); g.fill();
      const gr = g.createRadialGradient(s * 0.38, s * 0.34, s * 0.04, s * 0.5, s * 0.52, s * 0.56);
      gr.addColorStop(0, shade(c, 0.5)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.08));
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.32); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'gum', 1, 0.07, 0.32);
    },
  },
  pixel: {
    block(g, s, c) {
      const p = s / 8;
      g.fillStyle = shade(c, -0.5); g.fillRect(0, 0, s, s);
      g.fillStyle = c; g.fillRect(p * 0.6, p * 0.6, s - p * 1.2, s - p * 1.2);
      g.fillStyle = shade(c, 0.45); g.fillRect(p * 0.6, p * 0.6, s - p * 1.2, p); g.fillRect(p * 0.6, p * 0.6, p, s - p * 1.2);
      g.fillStyle = shade(c, -0.25); g.fillRect(p * 0.6, s - p * 1.6, s - p * 1.2, p); g.fillRect(s - p * 1.6, p * 0.6, p, s - p * 1.2);
      g.fillStyle = '#fff'; g.fillRect(p * 2, p * 2, p, p); g.fillRect(p * 3, p * 2, p, p); g.fillRect(p * 2, p * 3, p, p);
    },
  },
  crystal: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.45); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.84, s * 0.1); g.fillStyle = c; g.fill();
      texIn(g, s, c, 'crystal', 1, 0.07, 0.1);
    },
  },
  bean: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.2); g.fillStyle = shade(c, -0.32); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.18);
      const lg = g.createLinearGradient(0, 0, 0, s); lg.addColorStop(0, shade(c, 0.22)); lg.addColorStop(1, c); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'bean', 1, 0.07, 0.18);
    },
  },
  pumpkin: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.08, s * 0.9, s * 0.88, s * 0.32); g.fillStyle = shade(c, -0.38); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.38, s * 0.04, s * 0.5, s * 0.55, s * 0.58);
      gr.addColorStop(0, shade(c, 0.35)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.18));
      rr(g, s * 0.07, s * 0.09, s * 0.86, s * 0.82, s * 0.3); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'pumpkin', 1, 0.07, 0.3);
    },
  },
  cane: {
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.05, s * 0.9, s * 0.9, s * 0.18); g.fillStyle = shade(c, -0.35); g.fill();
      rr(g, s * 0.07, s * 0.06, s * 0.86, s * 0.82, s * 0.16); g.fillStyle = '#fff7f0'; g.fill();
      g.save(); g.clip(); caneStripes(g, s, c);
      rr(g, s * 0.16, s * 0.1, s * 0.68, s * 0.12, s * 0.06); g.fillStyle = 'rgba(255,255,255,.4)'; g.fill(); g.restore();
    },
  },
  marble: {
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08);
      const gl = g.createLinearGradient(0, 0, s, s); gl.addColorStop(0, '#f6e08a'); gl.addColorStop(0.5, '#b8902c'); gl.addColorStop(1, '#e8c860');
      g.fillStyle = gl; g.fill();
      rr(g, s * 0.09, s * 0.09, s * 0.82, s * 0.82, s * 0.05);
      const gr = g.createRadialGradient(s * 0.35, s * 0.3, s * 0.05, s * 0.5, s * 0.5, s * 0.7); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, shade(c, -0.08));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); marbleVeins(g, s, c); g.restore();
    },
  },
  paper: {
    block(g, s, c) {
      const o = s * 0.06, e = s * 0.94;
      g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(o + s * 0.02, o + s * 0.03, e - o, e - o);
      poly(g, [[o, o], [e, o], [o, e]], mixHex(c, '#ffffff', 0.14));
      poly(g, [[e, o], [e, e], [o, e]], shade(c, -0.1));
      texIn(g, s, c, 'paper', 1, 0.06, 0);
    },
  },
  fruit: {
    block(g, s, c) {
      const F = FRUIT[c] || { rind: shade(c, -0.35), kind: 'dots' };
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.22); g.fillStyle = F.rind; g.fill();
      rr(g, s * 0.1, s * 0.1, s * 0.8, s * 0.8, s * 0.17); g.fillStyle = F.pith || '#fffbe8'; g.fill();
      rr(g, s * 0.14, s * 0.14, s * 0.72, s * 0.72, s * 0.14);
      const gr = g.createRadialGradient(s * 0.5, s * 0.5, 0, s * 0.5, s * 0.5, s * 0.5); gr.addColorStop(0, mixHex(c, '#ffffff', 0.3)); gr.addColorStop(1, c);
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.fruit(g, s, c, seeded(c), 1); g.restore();
    },
  },
};
