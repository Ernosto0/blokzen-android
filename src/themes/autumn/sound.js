import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  autumn: {
    pick() { S.crunch({ vol: 0.04, n: 2 }); },
    place() { S.thud({ vol: 0.25, f: 110 }); S.crunch({ vol: 0.09, n: 4 }); },
    clear(n) { S.hissL({ dur: 0.9, vol: 0.08, type: 'bandpass', freq: 300, to: 1400, q: 0.7 }); for (let i = 0; i < n + 1; i++) S.crunch({ when: 0.1 + i * 0.08, vol: 0.07, n: 4 }); },
    deal() { S.rustle({ vol: 0.05, dur: 0.15 }); },
  },
});
