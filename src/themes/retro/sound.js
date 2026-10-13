import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  chip: {
    pick() { S.blip(880, { to: 1320, dur: 0.05, vol: 0.05 }); },
    place() { S.blip(330, { to: 110, dur: 0.1, vol: 0.09 }); S.hiss({ dur: 0.04, vol: 0.06, type: 'highpass', freq: 3000 }); },
    clear(n) { S.hiss({ dur: 0.3, vol: 0.1, type: 'lowpass', freq: 3000, to: 200, q: 1 }); S.blip(220, { to: 55, dur: 0.25, vol: 0.08 }); for (let i = 0; i < n; i++) S.blip(1760, { when: 0.3 + i * 0.05, dur: 0.03, vol: 0.04 }); },
    deal() { S.blip(660, { to: 990, dur: 0.06, vol: 0.04 }); },
  },
});
