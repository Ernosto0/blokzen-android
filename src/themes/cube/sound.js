import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';
import { click } from '../shared/sound.js';

Object.assign(KITS, {
  cube: { // the plastic of a speed cube: snaps, a quick run of turns on a clear, a little chord when it all lines up
    pick() { click(0, 0.05, 3000); },
    place() { S.knock(2200, { vol: 0.12 }); S.knock(1800, { vol: 0.1, when: 0.03 }); S.thud({ vol: 0.14, f: 170 }); },
    clear(n) { let w = 0; for (let i = 0; i < 6 + n * 3; i++) { click(w, 0.06, rand(2200, 3000)); w += 0.028; } S.hiss({ dur: 0.25, vol: 0.04, type: 'bandpass', freq: 1500, to: 3500, q: 1 }); [0, 4, 7].forEach((st, i) => S.tink(S.snd.root * 2 * Math.pow(2, st / 12), { when: w + 0.05 + i * 0.03, vol: 0.04, dur: 0.5 })); },
    deal() { for (let i = 0; i < 4; i++) click(i * 0.03, 0.05, 2600); },
  },
});
