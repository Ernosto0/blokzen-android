import { Sfx as S } from '../../audio/sfx.js';
import { KITS } from '../registry.js';

const burner = (when, dur, vol) => { S.hissL({ dur, vol, type: 'bandpass', freq: 350, to: 900, q: 0.8, when }); S.hissL({ dur: dur * 0.8, vol: vol * 0.6, type: 'lowpass', freq: 300, when }); };

Object.assign(KITS, {
  balloon: {
    pick() { S.rustle({ vol: 0.04, dur: 0.06 }); },
    place() { S.thud({ vol: 0.22, f: 130 }); burner(0.02, 0.18, 0.06); },
    clear(n) { burner(0, 0.5 + n * 0.08, 0.1); S.tone(S.snd.root * 0.5, { dur: 0.8, vol: 0.05, to: S.snd.root, attack: 0.1, wet: true }); S.hissL({ dur: 1, vol: 0.03, type: 'bandpass', freq: 500, to: 1500, q: 0.5, when: 0.3 }); },
    deal() { S.hissL({ dur: 0.4, vol: 0.04, type: 'bandpass', freq: 400, to: 900, q: 0.6 }); },
  },
});
