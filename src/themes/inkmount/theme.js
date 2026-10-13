// Theme data only: colours, block colours, which look/background/sound kit to use, clear effect and unlock task.
// The drawing and sound code lives in the other files of this folder.
export default {
  id: 'inkmount', name: 'Mürekkep Dağları', light: true, bg: '#ece6d6', glow: '#faf7ef', board: '#bfb6a2', cell: '#d4ccb8', fg: '#1e1c18', muted: '#5e5a50', accent: '#c42a22', ink: '#ffffff', btn: '#f6f2e8', grey: '#a8a294', stroke: '#faf7ef',
  blocks: ['#3a3a40', '#c42a22', '#3a7a62', '#4a5a9a', '#9a7034', '#7a4a7a', '#4a8aa0'], style: 'inkwash', amb: 'shanshui', snd: { wave: 'sine', root: 392, echo: true, kit: 'guqin' },
  fx: { p: 'inkdrop', g: 0.8, drag: 1, flash: '#ffffff' },
  unlock: { text: "Zen'de toplam 1.000 sıra temizle. Koleksiyonun finali", goal: 1000, val: s => s.zenLines, zen: true },
  finale: "ZEN KOLEKSİYONU FİNALİ",
};
