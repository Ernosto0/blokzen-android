/* ---------- Constants ---------- */
export const N = 8;
export const OS_REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const SAVE_KEY = 'blokzen.game.v2', OLD_SAVE_KEY = 'blokzen.game.v1', BEST_KEY = 'blokzen.best', MUTE_KEY = 'blokzen.mute', PREFS_KEY = 'blokzen.prefs', TUT_KEY = 'blokzen.tutorial', THEME_KEY = 'blokzen.themes';
export const OLD_COLORS = ['#ff6b5b', '#ffb23f', '#9ad94f', '#2ec4b6', '#4aa8ff', '#a77bff', '#ff6fb5'];
export const GREY = 8; // cell value for the game-over grey

// [rows, weight]; order is fixed (saved games refer to shapes by index)
const RAW = [
  [['#'], 0.5],
  [['##'], 0.9], [['#', '#'], 0.9],
  [['###'], 1.6], [['#', '#', '#'], 1.6],
  [['####'], 1.6], [['#', '#', '#', '#'], 1.6],
  [['#####'], 1.2], [['#', '#', '#', '#', '#'], 1.2],
  [['##', '##'], 3.6],
  [['###', '###', '###'], 2.6],
  [['###', '###'], 2.4], [['##', '##', '##'], 2.4],
  [['#.', '##'], 0.45], [['.#', '##'], 0.45], [['##', '#.'], 0.45], [['##', '.#'], 0.45],
  [['#.', '#.', '##'], 0.55], [['.#', '.#', '##'], 0.55], [['##', '#.', '#.'], 0.55], [['##', '.#', '.#'], 0.55],
  [['###', '#..'], 0.55], [['###', '..#'], 0.55], [['#..', '###'], 0.55], [['..#', '###'], 0.55],
  [['###', '.#.'], 0.55], [['.#.', '###'], 0.55], [['#.', '##', '#.'], 0.55], [['.#', '##', '.#'], 0.55],
  [['##.', '.##'], 0.4], [['.##', '##.'], 0.4], [['#.', '##', '.#'], 0.4], [['.#', '##', '#.'], 0.4],
  [['###', '#..', '#..'], 0.5], [['###', '..#', '..#'], 0.5], [['#..', '#..', '###'], 0.5], [['..#', '..#', '###'], 0.5],
];

export const SHAPES = RAW.map(([m, weight], id) => {
  const cells = [];
  m.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') cells.push([r, c]); }));
  const h = m.length, w = Math.max(...m.map(s => s.length));
  const pos = [];
  for (let r = 0; r + h <= N; r++) for (let c = 0; c + w <= N; c++) {
    let lo = 0, hi = 0;
    for (const [dr, dc] of cells) {
      const i = (r + dr) * N + (c + dc);
      if (i < 32) lo |= 1 << i; else hi |= 1 << (i - 32);
    }
    pos.push({ r, c, lo: lo >>> 0, hi: hi >>> 0 });
  }
  return { id, cells, w, h, weight, size: cells.length, pos };
});
