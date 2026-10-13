import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { at } from '../shared/sound.js';

Object.assign(KITS, {
  gamelan: { // bronze keys in pelog, tuned in pairs a hair apart so they shimmer, and the big gong
    pick() { S.tone(S.snd.root * 2, { dur: 0.3, vol: 0.03, attack: 0.003 }); },
    place() { S.thud({ vol: 0.18, f: 120 }); S.tone(S.snd.root * 0.5, { dur: 0.9, vol: 0.05, attack: 0.003, wet: true }); S.tone(S.snd.root * 0.503, { dur: 0.9, vol: 0.04, attack: 0.003 }); },
    clear(n) {
      const P = [0, 1, 3, 7, 8];
      for (let i = 0; i < n + 3; i++) { const f = at(P, i, S.snd.root), w = i * 0.12; S.tone(f, { dur: 1.1, vol: 0.05, attack: 0.003, when: w, wet: true }); S.tone(f * 1.007, { dur: 1.1, vol: 0.04, attack: 0.003, when: w }); S.tone(f * 2.7, { dur: 0.25, vol: 0.015, when: w }); }
      S.tone(70, { dur: 2, vol: 0.12, attack: 0.01, when: 0.05, wet: true }); S.tone(70.6, { dur: 2, vol: 0.1, attack: 0.01, when: 0.05 });
    },
    deal() { S.tone(S.snd.root * 1.5, { dur: 0.6, vol: 0.025, attack: 0.003, wet: true }); },
  },
});
