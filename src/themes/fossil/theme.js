// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'fossil', name: 'Fosil Kazısı', bg: '#221912', glow: '#583824', board: '#130d09', cell: '#291f17', fg: '#f6ece0', muted: '#bca890', accent: '#ff9a3a', ink: '#130d09', btn: '#32251b', grey: '#5a5048',
  blocks: ['#c08a5a', '#a86e4a', '#d4ae74', '#8c8474', '#b4785a', '#9a8a68', '#cc9c7c'], style: 'fossil', amb: 'prehistoric', snd: { wave: 'triangle', root: 349.23, kit: 'fossil' },
  fx: { p: 'crumb', g: 1.2, flash: '#ffe2c0' },
  unlock: { text: 'Toplamda 3.000.000 puan topla', goal: 3000000, val: s => s.totalScore },
};
