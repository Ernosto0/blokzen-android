import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  tea: { // spoon on glass, stirring, tea being poured, a ferry horn
    pick() { S.tink(3200, { vol: 0.04, dur: 0.08 }); },
    place() { S.thud({ vol: 0.16, f: 170 }); S.tink(rand(2300, 2600), { vol: 0.09, dur: 0.25 }); },
    clear(n) {
      for (let i = 0; i < n + 3; i++) S.tink(i % 2 ? 2900 : 2600, { when: i * 0.08, vol: 0.06, dur: 0.18 });
      S.tone(150, { type: 'triangle', dur: 0.9, vol: 0.07, when: 0.35, attack: 0.05, wet: true });
      S.tone(151.5, { type: 'triangle', dur: 0.9, vol: 0.05, when: 0.35, attack: 0.05 });
    },
    deal() { S.hissL({ dur: 0.35, vol: 0.05, type: 'lowpass', freq: 900, to: 400, q: 2 }); },
  },
});
