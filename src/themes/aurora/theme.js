// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'aurora', name: 'Kuzey Işıkları', bg: '#071526', glow: '#1d4a5a', board: '#040d18', cell: '#0e2236', fg: '#eafcff', muted: '#8fb4c4', accent: '#7dffc4', ink: '#04121c', btn: '#123048', grey: '#3e5260',
  blocks: ['#3dffa8', '#2ee0d0', '#4ab0ff', '#7a84ff', '#b47aff', '#ff7ad8', '#a8ff6a'], style: 'aurora', amb: 'aurora', snd: { wave: 'sine', root: 587.33, bell: true, echo: true, kit: 'aurora' },
  fx: { p: 'star', g: -0.1, drag: 2, glow: true, flash: '#d8fff0' },
  unlock: { text: '7 farklı günde oyna', goal: 7, val: s => s.daysPlayed },
};
