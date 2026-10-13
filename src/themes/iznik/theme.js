// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'iznik', name: 'İznik Çinisi', bg: '#0e2a50', glow: '#2a5a98', board: '#081c38', cell: '#13335e', fg: '#f4f8ff', muted: '#9fb6d8', accent: '#ff6a52', ink: '#081c38', btn: '#183a68', grey: '#5a6a80',
  blocks: ['#1f5fc8', '#1aa0b8', '#d8402e', '#2a9a5a', '#4a3ab0', '#d89a2a', '#b0306a'], style: 'iznik', amb: 'iznik', snd: { wave: 'triangle', root: 523.25, pluck: true, kit: 'iznik' },
  fx: { p: 'tile', g: 0.9, flash: '#ffffff' },
  unlock: { text: 'Tek hamlede 3+ sırayı 50 kez temizle', goal: 50, val: s => s.total3 },
};
