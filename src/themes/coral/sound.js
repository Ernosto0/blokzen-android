import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  reef: {
    pick() { S.plop(260, { vol: 0.07, dur: 0.06 }); },
    place() { S.thud({ vol: 0.3, f: 100 }); S.plop(180, { vol: 0.12, dur: 0.1, when: 0.02 }); S.hiss({ dur: 0.12, vol: 0.05, type: 'lowpass', freq: 500 }); },
    clear(n) {
      S.tone(280, { dur: 1.1, vol: 0.07, to: 520, attack: 0.15, wet: true }); S.tone(520, { dur: 0.8, vol: 0.05, to: 360, attack: 0.1, when: 0.9, wet: true });
      for (let i = 0; i < n + 2; i++) S.plop(rand(300, 700), { when: 0.05 + i * 0.07, vol: 0.08 });
    },
    deal() { S.plop(420, { vol: 0.05 }); S.plop(560, { vol: 0.04, when: 0.06 }); },
  },
});
