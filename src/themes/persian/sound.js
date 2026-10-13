import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { at } from '../shared/sound.js';

Object.assign(KITS, {
  santur: { // the hammered strings of a santur in dastgah-e shur, with its in-between koron steps
    pick() { S.tink(S.snd.root * 4, { vol: 0.02, dur: 0.2 }); },
    place() { S.thud({ vol: 0.16, f: 130 }); S.tone(S.snd.root, { dur: 0.4, vol: 0.05, attack: 0.001, wet: true }); S.tone(S.snd.root * 1.004, { dur: 0.4, vol: 0.04, attack: 0.001 }); },
    clear(n) {
      const D = [0, 1.5, 3, 5, 7, 8.5, 10];
      for (let i = 0; i < n + 3; i++) { const f = at(D, i, S.snd.root), w = i * 0.085; S.tone(f, { dur: 0.55, vol: 0.05, attack: 0.001, when: w, wet: true }); S.tone(f * 1.004, { dur: 0.5, vol: 0.04, attack: 0.001, when: w }); S.tone(f * 2, { dur: 0.2, vol: 0.015, when: w }); }
    },
    deal() { S.tone(S.snd.root * 2, { dur: 0.3, vol: 0.025, attack: 0.001, wet: true }); },
  },
});
