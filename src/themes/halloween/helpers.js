export function batShape(g, x, y, r, flap, fill, flip) {
  g.save(); g.translate(x, y); if (flip) g.scale(-1, 1);
  const wy = -r * 0.6 * flap;
  g.beginPath();
  g.moveTo(0, -r * 0.3);
  g.lineTo(r * 0.35, -r * 0.15 + wy * 0.4); g.lineTo(r * 1.15, wy - r * 0.15); g.lineTo(r * 0.9, wy + r * 0.2); g.lineTo(r * 0.6, wy * 0.6 + r * 0.15); g.lineTo(r * 0.3, r * 0.3);
  g.lineTo(0, r * 0.2);
  g.lineTo(-r * 0.3, r * 0.3); g.lineTo(-r * 0.6, wy * 0.6 + r * 0.15); g.lineTo(-r * 0.9, wy + r * 0.2); g.lineTo(-r * 1.15, wy - r * 0.15); g.lineTo(-r * 0.35, -r * 0.15 + wy * 0.4);
  g.closePath(); g.fillStyle = fill; g.fill();
  g.beginPath(); g.moveTo(-r * 0.15, -r * 0.3); g.lineTo(-r * 0.1, -r * 0.5); g.lineTo(0, -r * 0.32); g.lineTo(r * 0.1, -r * 0.5); g.lineTo(r * 0.15, -r * 0.3); g.fill();
  g.restore();
}
