import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

const chirp = (when, vol = 0.04) => { S.tone(2600, { dur: 0.05, vol, to: 3600, when }); S.tone(3000, { dur: 0.05, vol: vol * 0.8, to: 3900, when: when + 0.07 }); };

Object.assign(KITS, {
  picnic: { // birds, grass, a soda bottle opened
    pick() { S.tone(2900, { dur: 0.04, vol: 0.03, to: 3600 }); },
    place() { S.thud({ vol: 0.16, f: 150 }); S.rustle({ vol: 0.05, dur: 0.08 }); },
    clear(n) { S.pop({ vol: 0.16, f: 700 }); S.hissL({ dur: 0.6, vol: 0.04, type: 'highpass', freq: 5000, when: 0.05 }); for (let i = 0; i < Math.min(n + 1, 4); i++) chirp(0.15 + i * 0.18); },
    deal() { chirp(0, 0.03); },
  },
});
