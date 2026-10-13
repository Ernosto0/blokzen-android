// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'space', name: 'Derin Uzay', bg: '#050a1f', glow: '#1b2c6e', board: '#030616', cell: '#0f1a3a', fg: '#eef2ff', muted: '#8e9bd0', accent: '#8fd3ff', ink: '#030616', btn: '#121f48', grey: '#3f4a6e',
  blocks: ['#ff6b9d', '#ffb86b', '#d6f56b', '#5cf0d0', '#5aa2ff', '#9d7dff', '#e47dff'], style: 'cosmic', amb: 'stars', snd: { wave: 'sine', root: 523.25, echo: true, bell: true },
  fx: { p: 'star', g: 0.12, drag: 1.6, glow: true, flash: '#dfe9ff' },
  unlock: { text: 'Tek oyunda 100.000 puan yap', goal: 100000, val: s => s.bestScore },
};
