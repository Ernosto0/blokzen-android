// Little sea creatures drawn from simple shapes: 0 sea sponge, 1 jellyfish, 2 starfish, 3 crab, 4 pufferfish, 5 bubble, 6 pineapple.
// Full colour; r is about half the size.
const INK = '#0b3b55';

function ell(g, x, y, rx, ry, fill, rot = 0, line = 0) {
  g.beginPath(); g.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot, 0, Math.PI * 2);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (line) { g.lineWidth = line; g.strokeStyle = INK; g.stroke(); }
}
function eyes(g, x, y, r, dx, dy, rad) { // big round cartoon eyes
  for (const s of [-1, 1]) { ell(g, x + s * dx * r, y + dy * r, rad * r, rad * r * 1.1, '#fff', 0, r * 0.045); ell(g, x + s * dx * r, y + dy * r + rad * r * 0.1, rad * r * 0.45, rad * r * 0.55, INK); ell(g, x + s * dx * r - rad * r * 0.1, y + dy * r - rad * r * 0.1, rad * r * 0.16, rad * r * 0.16, '#fff'); }
}
function smile(g, x, y, r, w, h = 0.12) { g.strokeStyle = INK; g.lineWidth = r * 0.06; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - w * r, y); g.quadraticCurveTo(x, y + h * 2 * r, x + w * r, y); g.stroke(); }
function sponge(g, x, y, r) { // a soft yellow tube sponge, holes and all
  g.lineJoin = 'round';
  g.beginPath(); g.roundRect(x - r * 0.82, y - r * 0.88, r * 1.64, r * 1.76, r * 0.42); g.fillStyle = '#ffd93b'; g.fill(); g.lineWidth = r * 0.07; g.strokeStyle = INK; g.stroke();
  for (const [a, b, s] of [[-0.6, -0.65, 0.1], [0.62, -0.55, 0.08], [-0.65, 0.2, 0.07], [0.6, 0.45, 0.11], [-0.2, 0.72, 0.08], [0.05, -0.78, 0.06]]) ell(g, x + a * r, y + b * r, s * r, s * r * 0.8, '#e7b412');
  eyes(g, x, y, r, 0.33, -0.2, 0.25);
  for (const s of [-1, 1]) ell(g, x + s * r * 0.58, y + r * 0.2, r * 0.13, r * 0.08, 'rgba(255,120,90,.55)');
  smile(g, x, y + r * 0.28, r, 0.38, 0.14);
}
function jelly(g, x, y, r) {
  g.lineJoin = 'round'; g.lineCap = 'round';
  g.strokeStyle = '#ff8fd0'; g.lineWidth = r * 0.12;
  for (const k of [-0.55, -0.18, 0.18, 0.55]) { g.beginPath(); g.moveTo(x + k * r, y + r * 0.3); g.bezierCurveTo(x + (k + 0.25) * r, y + r * 0.6, x + (k - 0.25) * r, y + r * 0.8, x + k * r, y + r * 1.0); g.stroke(); }
  g.beginPath(); g.moveTo(x - r * 0.98, y + r * 0.35); g.bezierCurveTo(x - r * 1.0, y - r * 1.15, x + r * 1.0, y - r * 1.15, x + r * 0.98, y + r * 0.35); g.quadraticCurveTo(x, y + r * 0.1, x - r * 0.98, y + r * 0.35);
  g.fillStyle = '#ffb3e1'; g.fill(); g.lineWidth = r * 0.07; g.strokeStyle = INK; g.stroke();
  ell(g, x - r * 0.45, y - r * 0.55, r * 0.22, r * 0.1, 'rgba(255,255,255,.7)', -0.5);
  eyes(g, x, y, r, 0.32, -0.08, 0.19); smile(g, x, y + r * 0.16, r, 0.18, 0.09);
}
function starfish(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * 0.55 : r * 1.0; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d + r * 0.05); }
  g.closePath(); g.fillStyle = '#ffa94d'; g.fill(); g.lineWidth = r * 0.1; g.lineJoin = 'round'; g.strokeStyle = INK; g.stroke();
  g.fillStyle = '#ffd7a0'; for (const [a, b] of [[0, -0.62], [0.4, -0.15], [-0.4, -0.15], [0.28, 0.5], [-0.28, 0.5]]) { g.beginPath(); g.arc(x + a * r, y + b * r, r * 0.05, 0, 7); g.fill(); }
  eyes(g, x, y, r, 0.2, 0.0, 0.14); smile(g, x, y + r * 0.22, r, 0.16, 0.08);
}
function crab(g, x, y, r) {
  g.lineJoin = 'round'; g.lineCap = 'round';
  for (const s of [-1, 1]) { // claws and legs
    g.strokeStyle = INK; g.lineWidth = r * 0.1; g.beginPath(); g.moveTo(x + s * r * 0.7, y + r * 0.2); g.lineTo(x + s * r * 1.0, y - r * 0.35); g.stroke();
    ell(g, x + s * r * 0.92, y - r * 0.6, r * 0.3, r * 0.26, '#ff6a5a', 0, r * 0.06);
    g.beginPath(); g.moveTo(x + s * r * 0.9, y - r * 0.9); g.lineTo(x + s * r * 0.92, y - r * 0.62); g.strokeStyle = INK; g.lineWidth = r * 0.06; g.stroke();
    for (const k of [0.3, 0.6]) { g.beginPath(); g.moveTo(x + s * r * 0.55, y + r * 0.45); g.lineTo(x + s * r * (0.7 + k * 0.4), y + r * (0.8 + k * 0.1)); g.stroke(); }
  }
  ell(g, x, y + r * 0.25, r * 0.85, r * 0.62, '#ff6a5a', 0, r * 0.07);
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * r * 0.3, y - r * 0.2); g.lineTo(x + s * r * 0.3, y - r * 0.5); g.strokeStyle = INK; g.lineWidth = r * 0.06; g.stroke(); }
  eyes(g, x, y - r * 0.3, r, 0.3, -0.12, 0.17); smile(g, x, y + r * 0.35, r, 0.3, 0.12);
}
function puffer(g, x, y, r) {
  g.lineJoin = 'round';
  g.fillStyle = '#7ac96a'; g.strokeStyle = INK; g.lineWidth = r * 0.06;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, c = Math.cos(a), s = Math.sin(a); g.beginPath(); g.moveTo(x + c * r * 0.85 - s * r * 0.08, y + s * r * 0.85 + c * r * 0.08); g.lineTo(x + c * r * 1.12, y + s * r * 1.12); g.lineTo(x + c * r * 0.85 + s * r * 0.08, y + s * r * 0.85 - c * r * 0.08); g.closePath(); g.fill(); g.stroke(); }
  ell(g, x, y, r * 0.88, r * 0.88, '#8ee07a', 0, r * 0.07); ell(g, x, y + r * 0.3, r * 0.55, r * 0.5, '#e5ffd0');
  eyes(g, x, y, r, 0.34, -0.15, 0.22);
  ell(g, x, y + r * 0.35, r * 0.1, r * 0.12, '#ff7a8a', 0, r * 0.04);
}
function bubble(g, x, y, r) {
  ell(g, x, y, r * 0.95, r * 0.95, 'rgba(190,235,255,.55)', 0, r * 0.07);
  g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = r * 0.1; g.lineCap = 'round';
  g.beginPath(); g.arc(x, y, r * 0.7, Math.PI * 1.1, Math.PI * 1.55); g.stroke();
  ell(g, x + r * 0.35, y + r * 0.35, r * 0.1, r * 0.1, 'rgba(255,255,255,.9)');
  eyes(g, x, y, r, 0.3, 0.0, 0.17); smile(g, x, y + r * 0.3, r, 0.2, 0.1);
}
function pineapple(g, x, y, r) {
  g.lineJoin = 'round';
  g.fillStyle = '#4ac46a'; g.strokeStyle = INK; g.lineWidth = r * 0.06;
  for (const [a, h] of [[-0.55, 0.7], [0.55, 0.7], [-0.25, 0.95], [0.25, 0.95], [0, 1.05]]) { g.beginPath(); g.moveTo(x + a * r * 0.35, y - r * 0.5); g.quadraticCurveTo(x + a * r * 0.9, y - r * h * 0.9, x + a * r * 0.7 + (a ? 0 : 0), y - r * h * 1.05); g.quadraticCurveTo(x + a * r * 0.35 + r * 0.2, y - r * 0.8, x + a * r * 0.35 + r * 0.18, y - r * 0.5); g.closePath(); g.fill(); g.stroke(); }
  ell(g, x, y + r * 0.2, r * 0.7, r * 0.85, '#ffc233', 0, r * 0.07);
  g.strokeStyle = 'rgba(190,120,10,.55)'; g.lineWidth = r * 0.05;
  for (const k of [-0.4, 0, 0.4]) { g.beginPath(); g.moveTo(x + k * r - r * 0.25, y - r * 0.35); g.lineTo(x + k * r + r * 0.25, y + r * 1.0); g.stroke(); g.beginPath(); g.moveTo(x + k * r + r * 0.25, y - r * 0.35); g.lineTo(x + k * r - r * 0.25, y + r * 1.0); g.stroke(); }
  eyes(g, x, y + r * 0.0, r, 0.25, -0.05, 0.16); smile(g, x, y + r * 0.35, r, 0.22, 0.1);
}
export function seaChar(g, kind, x, y, r) {
  g.save();
  switch (kind) {
    case 0: sponge(g, x, y, r); break;
    case 1: jelly(g, x, y, r); break;
    case 2: starfish(g, x, y, r); break;
    case 3: crab(g, x, y, r); break;
    case 4: puffer(g, x, y, r); break;
    case 5: bubble(g, x, y, r); break;
    default: pineapple(g, x, y, r);
  }
  g.restore();
}
