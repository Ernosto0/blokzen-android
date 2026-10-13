// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'xmas', name: 'Yılbaşı Şekeri', bg: '#0d2418', glow: '#2a5a3a', board: '#07160e', cell: '#143222', fg: '#fff8f0', muted: '#a8c8b0', accent: '#ffd25a', ink: '#07160e', btn: '#18402a', grey: '#4c5a50',
  blocks: ['#e8283c', '#ee3446', '#e02034', '#f0404e', '#e42a3e', '#ea3242', '#de2232'], style: 'cane', amb: 'lights', snd: { wave: 'sine', root: 659.25, bell: true, kit: 'jingle' },
  fx: { p: 'star', g: 0.25, drag: 1.6, glow: true, flash: '#fff6d0' },
  unlock: { text: "Bir oyunda 8'li kombo yap", goal: 8, val: s => s.bestCombo },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
