// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'news', name: 'Sabah Gazetesi', light: true, bg: '#e6e0d2', glow: '#fbf8f0', board: '#b9b19f', cell: '#d0c8b6', fg: '#1e1c18', muted: '#5e594e', accent: '#c8321e', ink: '#ffffff', btn: '#f6f2e8', grey: '#a8a294', stroke: '#fbf8f0',
  blocks: ['#d0473a', '#e09a38', '#e2c640', '#5a9a5a', '#3a86c0', '#7a62b0', '#c4508a'], style: 'news', amb: 'newsroom', snd: { wave: 'triangle', root: 523.25, kit: 'news' },
  fx: { p: 'newsclip', g: 0.35, drag: 2, wobble: 1, flash: '#ffffff' },
  unlock: { text: 'Günlükte ilk yıldızını al', goal: 1, val: s => s.dailyStars, daily: true },
};
