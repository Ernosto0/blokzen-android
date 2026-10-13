import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  letter: { // envelopes sliding, a wax stamp pressed, a little post bell
    pick() { S.hiss({ dur: 0.06, vol: 0.05, type: 'bandpass', freq: 2200, to: 1200, q: 1 }); },
    place() { S.thud({ vol: 0.28, f: 95 }); S.knock(600, { vol: 0.12, when: 0.01 }); },
    clear(n) {
      for (let i = 0; i < Math.min(n + 1, 4); i++) S.hiss({ dur: 0.12, vol: 0.07, type: 'bandpass', freq: 2400, to: 1100, q: 1, when: i * 0.08 });
      S.thud({ vol: 0.3, f: 90, when: 0.3 }); S.tink(2200, { vol: 0.07, dur: 0.6, when: 0.4 });
    },
    deal() { S.hiss({ dur: 0.15, vol: 0.05, type: 'bandpass', freq: 2000, to: 900, q: 1 }); },
  },
});
