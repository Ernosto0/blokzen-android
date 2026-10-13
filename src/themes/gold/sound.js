import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  gold: {
    pick() { S.tink(2400, { vol: 0.05, dur: 0.12 }); },
    place() { S.thud({ vol: 0.25, f: 150 }); S.tink(rand(1900, 2300), { vol: 0.12 }); S.tink(rand(2600, 3000), { vol: 0.07, when: 0.04 }); },
    clear(n) { for (let i = 0; i < n * 3 + 2; i++) S.tink(rand(1800, 3400), { when: 0.04 + i * 0.045 + Math.random() * 0.02, vol: 0.07, dur: 0.18 }); S.thud({ vol: 0.25, f: 110 }); },
    deal() { S.tink(2600, { vol: 0.04, dur: 0.1 }); S.tink(3100, { vol: 0.03, dur: 0.1, when: 0.05 }); },
  },
});
