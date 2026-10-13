import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  glass: {
    pick() { S.tink(3200, { vol: 0.05, dur: 0.1 }); },
    place() { S.thud({ vol: 0.2, f: 180 }); S.tink(rand(2600, 3200), { vol: 0.1, dur: 0.3 }); },
    clear(n) {
      S.hiss({ dur: 0.35, vol: 0.12, type: 'highpass', freq: 4000, to: 9000 });
      for (let i = 0; i < n * 3 + 3; i++) S.tink(rand(2500, 5200), { when: 0.02 + Math.random() * 0.35, vol: 0.06, dur: 0.15 });
      S.thud({ vol: 0.2, f: 140 });
    },
    deal() { S.tink(4200, { vol: 0.03, dur: 0.2 }); },
  },
});
