import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

const pencil = (when, dur, vol) => S.hiss({ dur, vol, type: 'bandpass', freq: rand(3200, 4800), to: rand(2600, 5200), q: 3, when });

Object.assign(KITS, {
  blueprint: { // pencil on drafting paper, a ruler set down, the approval stamp on a clear
    pick() { pencil(0, 0.04, 0.04); },
    place() { S.knock(900, { vol: 0.14 }); pencil(0.02, 0.07, 0.05); S.thud({ vol: 0.12, f: 160 }); },
    clear(n) { for (let i = 0; i < Math.min(n + 2, 5); i++) pencil(i * 0.08, 0.1, 0.06); S.thud({ vol: 0.32, f: 95, when: Math.min(n + 2, 5) * 0.08 + 0.05 }); S.knock(420, { vol: 0.12, when: Math.min(n + 2, 5) * 0.08 + 0.05 }); },
    deal() { S.rustle({ vol: 0.05, dur: 0.18 }); },
  },
});
