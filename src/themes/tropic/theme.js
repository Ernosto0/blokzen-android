// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'tropic', name: 'Tropik Ada', light: true, bg: '#98dcd4', glow: '#fff8e0', board: '#d8b47c', cell: '#e6c896', fg: '#143a36', muted: '#3a6a64', accent: '#f0602e', ink: '#ffffff', btn: '#e6f8f4', grey: '#b8b0a0', stroke: '#fffaf0',
  blocks: ['#e8503a', '#f59a2a', '#f0c83a', '#4aa84a', '#22a8b8', '#3a72d0', '#e0569a'], style: 'tiki', amb: 'island', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'ukulele' },
  fx: { p: 'drop', g: 1.1, drag: 0.5, flash: '#ffffff' },
  unlock: { text: 'Tahtayı toplam 25 kez temizle', goal: 25, val: s => s.totalFulls },
};
