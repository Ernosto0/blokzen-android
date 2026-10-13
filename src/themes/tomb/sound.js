import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

const gong = (f, when, vol) => { S.tone(f, { dur: 1.8, vol, when, attack: 0.005, wet: true }); S.tone(f * 2.76, { dur: 0.9, vol: vol * 0.4, when }); S.tone(f * 1.52, { dur: 1.3, vol: vol * 0.5, when, detune: -12 }); };

Object.assign(KITS, {
  tomb: {
    pick() { S.hiss({ dur: 0.07, vol: 0.05, type: 'bandpass', freq: 900, q: 1.5 }); },
    place() { S.knock(260, { vol: 0.3 }); S.hiss({ dur: 0.15, vol: 0.07, type: 'bandpass', freq: 700, to: 300, q: 1.2, when: 0.01 }); },
    clear(n) { gong(110 + n * 6, 0, 0.16); S.hissL({ dur: 0.9, vol: 0.05, type: 'lowpass', freq: 2500, to: 400, when: 0.15 }); },
    deal() { S.hiss({ dur: 0.25, vol: 0.05, type: 'bandpass', freq: 600, to: 1400, q: 1.2 }); },
  },
});
