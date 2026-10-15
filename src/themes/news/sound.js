import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  news: { // typewriter keys and a carriage bell, pages turning
    pick() { S.rustle({ vol: 0.04, dur: 0.05 }); },
    place() { S.knock(1500, { vol: 0.12 }); S.hiss({ dur: 0.03, vol: 0.08, type: 'highpass', freq: 3000 }); S.thud({ vol: 0.12, f: 140 }); },
    clear(n) {
      for (let i = 0; i < n + 3; i++) { S.knock(S.key(rand(1300, 1700)), { when: i * 0.065, vol: 0.1 }); S.hiss({ dur: 0.02, vol: 0.05, type: 'highpass', freq: 3500, when: i * 0.065 }); }
      S.tink(2640, { when: (n + 3) * 0.065 + 0.05, vol: 0.09, dur: 0.6 });
    },
    deal() { S.hissL({ dur: 0.35, vol: 0.05, type: 'bandpass', freq: 1200, to: 3000, q: 0.7 }); },
  },
});
