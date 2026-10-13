// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'zellige', name: 'Fas Zellige', bg: '#0f2a2a', glow: '#2a5a52', board: '#081a1a', cell: '#123432', fg: '#f4f0e4', muted: '#9cc0b4', accent: '#e8b84a', ink: '#081a1a', btn: '#16403c', grey: '#4a5c58',
  blocks: ['#1e8a5a', '#2a5ab8', '#c8502e', '#d8a63a', '#e8e2d0', '#2aa8a0', '#8a4a8a'], style: 'zellige', amb: 'riad', snd: { wave: 'triangle', root: 440, echo: true, kit: 'oud' },
  fx: { p: 'zillij', g: 0.9, flash: '#fff6e0' },
  unlock: { text: "Zen'de toplam 15 dakika oyna", goal: 15, val: s => Math.floor(s.zenSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
};
