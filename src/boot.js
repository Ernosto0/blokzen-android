import { T, THEMES } from './themes/catalog.js';
import { BEST_KEY, MUTE_KEY, OLD_SAVE_KEY, PREFS_KEY, SAVE_KEY, THEME_KEY, TUT_KEY } from './core/constants.js';
import { Sfx } from './audio/sfx.js';
import { prefs } from './platform/haptics.js';
import { store } from './core/store.js';
import { stage } from './ui/dom.js';
import { state, DEV_KEY, DEV_TOOLS, discovered, earned, fresh, settings, syncOpen, theme } from './core/state.js';
import { checkUnlocks, DONE_KEY, META_V, NEW_TASKS, stats, STATS_KEY, themesDone, UNLOCKS } from './themes/progress.js';
import { daily, loadDaily } from './modes/daily.js';
import { MODE_KEY, MODES } from './modes/registry.js';
import { loadPuzzle } from './modes/puzzle.js';
import { layout } from './render/layout.js';
import { saveMeta, snapTheme } from './themes/switching.js';
import { checkOver, newGame, refreshFits, restore } from './game/flow.js';
import { updateHud } from './ui/hud.js';
import { syncMute } from './game/input.js';
import { openMenu } from './ui/menu.js';
import { applyPrefs } from './ui/settings.js';
import { frame } from './render/render.js';
import { loadPerf } from './render/quality.js';
import { translatePage } from './i18n/index.js';

/* ---------- Boot ---------- */
// data: a game to resume as-is (skips the main menu)
export function start(data) {
  translatePage(); // English for non-Turkish devices; also sets the page language
  state.best = store.get(BEST_KEY) | 0;
  Sfx.muted = !!store.get(MUTE_KEY);
  const sp = store.get(PREFS_KEY);
  if (sp && typeof sp === 'object') {
    const v = sp.vol | 0; if (v >= 5 && v <= 100) prefs.vol = v;
    prefs.vib = sp.vib !== false; prefs.lowFx = !!sp.lowFx;
  }
  applyPrefs();
  const meta = store.get(THEME_KEY);
  if (meta) {
    if (Array.isArray(meta.disc)) meta.disc.forEach(i => { if (i >= 0 && i < T) earned.add(i | 0); });
    settings.auto = meta.auto !== false; settings.fixed = (meta.fixed | 0) % T;
    settings.block = meta.block === 'soft' ? 'soft' : 'classic';
  }
  if (meta && (meta.v | 0) < META_V) THEMES.forEach((t, i) => { if (NEW_TASKS.includes(t.id)) earned.delete(i); });
  THEMES.forEach((t, i) => { if (!UNLOCKS[t.id]) earned.add(i); });
  state.devMode = DEV_TOOLS && !!store.get(DEV_KEY); syncOpen();
  if (meta && Array.isArray(meta.fresh)) meta.fresh.forEach(i => { if (discovered.has(i)) fresh.add(i); });
  if (!discovered.has(settings.fixed)) settings.fixed = 0;
  if (meta && (meta.v | 0) < META_V) saveMeta();
  const st = store.get(STATS_KEY);
  if (st) for (const k in stats) stats[k] = +st[k] || 0;
  stats.bestScore = Math.max(stats.bestScore, state.best);
  const dn = store.get(DONE_KEY);
  if (Array.isArray(dn)) dn.forEach(id => { if (THEMES.some(t => t.id === id)) themesDone.add(id); });
  stats.themesDone = themesDone.size;
  loadDaily();
  loadPuzzle();
  stats.dailyBestStreak = Math.max(stats.dailyBestStreak, daily.best);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { store.set(STATS_KEY, stats); Sfx.suspend(); }
    else Sfx.unlock(); // wakes the audio again
  });
  if (!store.get(TUT_KEY) && (state.best > 0 || stats.totalLines > 0)) store.set(TUT_KEY, true); // returning players skip the automatic guide
  theme.mode = theme.prevMode = settings.block;
  syncMute();
  // The game is set up inside a try: if one step fails (a WebView that is not laid out yet, an old engine), the observers, the frame loop
  // and the main menu below must still start, or the player is left on a dead board with no way in.
  loadPerf(); // the quality step this phone settled on last time
  try {
    layout();
    snapTheme(settings.auto ? 0 : settings.fixed);
    const oldSave = store.get(OLD_SAVE_KEY);
    if (oldSave) store.set(OLD_SAVE_KEY, null); // migrate once, never resurrect later
    // a live reload keeps its game; otherwise pick up the mode played last (a daily only on its own day)
    const last = store.get(MODE_KEY), lm = Object.prototype.hasOwnProperty.call(MODES, last) ? MODES[last] : null, lsave = lm ? store.get(lm.saveKey) : null;
    const ok = restore(data && data.grid ? data : null) || (lsave && lm.canResume(lsave) && restore(lsave)) || restore(store.get(SAVE_KEY));
    if (!ok) { state.grid = null; state.tray = []; state.score = 0; state.mode = 'classic'; newGame(); }
    else { refreshFits(); checkOver(performance.now()); }
    applyPrefs(); // the volume depends on the mode that was picked up
    checkUnlocks(performance.now() + 400);
    updateHud();
  } catch (e) { console.error('Blokzen boot', e); }
  new ResizeObserver(() => layout()).observe(stage);
  window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.load) document.fonts.load('800 20px "Baloo 2"');
  requestAnimationFrame(frame);
  const reveal = () => document.documentElement.classList.remove('booting');
  if (data && data.grid) { requestAnimationFrame(reveal); return; } // a live reload keeps playing
  openMenu(false); // a fresh visit starts on the main menu
  // the menu fades in over the plain background; the game screen appears behind it only once the menu is fully there,
  // or it would show through the first, still transparent frames of the fade
  const menu = document.getElementById('menu');
  const done = e => { if (e.target === menu) { menu.removeEventListener('animationend', done); reveal(); } };
  menu.addEventListener('animationend', done);
  setTimeout(reveal, 450); // no animation (reduced motion) or it never reports: show it anyway
}
