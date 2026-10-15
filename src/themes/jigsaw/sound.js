import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  jigsaw: { // cardboard lifted off the table, a piece clicking into place, a run of them snapping in
    pick() { S.rustle({ vol: 0.035, dur: 0.05 }); },
    place() { S.knock(1150, { vol: 0.17 }); S.thud({ vol: 0.18, f: 150 }); S.hiss({ dur: 0.03, vol: 0.05, type: 'bandpass', freq: 2800, q: 2 }); },
    clear(n) { for (let i = 0; i < n + 3; i++) S.knock(S.key(rand(1000, 1400)), { when: i * 0.06, vol: 0.1 }); S.pop({ when: (n + 3) * 0.06, vol: 0.12, f: 620 }); },
    deal() { S.rustle({ vol: 0.05, dur: 0.18 }); S.knock(1300, { vol: 0.04, when: 0.1 }); },
  },
});
