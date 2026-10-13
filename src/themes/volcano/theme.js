// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'volcano', name: 'Volkan', bg: '#1a0806', glow: '#5a160a', board: '#0e0403', cell: '#2a0e09', fg: '#fff0e6', muted: '#c08a76', accent: '#ff8a2a', ink: '#1a0806', btn: '#3a140c', grey: '#5a403a',
  blocks: ['#ff3d2e', '#ff7f1f', '#ffcc33', '#8fe05a', '#36c2d6', '#a66bff', '#ff4f9a'], style: 'lava', amb: 'embers', snd: { wave: 'triangle', root: 392 },
  fx: { p: 'ember', g: -0.45, drag: 1.4, wobble: 0.4, glow: true, flash: '#ffd27a' },
  unlock: { text: 'Bir oyunda tahtayı 3 kez temizle', goal: 3, val: s => s.bestFulls },
};
