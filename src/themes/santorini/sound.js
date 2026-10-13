import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { at, pluck } from '../shared/sound.js';

Object.assign(KITS, {
  bouzouki: { // a bouzouki tremolo on each note, then a wave on the shore
    pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.1 }); },
    place() { S.thud({ vol: 0.16, f: 140 }); pluck(S.snd.root, { vol: 0.06, dur: 0.25 }); },
    clear(n) {
      const P = [0, 2, 4, 5, 7, 9, 10];
      for (let i = 0; i < Math.min(n + 2, 6); i++) for (let j = 0; j < 4; j++) pluck(at(P, i, S.snd.root), { when: i * 0.16 + j * 0.04, vol: 0.035, dur: 0.1 });
      S.hissL({ dur: 1.1, vol: 0.05, type: 'lowpass', freq: 700, to: 220, when: 0.2 });
    },
    deal() { S.hissL({ dur: 0.6, vol: 0.03, type: 'lowpass', freq: 600, to: 250 }); },
  },
});
