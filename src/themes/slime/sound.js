import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  slime: {
    pick() { S.squelch({ vol: 0.06, dur: 0.1 }); },
    place() { S.squelch({ vol: 0.14, dur: 0.2 }); S.thud({ vol: 0.2, f: 90 }); },
    clear(n) { for (let i = 0; i < n + 1; i++) S.squelch({ when: i * 0.08, vol: 0.12, dur: 0.16 }); S.plop(300, { when: 0.1, vol: 0.1 }); },
    deal() { S.squelch({ vol: 0.05, dur: 0.14 }); },
  },
});
