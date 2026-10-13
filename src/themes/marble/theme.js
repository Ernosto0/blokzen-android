// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'marble', name: 'Mermer & Altın', bg: '#0c1612', glow: '#244236', board: '#060c0a', cell: '#152620', fg: '#fbf7ee', muted: '#a8b8ae', accent: '#e2c56b', ink: '#060c0a', btn: '#1a3028', grey: '#5a6460',
  blocks: ['#f2efe8', '#ece8df', '#f5f2ec', '#e8e4da', '#f0ece4', '#eeeae2', '#e6e2d8'], style: 'marble', amb: 'luxe', snd: { wave: 'triangle', root: 523.25, kit: 'stone' },
  fx: { p: 'fleck', g: 0.35, drag: 1.8, wobble: 0.6, flash: '#fff3c4' },
  unlock: { text: 'Toplam 50 oyun oyna', goal: 50, val: s => s.games },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
