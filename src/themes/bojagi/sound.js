import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { at, pluck } from '../shared/sound.js';

Object.assign(KITS, {
  gayageum: { // silk strings on a pentatonic scale, each note bent a little as it fades
    pick() { pluck(S.snd.root * 2, { type: 'sine', vol: 0.03, dur: 0.2 }); },
    place() { S.thud({ vol: 0.16, f: 140 }); pluck(S.snd.root * 0.5, { type: 'sine', vol: 0.08, dur: 0.7, to: S.snd.root * 0.49 }); },
    clear(n) {
      const P = [0, 2, 5, 7, 9];
      for (let i = 0; i < n + 3; i++) { const f = at(P, i, S.snd.root * 0.5); pluck(f, { type: 'sine', when: i * 0.1, vol: 0.06, dur: 0.8, to: f * 0.985 }); }
    },
    deal() { pluck(S.snd.root * 1.5, { type: 'sine', vol: 0.03, dur: 0.3 }); },
  },
});
