// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'moon', name: 'Ay Evreleri', bg: '#0a1426', glow: '#2a4466', board: '#060c18', cell: '#122036', fg: '#eef4ff', muted: '#9ab0cc', accent: '#dfe8f6', ink: '#060c18', btn: '#16263e', grey: '#3e4a60',
  blocks: ['#e8a0a0', '#e8c08a', '#ecdc9a', '#a8d8b0', '#9ac0ec', '#b8a8ec', '#e8b0d8'], style: 'lunar', amb: 'tides', snd: { wave: 'sine', root: 587.33, bell: true, echo: true, kit: 'moon' },
  fx: { p: 'crescent', g: -0.05, drag: 2.2, wobble: 0.5, glow: true, flash: '#ffffff' },
  unlock: { text: 'Günlüğü 28 farklı günde oyna', goal: 28, val: s => s.dailyDays, fmt: (h, g) => `${h} / ${g} gün`, daily: true },
};
