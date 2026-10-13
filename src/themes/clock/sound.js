import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  clock: {
    pick() { S.knock(2200, { vol: 0.05 }); },
    place() { S.knock(1600, { vol: 0.14 }); S.knock(1250, { vol: 0.12, when: 0.09 }); S.thud({ vol: 0.2, f: 120 }); },
    clear(n) { S.hiss({ dur: 0.45, vol: 0.08, type: 'highpass', freq: 2500, to: 6000 }); [880, 659.25, 783.99, 523.25].slice(0, Math.max(2, Math.min(4, n))).forEach((f, i) => S.tink(f, { when: 0.15 + i * 0.22, vol: 0.08, dur: 1 })); },
    deal() { for (let i = 0; i < 4; i++) S.knock(2400, { vol: 0.05, when: i * 0.04 }); },
  },
});
