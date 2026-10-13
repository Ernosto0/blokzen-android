import { T, THEMES } from './themes/catalog.js';
import { BEST_KEY, MUTE_KEY, OLD_SAVE_KEY, PREFS_KEY, SAVE_KEY, THEME_KEY, TUT_KEY } from './core/constants.js';
import { Sfx } from './audio/sfx.js';
import { prefs } from './platform/haptics.js';
import { store } from './core/store.js';
import { stage } from './ui/dom.js';
import { state, DEV_KEY, discovered, earned, fresh, settings, syncOpen, theme } from './core/state.js';
import { checkUnlocks, dayKey, DONE_KEY, META_V, NEW_TASKS, stats, STATS_KEY, themesDone, UNLOCKS } from './themes/progress.js';
import { daily, DAILY_SAVE_KEY, loadDaily, MODE_KEY, ZEN_SAVE_KEY } from './modes/daily.js';
import { PUZ_SAVE_KEY } from './modes/puzzle-levels.js';
import { loadPuzzle } from './modes/puzzle.js';
import { layout } from './render/layout.js';
import { saveMeta, snapTheme } from './themes/switching.js';
import { checkOver, newGame, refreshFits, restore } from './game/flow.js';
import { updateHud } from './ui/hud.js';
import { syncMute } from './game/input.js';
import { openMenu } from './ui/menu.js';
import { applyPrefs } from './ui/settings.js';
import { frame } from './render/render.js';

/* ---------- Boot ---------- */
// data: a game to resume as-is (skips the main menu)
export function start(data) {
  document.documentElement.lang = 'tr'; // Turkish casing for uppercase labels (i → İ)
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
  state.devMode = !!store.get(DEV_KEY); syncOpen();
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
  document.addEventListener('visibilitychange', () => { if (document.hidden) store.set(STATS_KEY, stats); });
  if (!store.get(TUT_KEY) && (state.best > 0 || stats.totalLines > 0)) store.set(TUT_KEY, true); // returning players skip the automatic guide
  theme.mode = theme.prevMode = settings.block;
  syncMute();
  layout();
  snapTheme(settings.auto ? 0 : settings.fixed);
  const oldSave = store.get(OLD_SAVE_KEY);
  if (oldSave) store.set(OLD_SAVE_KEY, null); // migrate once, never resurrect later
  // a live reload keeps its game; otherwise pick up the mode played last (a daily only on its own day)
  const lastMode = store.get(MODE_KEY);
  const dsave = lastMode === 'daily' ? store.get(DAILY_SAVE_KEY) : null;
  const zsave = lastMode === 'zen' ? store.get(ZEN_SAVE_KEY) : null;
  const psave = lastMode === 'puzzle' ? store.get(PUZ_SAVE_KEY) : null;
  const ok = restore(data && data.grid ? data : null) || (dsave && dsave.day === dayKey() && restore(dsave)) || (zsave && zsave.mode === 'zen' && restore(zsave)) || (psave && psave.mode === 'puzzle' && restore(psave)) || restore(store.get(SAVE_KEY)) || restore(oldSave);
  if (!ok) { state.grid = null; state.tray = []; state.score = 0; state.mode = 'classic'; newGame(); }
  else { refreshFits(); checkOver(performance.now()); }
  applyPrefs(); // the volume depends on the mode that was picked up
  checkUnlocks(performance.now() + 400);
  updateHud();
  new ResizeObserver(() => layout()).observe(stage);
  window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.load) document.fonts.load('800 20px "Baloo 2"');
  requestAnimationFrame(frame);
  if (!(data && data.grid)) openMenu(false); // a live reload keeps playing; a fresh visit starts on the main menu
}
