// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'sushi', name: 'Sushi Bar', bg: '#1a1414', glow: '#4a2a24', board: '#0e0a0a', cell: '#221a18', fg: '#fff6ee', muted: '#c4aa9a', accent: '#ff5a3a', ink: '#0e0a0a', btn: '#2e2220', grey: '#504644',
  blocks: ['#ff8a5a', '#d8344a', '#f2c84a', '#6ab84a', '#f2e8da', '#c8607a', '#3a6a4a'], style: 'sushi', amb: 'sushibar', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'sushi' },
  fx: { p: 'rice', g: 1, flash: '#fff4e8' },
  unlock: { text: 'Art arda 3 oyunda 10.000+ puan yap', goal: 3, val: s => s.bestStreak10k },
};
