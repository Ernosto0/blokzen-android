import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  organ: { // glass clinks and an organ chord with a slow swell
    pick() { S.tink(3000, { vol: 0.035, dur: 0.15 }); },
    place() { S.thud({ vol: 0.18, f: 130 }); S.tink(rand(2000, 2600), { vol: 0.07, dur: 0.3 }); },
    clear(n) {
      const r = S.snd.root * 0.5;
      [0, 7, 12, n > 2 ? 16 : 19].forEach(st => { const f = r * Math.pow(2, st / 12); S.tone(f, { dur: 1.3, vol: 0.05, attack: 0.15, wet: true }); S.tone(f * 2, { type: 'triangle', dur: 1.1, vol: 0.02, attack: 0.15 }); });
      for (let i = 0; i < n + 2; i++) S.tink(rand(2200, 3800), { when: 0.05 + i * 0.06, vol: 0.035, dur: 0.4 });
    },
    deal() { S.tink(2600, { vol: 0.03, dur: 0.5 }); },
  },
});
