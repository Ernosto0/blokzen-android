// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'gold', name: 'Altın Hazine', bg: '#1d1405', glow: '#6b4a0c', board: '#120c03', cell: '#2b1f0a', fg: '#fff6dc', muted: '#cdb27a', accent: '#ffd54a', ink: '#1d1405', btn: '#3a2a0c', grey: '#6a6050',
  blocks: ['#f5c542', '#f2bd37', '#f7cb4d', '#efb52e', '#f4c03f', '#f9d157', '#f0ba33'], style: 'gold', amb: 'coins', snd: { wave: 'triangle', root: 659.25, bell: true, kit: 'gold' },
  fx: { p: 'coin', g: 1, flash: '#fff2b0' },
  unlock: { text: 'Toplamda 50.000 puan topla', goal: 50000, val: s => s.totalScore },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
