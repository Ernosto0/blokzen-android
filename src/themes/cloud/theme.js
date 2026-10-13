// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'cloud', name: 'Pamuk Bulutlar', light: true, bg: '#bcdcf6', glow: '#ffffff', board: '#88b4dc', cell: '#a2c8e8', fg: '#1a3450', muted: '#4a6a8a', accent: '#f0558e', ink: '#ffffff', btn: '#e6f3fd', grey: '#a8b8c8', stroke: '#f4faff',
  blocks: ['#ff8fb0', '#ffb07a', '#ffd86a', '#7ad8a0', '#6ab8ff', '#a890ff', '#f08ad8'], style: 'cloud', amb: 'sky', snd: { wave: 'sine', root: 659.25, bell: true, kit: 'cloud' },
  fx: { p: 'puff', g: -0.1, drag: 3, flash: '#ffffff' },
  unlock: { text: 'Tahta yarıyı geçmeden tek oyunda 100 hamle yap', goal: 100, val: s => s.bestCalm },
};
