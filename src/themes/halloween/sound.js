import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  spooky: {
    pick() { S.tone(240, { dur: 0.1, vol: 0.06, to: 180 }); },
    place() { S.thud({ vol: 0.32, f: 80 }); S.tone(95, { type: 'sawtooth', dur: 0.14, vol: 0.025, to: 70, when: 0.02 }); },
    clear() {
      S.tone(660, { dur: 0.7, vol: 0.08, to: 392, wet: true, attack: 0.05 });
      S.tone(664, { dur: 0.7, vol: 0.06, to: 396, attack: 0.05 });
      S.hiss({ dur: 0.9, vol: 0.07, type: 'bandpass', freq: 400, to: 900, q: 3 });
      S.thud({ vol: 0.25, f: 70 });
    },
    deal() { S.hiss({ dur: 0.4, vol: 0.05, type: 'bandpass', freq: 500, to: 300, q: 3 }); },
  },
});
