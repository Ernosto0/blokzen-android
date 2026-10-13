import { defineMode, hudInfo } from './registry.js';
import { state } from '../core/state.js';
import { fmtN } from '../ui/menu.js';
import { Sfx } from '../audio/sfx.js';
import { bitsOf } from '../core/bitboard.js';
import { cellsOf } from '../core/dealer.js';
import { store } from '../core/store.js';
import { clearFullest, deal, refreshFits, save } from '../game/flow.js';
import { buzz } from '../platform/haptics.js';
import { L } from '../render/layout.js';
import { checkUnlocks, hourNow, stats, STATS_KEY } from '../themes/progress.js';
import { updateHud } from '../ui/hud.js';
import { tut } from '../ui/tutorial.js';

/* Zen: an endless, calm game with its own save. The dealer stays generous, there are no levels, and when no piece fits
   the board breathes out (its fullest lines clear quietly, no points) instead of ending. */
export const ZEN_SAVE_KEY = 'blokzen.zen.game';

// Zen breath: clear the fullest rows and columns one by one (at least two, at most five) until a waiting piece fits again.
// Cells drift away in a slow wave from the line's middle; no points, the combo rests.
let breathTimer = 0;
export function cancelBreath() { clearTimeout(breathTimer); breathTimer = 0; }
function zenBreath(now) {
  clearFullest(now);
  state.combo = 0; state.msc = 0; state.gs.zrun = 0;
  stats.zenBreaths++; store.set(STATS_KEY, stats);
  checkUnlocks(now);
  state.texts.push({ text: 'Nefes al, devam et', x: L.gx + L.B / 2 - L.pad, y: L.gy + L.cell * 3.2, t0: now + 160, dur: 1900, size: L.cell * 0.66, role: 'accent' });
  Sfx.breath(); buzz([8, 60, 8]);
  refreshFits();
  if (!state.tray.some(t => t && t.fits)) deal(now + 500); // the cleared board still has no room for these pieces: new ones
  updateHud();
  save();
}

defineMode({
  id: 'zen', saveKey: ZEN_SAVE_KEY, button: 'playZen', restartLabel: 'Zen tahtasını sıfırla', bodyClass: 'zen',
  hud: () => hudInfo({ best: fmtN(state.gs.lines), bestTitle: 'Bu oturumda temizlenen sıra', icon: 'zen' }),
  started() { stats.zenSessions++; },
  stop: cancelBreath,
  volume: 0.75, levels: false, shake: false, records: false, countsGame: false, endless: true, fullCap: 5,
  afterMove({ lines }) {
    state.gs.lines += lines; stats.zenLines += lines; stats.zenMoves++;
    if (lines && state.grid.every(row => row.every(v => !v))) stats.zenFulls++;
    state.gs.zrun++; stats.zenBestRun = Math.max(stats.zenBestRun, state.gs.zrun); // moves since the last breath (batik theme)
    if (cellsOf(...bitsOf(state.grid)) > 32) state.gs.zcalm = 0; // moves in a row with the board at most half full (andes theme)
    else { state.gs.zcalm++; stats.zenBestCalm = Math.max(stats.zenBestCalm, state.gs.zcalm); }
  },
  // no piece fits: after a short pause the board breathes out
  stuck() {
    if (!breathTimer) breathTimer = setTimeout(() => {
      breathTimer = 0;
      if (state.mode === 'zen' && !tut && !state.over && state.grid && !state.tray.some(t => t && t.fits)) zenBreath(performance.now());
    }, 650);
    return true;
  },
  playTime(dt) {
    stats.playSec += dt;
    stats.zenSec += dt;
    const hr = hourNow();
    if (hr >= 5 && hr < 10) stats.zenMorningSec += dt; else if (hr >= 19 && hr < 23) stats.zenEveningSec += dt;
  },
});
