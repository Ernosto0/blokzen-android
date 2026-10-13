// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'gelato', name: 'Gelato', light: true, bg: '#fbe4d6', glow: '#fffaf4', board: '#dcae84', cell: '#e8c4a0', fg: '#4a2a1a', muted: '#8a5a44', accent: '#e2447a', ink: '#ffffff', btn: '#fff2ea', grey: '#c0b0a4', stroke: '#fffaf4',
  blocks: ['#ff8fa0', '#ffb47a', '#ffe48a', '#9ad890', '#8acaf0', '#bea0ea', '#8a5a3a'], style: 'gelato', amb: 'gelateria', snd: { wave: 'triangle', root: 659.25, pluck: true, kit: 'gelato' },
  fx: { p: 'sprinkle', g: 0.9, flash: '#ffffff' },
  unlock: { text: 'Bir günde 5 oyun oyna', goal: 5, val: s => s.bestDayGames },
};
