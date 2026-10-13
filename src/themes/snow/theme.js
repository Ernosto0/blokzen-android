// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'snow', name: 'Kar Vadisi', light: true, bg: '#8db6db', glow: '#f0f8ff', board: '#5f8fbd', cell: '#79a4cc', fg: '#132c48', muted: '#3d5f82', accent: '#1d6ad0', ink: '#ffffff', btn: '#cfe2f3', grey: '#8a9db0', stroke: '#f2f8ff',
  blocks: ['#ee6f80', '#f4ad5f', '#86cf78', '#38c3c3', '#4f97ee', '#9a82f0', '#e07fc4'], style: 'frost', amb: 'snow', snd: { wave: 'sine', root: 659.25, bell: true, echo: true },
  fx: { p: 'flake', g: 0.18, drag: 2.4, wobble: 1, flash: '#ffffff' },
  unlock: { text: 'Tahtayı tamamen temizle', goal: 1, val: s => s.totalFulls },
};
