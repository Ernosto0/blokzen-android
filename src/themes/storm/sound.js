import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  storm: {
    pick() { S.hiss({ dur: 0.03, vol: 0.05, type: 'highpass', freq: 5000 }); },
    place() { S.thud({ vol: 0.28, f: 100 }); for (let i = 0; i < 3; i++) S.hiss({ dur: 0.02, vol: 0.04, type: 'highpass', freq: 4000, when: 0.02 + i * 0.04 * Math.random() }); },
    clear(n) { // a crack, then thunder that grows with the lines cleared
      const k = Math.min(1, 0.4 + n * 0.15);
      S.hiss({ dur: 0.08, vol: 0.16 * k, type: 'highpass', freq: 2000 });
      S.hissL({ dur: 1.2 + n * 0.25, vol: 0.22 * k, type: 'lowpass', freq: 500, to: 70, q: 1, when: 0.05 });
      S.tone(60, { dur: 1, vol: 0.22 * k, to: 35, when: 0.05 });
    },
    deal() { S.hissL({ dur: 0.5, vol: 0.03, type: 'highpass', freq: 3000 }); },
  },
});
