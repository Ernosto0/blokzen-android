// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'tomb', name: 'Firavun Mezarı', bg: '#26170a', glow: '#74451a', board: '#150d05', cell: '#30200e', fg: '#fff1d6', muted: '#cdab78', accent: '#ffc24a', ink: '#1a0f05', btn: '#3c2811', grey: '#6a5a48',
  blocks: ['#d9a65a', '#2f7fc0', '#2fb0a2', '#c8583a', '#e8c470', '#8a5ac0', '#7aa04a'], style: 'tomb', amb: 'tomb', snd: { wave: 'triangle', root: 392, kit: 'tomb' },
  fx: { p: 'crumb', g: 1.1, flash: '#ffe8b8' },
  unlock: { text: 'Bir oyunda tahtayı 5 kez temizle', goal: 5, val: s => s.bestFulls },
};
