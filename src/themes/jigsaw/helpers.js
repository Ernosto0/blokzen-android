// a jigsaw piece on the square x0, y0, L. e: [top, right, bottom, left], 1 a knob out, -1 a socket in, 0 flat; kn scales the tab
export function jigPath(g, x0, y0, L, e, kn = 0.7) {
  const C = [[x0, y0], [x0 + L, y0], [x0 + L, y0 + L], [x0, y0 + L]], NRM = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  g.beginPath(); g.moveTo(x0, y0);
  for (let k = 0; k < 4; k++) {
    const [ax, ay] = C[k], [bx, by] = C[(k + 1) % 4], dx = bx - ax, dy = by - ay, d = e[k] * kn, [nx, ny] = NRM[k];
    if (d) {
      const P = (u, v) => [ax + dx * u + nx * v * d * L, ay + dy * u + ny * v * d * L]; // the tab is symmetric, so two neighbours trace the same curve
      g.lineTo(...P(0.37, 0));
      g.bezierCurveTo(...P(0.43, 0), ...P(0.4, 0.1), ...P(0.36, 0.15));
      g.bezierCurveTo(...P(0.3, 0.26), ...P(0.42, 0.32), ...P(0.5, 0.32));
      g.bezierCurveTo(...P(0.58, 0.32), ...P(0.7, 0.26), ...P(0.64, 0.15));
      g.bezierCurveTo(...P(0.6, 0.1), ...P(0.57, 0), ...P(0.63, 0));
    }
    g.lineTo(bx, by);
  }
  g.closePath();
}
