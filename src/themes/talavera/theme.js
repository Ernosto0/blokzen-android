// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'talavera', name: 'Talavera', bg: '#1e3a78', glow: '#4a7ad0', board: '#122650', cell: '#1e3666', fg: '#fff8ec', muted: '#a8c0e8', accent: '#ffc83a', ink: '#122650', btn: '#264684', grey: '#5a6a8a',
  blocks: ['#1e4fb8', '#e8a81a', '#e86a1a', '#2a9a5a', '#c83a3a', '#6a4ab0', '#1aa0b0'], style: 'talavera', amb: 'plaza', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'mariachi' },
  fx: { p: 'flag', g: 0.3, drag: 2, wobble: 1, flash: '#ffffff' },
  unlock: { text: "Zen'de tahtayı toplam 5 kez tamamen temizle", goal: 5, val: s => s.zenFulls, zen: true },
};
