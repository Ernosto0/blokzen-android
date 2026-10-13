// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'lavalamp', name: 'Lav Lambası', bg: '#28120a', glow: '#86381a', board: '#160904', cell: '#2e160a', fg: '#fff0e0', muted: '#d8a880', accent: '#ff8a2a', ink: '#160904', btn: '#3e1e0e', grey: '#5a4a40',
  blocks: ['#ff6a3a', '#ffb03a', '#e8d84a', '#d04a8a', '#8a4ac8', '#3aa8a8', '#ff4a6a'], style: 'lamp', amb: 'lavalamp', snd: { wave: 'triangle', root: 392, kit: 'funk' },
  fx: { p: 'blob', g: -0.3, drag: 2, wobble: 0.4, flash: '#ffe2b8' },
  unlock: { text: 'Toplam 75 oyun oyna', goal: 75, val: s => s.games },
};
