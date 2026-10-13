import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

// all sounds are synthesized here: a bubbly "blub" is a sine gliding up, a "boing" a sine springing down then up
const blub = (f, { when = 0, vol = 0.1 } = {}) => { S.tone(f, { type: 'sine', dur: 0.09, vol, to: f * 1.9, when, attack: 0.004, wet: true }); S.tone(f * 1.5, { type: 'sine', dur: 0.05, vol: vol * 0.4, to: f * 2.6, when: when + 0.02 }); };
const boing = (f, { when = 0, vol = 0.2 } = {}) => { S.tone(f, { type: 'sine', dur: 0.12, vol, to: f * 0.6, when, attack: 0.004 }); S.tone(f * 0.6, { type: 'sine', dur: 0.2, vol: vol * 0.8, to: f * 1.6, when: when + 0.11, attack: 0.01 }); };
// a silly giggle: a quick run of short squeaky notes
const giggle = (f, { when = 0, vol = 0.06 } = {}) => { for (let i = 0; i < 5; i++) S.tone(f * (i % 2 ? 1.18 : 1), { type: 'triangle', dur: 0.07, vol, to: f * (i % 2 ? 1.05 : 1.3), when: when + i * 0.085, attack: 0.005, wet: true }); };

Object.assign(KITS, {
  bubble: { // blubs and boings: a bubble when you pick a piece up, a boing when it lands, bubbly arpeggios and a giggle for big clears
    pick() { blub(rand(620, 760), { vol: 0.08 }); },
    place() { boing(rand(300, 340)); S.pop({ vol: 0.06, f: 900, when: 0.04 }); },
    clear(n, combo) {
      for (let i = 0; i < n + 2; i++) blub(520 * Math.pow(2, [0, 4, 7, 12, 16, 19][i % 6] / 12), { when: 0.08 + i * 0.07, vol: 0.08 });
      S.hiss({ dur: 0.35, vol: 0.05, type: 'bandpass', freq: 1200, to: 4200, q: 1.2, when: 0.04 });
      if (n > 1) giggle(rand(900, 1050), { when: 0.3 });
      if (n > 3 || (combo || 0) > 2) { boing(rand(380, 440), { when: 0.62, vol: 0.14 }); S.pop({ vol: 0.14, f: 800, when: 0.9 }); }
    },
    deal() { for (let i = 0; i < 3; i++) blub(rand(480, 700), { when: i * 0.08, vol: 0.06 }); },
  },
});
