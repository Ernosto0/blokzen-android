// alchemical signs, stroked with the current strokeStyle: fire, water, air, earth, sun, moon, salt
export function alchemySign(g, kind, x, y, r) {
  g.beginPath();
  const tri = up => { const d = up ? -1 : 1; g.moveTo(x, y + d * r); g.lineTo(x + r * 0.9, y - d * r * 0.6); g.lineTo(x - r * 0.9, y - d * r * 0.6); g.closePath(); };
  if (kind < 4) { tri(kind % 2 === 0); if (kind >= 2) { const d = kind === 2 ? 1 : -1; g.moveTo(x - r * 0.75, y + d * r * 0.1); g.lineTo(x + r * 0.75, y + d * r * 0.1); } }
  else if (kind === 4) { g.arc(x, y, r * 0.85, 0, Math.PI * 2); g.moveTo(x + r * 0.16, y); g.arc(x, y, r * 0.16, 0, Math.PI * 2); }
  else if (kind === 5) { g.arc(x, y, r * 0.85, Math.PI * 0.35, Math.PI * 1.65); g.arc(x + r * 0.42, y, r * 0.62, Math.PI * 1.25, Math.PI * 0.75, true); }
  else { g.arc(x, y, r * 0.85, 0, Math.PI * 2); g.moveTo(x - r * 0.85, y); g.lineTo(x + r * 0.85, y); }
  g.stroke();
}
