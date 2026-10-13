// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'carnival', name: 'Lunapark', bg: '#1a0a2a', glow: '#4a1a6a', board: '#0e0618', cell: '#22103a', fg: '#fff6e0', muted: '#c0a0d8', accent: '#ffd23a', ink: '#0e0618', btn: '#2e1846', grey: '#4e4460',
  blocks: ['#ff3a4a', '#ff9a2a', '#ffd83a', '#3ad86a', '#3aa8ff', '#a85aff', '#ff5ac8'], style: 'marquee', amb: 'carnival', snd: { wave: 'square', root: 523.25, gain: 0.35, kit: 'carnival' },
  fx: { p: 'confetti', g: 0.5, drag: 1.8, wobble: 0.8, flash: '#fff6d0' },
  unlock: { text: 'Tek oyunda 250.000 puan yap', goal: 250000, val: s => s.bestScore },
};
