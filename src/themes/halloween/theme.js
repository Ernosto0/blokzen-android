// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'halloween', name: 'Cadılar Bayramı', bg: '#120a1c', glow: '#3a1a4a', board: '#0a0610', cell: '#1e1328', fg: '#fff0e0', muted: '#b49ab8', accent: '#ff8a1e', ink: '#0a0610', btn: '#2a1a36', grey: '#4a4250',
  blocks: ['#ff7a12', '#ff8420', '#f8700c', '#ff8e2a', '#fa7616', '#ff801c', '#f46e10'], style: 'pumpkin', amb: 'night', snd: { wave: 'triangle', root: 349.23, echo: true, kit: 'spooky' },
  fx: { p: 'bat', g: -0.25, drag: 1.4, wobble: 1, flash: '#ffb050' },
  unlock: { text: 'Toplam 2.000 blok yerleştir', goal: 2000, val: s => s.totalPlaced },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
