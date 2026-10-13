import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  cup: {
    pick() { S.tink(1500, { vol: 0.05, dur: 0.12 }); },
    place() { S.thud({ vol: 0.22, f: 140 }); S.tink(rand(1300, 1500), { vol: 0.12, dur: 0.25 }); },
    clear(n) {
      for (let i = 0; i < n + 3; i++) S.tink(i % 2 ? 1900 : 1600, { when: 0.03 + i * 0.07, vol: 0.07, dur: 0.12 });
      S.hiss({ dur: 0.5, vol: 0.07, type: 'lowpass', freq: 1200, to: 400, q: 1, when: 0.05 });
    },
    deal() { S.tink(1700, { vol: 0.04, dur: 0.15 }); },
  },
});
