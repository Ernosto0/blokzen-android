import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { pluck } from '../shared/sound.js';

Object.assign(KITS, {
  mariachi: { // guitarrón bass, a guitar strum, two trumpets
    pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.12 }); },
    place() { S.tone(98, { type: 'triangle', dur: 0.3, vol: 0.18, attack: 0.003 }); S.thud({ vol: 0.12, f: 140 }); },
    clear(n) {
      const r = S.snd.root * 0.5;
      [0, 4, 7, 12].forEach((st, i) => pluck(r * Math.pow(2, st / 12), { when: i * 0.02, vol: 0.05, dur: 0.4 }));
      [0, 4, 7, 12].slice(0, Math.max(2, Math.min(4, n))).forEach((st, i) => {
        const f = r * 2 * Math.pow(2, st / 12), w = 0.18 + i * 0.13;
        S.tone(f, { type: 'square', dur: 0.2, vol: 0.022, attack: 0.02, when: w }); S.tone(f * 1.003, { type: 'square', dur: 0.2, vol: 0.018, attack: 0.02, when: w });
      });
    },
    deal() { [0, 4, 7].forEach((st, i) => pluck(S.snd.root * Math.pow(2, st / 12), { when: i * 0.02, vol: 0.025, dur: 0.2 })); },
  },
});
