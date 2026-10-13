// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'detective', name: 'Dedektif Panosu', bg: '#3a2a1c', glow: '#6b4a2c', board: '#22170e', cell: '#45311f', fg: '#fbf1e2', muted: '#cdb08c', accent: '#e0393a', ink: '#ffffff', btn: '#4c3624', grey: '#6e6052',
  blocks: ['#f2cf45', '#efe9dc', '#ef98ae', '#8cc2e6', '#9cd187', '#f2a058', '#c8a274'], style: 'memo', amb: 'corkboard', snd: { wave: 'sine', root: 392, kit: 'detective' },
  fx: { p: 'memo', g: 0.3, drag: 2, wobble: 1, flash: '#fff6e4' },
  unlock: { text: 'Bulmacada bir bölümü son parçayla, elinde hiç parça kalmadan bitir', goal: 1, val: s => s.puzzleLast, puzzle: true },
};
