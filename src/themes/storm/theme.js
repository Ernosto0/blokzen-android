// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'storm', name: 'Fırtına', bg: '#121822', glow: '#323e56', board: '#090d13', cell: '#18202c', fg: '#eef2fa', muted: '#97a4ba', accent: '#9fd8ff', ink: '#090d13', btn: '#202a3a', grey: '#3e4552',
  blocks: ['#8090c0', '#4f9ad8', '#9a7ad8', '#4fb0b0', '#c08ad0', '#5f78d8', '#8ac4e8'], style: 'storm', amb: 'storm', snd: { wave: 'sine', root: 392, echo: true, kit: 'storm' },
  fx: { p: 'streak', g: 0.6, drag: 0.6, glow: true, flash: '#e0f2ff' },
  unlock: { text: 'Tek hamlede 5 sıra temizle', goal: 5, val: s => s.bestLines },
};
