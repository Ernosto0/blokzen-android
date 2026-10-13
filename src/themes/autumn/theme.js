// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'autumn', name: 'Sonbahar', bg: '#281508', glow: '#763810', board: '#160b04', cell: '#2d190b', fg: '#fff2e2', muted: '#d4a882', accent: '#ffa53a', ink: '#160b04', btn: '#3d210e', grey: '#5a4c40',
  blocks: ['#d8402a', '#e8782a', '#f0b030', '#b8a02a', '#7a9a3a', '#a03a2a', '#d86a4a'], style: 'maple', amb: 'autumn', snd: { wave: 'triangle', root: 440, marimba: true, kit: 'autumn' },
  fx: { p: 'leaf', g: 0.25, drag: 2.2, wobble: 1.2, flash: '#ffe2b0' },
  unlock: { text: 'Toplam 2.500 sıra temizle', goal: 2500, val: s => s.totalLines },
};
