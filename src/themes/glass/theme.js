// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'glass', name: 'Cam Kristal', bg: '#0b1a24', glow: '#2a5a72', board: '#07121a', cell: '#122a38', fg: '#eefaff', muted: '#8fb8cc', accent: '#9ff0ff', ink: '#07121a', btn: '#163444', grey: '#4a5c66',
  blocks: ['#ff8fa3', '#ffc48a', '#fff08a', '#9df5b5', '#8ae8ff', '#a3b5ff', '#e3a3ff'], style: 'glass', amb: 'prism', snd: { wave: 'sine', root: 783.99, bell: true, echo: true, kit: 'glass' },
  fx: { p: 'shard', g: 1.1, flash: '#ffffff' },
  unlock: { text: 'Toplam 500 blok yerleştir', goal: 500, val: s => s.totalPlaced },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
