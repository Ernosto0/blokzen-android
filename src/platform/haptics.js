import { registerPlugin } from '@capacitor/core';
import { Sfx } from '../audio/sfx.js';

const capHaptics = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
const NATIVE_VIBRATE = !capHaptics && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
const IS_IOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const iosTick = (() => {
  if (capHaptics || NATIVE_VIBRATE || !IS_IOS) return null;
  try {
    const lb = document.createElement('label'), inp = document.createElement('input');
    inp.type = 'checkbox'; inp.setAttribute('switch', ''); inp.tabIndex = -1;
    lb.setAttribute('aria-hidden', 'true');
    lb.style.cssText = 'position:fixed;left:-200px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden';
    lb.appendChild(inp); document.body.appendChild(lb);
    let last = 0;
    return () => { const t = performance.now(); if (t - last < 40) return; last = t; lb.click(); };
  } catch (e) { return null; }
})();
// our own native plugin (android/.../BuzzPlugin.java): waveforms with a strength per pulse. If it is missing (an older
// shell) the first failed call drops back to the stock Haptics taps for good.
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
let nativeBuzz = NATIVE && window.Capacitor.isPluginAvailable && window.Capacitor.isPluginAvailable('Buzz') ? registerPlugin('Buzz') : null;
export const CAN_VIBRATE = !!nativeBuzz || !!capHaptics || NATIVE_VIBRATE || !!iosTick;
export const prefs = { vol: 100, vib: true, lowFx: false }; // player settings, loaded at boot

/* A haptic is a list of [ms, strength] pulses, strength 0..255, where 0 is a pause: [[16, 120], [30, 0], [22, 200]].
   With the native plugin the strength is real; the stock taps pick light/medium/heavy from it; the web vibrates the on times. */
function play(steps) {
  if (!prefs.vib || !CAN_VIBRATE) return;
  try {
    if (nativeBuzz) {
      const timings = [0], amplitudes = [0]; // the waveform alternates off, on, off, on...
      for (const [ms, amp] of steps) {
        const on = amp > 0, last = timings.length - 1, lastOn = last % 2 === 1;
        if (on === lastOn) { timings[last] += ms; amplitudes[last] = Math.max(amplitudes[last], amp); } // two pulses or two pauses in a row merge
        else { timings.push(ms); amplitudes.push(on ? amp : 0); }
      }
      nativeBuzz.wave({ timings, amplitudes }).catch(() => { nativeBuzz = null; });
      return;
    }
    if (capHaptics) {
      let t = 0;
      for (const [ms, amp] of steps) {
        if (amp > 0) { const style = amp >= 180 ? 'HEAVY' : amp >= 100 ? 'MEDIUM' : 'LIGHT', tap = () => capHaptics.impact({ style }).catch(() => {}); if (t === 0) tap(); else setTimeout(tap, t); }
        t += ms;
      }
    } else if (NATIVE_VIBRATE) {
      const ms = [];
      for (const [d, amp] of steps) { const on = amp > 0; if ((ms.length % 2 === 0) === on) ms.push(d); else if (ms.length) ms[ms.length - 1] += d; }
      navigator.vibrate(ms);
    } else iosTick();
  } catch (e) {}
}
// the old call: a duration or an on/off pattern in ms; longer pulses count as stronger
export const buzz = ms => play((Array.isArray(ms) ? ms : [ms]).map((d, i) => [d, i % 2 ? 0 : d >= 40 ? 230 : d >= 16 ? 150 : 80]));

// the game's own feel: every clear hits a little harder with each line and each step of the combo
export const haptic = {
  pick() { play([[8, 45]]); },
  preview() { play([[6, 40]]); }, // the dragged piece would now clear a line
  place() { play([[12, 70]]); },
  clear(lines, combo) {
    const s = Math.min(1, 0.5 + 0.15 * (lines - 1) + 0.08 * (Math.max(combo, 1) - 1)), n = Math.min(lines, 4), steps = [];
    for (let i = 0; i < n; i++) { if (i) steps.push([28, 0]); steps.push([16 + i * 3, Math.round(255 * s * (0.75 + 0.25 * i / 3))]); }
    if (combo >= 3) steps.push([30, 0], [34 + Math.min(combo, 8) * 3, Math.round(255 * Math.min(1, s + 0.15))]); // a combo lands with a longer, stronger beat
    play(steps);
  },
  clean() { play([[30, 150], [40, 0], [30, 200], [40, 0], [70, 255], [50, 0], [40, 120]]); }, // the whole board cleared
};
// iOS: wake the audio on any real gesture (Safari only counts touchend/click), stop pinch-zoom and the double-tap zoom
['touchend', 'click', 'keydown'].forEach(t => document.addEventListener(t, () => Sfx.unlock(), { capture: true, passive: true }));
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });
