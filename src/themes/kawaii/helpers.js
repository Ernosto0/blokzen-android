// Little round-faced characters drawn from simple shapes: 0 kitty with a red bow, 1 mischievous hooded imp with a skull,
// 2 floppy-eared puppy, 3 heart, 4 star, 5 ribbon bow, 6 kitty with a blue bow. Full colour; r is about half the size.
const INK = '#5a2a45', PINK = '#ff8fb8';

function ell(g, x, y, rx, ry, fill, rot = 0, line = 0) {
  g.beginPath(); g.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot, 0, Math.PI * 2);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (line) { g.lineWidth = line; g.strokeStyle = INK; g.stroke(); }
}
function eyes(g, x, y, r, dx, dy, w, h, col = INK) {
  for (const s of [-1, 1]) { ell(g, x + s * dx * r, y + dy * r, w * r, h * r, col); ell(g, x + s * dx * r - w * r * 0.25, y + dy * r - h * r * 0.35, w * r * 0.3, h * r * 0.28, '#fff'); }
}
function blush(g, x, y, r, dx, dy, col = 'rgba(255,110,160,.5)') { for (const s of [-1, 1]) ell(g, x + s * dx * r, y + dy * r, r * 0.17, r * 0.1, col); }
function bowAt(g, x, y, r, col) { // a ribbon bow centred on x, y
  const w = r * 0.5, h = r * 0.34;
  g.lineJoin = 'round';
  for (const s of [-1, 1]) {
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + s * w * 0.5, y - h * 1.5, x + s * w, y - h); g.quadraticCurveTo(x + s * w * 1.1, y, x + s * w, y + h); g.quadraticCurveTo(x + s * w * 0.5, y + h * 1.5, x, y); g.closePath();
    g.fillStyle = col; g.fill(); g.lineWidth = r * 0.05; g.strokeStyle = INK; g.stroke();
  }
  ell(g, x, y, r * 0.11, r * 0.13, col, 0, r * 0.05);
}
function kitty(g, x, y, r, bow) {
  g.lineJoin = 'round';
  for (const s of [-1, 1]) { // ears
    g.beginPath(); g.moveTo(x + s * r * 0.92, y - r * 0.05); g.lineTo(x + s * r * 0.8, y - r * 0.92); g.lineTo(x + s * r * 0.15, y - r * 0.6); g.closePath();
    g.fillStyle = '#fff'; g.fill(); g.lineWidth = r * 0.07; g.strokeStyle = INK; g.stroke();
  }
  ell(g, x, y + r * 0.1, r * 0.98, r * 0.78, '#fff', 0, r * 0.07);
  eyes(g, x, y, r, 0.5, 0.1, 0.085, 0.12);
  ell(g, x, y + r * 0.3, r * 0.12, r * 0.075, '#ffc21a', 0, r * 0.03);
  g.strokeStyle = INK; g.lineWidth = r * 0.04; g.lineCap = 'round';
  for (const s of [-1, 1]) for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(x + s * r * 0.72, y + r * (0.22 + k * 0.1)); g.lineTo(x + s * r * 1.12, y + r * (0.16 + k * 0.2)); g.stroke(); }
  bowAt(g, x + r * 0.6, y - r * 0.62, r, bow);
}
function imp(g, x, y, r) {
  const HOOD = '#3d2a5c';
  g.lineJoin = 'round';
  for (const s of [-1, 1]) { // long floppy ears
    ell(g, x + s * r * 0.62, y - r * 0.72, r * 0.26, r * 0.62, HOOD, s * 0.35);
    ell(g, x + s * r * 0.64, y - r * 0.7, r * 0.13, r * 0.4, PINK, s * 0.35);
  }
  ell(g, x, y + r * 0.02, r * 0.98, r * 0.82, HOOD, 0, r * 0.05);
  ell(g, x, y + r * 0.22, r * 0.78, r * 0.6, '#fff', 0, r * 0.05);
  ell(g, x, y - r * 0.5, r * 0.2, r * 0.17, PINK); // the skull on the hood
  ell(g, x, y - r * 0.36, r * 0.1, r * 0.08, PINK);
  for (const s of [-1, 1]) ell(g, x + s * r * 0.07, y - r * 0.51, r * 0.045, r * 0.05, HOOD);
  eyes(g, x, y, r, 0.36, 0.2, 0.08, 0.11);
  ell(g, x, y + r * 0.4, r * 0.09, r * 0.06, '#ff5a96');
  blush(g, x, y, r, 0.56, 0.42);
  g.strokeStyle = INK; g.lineWidth = r * 0.04; g.lineCap = 'round'; // a cheeky grin
  g.beginPath(); g.moveTo(x - r * 0.14, y + r * 0.5); g.quadraticCurveTo(x, y + r * 0.6, x + r * 0.14, y + r * 0.5); g.stroke();
}
function puppy(g, x, y, r) {
  for (const s of [-1, 1]) { ell(g, x + s * r * 0.95, y + r * 0.22, r * 0.3, r * 0.62, '#dff1ff', s * 0.18, r * 0.06); ell(g, x + s * r * 0.97, y + r * 0.3, r * 0.14, r * 0.38, '#bfe0ff', s * 0.18); }
  ell(g, x, y, r * 0.98, r * 0.82, '#fff', 0, r * 0.07);
  g.strokeStyle = '#9ccfff'; g.lineWidth = r * 0.07; g.lineCap = 'round'; // the curl on the forehead
  g.beginPath(); g.arc(x, y - r * 0.6, r * 0.1, Math.PI * 0.2, Math.PI * 1.9); g.stroke();
  eyes(g, x, y, r, 0.46, 0.08, 0.09, 0.125, '#3b7fd0');
  ell(g, x, y + r * 0.27, r * 0.09, r * 0.065, '#ff8fb0');
  blush(g, x, y, r, 0.68, 0.32);
  g.strokeStyle = INK; g.lineWidth = r * 0.035;
  g.beginPath(); g.moveTo(x - r * 0.12, y + r * 0.38); g.quadraticCurveTo(x, y + r * 0.48, x + r * 0.12, y + r * 0.38); g.stroke();
}
function heart(g, x, y, r) {
  g.beginPath(); g.moveTo(x, y + r * 0.92);
  g.bezierCurveTo(x - r * 1.4, y + r * 0.1, x - r * 0.95, y - r * 0.95, x, y - r * 0.4);
  g.bezierCurveTo(x + r * 0.95, y - r * 0.95, x + r * 1.4, y + r * 0.1, x, y + r * 0.92); g.closePath();
  g.fillStyle = '#ff6f9f'; g.fill(); g.lineWidth = r * 0.07; g.lineJoin = 'round'; g.strokeStyle = INK; g.stroke();
  ell(g, x - r * 0.5, y - r * 0.28, r * 0.17, r * 0.1, 'rgba(255,255,255,.7)', -0.6);
  eyes(g, x, y, r, 0.3, 0.05, 0.08, 0.11);
  g.strokeStyle = INK; g.lineWidth = r * 0.04; g.lineCap = 'round';
  g.beginPath(); g.arc(x, y + r * 0.2, r * 0.1, 0.2, Math.PI - 0.2); g.stroke();
  blush(g, x, y, r, 0.5, 0.22);
}
function star(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * 0.5 : r * 1.0; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d + r * 0.05); }
  g.closePath(); g.fillStyle = '#ffd84a'; g.fill(); g.lineWidth = r * 0.1; g.lineJoin = 'round'; g.strokeStyle = INK; g.stroke();
  eyes(g, x, y, r, 0.22, 0.1, 0.07, 0.1);
  g.strokeStyle = INK; g.lineWidth = r * 0.035; g.lineCap = 'round';
  g.beginPath(); g.arc(x, y + r * 0.22, r * 0.08, 0.2, Math.PI - 0.2); g.stroke();
  blush(g, x, y, r, 0.36, 0.24);
}
export function kawaiiChar(g, kind, x, y, r) {
  g.save();
  switch (kind) {
    case 0: kitty(g, x, y, r, '#f0384f'); break;
    case 1: imp(g, x, y, r); break;
    case 2: puppy(g, x, y, r); break;
    case 3: heart(g, x, y, r); break;
    case 4: star(g, x, y, r); break;
    case 5: bowAt(g, x, y, r * 1.7, '#ff5a96'); break;
    default: kitty(g, x, y, r, '#4aa8ff');
  }
  g.restore();
}
