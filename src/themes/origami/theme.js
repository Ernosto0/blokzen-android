// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'origami', name: 'Kâğıt Origami', light: true, bg: '#f3ead8', glow: '#fffaf0', board: '#d8c8a8', cell: '#e6d8bc', fg: '#3a2e20', muted: '#7a6a52', accent: '#e2553a', ink: '#ffffff', btn: '#fbf4e6', grey: '#b0a898', stroke: '#fffaf0',
  blocks: ['#f26b5b', '#f5a04a', '#f2d25a', '#7cc77a', '#55aee0', '#8c7ee0', '#e47ab4'], style: 'paper', amb: 'cranes', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'paper' },
  fx: { p: 'paper', g: 0.4, drag: 2, wobble: 1, flash: '#ffffff' },
  unlock: { text: 'Toplam 1.000 sıra temizle', goal: 1000, val: s => s.totalLines },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
