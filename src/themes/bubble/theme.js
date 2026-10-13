// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'bubble', name: 'Köpük Kasabası', light: true, bg: '#2aa7e8', glow: '#b9ecff', board: '#0b4f86', cell: '#3c9ad6', fg: '#06294a', muted: '#1d5f8c', accent: '#ff5fa2', ink: '#ffffff', btn: '#a9e2ff', grey: '#7fb0cf', stroke: '#e3f6ff',
  // the order matters: each colour has its own sea creature (sponge, jellyfish, starfish, crab, pufferfish, bubble, pineapple)
  blocks: ['#ffe14a', '#ff7cc8', '#ff9d3a', '#ff5747', '#7bdc5a', '#7fd0ff', '#ffbf1f'], style: 'bubble', amb: 'bubble', snd: { wave: 'sine', root: 659.25, echo: true, kit: 'bubble' },
  fx: { p: 'bubble', g: -0.5, drag: 1.4, wobble: 1.1, flash: '#e6fbff' },
  unlock: { text: 'Köpük patlat: tek hamlede 2+ sırayı 25 kez temizle', goal: 25, val: s => s.pops },
};
