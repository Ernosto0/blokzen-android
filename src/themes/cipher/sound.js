import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';
import { click } from '../shared/sound.js';

const key = (when, vol) => { S.knock(rand(1500, 1800), { when, vol }); S.hiss({ dur: 0.02, vol: vol * 0.5, type: 'highpass', freq: 3500, when }); };

Object.assign(KITS, {
  cipher: { // typewriter keys, the rotors ratcheting on, a bell at the end of the line
    pick() { S.knock(2600, { vol: 0.04 }); },
    place() { key(0, 0.15); click(0.05, 0.06, 3200); S.thud({ vol: 0.14, f: 150 }); },
    clear(n) { for (let i = 0; i < n + 3; i++) { key(i * 0.07, 0.1); click(i * 0.07 + 0.03, 0.04, 3200); } S.tink(2640, { when: (n + 3) * 0.07 + 0.05, vol: 0.08, dur: 0.6 }); },
    deal() { for (let i = 0; i < 3; i++) click(i * 0.05, 0.07, 2800 + i * 200); },
  },
});
