// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'dunes', name: 'Çöl Akşamı', bg: '#2e1a24', glow: '#c4643a', board: '#22140a', cell: '#3e2614', fg: '#fff3e0', muted: '#dcb48a', accent: '#ffb25a', ink: '#22140a', btn: '#4a2a24', grey: '#6a5440',
  blocks: ['#e8b450', '#e07a38', '#c4503a', '#f0d890', '#a8743e', '#9aa85a', '#6a8ac0'], style: 'sandstone', amb: 'dunes', snd: { wave: 'sine', root: 349.23, echo: true, kit: 'sand' }, // shares the desert's sand sound kit
  fx: { p: 'grain', g: 0.8, drag: 0.8, wobble: 0.6, flash: '#ffe0b0' },
  unlock: { text: 'Gün batımında oyna: akşam 18:00 ile 21:00 arası 5 oyun bitir', goal: 5, val: s => s.duskGames },
};
