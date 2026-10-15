import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  ebru: {
    pick() { S.tone(1400, { dur: 0.05, vol: 0.05, to: 2200 }); },
    place() { S.plop(220, { vol: 0.2, dur: 0.09 }); S.thud({ vol: 0.15, f: 120 }); S.tone(900, { dur: 0.25, vol: 0.03, to: 500, when: 0.05, wet: true }); },
    clear(n) { S.hiss({ dur: 0.45, vol: 0.07, type: 'bandpass', freq: 800, to: 2600, q: 1 }); for (let i = 0; i < n + 1; i++) S.plop(S.key(rand(350, 650)), { when: 0.12 + i * 0.09, vol: 0.08 }); },
    deal() { S.tone(700, { dur: 0.3, vol: 0.03, to: 450, wet: true }); },
  },
});
