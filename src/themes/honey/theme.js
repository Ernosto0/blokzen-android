// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'honey', name: 'Bal Kovanı', bg: '#2a1703', glow: '#7a4a0a', board: '#170c01', cell: '#3a2307', fg: '#fff4dc', muted: '#d8b277', accent: '#ffc23a', ink: '#1d0f02', btn: '#43280a', grey: '#6b5a44',
  blocks: ['#f2a516', '#f5ab1c', '#efa013', '#f6b022', '#eea415', '#f4a81a', '#f0a518'], style: 'honey', amb: 'hive', snd: { wave: 'sine', root: 440, kit: 'honey' },
  fx: { p: 'drop', g: 1.15, drag: 0.6, flash: '#ffe39a' },
  unlock: { text: 'Toplam 10 oyun oyna', goal: 10, val: s => s.games },
  newTask: true, // open from the start before theme meta v2; older saves lose it until the task is done
};
