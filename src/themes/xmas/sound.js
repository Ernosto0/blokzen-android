import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  jingle: {
    pick() { S.tink(2800, { vol: 0.04, dur: 0.1 }); },
    place() { S.thud({ vol: 0.22, f: 150 }); for (let i = 0; i < 4; i++) S.tink(rand(2500, 4200), { when: i * 0.025, vol: 0.04, dur: 0.12 }); },
    clear(n) { for (let i = 0; i < n * 4 + 4; i++) S.tink(S.key(rand(2500, 4500)), { when: Math.random() * 0.5, vol: 0.04, dur: 0.14 }); },
    deal() { S.tink(3000, { vol: 0.03, dur: 0.1 }); S.tink(3600, { vol: 0.03, dur: 0.1, when: 0.04 }); },
  },
});
