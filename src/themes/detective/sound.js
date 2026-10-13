import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

const pizz = (f, when, vol) => { S.tone(f, { dur: 0.38, vol, when, attack: 0.003, to: f * 0.995 }); S.tone(f * 2, { dur: 0.12, vol: vol * 0.35, when, attack: 0.002 }); };

const WALK = [0, 3, 5, 7, 10, 12];

Object.assign(KITS, {
  detective: { // a pin pushed into cork, paper, a string snapping, a double bass walking under it
    pick() { S.rustle({ vol: 0.04, dur: 0.05 }); },
    place() { S.knock(2700, { vol: 0.07 }); S.thud({ vol: 0.22, f: 130 }); },
    clear(n, combo) {
      S.tone(900, { type: 'triangle', dur: 0.12, vol: 0.06, to: 380 }); S.rustle({ vol: 0.07, dur: 0.3, when: 0.05 });
      const r = S.snd.root / 4;
      for (let i = 0; i < Math.min(n + 1, 4); i++) pizz(r * Math.pow(2, WALK[(i + (combo || 0)) % 6] / 12), 0.1 + i * 0.14, 0.16);
    },
    deal() { S.rustle({ vol: 0.05, dur: 0.2 }); S.rustle({ vol: 0.04, dur: 0.15, when: 0.12 }); },
  },
});
