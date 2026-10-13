import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  gelato: {
    pick() { S.tink(2500, { vol: 0.03, dur: 0.08 }); },
    place() { S.squelch({ vol: 0.07, dur: 0.12 }); S.thud({ vol: 0.15, f: 150 }); },
    clear(n) { S.crunch({ vol: 0.11, n: 5 }); for (let i = 0; i < n + 1; i++) S.tink(rand(2400, 3600), { when: 0.12 + i * 0.05, vol: 0.03, dur: 0.2 }); },
    deal() { S.tink(2600, { vol: 0.03, dur: 0.1 }); },
  },
});
