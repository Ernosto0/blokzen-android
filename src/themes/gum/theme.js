// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'gum', name: 'Sakız Balonu', light: true, bg: '#ffc2dc', glow: '#fff0f6', board: '#e88ab4', cell: '#f3a8c8', fg: '#5a1035', muted: '#a04870', accent: '#e0287a', ink: '#ffffff', btn: '#ffe0ee', grey: '#c0a0b0', stroke: '#fff3f8',
  blocks: ['#ff5fa2', '#ff6fae', '#ff539a', '#ff7bb6', '#ff66a8', '#ff5a9e', '#ff74b2'], style: 'gum', amb: 'gumballs', snd: { wave: 'triangle', root: 622.25, pluck: true, kit: 'gum' },
  fx: { p: 'ring', g: -0.1, drag: 3, flash: '#ffffff' },
  unlock: { text: 'Toplam 400 sıra temizle', goal: 400, val: s => s.totalLines },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
