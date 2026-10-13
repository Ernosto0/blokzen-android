// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'chalk', name: 'Kara Tahta', bg: '#1c3a2d', glow: '#2e5845', board: '#12261c', cell: '#1f3d2e', fg: '#f3f1e6', muted: '#a6bfae', accent: '#ffe27a', ink: '#12261c', btn: '#284e3b', grey: '#4d6356',
  blocks: ['#f28b82', '#f7b267', '#f3df78', '#9be08f', '#8ecdf0', '#c3a6f0', '#f5a3cf'], style: 'chalk', amb: 'blackboard', snd: { wave: 'triangle', root: 440, kit: 'chalk' },
  fx: { p: 'chalkdust', g: 0.3, drag: 2.6, wobble: 0.4, flash: '#f6f4ea' },
  unlock: { text: 'Bulmacada kaybettiğin 3 farklı bölümü sonradan 3 yıldızla bitir', goal: 3, val: s => s.puzzleBack, puzzle: true },
};
