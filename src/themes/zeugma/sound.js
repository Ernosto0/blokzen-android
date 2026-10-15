import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  mosaic: { // stone tiles set down one by one, a brush sweeping the dust
    pick() { S.knock(2200, { vol: 0.04 }); },
    place() { S.knock(900, { vol: 0.16 }); S.knock(1200, { vol: 0.1, when: 0.04 }); S.thud({ vol: 0.12, f: 140 }); },
    clear(n) { for (let i = 0; i < n * 3 + 4; i++) S.knock(S.key(rand(900, 1600)), { when: i * 0.035 + Math.random() * 0.02, vol: 0.07 }); S.hissL({ dur: 0.5, vol: 0.05, type: 'bandpass', freq: 2500, to: 1200, q: 0.8, when: 0.1 }); },
    deal() { for (let i = 0; i < 3; i++) S.knock(1400 + i * 150, { vol: 0.04, when: i * 0.05 }); },
  },
});
