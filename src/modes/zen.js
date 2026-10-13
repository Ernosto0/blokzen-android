import { defineMode, hudInfo } from './registry.js';
import { state, theme } from '../core/state.js';
import { closeMenu, fmtN, inProgress, prepCanvas } from '../ui/menu.js';
import { Sfx } from '../audio/sfx.js';
import { bitsOf } from '../core/bitboard.js';
import { cellsOf } from '../core/dealer.js';
import { store } from '../core/store.js';
import { clearFullest, deal, newGame, refreshFits, save, switchMode } from '../game/flow.js';
import { buzz } from '../platform/haptics.js';
import { L } from '../render/layout.js';
import { checkUnlocks, hourNow, stats, STATS_KEY } from '../themes/progress.js';
import { updateHud } from '../ui/hud.js';
import { tut } from '../ui/tutorial.js';
import { rr, sprite } from '../render/sprites.js';
import { $ } from '../ui/dom.js';

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

const ART_ZEN = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [3, 3, 0, 5, 0]]; // a few stones under an open circle
function zenStatus() {
  if (state.mode === 'zen') return { prog: inProgress(), score: state.score, lines: state.gs.lines };
  const d = store.get(ZEN_SAVE_KEY);
  return d && d.mode === 'zen' && Array.isArray(d.grid) ? { prog: (d.moves | 0) > 0, score: d.score | 0, lines: (d.gs && d.gs.lines) | 0 } : { prog: false, score: 0, lines: 0 };
}
let newTimer = 0;
function resetNew() {
  clearTimeout(newTimer);
  const z = $('zenNew'); z.classList.remove('confirm'); z.textContent = 'Sıfırla';
}
$('zenNew').addEventListener('click', () => {
  Sfx.unlock();
  const b = $('zenNew');
  if (b.classList.contains('confirm')) { resetNew(); switchMode('zen'); newGame(); closeMenu(); return; }
  b.classList.add('confirm'); b.textContent = 'Silinecek · Onayla';
  newTimer = setTimeout(resetNew, 3000);
});

defineMode({
  id: 'zen', saveKey: ZEN_SAVE_KEY, button: 'playZen', restartLabel: 'Zen tahtasını sıfırla', bodyClass: 'zen',
  hud: () => hudInfo({ best: fmtN(state.gs.lines), bestTitle: 'Bu oturumda temizlenen sıra', icon: 'zen' }),
  drawArt(th) {
  const p = prepCanvas($('artZen'), 'zen');
  if (p) { // a few stones on a quiet board, under an open ensō circle
    const { g, w, dpr } = p, pad = w * 0.11, cs = (w - 2 * pad) / 5, px = Math.ceil(cs * dpr);
    rr(g, 0, 0, w, w, w * 0.24); g.fillStyle = th.board; g.fill();
    ART_ZEN.forEach((row, r) => row.forEach((v, cc) => g.drawImage(sprite(theme.cur, v, px), pad + cc * cs, pad + r * cs, cs, cs)));
    g.save();
    g.lineCap = 'round'; g.lineWidth = w * 0.065; g.strokeStyle = th.accent;
    g.beginPath(); g.arc(w / 2, w * 0.4, w * 0.24, Math.PI * 0.62, Math.PI * 2.38); g.stroke();
    g.restore();
  }
  },
  renderCard() {
  const zs = zenStatus();
  $('zenLbl').textContent = zs.prog ? 'Devam et' : 'Oyna';
  $('zenSub').textContent = 'Bitmez, acele yok';
  $('zenFoot').hidden = !zs.prog;
  if (zs.prog) $('zenInfo').textContent = `${fmtN(zs.lines)} sıra · ${fmtN(zs.score)} puan`;
  },
  resetNew,
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
