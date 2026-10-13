// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'comet', name: 'Kuyruklu Yıldız', bg: '#070a1e', glow: '#22285a', board: '#04061a', cell: '#10143a', fg: '#f2f4ff', muted: '#98a0d8', accent: '#7ef0ff', ink: '#04061a', btn: '#141a46', grey: '#3a3e66',
  blocks: ['#ff7a9a', '#ffb06a', '#ffe07a', '#7af0b0', '#6ad0ff', '#9a8aff', '#e88aff'], style: 'cometcore', amb: 'comet', snd: { wave: 'sine', root: 659.25, bell: true, echo: true, kit: 'comet' },
  fx: { p: 'star', g: -0.05, drag: 1.6, glow: true, flash: '#e8fbff' },
  unlock: { text: 'Günlükte 30 günlük seri yap. Koleksiyonun finali', goal: 30, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
  finale: "GÜNLÜK KOLEKSİYON FİNALİ",
};
