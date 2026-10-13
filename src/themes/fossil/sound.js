import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  fossil: {
    pick() { S.tink(2600, { vol: 0.03, dur: 0.08 }); },
    place() { S.knock(220, { vol: 0.3 }); S.crunch({ vol: 0.08, n: 3 }); },
    clear(n) { // rocks breaking and a distant roar
      S.crunch({ vol: 0.12, n: 6 });
      S.hissL({ dur: 1 + n * 0.1, vol: 0.1, type: 'bandpass', freq: 260, to: 140, q: 2.5, when: 0.1 });
      S.tone(85, { type: 'sawtooth', dur: 0.9, vol: 0.04, to: 60, when: 0.1, attack: 0.1 });
    },
    deal() { S.crunch({ vol: 0.05, n: 2 }); },
  },
});
