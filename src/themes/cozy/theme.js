// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'cozy', name: 'Sıcak Yuva', bg: '#2a1c1e', glow: '#c98a52', board: '#1f1416', cell: '#34242a', fg: '#fbeede', muted: '#d2ac92', accent: '#f2a65a', ink: '#2a1810', btn: '#47302f', grey: '#7a6360',
  // yarn colours: terracotta, butter, sage, dusty blue, lilac, rose, oat
  blocks: ['#e8957a', '#f2c36b', '#9cbf8e', '#8fb4c9', '#c79bc4', '#f0a8b4', '#d9b99a'], style: 'knit', amb: 'cozy', snd: { wave: 'sine', root: 392, echo: true, kit: 'cozy' },
  fx: { p: 'wool', g: 0.25, drag: 2.4, wobble: 1, flash: '#ffe6c4' },
  unlock: { text: "Zen'de gece 22:00 ile 05:00 arası toplam 25 dakika oyna", goal: 25, val: s => Math.floor(s.zenNightSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
};
