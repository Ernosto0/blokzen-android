import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  alchemy: { // glass clinking on glass, the brew bubbling, a shimmer when it turns
    pick() { S.tink(2900, { vol: 0.03, dur: 0.15 }); },
    place() { S.tink(rand(1900, 2200), { vol: 0.07, dur: 0.3 }); S.plop(260, { vol: 0.12, when: 0.02 }); S.thud({ vol: 0.1, f: 140 }); },
    clear(n) { for (let i = 0; i < n + 3; i++) S.plop(rand(250, 520), { when: i * 0.06, vol: 0.08 }); for (let i = 0; i < 5; i++) S.tink(S.snd.root * 2 * Math.pow(2, [0, 3, 7, 10, 12][i] / 12), { when: 0.18 + i * 0.05, vol: 0.03, dur: 0.7 }); S.hissL({ dur: 0.7, vol: 0.05, type: 'bandpass', freq: 600, to: 3000, q: 0.8, when: 0.1 }); },
    deal() { S.plop(380, { vol: 0.06 }); S.tink(2500, { vol: 0.03, dur: 0.2, when: 0.05 }); },
  },
});
