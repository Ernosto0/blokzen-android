// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'forest', name: 'Ateşböceği Ormanı', bg: '#0c1c14', glow: '#21452f', board: '#07120c', cell: '#15301f', fg: '#eef7e4', muted: '#93b49a', accent: '#d8f36a', ink: '#07120c', btn: '#1a3826', grey: '#4f6455',
  blocks: ['#d9573b', '#eaa53a', '#a8d24a', '#43b97a', '#3aa7b8', '#9a86e0', '#d85f8f'], style: 'leaf', amb: 'fireflies', snd: { wave: 'sine', root: 440, marimba: true },
  fx: { p: 'firefly', g: -0.08, drag: 2.6, wobble: 1, glow: true, flash: '#eaff9a' },
  unlock: { text: "Bir oyunda 4'lü kombo yap", goal: 4, val: s => s.bestCombo },
};
