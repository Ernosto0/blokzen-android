// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'bubble', name: 'Köpük Kasabası', light: true, bg: '#7fdcef', glow: '#d9fbff', board: '#1f9bc0', cell: '#a6ecf7', fg: '#08394f', muted: '#2f7f9a', accent: '#ff7a1a', ink: '#ffffff', btn: '#c4f4fb', grey: '#9cc7d2', stroke: '#e9fdff',
  // the order matters: each colour has its own sea creature (sponge, jellyfish, starfish, crab, pufferfish, bubble, pineapple)
  blocks: ['#ffd93b', '#ff8fd0', '#ffa94d', '#ff6a5a', '#8ee07a', '#8fd0ff', '#ffc233'], style: 'bubble', amb: 'bubble', snd: { wave: 'sine', root: 659.25, echo: true, kit: 'bubble' },
  fx: { p: 'bubble', g: -0.5, drag: 1.4, wobble: 1.1, flash: '#e6fbff' },
  unlock: { text: 'Köpük patlat: tek hamlede 2+ sırayı 25 kez temizle', goal: 25, val: s => s.pops },
};
