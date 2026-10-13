import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  comet: { // shimmering ice and a whoosh as the comet passes
    pick() { S.tink(3600, { vol: 0.03, dur: 0.3 }); },
    place() { S.thud({ vol: 0.15, f: 140 }); S.tone(S.snd.root * 0.5, { dur: 0.35, vol: 0.04, to: S.snd.root, wet: true }); },
    clear(n) {
      for (let i = 0; i < n + 4; i++) S.tink(S.snd.root * 2 * Math.pow(2, [0, 4, 7, 11, 12, 16, 19, 23][i % 8] / 12), { when: i * 0.06, vol: 0.04, dur: 0.6 });
      S.hissL({ dur: 0.9, vol: 0.07, type: 'bandpass', freq: 300, to: 4000, q: 0.7 });
    },
    deal() { S.tink(3200, { vol: 0.03, dur: 0.4 }); S.tink(4200, { vol: 0.02, dur: 0.3, when: 0.06 }); },
  },
});
