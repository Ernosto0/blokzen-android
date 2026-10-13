// hieroglyphs: eye, water, sun disc, feather (path only, stroked by the caller)
export function glyph(g, kind, x, y, r) {
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
