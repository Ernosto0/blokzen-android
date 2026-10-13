import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  factory: {
    pick() { S.tone(500, { type: 'square', dur: 0.06, vol: 0.02, to: 800 }); },
    place() { S.hiss({ dur: 0.09, vol: 0.1, type: 'bandpass', freq: 900, q: 1.5 }); S.thud({ vol: 0.35, f: 70 }); S.knock(800, { vol: 0.08, when: 0.02 }); },
    clear(n) { // welding crackle and a two-tone alarm
      for (let i = 0; i < 8 + n * 3; i++) S.hiss({ dur: rand(0.01, 0.04), vol: rand(0.04, 0.1), type: 'highpass', freq: rand(3000, 7000), when: Math.random() * 0.5 });
      S.blip(880, { when: 0.05, dur: 0.09, vol: 0.05 }); S.blip(660, { when: 0.22, dur: 0.09, vol: 0.05 });
    },
    deal() { S.knock(500, { vol: 0.1 }); S.knock(500, { vol: 0.08, when: 0.12 }); },
  },
});
