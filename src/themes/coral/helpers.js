export function fishShape(g, x, y, r, dir, fill, wag = 0) {
  g.save(); g.translate(x, y); g.scale(dir, 1);
  g.beginPath(); g.ellipse(0, 0, r, r * 0.45, 0, 0, Math.PI * 2);
  g.moveTo(-r * 0.75, 0); g.lineTo(-r * 1.5, -r * 0.45 * (1 + 0.25 * wag)); g.lineTo(-r * 1.5, r * 0.45 * (1 - 0.25 * wag)); g.closePath();
  g.fillStyle = fill; g.fill();
  g.restore();
}
