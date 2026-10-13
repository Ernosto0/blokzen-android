// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'neon', name: 'Neon Şehir', bg: '#07060f', glow: '#2c0c40', board: '#050409', cell: '#120f22', fg: '#f2f0ff', muted: '#8f86b8', accent: '#ff3dc8', ink: '#07060f', btn: '#1a1430', grey: '#3e3a55',
  blocks: ['#ff3b6b', '#ff9e2c', '#e8ff3a', '#2bffb8', '#2ad4ff', '#8a5cff', '#ff4fd8'], style: 'neon', amb: 'grid', snd: { wave: 'square', root: 523.25, gain: 0.45 },
  fx: { p: 'streak', g: 0.45, drag: 0.8, glow: true, flash: null },
  unlock: { text: 'Toplam 150 sıra temizle', goal: 150, val: s => s.totalLines },
};
