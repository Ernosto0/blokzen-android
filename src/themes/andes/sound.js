import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { at, pluck } from '../shared/sound.js';

Object.assign(KITS, {
  panflute: { // a breathy zampoña and the doubled strings of a charango
    pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.1 }); pluck(S.snd.root * 2.01, { vol: 0.025, dur: 0.1 }); },
    place() { S.thud({ vol: 0.2, f: 110 }); S.hiss({ dur: 0.08, vol: 0.04, type: 'lowpass', freq: 700 }); },
    clear(n) {
      const P = [0, 3, 5, 7, 10];
      for (let i = 0; i < n + 2; i++) { const f = at(P, i, S.snd.root), w = i * 0.14; S.tone(f, { dur: 0.45, vol: 0.07, attack: 0.04, when: w, wet: true }); S.hiss({ dur: 0.3, vol: 0.025, type: 'bandpass', freq: f * 2, q: 6, when: w }); }
    },
    deal() { S.hiss({ dur: 0.25, vol: 0.03, type: 'bandpass', freq: S.snd.root * 2, q: 5 }); },
  },
});
