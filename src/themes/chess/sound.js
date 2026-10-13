import { Sfx as S } from '../../audio/sfx.js';
import { rand } from '../../core/util.js';
import { KITS } from '../registry.js';
import { click } from '../shared/sound.js';

Object.assign(KITS, {
  chess: { // a weighted wooden piece set down, the chess clock pressed, a bell for check on a bigger clear
    pick() { S.knock(1150, { vol: 0.05 }); },
    place() { S.thud({ vol: 0.3, f: 190 }); S.knock(640, { vol: 0.15 }); },
    clear(n, combo) {
      S.knock(700, { vol: 0.16 }); S.thud({ vol: 0.28, f: 170 }); S.knock(560, { vol: 0.12, when: 0.09 }); // a capture: one piece off, the other in its place
      click(0.3, 0.1, 2400); S.knock(1800, { vol: 0.08, when: 0.3 });
      if (n > 1 || (combo || 0) > 2) S.tink(1568, { vol: 0.07, dur: 1, when: 0.42 });
    },
    deal() { for (let i = 0; i < 3; i++) S.knock(rand(900, 1300), { vol: 0.05, when: i * 0.06 }); },
  },
});
