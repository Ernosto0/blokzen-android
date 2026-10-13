// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'santorini', name: 'Santorini', light: true, bg: '#d6eaf6', glow: '#ffffff', board: '#5a8ec4', cell: '#78a6d4', fg: '#14304e', muted: '#40648a', accent: '#1e5ec8', ink: '#ffffff', btn: '#eef6fc', grey: '#9ab0c4', stroke: '#f6fbff',
  blocks: ['#1e5ec8', '#f4f2ec', '#e8a83a', '#d84a6a', '#2aa8a0', '#8a6ad0', '#f07a3a'], style: 'cycladic', amb: 'caldera', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'bouzouki' },
  fx: { p: 'bubble', g: -0.3, drag: 2.2, wobble: 0.5, flash: '#ffffff' },
  unlock: { text: "Zen'de akşam 19:00 ile 23:00 arası toplam 45 dakika oyna", goal: 45, val: s => Math.floor(s.zenEveningSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
};
