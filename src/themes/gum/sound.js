import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  gum: {
    pick() { S.pop({ vol: 0.06, f: 900 }); },
    place() { S.thud({ vol: 0.22, f: 160 }); S.hiss({ dur: 0.08, vol: 0.08, type: 'lowpass', freq: 900 }); },
    clear(n) { for (let i = 0; i < n + 2; i++) S.pop({ when: 0.04 + i * 0.07, vol: 0.18, f: rand(500, 900) }); },
    deal() { S.hiss({ dur: 0.3, vol: 0.06, type: 'bandpass', freq: 400, to: 1800, q: 2 }); },
  },
});
