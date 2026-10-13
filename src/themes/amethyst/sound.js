import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  crystal: {
    pick() { S.tink(1760, { vol: 0.05, dur: 0.3 }); },
    place() { S.thud({ vol: 0.22, f: 130 }); S.tink(rand(1200, 1600), { vol: 0.1, dur: 0.6 }); },
    clear(n) { for (let i = 0; i < n * 2 + 3; i++) S.tink(rand(2000, 4000), { when: 0.05 + i * 0.05, vol: 0.05, dur: 0.5 }); S.thud({ vol: 0.2, f: 100 }); },
    deal() { S.tink(2350, { vol: 0.035, dur: 0.4 }); },
  },
});
