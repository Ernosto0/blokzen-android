// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'balloon', name: 'Kapadokya Balonları', light: true, bg: '#f2c4a2', glow: '#fff2dc', board: '#c48466', cell: '#d89c7e', fg: '#4a2418', muted: '#8a5440', accent: '#d8442a', ink: '#ffffff', btn: '#fbe2cf', grey: '#b8a090', stroke: '#fff4ea',
  blocks: ['#e8443a', '#f5962a', '#f2c83a', '#3aa86a', '#3a86d8', '#8a56d0', '#e8569a'], style: 'balloon', amb: 'cappadocia', snd: { wave: 'triangle', root: 587.33, kit: 'balloon' },
  fx: { p: 'balloon', g: -0.3, drag: 1.6, wobble: 0.5, flash: '#fff4e4' },
  unlock: { text: 'Sabah 05:00 ile 09:00 arası bir oyun bitir', goal: 1, val: s => s.morningGames },
};
