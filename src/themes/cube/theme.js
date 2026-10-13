// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'cube', name: 'Sihirli Küp', bg: '#1a1d2e', glow: '#353b5e', board: '#0e1020', cell: '#232741', fg: '#f2f4ff', muted: '#a3a9c8', accent: '#ffd23a', ink: '#0e1020', btn: '#2a2f4c', grey: '#4f5470',
  blocks: ['#f4f4f0', '#ffd23a', '#e8333a', '#ff8a1e', '#2a6ce8', '#22b04a', '#9a5ae0'], style: 'cubeface', amb: 'cubes', snd: { wave: 'triangle', root: 523.25, kit: 'cube' },
  fx: { p: 'sticker', g: 1, drag: 0.4, flash: '#ffffff' },
  unlock: { text: 'Bulmacada tek hamlede bir satırı ve bir sütunu birlikte temizle, 5 kez', goal: 5, val: s => s.puzzleCross, puzzle: true },
};
