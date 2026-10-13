// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'choco', name: 'Çikolata Dükkânı', bg: '#1e0f08', glow: '#5a2e18', board: '#0d0603', cell: '#22120a', fg: '#fff0e2', muted: '#c49a80', accent: '#ffb070', ink: '#1e0f08', btn: '#3a1f10', grey: '#5c4a40',
  blocks: ['#8b4a24', '#94532a', '#874622', '#9a5a2e', '#82431f', '#915028', '#8e4c25'], style: 'choco', amb: 'cocoa', snd: { wave: 'triangle', root: 440, kit: 'choco' },
  fx: { p: 'crumb', g: 1.2, flash: '#ffd6a8' },
  unlock: { text: "Bir oyunda 6'lı kombo yap", goal: 6, val: s => s.bestCombo },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
