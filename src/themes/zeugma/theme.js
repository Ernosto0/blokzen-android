// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'zeugma', name: 'Zeugma Mozaiği', bg: '#2e1a12', glow: '#7a4428', board: '#1a0e09', cell: '#352016', fg: '#fbefe2', muted: '#d4b098', accent: '#e8b46a', ink: '#1a0e09', btn: '#3e2619', grey: '#5e4c40',
  blocks: ['#b84a32', '#d8963e', '#e8cc8a', '#6a8a4a', '#4a7a9a', '#7a5a7a', '#e6dccb'], style: 'tesserae', amb: 'mosaicfloor', snd: { wave: 'triangle', root: 440, kit: 'mosaic' },
  fx: { p: 'tile', g: 1, flash: '#fff2dc' },
  unlock: { text: 'Günlükte toplam 50 yıldız topla', goal: 50, val: s => s.dailyStars, daily: true },
};
