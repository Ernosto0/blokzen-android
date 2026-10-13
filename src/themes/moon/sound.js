import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  moon: { // soft chimes on a pentatonic scale and a wave on the shore
    pick() { S.tink(2800, { vol: 0.03, dur: 0.4 }); },
    place() { S.thud({ vol: 0.14, f: 140 }); S.tone(S.snd.root * 0.5, { dur: 0.5, vol: 0.04, attack: 0.03, wet: true }); },
    clear(n) {
      const P = [0, 2, 4, 7, 9, 12, 14];
      for (let i = 0; i < n + 2; i++) S.tink(S.snd.root * 2 * Math.pow(2, P[i % 7] / 12), { when: 0.04 + i * 0.12, vol: 0.04, dur: 0.9 });
      S.hissL({ dur: 1.2, vol: 0.06, type: 'lowpass', freq: 700, to: 200, when: 0.2 });
    },
    deal() { S.hissL({ dur: 0.6, vol: 0.03, type: 'lowpass', freq: 600, to: 250 }); },
  },
});
