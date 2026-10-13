// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'coffee', name: 'Kahve Dükkânı', bg: '#1c120c', glow: '#5c3a22', board: '#110a06', cell: '#2a1c13', fg: '#fff3e6', muted: '#c8a888', accent: '#f2c48d', ink: '#1c120c', btn: '#382518', grey: '#5c5048',
  blocks: ['#c48a5a', '#b97d4e', '#d29a68', '#a86f43', '#c99060', '#bd8452', '#d6a272'], style: 'bean', amb: 'steam', snd: { wave: 'sine', root: 493.88, kit: 'cup' },
  fx: { p: 'bubble', g: -0.3, drag: 2.2, wobble: 0.5, flash: '#ffe8c8' },
  unlock: { text: 'Tahtayı toplam 10 kez temizle', goal: 10, val: s => s.totalFulls },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
