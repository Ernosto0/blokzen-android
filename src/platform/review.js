import { registerPlugin } from '@capacitor/core';
import { store } from '../core/store.js';
import { stats } from '../themes/progress.js';

/* ---------- In-app review ----------
   Google's own rating sheet slides up over the game-over card (Play In-App Review API, through
   @capacitor-community/in-app-review). Its look and wording are Google's, and the rules forbid asking "do you like the app?"
   first, so the game only picks a good moment: a finished classic game that was a record or above the player's average,
   after at least 5 games on 2 different days, and never twice within 90 days. Google keeps its own quota on top and may
   show nothing; the app cannot tell. Settings → About has a plain "Rate" link for everyone else. */
export const REVIEW_KEY = 'blokzen.review';
export const MIN_GAMES = 5, MIN_DAYS = 2, GAP_DAYS = 90, DELAY_MS = 1500;
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const plugin = NATIVE && window.Capacitor.isPluginAvailable && window.Capacitor.isPluginAvailable('InAppReview') ? registerPlugin('InAppReview') : null;
// tests/review.spec.js puts a stand-in here, since the browser has no Play
const request = () => (window.__blokzenReview || (plugin && (() => plugin.requestReview())) || (() => {}))();
let timer = 0;

// score: the game that just ended; best: true when it set a record
export function reviewDue(score, best, now = Date.now()) {
  const last = store.get(REVIEW_KEY);
  if (last && now - last.at < GAP_DAYS * 864e5) return false;
  if (stats.games < MIN_GAMES || stats.daysPlayed < MIN_DAYS) return false;
  return best || score >= stats.totalScore / stats.games;
}
// call when a classic game-over card has just appeared; `still` says the player is still looking at it
export function askReview(score, best, still) {
  if (!(plugin || window.__blokzenReview) || !reviewDue(score, best)) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (!still() || !reviewDue(score, best)) return; // moved on meanwhile
    store.set(REVIEW_KEY, { at: Date.now() });
    try { Promise.resolve(request()).catch(() => {}); } catch (e) {}
  }, DELAY_MS);
}
