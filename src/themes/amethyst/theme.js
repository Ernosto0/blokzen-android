// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'amethyst', name: 'Ametist Mağarası', bg: '#140a24', glow: '#4a2276', board: '#0b0516', cell: '#1f1236', fg: '#f6eeff', muted: '#ad94d6', accent: '#d59bff', ink: '#0b0516', btn: '#2a1846', grey: '#4f4462',
  blocks: ['#a35cff', '#b06bff', '#9550f0', '#bb7aff', '#9c58f8', '#a965ff', '#8f4ae8'], style: 'crystal', amb: 'cave', snd: { wave: 'sine', root: 587.33, bell: true, echo: true, kit: 'crystal' },
  fx: { p: 'diamond', g: 0.6, glow: true, flash: '#f0d8ff' },
  unlock: { text: 'Toplamda 250.000 puan topla', goal: 250000, val: s => s.totalScore },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
