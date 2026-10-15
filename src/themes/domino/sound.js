import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

const clack = (f, when, vol) => { S.knock(f, { when, vol }); S.tink(f * 1.9, { when, vol: vol * 0.22, dur: 0.05 }); };

Object.assign(KITS, {
  domino: { // ivory tiles: a clack when one is set down, a chain of them toppling faster and longer with the combo
    pick() { clack(2100, 0, 0.06); },
    place() { clack(1500, 0, 0.18); clack(1300, 0.035, 0.12); S.thud({ vol: 0.16, f: 140 }); },
    clear(n, combo) {
      const m = 6 + n * 3 + Math.min(combo || 1, 6) * 2; let w = 0, gap = 0.07;
      for (let i = 0; i < m; i++) { clack(S.key(rand(1400, 1800)), w, 0.09); w += gap; gap = Math.max(0.025, gap * 0.93); }
    },
    deal() { for (let i = 0; i < 6; i++) S.knock(rand(1200, 1700), { when: i * 0.04 + Math.random() * 0.02, vol: 0.05 }); S.rustle({ vol: 0.04, dur: 0.2 }); },
  },
});
