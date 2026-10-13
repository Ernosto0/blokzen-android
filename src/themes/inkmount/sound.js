import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { at } from '../shared/sound.js';

Object.assign(KITS, {
  guqin: { // a guqin: low strings with the finger sliding, and bell-like harmonics
    pick() { S.tone(S.snd.root * 4, { dur: 0.4, vol: 0.02, attack: 0.002 }); },
    place() { S.thud({ vol: 0.14, f: 120 }); S.tone(S.snd.root * 0.25, { dur: 1, vol: 0.08, attack: 0.003, to: S.snd.root * 0.26, wet: true }); },
    clear(n) {
      const P = [0, 2, 4, 7, 9];
      for (let i = 0; i < n + 2; i++) { const f = at(P, i, S.snd.root * 0.5); S.tone(f, { dur: 1.2, vol: 0.06, attack: 0.003, when: i * 0.22, to: f * (i % 2 ? 1.03 : 0.98), wet: true }); }
      S.tone(S.snd.root * 4, { dur: 0.9, vol: 0.025, attack: 0.002, when: 0.1 + (n + 2) * 0.22 });
    },
    deal() { S.tone(S.snd.root * 3, { dur: 0.5, vol: 0.02, attack: 0.002 }); },
  },
});
