// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'zen', name: 'Zen Bahçesi', light: true, bg: '#dbe3d6', glow: '#f8fbf4', board: '#a2ac96', cell: '#b8c2ac', fg: '#24302a', muted: '#5a6a5e', accent: '#c8442e', ink: '#ffffff', btn: '#eef2ea', grey: '#a0a69a', stroke: '#f8fbf4',
  blocks: ['#6f8fa8', '#a8846a', '#6a9a7a', '#b8a07a', '#5a6f9a', '#9a7aa0', '#c08a7a'], style: 'stone', amb: 'zen', snd: { wave: 'sine', root: 440, kit: 'zen' },
  fx: { p: 'leaf', g: 0.2, drag: 2.2, wobble: 1.2, flash: '#ffffff' },
  unlock: { text: 'Toplam 3 saat oyna', goal: 180, val: s => Math.floor(s.playSec / 60), fmt: (h, g) => `${h} / ${g} dk` },
};
