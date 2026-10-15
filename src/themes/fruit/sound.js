import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  juicy: {
    pick() { S.plop(400, { vol: 0.06, dur: 0.06 }); },
    place() { S.squelch({ vol: 0.09, dur: 0.12 }); S.crunch({ vol: 0.07, n: 2 }); S.thud({ vol: 0.18, f: 140 }); },
    clear(n) {
      S.crunch({ vol: 0.12, n: 5 });
      S.hiss({ dur: 0.35, vol: 0.09, type: 'lowpass', freq: 2200, to: 500, q: 2, when: 0.05 });
      for (let i = 0; i < n + 1; i++) S.plop(S.key(rand(500, 800)), { when: 0.12 + i * 0.07, vol: 0.09 });
    },
    deal() { S.plop(520, { vol: 0.05, dur: 0.05 }); },
  },
});
