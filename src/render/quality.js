import { state } from '../core/state.js';
import { store } from '../core/store.js';
import { layout } from './layout.js';

/* ---------- Automatic quality ----------
   The game is limited by how many pixels it fills, not by its code: a phone that cannot keep up while playing steps down,
   one step at a time, to a lighter look. 1: the background canvas at 1x; 2: half the particles, no glows, the board at most
   2x; 3: the board at 1.5x. The step is remembered so a slow phone does not stutter at every launch. A single slow moment
   (a busy phone, a heavy app in the background) must not stick for good either: after half a minute of easy play the
   game tries one step back up, once per session; if that is too much it simply steps down again. */
export const PERF_KEY = 'blokzen.perf', PERF_MAX = 3;
export function loadPerf() { state.perf = Math.max(0, Math.min(PERF_MAX, store.get(PERF_KEY) | 0)); }

let ema = 1 / 60, slow = 0, fast = 0, settle = 0, triedUp = false;
const step = d => { state.perf += d; slow = fast = 0; settle = 1.5; ema = 1 / 60; store.set(PERF_KEY, state.perf); layout(); };
// called every frame with the frame time; playing: the board is in front and the player is active
export function watchFrame(dt, playing) {
  if (!playing) { slow = 0; return; }
  if (settle > 0) { settle -= dt; return; } // let a new step (and its rebuilt sprites) settle before judging it
  ema += (dt - ema) * 0.1;
  if (ema > 1 / 45) { slow += dt; fast = 0; } else { slow = Math.max(0, slow - dt); fast = ema < 1 / 56 ? fast + dt : 0; }
  if (slow > 2 && state.perf < PERF_MAX) step(1); // under ~45 fps for about two seconds
  else if (fast > 30 && state.perf > 0 && !triedUp) { triedUp = true; step(-1); } // smooth for half a minute: try a step up
}
