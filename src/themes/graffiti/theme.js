// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'graffiti', name: 'Graffiti Duvarı', bg: '#1e1a1c', glow: '#4a3a40', board: '#121012', cell: '#242024', fg: '#ffffff', muted: '#b0a8ac', accent: '#c8ff3a', ink: '#121012', btn: '#2e282c', grey: '#555055',
  blocks: ['#ff3d5a', '#ff9a1a', '#ffe81a', '#3dff7a', '#1ad8ff', '#8a5aff', '#ff4ad8'], style: 'spray', amb: 'graffiti', snd: { wave: 'square', root: 392, gain: 0.3, kit: 'spray' },
  fx: { p: 'drop', g: 1.1, drag: 0.4, flash: null },
  unlock: { text: 'Tek oyunda 50.000 puan yap', goal: 50000, val: s => s.bestScore },
};
