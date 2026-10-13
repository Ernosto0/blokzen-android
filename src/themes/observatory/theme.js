// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'observatory', name: 'Rasathane', bg: '#0a1020', glow: '#1e2a50', board: '#060a14', cell: '#121c32', fg: '#eef2ff', muted: '#94a2c8', accent: '#e8c06a', ink: '#060a14', btn: '#16223e', grey: '#3e4866',
  blocks: ['#d85a4a', '#e8a040', '#e8d070', '#5ab88a', '#4a90e0', '#8a70d8', '#d070b0'], style: 'astrolabe', amb: 'starchart', snd: { wave: 'sine', root: 523.25, bell: true, echo: true, kit: 'brass' },
  fx: { p: 'star', g: 0.1, drag: 1.8, glow: true, flash: '#fff0c8' },
  unlock: { text: 'Günlükte 5 farklı günde 3 yıldız al', goal: 5, val: s => s.dailyThree, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
};
