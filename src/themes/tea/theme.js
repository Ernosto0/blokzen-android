// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'tea', name: 'Çay Bahçesi', bg: '#2c4a5e', glow: '#e8a878', board: '#1a2e3c', cell: '#2a4456', fg: '#fff6ea', muted: '#b8c6cc', accent: '#f0a03a', ink: '#1a2e3c', btn: '#33536a', grey: '#556a74',
  blocks: ['#c84a24', '#e08a2a', '#e8bc4a', '#8cb040', '#d4405a', '#9a5a9a', '#3a9a8a'], style: 'teaglass', amb: 'bosphorus', snd: { wave: 'sine', root: 493.88, echo: true, kit: 'tea' },
  fx: { p: 'sugar', g: 1, flash: '#ffe8c0' },
  unlock: { text: 'Günlükte sabah 05:00 ile 09:00 arası yıldız al', goal: 1, val: s => s.dailyMorning, daily: true },
};
