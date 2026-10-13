// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'library', name: 'Gece Yarısı Kütüphanesi', bg: '#1e140e', glow: '#5a3418', board: '#120b07', cell: '#24170f', fg: '#f8ecd8', muted: '#c8a880', accent: '#f0b860', ink: '#120b07', btn: '#33221a', grey: '#54463a',
  blocks: ['#b03a3a', '#3a8a4a', '#3a62a8', '#b8802e', '#8a447a', '#c8a050', '#3a8a8a'], style: 'book', amb: 'library', snd: { wave: 'sine', root: 440, echo: true, kit: 'library' },
  fx: { p: 'page', g: 0.3, drag: 2, wobble: 1, flash: '#ffe8b8' },
  unlock: { text: 'Günlükte gece 22:00 ile 02:00 arası yıldız al', goal: 1, val: s => s.dailyNight, daily: true },
};
