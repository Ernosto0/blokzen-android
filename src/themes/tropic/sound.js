import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  ukulele: {
    pick() { S.tone(1046, { type: 'triangle', dur: 0.06, vol: 0.05, attack: 0.002 }); },
    place() { S.knock(700, { vol: 0.2 }); S.thud({ vol: 0.15, f: 140 }); },
    clear() { // one strum of a ukulele, then a wave washing in
      [392, 261.63, 329.63, 440].forEach((f, i) => { S.tone(f * 1.5, { type: 'triangle', dur: 0.35, vol: 0.07, when: i * 0.025, attack: 0.002 }); S.tone(f * 3, { dur: 0.15, vol: 0.02, when: i * 0.025 }); });
      S.hissL({ dur: 1.2, vol: 0.06, type: 'lowpass', freq: 700, to: 200, when: 0.15 });
    },
    deal() { S.hissL({ dur: 0.7, vol: 0.03, type: 'lowpass', freq: 600, to: 250 }); },
  },
});
