import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  aurora: {
    pick() { S.tink(2600, { vol: 0.04, dur: 0.3 }); },
    place() { S.thud({ vol: 0.2, f: 140 }); S.tone(S.snd.root * 0.5, { dur: 0.5, vol: 0.05, attack: 0.03, wet: true }); },
    clear(n) {
      const r = S.snd.root * 0.5;
      [0, 7, 12].forEach(st => { const f = r * Math.pow(2, st / 12); S.tone(f, { dur: 1.2, vol: 0.05, attack: 0.12, wet: true, when: 0.02 }); S.tone(f, { dur: 1.2, vol: 0.04, attack: 0.12, detune: 9, when: 0.02 }); });
      for (let i = 0; i < n + 2; i++) S.tink(r * 4 * Math.pow(2, [0, 4, 7, 11, 14, 19, 23][i % 7] / 12), { when: 0.08 + i * 0.06, vol: 0.035, dur: 0.5 });
    },
    deal() { S.tink(3100, { vol: 0.03, dur: 0.4 }); },
  },
});
