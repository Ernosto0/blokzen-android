// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'stained', name: 'Vitray', bg: '#16121c', glow: '#3a2a4a', board: '#0c0910', cell: '#1e1826', fg: '#f4eefc', muted: '#a89cbc', accent: '#ffd25a', ink: '#0c0910', btn: '#261e30', grey: '#4a4256',
  blocks: ['#e0283c', '#f08a1e', '#f2cc2a', '#28a858', '#2a72d8', '#7a3ac8', '#d83a9a'], style: 'vitray', amb: 'cathedral', snd: { wave: 'sine', root: 392, echo: true, kit: 'organ' },
  fx: { p: 'shard', g: 1, flash: '#fff4d0' },
  unlock: { text: 'Günlükte bir oyunda tahtayı 2 kez tamamen temizle', goal: 2, val: s => s.dailyBestFulls, daily: true },
};
