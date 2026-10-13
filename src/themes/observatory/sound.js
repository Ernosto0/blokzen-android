import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  brass: { // ticking brass gears and an observatory bell
    pick() { S.knock(2600, { vol: 0.04 }); },
    place() { S.thud({ vol: 0.22, f: 120 }); S.tink(900, { vol: 0.07, dur: 0.25 }); },
    clear(n) { for (let i = 0; i < 6; i++) S.knock(2400, { vol: 0.04, when: i * 0.05 }); S.tink(660, { vol: 0.11, dur: 1.6, when: 0.3 }); if (n > 1) S.tink(990, { vol: 0.07, dur: 1.2, when: 0.45 }); },
    deal() { for (let i = 0; i < 3; i++) S.knock(2800, { vol: 0.03, when: i * 0.06 }); },
  },
});
