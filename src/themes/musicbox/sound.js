import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

const MEL = [0, 4, 7, 12, 7, 4, 5, 9, 12, 9, 5, 4, 2, 7, 11, 14, 11, 7, 0, 4, 7, 12, 16, 12];

let mi = 0;

const comb = (st, { when = 0, vol = 0.08 } = {}) => { const f = S.snd.root * 0.5 * Math.pow(2, st / 12); S.tone(f, { dur: 0.7, vol, when, attack: 0.002, wet: true }); S.tone(f * 3, { dur: 0.2, vol: vol * 0.25, when, attack: 0.002 }); };

Object.assign(KITS, {
  musicbox: {
    pick() { comb(24, { vol: 0.03 }); },
    place() { comb(MEL[mi++ % MEL.length], { vol: 0.09 }); S.thud({ vol: 0.1, f: 180 }); }, // each block plays the next note of the tune
    clear(n) { for (let i = 0; i < Math.min(n, 5); i++) comb(MEL[mi++ % MEL.length] + 12, { when: i * 0.1, vol: 0.07 }); comb(0, { when: 0.02, vol: 0.05 }); comb(7, { when: 0.02, vol: 0.04 }); },
    deal() { for (let i = 0; i < 4; i++) S.knock(3000, { vol: 0.03, when: i * 0.035 }); },
  },
});
