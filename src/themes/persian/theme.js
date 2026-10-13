// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'persian', name: 'Pers Bahçesi', bg: '#14182e', glow: '#3a3060', board: '#0a0d1c', cell: '#1a1e36', fg: '#fbf2e2', muted: '#b8aec8', accent: '#e8c06a', ink: '#0a0d1c', btn: '#222844', grey: '#4a4c60',
  blocks: ['#b8283e', '#2a5ab0', '#e8c06a', '#2a8a7a', '#ece4d0', '#d0702a', '#7a4a9a'], style: 'carpet', amb: 'charbagh', snd: { wave: 'sine', root: 523.25, echo: true, kit: 'santur' },
  fx: { p: 'petal', g: 0.2, drag: 2.2, wobble: 1.2, flash: '#fff2d0' },
  unlock: { text: "Zen'de toplam 3 saat oyna", goal: 180, val: s => Math.floor(s.zenSec / 60), fmt: (h, g) => `${h} / ${g} dk`, zen: true },
};
