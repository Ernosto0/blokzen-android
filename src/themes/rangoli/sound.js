import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { at, pluck } from '../shared/sound.js';

Object.assign(KITS, {
  sitar: { // tabla strokes, and a sitar run in raag yaman with a slide into each note
    pick() { S.tone(520, { dur: 0.08, vol: 0.06, to: 470 }); },
    place() { S.tone(95, { dur: 0.35, vol: 0.22, to: 140 }); S.tone(520, { dur: 0.1, vol: 0.06, to: 480, when: 0.05 }); },
    clear(n) {
      const Y = [0, 2, 4, 6, 7, 9, 11];
      for (let i = 0; i < n + 3; i++) { const f = at(Y, i, S.snd.root * 0.5); pluck(f, { when: i * 0.09, vol: 0.06, dur: 0.5, to: f * 1.015 }); S.tink(f * 3, { when: i * 0.09 + 0.02, vol: 0.012, dur: 0.6 }); }
      S.tone(95, { dur: 0.35, vol: 0.2, to: 140 }); S.tone(560, { dur: 0.1, vol: 0.07, to: 500, when: 0.18 });
    },
    deal() { S.tink(S.snd.root * 3, { vol: 0.02, dur: 0.8 }); },
  },
});
