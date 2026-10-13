// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'kente', name: 'Kente', bg: '#1a1408', glow: '#5a4210', board: '#0e0b04', cell: '#2a2010', fg: '#fff6dc', muted: '#d4b878', accent: '#ffc21a', ink: '#0e0b04', btn: '#3a2c10', grey: '#5a5040',
  blocks: ['#e8b818', '#2a9a3a', '#d8302a', '#3a5ad0', '#e8781a', '#b8d03a', '#a03a9a'], style: 'kente', amb: 'loom', snd: { wave: 'triangle', root: 440, marimba: true, kit: 'djembe' },
  fx: { p: 'thread', g: 0.5, drag: 1.6, wobble: 0.8, flash: '#fff2c0' },
  unlock: { text: "Zen'de toplam 300 sıra temizle", goal: 300, val: s => s.zenLines, zen: true },
};
