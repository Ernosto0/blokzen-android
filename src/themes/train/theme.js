// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'train', name: 'Gece Treni', bg: '#141628', glow: '#2e2e58', board: '#0b0c18', cell: '#1c1e34', fg: '#f2f0ff', muted: '#a0a0c8', accent: '#ffb84a', ink: '#0b0c18', btn: '#22243e', grey: '#46485e',
  blocks: ['#c83a3a', '#e08a2a', '#e8c84a', '#3a9a5a', '#3a6ac0', '#7a4aa8', '#3a9aa8'], style: 'carriage', amb: 'nighttrain', snd: { wave: 'triangle', root: 440, kit: 'train' },
  fx: { p: 'puff', g: -0.15, drag: 3, flash: '#ffe8c0' },
  unlock: { text: 'Günlükte 14 günlük seri yap', goal: 14, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
};
