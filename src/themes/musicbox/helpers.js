export function noteShape(g, x, y, r) { // eighth note, filled with the current fillStyle
  g.save(); g.translate(x, y);
  g.beginPath(); g.ellipse(-r * 0.2, r * 0.55, r * 0.32, r * 0.22, -0.4, 0, Math.PI * 2); g.fill();
  g.fillRect(r * 0.04, -r * 0.75, r * 0.1, r * 1.3);
  g.beginPath(); g.moveTo(r * 0.14, -r * 0.75); g.quadraticCurveTo(r * 0.55, -r * 0.45, r * 0.42, -r * 0.05); g.quadraticCurveTo(r * 0.42, -r * 0.35, r * 0.14, -r * 0.42); g.fill();
  g.restore();
}
