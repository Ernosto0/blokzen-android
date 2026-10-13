import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

// An ASMR kit: everything is quiet, soft and close. Fabric rustles, muffled pats on a cushion, a music-box note or two.
Object.assign(KITS, {
  cozy: {
    pick() { S.rustle({ vol: 0.035, dur: 0.1 }); S.tone(620, { dur: 0.05, vol: 0.015, to: 760 }); },
    place() { // a soft pat on a pillow: a low muffled body, a little fabric
      S.tone(190, { dur: 0.16, vol: 0.14, to: 110, attack: 0.012 });
      S.hiss({ dur: 0.12, vol: 0.05, type: 'lowpass', freq: 700, to: 250 });
      S.rustle({ vol: 0.025, dur: 0.08, when: 0.02 });
    },
    clear(n) { // a lullaby on a pentatonic scale, each note soft and long, over a breath of wool
      const P = [0, 2, 4, 7, 9, 12, 14, 16];
      for (let i = 0; i < n + 3; i++) S.tone(S.snd.root * 2 * Math.pow(2, P[(Math.random() * 8) | 0] / 12), { dur: 0.9, vol: 0.04, attack: 0.012, when: 0.05 + i * 0.13 });
      S.hiss({ dur: 0.5, vol: 0.04, type: 'lowpass', freq: 900, to: 300, when: 0.02 });
      S.rustle({ vol: 0.04, dur: 0.2, when: 0.06 });
    },
    deal() { S.rustle({ vol: 0.03, dur: 0.14 }); S.tone(440, { dur: 0.12, vol: 0.02, to: 560, attack: 0.02 }); },
  },
});
