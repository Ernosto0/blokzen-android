// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'kawaii', name: 'Kawaii Kedi', light: true, bg: '#ffc9e3', glow: '#fff2f9', board: '#f59cc8', cell: '#ffbedb', fg: '#6b1d4a', muted: '#a8527f', accent: '#e8317f', ink: '#ffffff', btn: '#ffe2f0', grey: '#c9a9ba', stroke: '#fff6fb',
  // the order matters: each colour has its own character (kitty, imp, puppy, heart, star, bow, blue kitty)
  blocks: ['#ff8fb8', '#b693f2', '#8ed2ff', '#ff7aa5', '#ffd95e', '#ffa6d8', '#9ae6cc'], style: 'kawaii', amb: 'kawaii', snd: { wave: 'sine', root: 783.99, pluck: true, bell: true, echo: true, kit: 'kawaii' },
  fx: { p: 'kawaii', g: 0.35, drag: 1.6, wobble: 0.8, flash: '#fff0f8', edge: true }, // edge: rows and columns celebrate from the board's edges
  unlock: { text: 'Fiyonk yap: aynı hamlede hem satırı hem sütunu temizle (7 kez)', goal: 7, val: s => s.crossMoves },
};
