import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  cloud: {
    pick() { S.hiss({ dur: 0.06, vol: 0.04, type: 'lowpass', freq: 1200 }); },
    place() { S.hiss({ dur: 0.12, vol: 0.08, type: 'lowpass', freq: 900, to: 300 }); S.thud({ vol: 0.12, f: 160 }); },
    clear(n) { S.hissL({ dur: 0.6, vol: 0.06, type: 'bandpass', freq: 500, to: 1800, q: 0.5 }); for (let i = 0; i < n + 3; i++) S.tink(rand(2200, 3800), { when: 0.08 + Math.random() * 0.5, vol: 0.03, dur: 0.6 }); },
    deal() { S.hiss({ dur: 0.15, vol: 0.04, type: 'lowpass', freq: 1000 }); },
  },
});
