// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'desert', name: 'Kum Saati Çölü', bg: '#3a2414', glow: '#c47a3a', board: '#22140a', cell: '#3e2614', fg: '#fff3e0', muted: '#dcb48a', accent: '#ffc65a', ink: '#22140a', btn: '#4a2e18', grey: '#6a5440',
  blocks: ['#e8b450', '#e07a38', '#c4503a', '#f0d890', '#a8743e', '#9aa85a', '#6a8ac0'], style: 'dune', amb: 'hourglass', snd: { wave: 'sine', root: 392, echo: true, kit: 'sand' },
  fx: { p: 'grain', g: 0.8, drag: 0.8, wobble: 0.6, flash: '#fff0c8' },
  unlock: { text: 'Günlükte bir günün ilk denemesinde 3 yıldız al', goal: 1, val: s => s.dailyFirst3, daily: true },
};
