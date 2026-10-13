// domino pips laid out on a square of side sz; the colour of a block picks how many
const PIP = [[], [[0.5, 0.5]], [[0.27, 0.27], [0.73, 0.73]], [[0.27, 0.27], [0.5, 0.5], [0.73, 0.73]],
  [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]], [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]],
  [[0.27, 0.24], [0.73, 0.24], [0.27, 0.5], [0.73, 0.5], [0.27, 0.76], [0.73, 0.76]]];

export function pips(g, x, y, sz, n, col, rad, sunk = true) {
  for (const [u, v] of PIP[n]) {
    const px = x + u * sz, py = y + v * sz;
    if (sunk) { g.beginPath(); g.arc(px, py + rad * 0.2, rad, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill(); } // the lower lip of the drilled hole catches the light
    g.beginPath(); g.arc(px, py, rad, 0, Math.PI * 2); g.fillStyle = col; g.fill();
  }
}
