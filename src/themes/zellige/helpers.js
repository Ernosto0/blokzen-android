// eight-pointed star (two squares at 45°), the heart of zellige tilework
export function star8(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 16; i++) {
    const an = i * Math.PI / 8 - Math.PI / 2, rad = i % 2 ? r * 0.765 : r;
    i ? g.lineTo(x + Math.cos(an) * rad, y + Math.sin(an) * rad) : g.moveTo(x + Math.cos(an) * rad, y + Math.sin(an) * rad);
  }
  g.closePath();
}
