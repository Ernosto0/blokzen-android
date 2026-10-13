import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  stone: {
    pick() { S.knock(1400, { vol: 0.05 }); },
    place() { S.knock(rand(380, 450), { vol: 0.3 }); S.hiss({ dur: 0.04, vol: 0.08, type: 'bandpass', freq: 2000, q: 1.5 }); },
    clear(n) { S.hiss({ dur: 0.7, vol: 0.05, type: 'highpass', freq: 6000, to: 10000, when: 0.05 }); for (let i = 0; i < n + 1; i++) S.knock(700 - i * 60, { when: i * 0.07, vol: 0.14 }); },
    deal() { S.knock(1600, { vol: 0.04 }); },
  },
});
