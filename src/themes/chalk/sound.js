import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

const scratch = (when, dur, vol) => S.hiss({ dur, vol, type: 'bandpass', freq: rand(2500, 4200), to: rand(2000, 5000), q: 4, when });

Object.assign(KITS, {
  chalk: { // chalk tapped on the board, a few strokes scratched, then the eraser
    pick() { S.knock(2400, { vol: 0.04 }); },
    place() { S.knock(1900, { vol: 0.13 }); scratch(0.01, 0.06, 0.05); S.thud({ vol: 0.14, f: 160 }); },
    clear(n) { const m = Math.min(n + 2, 5); for (let i = 0; i < m; i++) scratch(i * 0.09, 0.12, 0.06); S.hissL({ dur: 0.45, vol: 0.06, type: 'lowpass', freq: 900, to: 380, q: 0.7, when: m * 0.09 + 0.05 }); },
    deal() { S.knock(2100, { vol: 0.05 }); S.knock(2100, { vol: 0.04, when: 0.08 }); },
  },
});
