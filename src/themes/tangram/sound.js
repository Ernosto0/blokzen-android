import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  tangram: { // lacquered wooden pieces: a soft tak, a clatter on a clear and a little chime
    pick() { S.knock(1600, { vol: 0.05 }); },
    place() { S.knock(820, { vol: 0.2 }); S.tink(1640, { vol: 0.03, dur: 0.1 }); S.thud({ vol: 0.15, f: 150 }); },
    clear(n) { for (let i = 0; i < n * 2 + 4; i++) S.knock(rand(700, 1200), { when: i * 0.045 + Math.random() * 0.02, vol: 0.08 }); S.tink(S.snd.root * 2, { when: 0.3, vol: 0.04, dur: 0.6 }); },
    deal() { for (let i = 0; i < 3; i++) S.hiss({ dur: 0.06, vol: 0.04, type: 'lowpass', freq: 1200, when: i * 0.05 }); },
  },
});
