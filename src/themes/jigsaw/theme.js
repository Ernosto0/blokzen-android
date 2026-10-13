// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'jigsaw', name: 'Yapboz', light: true, bg: '#e9dcc4', glow: '#fbf3e3', board: '#c4ad86', cell: '#d8c6a2', fg: '#3a2c1c', muted: '#76603f', accent: '#d2502a', ink: '#ffffff', btn: '#f6eddc', grey: '#b3a58c', stroke: '#fbf3e3',
  blocks: ['#e4604f', '#ee9f3e', '#e6c548', '#6fb25e', '#4f9fd4', '#8a72cc', '#de6fa2'], style: 'jigsaw', amb: 'jigsawtable', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'jigsaw' },
  fx: { p: 'piece', g: 0.9, drag: 0.6, flash: '#fff8ec' },
  unlock: { text: 'Bulmacada ilk bölümünü bitir', goal: 1, val: s => s.puzzleWins, puzzle: true },
};
