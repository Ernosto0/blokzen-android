// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'wood', name: 'Ahşap Oyuncak', bg: '#2a1a10', glow: '#6e4422', board: '#1a0f08', cell: '#2e1d12', fg: '#fff3e2', muted: '#c8a484', accent: '#ffc46a', ink: '#1a0f08', btn: '#3e2816', grey: '#5e5248',
  blocks: ['#d9a066', '#c98f55', '#e0aa70', '#cf9660', '#d39a5e', '#dca468', '#c88c52'], style: 'wood', amb: 'workshop', snd: { wave: 'sine', root: 523.25, marimba: true, kit: 'wood' },
  fx: { p: 'chip', g: 0.9, drag: 0.6, flash: '#ffe6c0' },
  unlock: { text: 'Toplam 25 oyun oyna', goal: 25, val: s => s.games },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
