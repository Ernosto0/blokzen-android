// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'retro', name: 'Retro Arcade', bg: '#0a0820', glow: '#241a5e', board: '#05040f', cell: '#151236', fg: '#ffffff', muted: '#9a94d0', accent: '#3dff7a', ink: '#05040f', btn: '#1c1846', grey: '#4a4866',
  blocks: ['#ff3355', '#ff9922', '#ffee33', '#33ee55', '#33ccff', '#5566ff', '#cc44ff'], style: 'pixel', amb: 'arcade', snd: { wave: 'square', root: 523.25, gain: 0.4, kit: 'chip' },
  fx: { p: 'pixel', g: 1, flash: null },
  unlock: { text: 'Tek hamlede 4 sıra temizle', goal: 4, val: s => s.bestLines },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
