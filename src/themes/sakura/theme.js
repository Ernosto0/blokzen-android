// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'sakura', name: 'Sakura', light: true, bg: '#efbccc', glow: '#fff4f7', board: '#cf8ca3', cell: '#e2a9bb', fg: '#4a1f30', muted: '#8a5065', accent: '#c93a68', ink: '#ffffff', btn: '#f8dbe4', grey: '#b89aa4', stroke: '#fff5f8',
  blocks: ['#e8506a', '#f39c5a', '#a3c955', '#43b89c', '#5a9be0', '#9a7ad8', '#e070ae'], style: 'candy', amb: 'petals', snd: { wave: 'triangle', root: 698.46, pluck: true },
  fx: { p: 'petal', g: 0.2, drag: 2.2, wobble: 1.2, flash: '#fff3f7' },
  unlock: { text: 'Tek oyunda 25.000 puan yap', goal: 25000, val: s => s.bestScore },
};
