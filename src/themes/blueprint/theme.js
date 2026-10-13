// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'blueprint', name: 'Mavi Kopya', bg: '#1b4f8c', glow: '#2f6db0', board: '#123b6c', cell: '#1c4b82', fg: '#f2f8ff', muted: '#acc8ea', accent: '#ffd75e', ink: '#123b6c', btn: '#245a98', grey: '#5a7598',
  blocks: ['#ff8a7a', '#ffb760', '#ffe27a', '#7ee0a0', '#7fd4ff', '#c3a6ff', '#f2f6ff'], style: 'draft', amb: 'drafting', snd: { wave: 'sine', root: 587.33, kit: 'blueprint' },
  fx: { p: 'dimension', g: 0.2, drag: 2, wobble: 0.6, flash: '#e8f4ff' },
  unlock: { text: "Bulmacada 'tahtayı boşalt' bölümlerinin hepsini 3 yıldızla bitir", goal: 4, val: s => s.puzzleClear3, fmt: (h, g) => `${h} / ${g} bölüm`, puzzle: true },
};
