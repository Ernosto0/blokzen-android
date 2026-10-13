// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'chess', name: 'Satranç', bg: '#2a2420', glow: '#5a4430', board: '#16110d', cell: '#3a2e24', fg: '#fbf3e4', muted: '#cbb497', accent: '#e8c35a', ink: '#16110d', btn: '#3c3027', grey: '#6a5c50',
  blocks: ['#e8e0cc', '#c8503a', '#e0a040', '#4a9a6a', '#3a78b8', '#8a5ab0', '#b88a5a'], style: 'chesstile', amb: 'chessboard', snd: { wave: 'triangle', root: 392, echo: true, kit: 'chess' },
  fx: { p: 'chessman', g: 1, drag: 0.4, flash: '#fff2d0' },
  unlock: { text: 'Bulmacada bütün bölümleri 3 yıldızla bitir. Koleksiyonun finali', goal: 60, val: s => s.puzzleStars, fmt: (h, g) => `${h} / ${g} yıldız`, puzzle: true },
  finale: "BULMACA KOLEKSİYONU FİNALİ",
};
