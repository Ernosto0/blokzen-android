// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'calendar', name: 'Takvim Yaprağı', bg: '#1f3a3c', glow: '#3e6a68', board: '#13282a', cell: '#24403f', fg: '#fdf8ee', muted: '#a9c2bc', accent: '#ff5a4a', ink: '#13282a', btn: '#2a4a4a', grey: '#4f6462',
  blocks: ['#f26b5b', '#f5a24a', '#f2d25a', '#8cc87a', '#5aaee0', '#9a86e0', '#f08ab4'], style: 'leaflet', amb: 'tearoff', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'calendar' },
  fx: { p: 'leaflet', g: 0.4, drag: 2, wobble: 1.1, flash: '#fff8ee' },
  unlock: { text: 'Günlükte 3 günlük seri yap', goal: 3, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
};
