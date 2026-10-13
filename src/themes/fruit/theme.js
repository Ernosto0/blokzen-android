// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'fruit', name: 'Meyve Bahçesi', light: true, bg: '#bfe9d4', glow: '#f6fff6', board: '#7cc8a4', cell: '#9ad8b8', fg: '#123a28', muted: '#3a6a52', accent: '#ff4a5a', ink: '#ffffff', btn: '#e2f7ec', grey: '#9ab0a4', stroke: '#f2fff8',
  blocks: ['#ff4d5e', '#ff9a2a', '#ffe14a', '#8ccf3a', '#ff5ab4', '#8a4ad8', '#3fbf6a'], style: 'fruit', amb: 'summer', snd: { wave: 'triangle', root: 554.37, pluck: true, kit: 'juicy' },
  fx: { p: 'drop', g: 1.1, drag: 0.5, flash: '#ffffff' },
  unlock: { text: 'Toplamda 1.000.000 puan topla', goal: 1000000, val: s => s.totalScore },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
