// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'coral', name: 'Mercan Resifi', bg: '#083444', glow: '#16707e', board: '#041e28', cell: '#0c3e4c', fg: '#eafffb', muted: '#86c2c6', accent: '#ff8a6a', ink: '#041e28', btn: '#0e4a58', grey: '#4a666c',
  blocks: ['#ff6a5a', '#ff9f4a', '#ffd25a', '#ff6f9e', '#c47aff', '#4ad8c8', '#7ae07a'], style: 'coral', amb: 'reef', snd: { wave: 'sine', root: 493.88, echo: true, kit: 'reef' },
  fx: { p: 'fish', g: -0.05, drag: 2, wobble: 0.6, flash: '#ffe6dc' },
  unlock: { text: 'Bir oyunda 10 kez tek hamlede 2+ sıra temizle', goal: 10, val: s => s.bestMulti },
};
