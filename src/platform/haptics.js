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
// native: map each vibration pulse (pattern = on, off, on, ...) to a Taptic Engine tap of matching weight
const capTap = d => capHaptics.impact({ style: d >= 40 ? 'HEAVY' : d >= 16 ? 'MEDIUM' : 'LIGHT' }).catch(() => {});
const capBuzz = ms => {
  if (!Array.isArray(ms)) { capTap(ms); return; }
  let t = 0;
  ms.forEach((d, i) => { if (i % 2 === 0) { if (t === 0) capTap(d); else setTimeout(() => capTap(d), t); } t += d; });
};
export const CAN_VIBRATE = !!capHaptics || NATIVE_VIBRATE || !!iosTick;
export const prefs = { vol: 100, vib: true, lowFx: false }; // player settings, loaded at boot
export const buzz = ms => { if (!prefs.vib || !CAN_VIBRATE) return; try { if (capHaptics) capBuzz(ms); else if (NATIVE_VIBRATE) navigator.vibrate(ms); else iosTick(); } catch (e) {} };
// iOS: wake the audio on any real gesture (Safari only counts touchend/click), stop pinch-zoom and the double-tap zoom
['touchend', 'click', 'keydown'].forEach(t => document.addEventListener(t, () => Sfx.unlock(), { capture: true, passive: true }));
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });
