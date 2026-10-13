// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'batik', name: 'Batik', bg: '#1a140e', glow: '#4a3420', board: '#0e0a06', cell: '#261c12', fg: '#fff2dc', muted: '#c8a880', accent: '#e8a040', ink: '#0e0a06', btn: '#33261a', grey: '#54483c',
  blocks: ['#3a5aa8', '#a8642a', '#d8a03a', '#b03a2a', '#3a8a6a', '#8a4a7a', '#d8c8a0'], style: 'batik', amb: 'paddy', snd: { wave: 'sine', root: 392, echo: true, bell: true, kit: 'gamelan' },
  fx: { p: 'drop', g: 1, drag: 0.6, flash: '#ffe8c0' },
  unlock: { text: "Zen'de hiç nefes almadan art arda 200 hamle yap", goal: 200, val: s => s.zenBestRun, zen: true },
};
