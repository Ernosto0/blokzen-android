// a papel picado flag: zigzag hem and cut-out holes (fill with 'evenodd')
export function papelPath(g, x, y, fw, fh) {
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + fw, y); g.lineTo(x + fw, y + fh * 0.82);
  for (let i = 5; i >= 0; i--) g.lineTo(x + fw * i / 6, y + fh * (i % 2 ? 1 : 0.82));
  g.closePath();
  const cx = x + fw / 2, cy = y + fh * 0.42, r = fw * 0.16;
  g.moveTo(cx, cy - r); g.lineTo(cx + r, cy); g.lineTo(cx, cy + r); g.lineTo(cx - r, cy); g.closePath();
  for (const dx of [-0.32, 0.32]) { g.moveTo(cx + dx * fw + fw * 0.06, cy); g.arc(cx + dx * fw, cy, fw * 0.06, 0, Math.PI * 2); }
}
