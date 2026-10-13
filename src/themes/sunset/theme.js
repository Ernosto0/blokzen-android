// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'sunset', name: 'Gün Batımı', bg: '#4a1d3c', glow: '#c4566a', board: '#24091d', cell: '#441a36', fg: '#fff3e8', muted: '#f0b9a8', accent: '#ffe08a', ink: '#24091d', btn: '#5e2549', grey: '#7a5560',
  blocks: ['#ff5e57', '#ff9f43', '#ffd23f', '#3ddc97', '#38b6ff', '#8c7bff', '#ff6fb7'], style: 'gem', amb: 'dust', snd: { wave: 'triangle', root: 493.88 },
  fx: { p: 'diamond', g: 0.9, flash: '#ffe2b0' },
  unlock: { text: 'Tek hamlede 3 sıra temizle', goal: 3, val: s => s.bestLines },
};
