// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'alchemy', name: 'Simya Atölyesi', bg: '#1e1428', glow: '#42295c', board: '#120b1a', cell: '#271a35', fg: '#f6eedc', muted: '#bba8cc', accent: '#86f0a8', ink: '#120b1a', btn: '#2f2140', grey: '#584a66',
  blocks: ['#e8434a', '#f2913a', '#f2d24a', '#52d07a', '#3ab0e0', '#9a62e8', '#e85ab0'], style: 'flask', amb: 'alchemylab', snd: { wave: 'sine', root: 466.16, echo: true, kit: 'alchemy' },
  fx: { p: 'rune', g: -0.3, drag: 1.8, wobble: 0.5, glow: true, flash: '#d8ffe4' },
  unlock: { text: 'Bulmacada toplam 50 taş kır', goal: 50, val: s => s.puzzleGemsTotal, fmt: (h, g) => `${h} / ${g} taş`, puzzle: true },
};
