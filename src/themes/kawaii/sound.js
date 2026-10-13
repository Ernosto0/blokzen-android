import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

// squeaky "mew": a glide up then down, with a thin overtone
const mew = (f, { when = 0, vol = 0.07 } = {}) => {
  S.tone(f, { type: 'triangle', dur: 0.13, vol, to: f * 1.6, when, attack: 0.01, wet: true });
  S.tone(f * 1.6, { type: 'triangle', dur: 0.22, vol: vol * 0.9, to: f * 0.85, when: when + 0.12, attack: 0.01, wet: true });
  S.tone(f * 3.2, { type: 'sine', dur: 0.2, vol: vol * 0.25, to: f * 2, when: when + 0.12 });
};
// a tiny music-box twinkle
const twinkle = (f, { when = 0, vol = 0.07 } = {}) => { S.tone(f, { type: 'sine', dur: 0.35, vol, when, attack: 0.002, wet: true }); S.tone(f * 3, { type: 'sine', dur: 0.12, vol: vol * 0.4, when }); };

Object.assign(KITS, {
  kawaii: { // soft squeaks and bells: a boing when a block is set down, twinkles and a mew when rows pop
    pick() { S.tone(1180, { type: 'sine', dur: 0.07, vol: 0.07, to: 1750 }); },
    place() { S.tone(330, { type: 'sine', dur: 0.16, vol: 0.26, to: 560, attack: 0.006 }); twinkle(1568, { when: 0.05, vol: 0.05 }); },
    clear(n, combo) {
      for (let i = 0; i < n + 1; i++) twinkle(1318.5 * Math.pow(2, [0, 2, 4, 7, 9, 12][i % 6] / 12), { when: 0.1 + i * 0.07, vol: 0.06 });
      S.hiss({ dur: 0.3, vol: 0.04, type: 'highpass', freq: 5000, to: 11000, when: 0.05 });
      if (n > 3 || (combo || 0) > 2) mew(rand(780, 900), { when: 0.32 });
      if (n > 3) S.pop({ vol: 0.12, f: 1100, when: 0.55 });
    },
    deal() { for (let i = 0; i < 3; i++) S.tone(rand(1000, 1500), { type: 'sine', dur: 0.06, vol: 0.05, to: rand(1600, 2200), when: i * 0.07 }); },
  },
});
