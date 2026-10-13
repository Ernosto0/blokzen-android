// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'factory', name: 'Robot Fabrikası', bg: '#14171b', glow: '#383e46', board: '#0a0c0f', cell: '#1b1f25', fg: '#eef2f6', muted: '#9aa4b0', accent: '#ffc21a', ink: '#0a0c0f', btn: '#252b33', grey: '#4a5058',
  blocks: ['#e04a3a', '#f5a01a', '#f2d21a', '#4ab85a', '#3a8ae0', '#8a6ad8', '#a8b4c0'], style: 'metal', amb: 'factory', snd: { wave: 'square', root: 392, gain: 0.35, kit: 'factory' },
  fx: { p: 'nut', g: 1.1, flash: '#fff4cc' },
  unlock: { text: 'Toplam 5.000 blok yerleştir', goal: 5000, val: s => s.totalPlaced },
};
