import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { at } from '../shared/sound.js';

Object.assign(KITS, {
  djembe: { // djembe bass and tone strokes, and a balafon: wooden keys over gourds
    pick() { S.hiss({ dur: 0.03, vol: 0.05, type: 'highpass', freq: 3000 }); },
    place() { S.tone(78, { dur: 0.25, vol: 0.32, to: 55 }); S.hiss({ dur: 0.05, vol: 0.05, type: 'bandpass', freq: 800, q: 1 }); },
    clear(n) {
      const P = [0, 2, 4, 7, 9];
      for (let i = 0; i < n + 3; i++) {
        const f = at(P, i, S.snd.root), w = i * 0.08;
        S.tone(f, { dur: 0.2, vol: 0.09, attack: 0.001, when: w }); S.tone(f * 3.9, { dur: 0.05, vol: 0.025, when: w }); S.hiss({ dur: 0.03, vol: 0.03, type: 'bandpass', freq: f * 2, q: 3, when: w });
      }
      S.tone(78, { dur: 0.25, vol: 0.3, to: 55 }); S.tone(240, { dur: 0.1, vol: 0.14, to: 200, when: 0.16 }); S.hiss({ dur: 0.06, vol: 0.08, type: 'highpass', freq: 2500, when: 0.3 });
    },
    deal() { S.tone(240, { dur: 0.08, vol: 0.1, to: 200 }); S.tone(240, { dur: 0.08, vol: 0.08, to: 200, when: 0.1 }); },
  },
});
