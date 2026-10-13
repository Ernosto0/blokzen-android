// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'letter', name: 'Mektup ve Mühür', bg: '#1e2433', glow: '#4a5470', board: '#121722', cell: '#232b3c', fg: '#f6f0e6', muted: '#a8b0c4', accent: '#e85a4a', ink: '#121722', btn: '#2a3346', grey: '#4a5266',
  blocks: ['#c83a3a', '#e08a2a', '#e8c24a', '#4a9a6a', '#3a7ac8', '#7a5ab8', '#c85a9a'], style: 'envelope', amb: 'post', snd: { wave: 'triangle', root: 523.25, kit: 'letter' },
  fx: { p: 'envelope', g: 0.3, drag: 2, wobble: 0.8, flash: '#fff6e8' },
  unlock: { text: 'Günlükte 5 farklı günde önceki günün en iyi skorunu geç', goal: 5, val: s => s.dailyBeat, daily: true },
};
