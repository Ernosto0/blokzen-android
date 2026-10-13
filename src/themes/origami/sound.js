import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  paper: {
    pick() { S.rustle({ vol: 0.04, dur: 0.06 }); },
    place() { S.rustle({ vol: 0.09 }); S.thud({ vol: 0.12, f: 200 }); },
    clear() { S.hiss({ dur: 0.3, vol: 0.1, type: 'bandpass', freq: 600, to: 4000, q: 1 }); S.rustle({ vol: 0.08, dur: 0.3, when: 0.1 }); },
    deal() { S.rustle({ vol: 0.05, dur: 0.2 }); },
  },
});
