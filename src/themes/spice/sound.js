import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  spice: { // grains poured from a scoop, brass scale pans, a darbuka "doum tek"
    pick() { S.hiss({ dur: 0.04, vol: 0.05, type: 'bandpass', freq: 3200, q: 2 }); },
    place() { S.hissL({ dur: 0.22, vol: 0.08, type: 'bandpass', freq: 2600, to: 1200, q: 1.2 }); S.thud({ vol: 0.2, f: 120 }); },
    clear(n) {
      S.tone(110, { dur: 0.25, vol: 0.28, to: 70 }); S.knock(1800, { vol: 0.12, when: 0.18 }); S.knock(1800, { vol: 0.1, when: 0.3 });
      if (n > 1) { S.tone(110, { dur: 0.2, vol: 0.22, to: 70, when: 0.45 }); S.knock(1800, { vol: 0.1, when: 0.6 }); }
      S.tink(1250, { vol: 0.07, when: 0.05, dur: 0.5 }); S.tink(1580, { vol: 0.05, when: 0.1, dur: 0.4 });
      S.hissL({ dur: 0.7, vol: 0.06, type: 'bandpass', freq: 3000, to: 1500, q: 1, when: 0.05 });
    },
    deal() { S.rustle({ vol: 0.05, dur: 0.15 }); },
  },
});
