// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'picnic', name: 'Hafta Sonu Pikniği', light: true, bg: '#bfe0a8', glow: '#f4fbe8', board: '#8ab070', cell: '#a4c88a', fg: '#1e3a1a', muted: '#4a6a3e', accent: '#d8402e', ink: '#ffffff', btn: '#eaf6e0', grey: '#a8b49a', stroke: '#f4fbe8',
  blocks: ['#e0453a', '#f0943a', '#f0c83a', '#4aa84a', '#3a8ad0', '#9a6ac8', '#e86aa0'], style: 'gingham', amb: 'park', snd: { wave: 'triangle', root: 587.33, pluck: true, kit: 'picnic' },
  fx: { p: 'petal', g: 0.2, drag: 2.2, wobble: 1.2, flash: '#ffffff' },
  unlock: { text: 'Günlükte aynı hafta sonu hem cumartesi hem pazar yıldız al', goal: 1, val: s => s.dailyWeekend, daily: true },
};
