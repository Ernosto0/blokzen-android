// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'musicbox', name: 'Müzik Kutusu', bg: '#280d19', glow: '#682943', board: '#17070f', cell: '#2d1120', fg: '#fff0f4', muted: '#d0a0b4', accent: '#ffd27a', ink: '#17070f', btn: '#3d1929', grey: '#5a4650',
  blocks: ['#d8304a', '#e8902a', '#e8c840', '#2a9a6a', '#2a6ac8', '#7a3ab0', '#c83a8a'], style: 'lacquer', amb: 'musicbox', snd: { wave: 'sine', root: 783.99, bell: true, kit: 'musicbox' },
  fx: { p: 'note', g: -0.2, drag: 2, wobble: 0.6, flash: '#fff2c8' },
  unlock: { text: "Bir oyunda 10'lu kombo yap", goal: 10, val: s => s.bestCombo },
};
