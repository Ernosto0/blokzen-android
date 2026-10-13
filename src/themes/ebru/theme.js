// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'ebru', name: 'Ebru', bg: '#122030', glow: '#2e4a6a', board: '#0a131d', cell: '#18283a', fg: '#f6f2ea', muted: '#a8b4c4', accent: '#ffb84a', ink: '#0a131d', btn: '#1e3246', grey: '#4c5866',
  blocks: ['#e8485a', '#f5a03a', '#f0d84a', '#3ab87a', '#3a96d8', '#7a58d0', '#e868b8'], style: 'ebru', amb: 'ebru', snd: { wave: 'sine', root: 440, echo: true, kit: 'ebru' },
  fx: { p: 'ring', g: -0.05, drag: 3, flash: '#fff6e8' },
  unlock: { text: '10 farklı temada oyun bitir', goal: 10, val: s => s.themesDone },
};
