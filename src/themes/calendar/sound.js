import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  calendar: { // a leaf torn off, several in a row on a clear
    pick() { S.hiss({ dur: 0.03, vol: 0.05, type: 'bandpass', freq: 2500, q: 1.5 }); },
    place() { S.hiss({ dur: 0.13, vol: 0.12, type: 'bandpass', freq: 1400, to: 4200, q: 2.2 }); S.thud({ vol: 0.14, f: 150 }); },
    clear(n) {
      for (let i = 0; i < Math.min(n + 1, 5); i++) S.hiss({ dur: 0.11, vol: 0.1, type: 'bandpass', freq: 1200 + i * 200, to: 4500, q: 2, when: i * 0.09 });
      S.rustle({ vol: 0.07, dur: 0.35, when: 0.2 });
    },
    deal() { S.rustle({ vol: 0.05, dur: 0.12 }); S.knock(1400, { vol: 0.04, when: 0.08 }); },
  },
});
