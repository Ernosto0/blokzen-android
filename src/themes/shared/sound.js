// Sound helpers that more than one theme's kit uses.

import { Sfx as S } from '../../audio/sfx.js';

export const pluck = (f, { when = 0, vol = 0.08, dur = 0.6, type = 'triangle', to = null } = {}) => {
  S.tone(f, { type, dur, vol, when, attack: 0.002, to, wet: true });
  S.tone(f * 2, { dur: dur * 0.3, vol: vol * 0.3, when, attack: 0.002 });
};

export const at = (sc, i, base) => base * Math.pow(2, sc[i % sc.length] / 12) * (i >= sc.length ? 2 : 1); // i-th note of a scale, the next octave after the last

export const click = (when, vol, f = 2600) => { S.tone(f, { type: 'square', dur: 0.012, vol: vol * 0.25, when, attack: 0.001 }); S.hiss({ dur: 0.015, vol, type: 'bandpass', freq: f * 1.4, q: 3, when }); };
