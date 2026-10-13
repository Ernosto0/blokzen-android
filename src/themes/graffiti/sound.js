import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

const kick = (when, vol) => S.tone(130, { dur: 0.18, vol, to: 45, when });

const snare = (when, vol) => { S.hiss({ dur: 0.12, vol, type: 'bandpass', freq: 1800, q: 0.8, when }); S.tone(210, { dur: 0.08, vol: vol * 0.8, to: 150, when }); };

const hat = when => S.hiss({ dur: 0.03, vol: 0.04, type: 'highpass', freq: 7000, when });

Object.assign(KITS, {
  spray: {
    pick() { S.knock(1800, { vol: 0.06 }); S.knock(1700, { vol: 0.05, when: 0.05 }); },
    place() { S.hiss({ dur: 0.1, vol: 0.07, type: 'highpass', freq: 3500 }); kick(0, 0.25); },
    clear(n) { // a spray burst over a boom-bap beat
      S.hiss({ dur: 0.3, vol: 0.08, type: 'highpass', freq: 3000, to: 6000 });
      kick(0, 0.3); hat(0.12); snare(0.24, 0.12);
      if (n > 2) { hat(0.36); kick(0.42, 0.25); snare(0.6, 0.12); }
    },
    deal() { for (let i = 0; i < 3; i++) S.knock(1900, { vol: 0.05, when: i * 0.06 }); },
  },
});
