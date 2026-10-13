// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'clock', name: 'Saat Kulesi', bg: '#1a140e', glow: '#5a4020', board: '#0e0a06', cell: '#2a2016', fg: '#fff2dc', muted: '#c8aa84', accent: '#e8b84a', ink: '#1a140e', btn: '#3a2a18', grey: '#5a5044',
  blocks: ['#d4a040', '#b86e34', '#e8c868', '#8c9caa', '#5a9a8a', '#a85a3a', '#c8b088'], style: 'gear', amb: 'clockwork', snd: { wave: 'triangle', root: 440, bell: true, kit: 'clock' },
  fx: { p: 'cog', g: 1, flash: '#ffe6a8' },
  unlock: { text: 'Tek oyunda 300 hamle yap', goal: 300, val: s => s.bestMoves },
};
