import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  sand: { // sand poured and blown by the wind
    pick() { S.hiss({ dur: 0.05, vol: 0.04, type: 'lowpass', freq: 2500 }); },
    place() { S.hissL({ dur: 0.22, vol: 0.08, type: 'lowpass', freq: 1600, to: 600, q: 1 }); S.thud({ vol: 0.16, f: 110 }); },
    clear(n) { S.hissL({ dur: 0.9 + n * 0.1, vol: 0.09, type: 'bandpass', freq: 400, to: 1400, q: 0.6 }); S.hissL({ dur: 0.6, vol: 0.05, type: 'highpass', freq: 5000, when: 0.15 }); },
    deal() { S.hissL({ dur: 0.3, vol: 0.04, type: 'lowpass', freq: 2200, to: 900 }); },
  },
});
