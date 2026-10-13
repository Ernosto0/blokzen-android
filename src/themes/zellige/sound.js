import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';
import { at, pluck } from '../shared/sound.js';

Object.assign(KITS, {
  oud: { // a plucked oud in maqam hijaz over a darbuka "doum tek tek"
    pick() { pluck(S.snd.root * 2, { vol: 0.03, dur: 0.15 }); },
    place() { S.thud({ vol: 0.2, f: 120 }); pluck(S.snd.root * 0.5, { vol: 0.09, dur: 0.45 }); },
    clear(n) {
      const H = [0, 1, 4, 5, 7, 8, 11];
      for (let i = 0; i < n + 3; i++) pluck(at(H, i, S.snd.root * 0.5), { when: i * 0.075, vol: 0.06, dur: 0.35 });
      S.tone(110, { dur: 0.22, vol: 0.22, to: 70 }); S.knock(1700, { vol: 0.1, when: 0.2 }); S.knock(1700, { vol: 0.08, when: 0.3 });
    },
    deal() { pluck(S.snd.root, { vol: 0.03, dur: 0.2 }); },
  },
});
