// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'cipher', name: 'Şifre Makinesi', bg: '#171b1d', glow: '#2e3739', board: '#0c0f10', cell: '#1d2427', fg: '#f0ece0', muted: '#a2a9a3', accent: '#ffb43a', ink: '#0c0f10', btn: '#262e31', grey: '#4c5452',
  blocks: ['#d8483a', '#e89a3a', '#d8c25a', '#4aa078', '#3a86c8', '#8a64c0', '#e8e2d0'], style: 'cipherkey', amb: 'enigma', snd: { wave: 'triangle', root: 440, kit: 'cipher' },
  fx: { p: 'cipherchar', g: 0.6, drag: 1.2, wobble: 0.4, flash: '#ffe2a8' },
  unlock: { text: 'Bulmacada 5 bölümü tek denemede, hiç geri almadan 3 yıldızla çöz', goal: 5, val: s => s.puzzleClean, fmt: (h, g) => `${h} / ${g} bölüm`, puzzle: true },
};
