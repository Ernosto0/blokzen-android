import { comboMult, fmtMult, levelMult, levelOf } from '../core/scoring.js';
import { canUndo, mode } from '../modes/registry.js';
import { $, elBest, elCombo, elScore } from './dom.js';
import { state } from '../core/state.js';
import { updateRing } from '../themes/switching.js';
import { restartLabel } from '../game/input.js';

/* ---------- HUD ---------- */
let bumpTimer = 0;
export function bumpScore() {
  if (state.REDUCED) return;
  elScore.classList.add('bump');
  clearTimeout(bumpTimer);
  bumpTimer = setTimeout(() => elScore.classList.remove('bump'), 140);
}
export function updateHud() {
  const m = mode(), info = m.hud();
  elBest.textContent = info.best;
  $('bestBox').title = info.bestTitle;
  $('icoBest').toggleAttribute('hidden', info.icon !== 'best'); $('icoZen').toggleAttribute('hidden', info.icon !== 'zen'); $('icoPuz').toggleAttribute('hidden', info.icon !== 'puz'); // svg elements have no .hidden property
  for (const id of ['daily', 'zen', 'puzzle']) document.body.classList.toggle(id, state.mode === id);
  $('goalRow').hidden = !info.goalRow;
  $('puzRow').hidden = !info.puzRow;
  $('undo').hidden = !info.undo;
  if (m.updateHud) m.updateHud();
  if (!$('restart').classList.contains('confirm')) $('restart').setAttribute('aria-label', restartLabel());
  const lvl = levelOf(state.score), el = $('lvl');
  el.hidden = lvl < 2 || !mode().levels;
  el.innerHTML = `Seviye ${lvl}<b>${fmtMult(levelMult(lvl))}</b>`;
  if (state.combo >= 2) {
    const left = 3 - state.msc;
    elCombo.innerHTML = 'Kombo ' + state.combo + ' ' + fmtMult(comboMult(state.combo)) + ' <span class="dots">' + [0, 1, 2].map(i => `<i class="${i < left ? 'on' : ''}"></i>`).join('') + '</span>';
    elCombo.hidden = false;
  } else elCombo.hidden = true;
  updateRing();
}
// the undo button in the tools: puzzle has one undo per attempt, classic three per game; the badge counts what is left
export function updateUndoBtn() {
  const u = $('undo'), ok = canUndo(), { left: leftFn, spent } = mode().undoInfo, left = leftFn();
  u.classList.toggle('off', !ok);
  u.setAttribute('aria-disabled', String(!ok));
  $('undoBadge').hidden = !left;
  $('undoBadge').textContent = left;
  u.setAttribute('aria-label', !left ? spent : ok ? `Son hamleyi geri al (${left} hak)` : 'Geri alınacak hamle yok');
}
