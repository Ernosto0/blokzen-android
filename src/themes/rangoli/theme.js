// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'rangoli', name: 'Rangoli', bg: '#2a0e1e', glow: '#7a1e48', board: '#1a0812', cell: '#3a1428', fg: '#fff2e8', muted: '#d8a0b8', accent: '#ffb030', ink: '#1a0812', btn: '#46182e', grey: '#5a4450',
  blocks: ['#ff3a6a', '#ff9a1a', '#ffd83a', '#2ac0a0', '#3a7aff', '#a050e0', '#ff5a2a'], style: 'rangoli', amb: 'diya', snd: { wave: 'triangle', root: 493.88, kit: 'sitar' },
  fx: { p: 'powder', g: -0.05, drag: 2.6, flash: '#ffe8b0' },
  unlock: { text: "Zen'de sabah 05:00 ile 10:00 arası toplam 20 dakika oyna", goal: 20, val: s => Math.floor(s.zenMorningSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
};
