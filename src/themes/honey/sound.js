import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  honey: {
    pick() { S.plop(330, { vol: 0.09, dur: 0.06 }); },
    place() { S.plop(170, { vol: 0.34, dur: 0.12 }); S.tone(120, { dur: 0.18, vol: 0.28, to: 55 }); S.goo({ vol: 0.12, dur: 0.14, when: 0.01 }); },
    clear(n) {
      S.hiss({ dur: 0.6, vol: 0.09, type: 'lowpass', freq: 1100, to: 260, when: 0.02, q: 3 });
      for (let i = 0; i < n + 1; i++) S.plop(rand(420, 760), { when: 0.08 + i * 0.075 + Math.random() * 0.03, vol: 0.11 });
      S.tone(120, { dur: 0.26, vol: 0.28, to: 50 });
    },
    deal() { S.goo({ vol: 0.07, dur: 0.22 }); },
  },
});
