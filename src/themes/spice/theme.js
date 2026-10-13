// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'spice', name: 'Baharat Çarşısı', bg: '#2a160c', glow: '#7a3a14', board: '#170b05', cell: '#33190c', fg: '#fff0dc', muted: '#d4a47c', accent: '#ffb43a', ink: '#170b05', btn: '#40220f', grey: '#5e4a3c',
  blocks: ['#b02a36', '#e8a81c', '#d84a22', '#b07a34', '#6e9a40', '#ee7a2a', '#8a6aa8'], style: 'spice', amb: 'bazaar', snd: { wave: 'triangle', root: 440, kit: 'spice' },
  fx: { p: 'grain', g: 1.2, drag: 0.4, flash: '#ffd890' },
  unlock: { text: 'Günlükte 7 günlük seri yap', goal: 7, val: s => s.dailyBestStreak, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
};
