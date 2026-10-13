// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'domino', name: 'Domino', bg: '#3a1420', glow: '#6a2434', board: '#22080e', cell: '#481a25', fg: '#fff3ea', muted: '#d4a3ad', accent: '#f2c14e', ink: '#22080e', btn: '#4f1f2c', grey: '#6a4f55',
  blocks: ['#d23440', '#e5852a', '#d9a826', '#2f9a5a', '#2f6fc8', '#7a46b8', '#26232a'], style: 'domino', amb: 'dominorun', snd: { wave: 'triangle', root: 493.88, kit: 'domino' },
  fx: { p: 'bone', g: 1, drag: 0.4, flash: '#fff4dc' },
  unlock: { text: 'Bulmacada tek hamlede 3 taşı birden temizle', goal: 3, val: s => s.puzzleBestGems, fmt: (h, g) => `${h} / ${g} taş`, puzzle: true },
};
