import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  choco: {
    pick() { S.crunch({ vol: 0.05, n: 2 }); },
    place() { S.thud({ vol: 0.3, f: 110 }); S.crunch({ vol: 0.1, n: 3 }); },
    clear(n) {
      for (let i = 0; i < Math.min(n + 1, 4); i++) S.crunch({ when: i * 0.11, vol: 0.13, n: 6 });
      S.hiss({ dur: 0.5, vol: 0.06, type: 'lowpass', freq: 800, to: 300, when: 0.1, q: 2 });
    },
    deal() { S.rustle({ vol: 0.05 }); },
  },
});
