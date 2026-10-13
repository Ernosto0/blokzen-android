// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'andes', name: 'And Teraslar', bg: '#2a1a12', glow: '#7a4a2a', board: '#160d08', cell: '#30201a', fg: '#fff2e4', muted: '#d0aa8a', accent: '#e8503a', ink: '#160d08', btn: '#3e2a1e', grey: '#5e4e44',
  blocks: ['#e8303a', '#f0a020', '#e8d040', '#2a9a6a', '#2a6ac8', '#d04a9a', '#8a4ac0'], style: 'andean', amb: 'terraces', snd: { wave: 'sine', root: 440, echo: true, kit: 'panflute' },
  fx: { p: 'wool', g: 0.35, drag: 2, wobble: 0.6, flash: '#fff0e0' },
  unlock: { text: "Zen'de art arda 150 hamle boyunca tahta yarıyı geçmesin", goal: 150, val: s => s.zenBestCalm, zen: true },
};
