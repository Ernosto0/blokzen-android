// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'ocean', name: 'Okyanus', bg: '#062236', glow: '#0d5876', board: '#03141f', cell: '#0b2f47', fg: '#e6fbff', muted: '#7fb5c9', accent: '#5ef2d6', ink: '#03141f', btn: '#0d3a55', grey: '#4b6878',
  blocks: ['#ff7a6b', '#ffd166', '#7ae582', '#2ee6d6', '#36a9ff', '#7d8cff', '#f78fd8'], style: 'jelly', amb: 'bubbles', snd: { wave: 'sine', root: 587.33, echo: true },
  fx: { p: 'bubble', g: -0.35, drag: 2.2, wobble: 0.5, flash: '#c8fbff' },
  unlock: { text: 'Tek oyunda 2.500 puan yap', goal: 2500, val: s => s.bestScore },
};
