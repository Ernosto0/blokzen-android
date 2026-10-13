import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  carnival: {
    pick() { S.tink(2100, { vol: 0.04, dur: 0.12 }); },
    place() { S.thud({ vol: 0.2, f: 150 }); S.tone(S.snd.root, { type: 'square', dur: 0.12, vol: 0.03 }); },
    clear(n) { S.pop({ vol: 0.15, f: 800 }); S.tink(1760, { vol: 0.07, dur: 0.6, when: 0.05 }); [0, 4, 7, 12].slice(0, Math.max(2, Math.min(4, n))).forEach((st, i) => S.tone(S.snd.root * Math.pow(2, st / 12), { type: 'square', dur: 0.12, vol: 0.025, when: 0.1 + i * 0.08 })); },
    deal() { S.tink(2000, { vol: 0.04, dur: 0.15 }); S.tink(2000, { vol: 0.03, dur: 0.15, when: 0.12 }); },
  },
});
