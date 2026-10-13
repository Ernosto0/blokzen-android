import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  iznik: {
    pick() { S.tink(2300, { vol: 0.05, dur: 0.12 }); },
    place() { S.thud({ vol: 0.22, f: 160 }); S.tink(rand(1700, 2000), { vol: 0.1, dur: 0.2 }); },
    clear(n) { // a quick kanun run in a hijaz scale
      const H = [0, 1, 4, 5, 7, 8, 11, 12];
      for (let i = 0; i < n + 3; i++) { const f = S.snd.root * Math.pow(2, H[i % 8] / 12); S.tone(f, { type: 'triangle', dur: 0.18, vol: 0.09, when: i * 0.07, attack: 0.002 }); S.tone(f * 2, { dur: 0.1, vol: 0.03, when: i * 0.07 }); }
      S.tink(2600, { vol: 0.05, when: 0.05 });
    },
    deal() { S.tink(2000, { vol: 0.04, dur: 0.1 }); S.tink(2500, { vol: 0.03, dur: 0.1, when: 0.05 }); },
  },
});
