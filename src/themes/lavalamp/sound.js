import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  funk: {
    pick() { S.tone(300, { dur: 0.08, vol: 0.08, to: 600 }); },
    place() { S.tone(180, { dur: 0.12, vol: 0.2, to: 110 }); S.thud({ vol: 0.15, f: 90 }); },
    clear(n) {
      const r = S.snd.root * 0.5;
      [0, 4, 7, 10].forEach(st => S.wah(r * Math.pow(2, st / 12), { vol: 0.035, dur: 0.5 }));
      if (n > 2) [0, 4, 7, 10].forEach(st => S.wah(r * Math.pow(2, (st + 5) / 12), { vol: 0.03, dur: 0.4, when: 0.25 }));
      S.tone(110, { dur: 0.25, vol: 0.2, to: 70 });
    },
    deal() { S.tone(260, { dur: 0.07, vol: 0.06, to: 520 }); S.tone(330, { dur: 0.07, vol: 0.05, to: 660, when: 0.07 }); },
  },
});
