import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  zen: {
    pick() { S.tone(1300, { dur: 0.06, vol: 0.04, to: 2000 }); },
    place() { S.knock(320, { vol: 0.3 }); S.tone(160, { dur: 0.12, vol: 0.12, to: 120 }); },
    clear(n) { // wind chimes on a pentatonic scale and a drop in the pond
      const P = [0, 2, 4, 7, 9, 12, 14, 16];
      for (let i = 0; i < n + 3; i++) S.tink(S.snd.root * 2 * Math.pow(2, P[(Math.random() * 8) | 0] / 12), { when: 0.05 + i * 0.09 + Math.random() * 0.04, vol: 0.04, dur: 0.8 });
      S.plop(400, { when: 0.1, vol: 0.06 });
    },
    deal() { S.tone(1100, { dur: 0.08, vol: 0.03, to: 1700 }); },
  },
});
