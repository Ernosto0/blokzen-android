// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'bojagi', name: 'Bojagi', light: true, bg: '#efe4e8', glow: '#fffaf8', board: '#c4aab4', cell: '#d8c4cc', fg: '#3a2430', muted: '#7a5a68', accent: '#c83a5a', ink: '#ffffff', btn: '#fbf2f5', grey: '#b8a8ae', stroke: '#fffaf8',
  blocks: ['#e8506a', '#f0b040', '#3a9a7a', '#4a78c8', '#a85ac0', '#ec8a5a', '#4ab8c0'], style: 'bojagi', amb: 'hanok', snd: { wave: 'sine', root: 587.33, pluck: true, kit: 'gayageum' },
  fx: { p: 'silk', g: 0.2, drag: 2.2, wobble: 1.1, flash: '#ffffff' },
  unlock: { text: "Zen'de tahta 25 kez nefes alsın", goal: 25, val: s => s.zenBreaths, zen: true },
};
