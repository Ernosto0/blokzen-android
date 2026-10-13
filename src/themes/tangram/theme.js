// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'tangram', name: 'Tangram', light: true, bg: '#efe7d6', glow: '#fbf6ec', board: '#c6b99d', cell: '#dbcfb6', fg: '#2b2620', muted: '#6c6250', accent: '#c8402d', ink: '#ffffff', btn: '#f8f2e6', grey: '#b3aa98', stroke: '#fbf6ec',
  blocks: ['#e04b3a', '#f29b2e', '#efc23a', '#3aa86a', '#2f86c8', '#6a52b8', '#e0609a'], style: 'tangram', amb: 'tans', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'tangram' },
  fx: { p: 'tan', g: 0.8, drag: 0.6, flash: '#ffffff' },
  unlock: { text: 'Bulmacada dört hedef türünün her birinde bir bölümü 3 yıldızla bitir', goal: 4, val: s => s.puzzleTypes3, fmt: (h, g) => `${h} / ${g} tür`, puzzle: true },
};
