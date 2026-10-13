// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'slime', name: 'Slime', bg: '#0b1a0c', glow: '#2c5e1c', board: '#061006', cell: '#132a12', fg: '#efffe6', muted: '#9cc48c', accent: '#9dff4a', ink: '#061006', btn: '#18361a', grey: '#4c5c48',
  blocks: ['#7ee03a', '#86e842', '#74d632', '#8cee4c', '#78dc36', '#82e43e', '#7ad838'], style: 'slime', amb: 'ooze', snd: { wave: 'sine', root: 392, kit: 'slime' },
  fx: { p: 'drop', g: 1, drag: 0.8, flash: '#d6ff9a' },
  unlock: { text: 'Tek oyunda 150 hamle yap', goal: 150, val: s => s.bestMoves },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
