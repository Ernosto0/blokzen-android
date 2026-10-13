import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  sushi: {
    pick() { S.knock(2100, { vol: 0.05 }); S.knock(2300, { vol: 0.04, when: 0.04 }); },
    place() { S.thud({ vol: 0.18, f: 150 }); S.tink(rand(1700, 1900), { vol: 0.07, dur: 0.15 }); },
    clear(n) { S.tink(1320, { vol: 0.1, dur: 1.1 }); S.tink(1980, { vol: 0.05, dur: 0.8, when: 0.15 }); for (let i = 0; i < n; i++) S.knock(2200, { vol: 0.05, when: 0.1 + i * 0.06 }); },
    deal() { S.tink(1800, { vol: 0.04, dur: 0.1 }); S.tink(2100, { vol: 0.03, dur: 0.1, when: 0.06 }); },
  },
});
