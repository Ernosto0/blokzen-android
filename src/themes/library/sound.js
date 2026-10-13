import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  library: { // pages turning, a heavy book closed, a candle crackling
    pick() { S.hiss({ dur: 0.05, vol: 0.04, type: 'bandpass', freq: 2200, q: 1.2 }); },
    place() { S.thud({ vol: 0.28, f: 100 }); S.knock(300, { vol: 0.12 }); },
    clear(n) {
      for (let i = 0; i < Math.min(n + 1, 4); i++) S.hissL({ dur: 0.14, vol: 0.07, type: 'bandpass', freq: 1500, to: 3500, q: 1, when: i * 0.1 });
      S.crunch({ vol: 0.05, n: 3, when: 0.2 }); S.thud({ vol: 0.32, f: 80, when: 0.45 });
    },
    deal() { S.hissL({ dur: 0.3, vol: 0.04, type: 'bandpass', freq: 1800, to: 3200, q: 1 }); },
  },
});
