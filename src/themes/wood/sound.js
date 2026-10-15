import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  wood: {
    pick() { S.knock(900, { vol: 0.08 }); },
    place() { S.knock(rand(520, 620), { vol: 0.3 }); S.thud({ vol: 0.2, f: 130 }); },
    clear(n) { for (let i = 0; i < n + 2; i++) S.knock(S.key(500 + i * 90), { when: i * 0.06, vol: 0.18 }); },
    deal() { S.knock(1100, { vol: 0.06 }); S.knock(1300, { vol: 0.05, when: 0.06 }); },
  },
});
