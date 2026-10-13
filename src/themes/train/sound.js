import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

Object.assign(KITS, {
  train: { // rail joints "ta-tak", a steam whistle on a clear
    pick() { S.knock(1800, { vol: 0.04 }); },
    place() { S.knock(210, { vol: 0.26 }); S.knock(180, { vol: 0.22, when: 0.09 }); },
    clear(n) {
      S.tone(740, { type: 'triangle', dur: 0.75, vol: 0.05, attack: 0.05, wet: true }); S.tone(932, { type: 'triangle', dur: 0.75, vol: 0.045, attack: 0.05 });
      S.hissL({ dur: 0.8, vol: 0.05, type: 'bandpass', freq: 2500, q: 0.8 });
      for (let i = 0; i < Math.min(n + 1, 4); i++) { S.knock(210, { vol: 0.18, when: 0.8 + i * 0.22 }); S.knock(180, { vol: 0.15, when: 0.89 + i * 0.22 }); }
    },
    deal() { for (let i = 0; i < 4; i++) S.hiss({ dur: 0.08, vol: 0.05, type: 'bandpass', freq: 900, q: 0.8, when: i * 0.12 }); },
  },
});
