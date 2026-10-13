import { comboMult, fmtMult, levelMult, levelOf } from '../core/scoring.js';
import { mode } from '../modes/registry.js';
import { $, elBest, elCombo, elScore } from './dom.js';
import { state } from '../core/state.js';
import { dailyStart, dayBest, fmtDay, starsFor } from '../modes/daily.js';
import { LEVELS } from '../modes/puzzle-levels.js';
import { GOAL_ICON, goalText, piecesLeft, puzGoal, puzLevel, puzStarsFor } from '../modes/puzzle.js';
import { canUndo } from '../modes/classic.js';
import { updateRing } from '../themes/switching.js';
import { STAR_SVG } from '../game/flow.js';
import { restartLabel } from '../game/input.js';
import { fmtN } from './menu.js';

/* ---------- HUD ---------- */
let bumpTimer = 0;
export function bumpScore() {
  if (state.REDUCED) return;
  elScore.classList.add('bump');
  clearTimeout(bumpTimer);
  bumpTimer = setTimeout(() => elScore.classList.remove('bump'), 140);
}
export function updateHud() {
  const dl = state.mode === 'daily', zen = state.mode === 'zen', pz = state.mode === 'puzzle';
  elBest.textContent = pz ? `${state.puz.li + 1}/${LEVELS.length}` : fmtN(dl ? Math.max(dayBest(state.gameDay), state.score) : zen ? state.gs.lines : state.best);
  $('bestBox').title = dl ? 'Bugünün en iyisi' : zen ? 'Bu oturumda temizlenen sıra' : pz ? 'Bölüm' : 'En iyi skor';
  $('icoBest').toggleAttribute('hidden', zen || pz); $('icoZen').toggleAttribute('hidden', !zen); $('icoPuz').toggleAttribute('hidden', !pz); // svg elements have no .hidden property
  document.body.classList.toggle('daily', dl);
  document.body.classList.toggle('zen', zen);
  document.body.classList.toggle('puzzle', pz);
  $('goalRow').hidden = !dl;
  if (dl) updateGoal();
  $('puzRow').hidden = !pz;
  $('undo').hidden = !(pz || state.mode === 'classic');
  if (pz) updatePuzzleHud();
  else if (state.mode === 'classic') updateUndoBtn();
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
// puzzle row: level name (opens the level list), goal progress, pieces left with the stars a win right now would give
export const MINI_STAR = on => STAR_SVG.replace('<svg ', `<svg class="${on ? 'on' : ''}" `);
function updatePuzzleHud() {
  const lv = puzLevel(), g = puzGoal(), left = piecesLeft(), pot = puzStarsFor(left, lv.stars);
  $('puzName').textContent = `${state.puz.li + 1} · ${lv.title}`;
  $('puzTitle').setAttribute('aria-label', `Bölüm ${state.puz.li + 1}, ${lv.title}. Bölüm listesini aç`);
  const goal = $('puzGoal');
  goal.innerHTML = GOAL_ICON[lv.goal.type] + `<span>${g.html}</span>`;
  goal.classList.toggle('done', g.done);
  goal.title = goalText(lv);
  goal.setAttribute('aria-label', `Hedef: ${goalText(lv)}. ${g.label}`);
  const lf = $('puzLeft');
  lf.innerHTML = `<span>${left} parça</span><span class="pst">${[0, 1, 2].map(i => MINI_STAR(i < pot)).join('')}</span>`;
  lf.title = `Kalan parça ${left}. Şimdi bitirirsen ${pot} yıldız`;
  lf.setAttribute('aria-label', lf.title);
  updateUndoBtn();
}
// the undo button in the tools: puzzle has one undo per attempt, classic three per game; the badge counts what is left
function updateUndoBtn() {
  const u = $('undo'), ok = canUndo(), pz = state.mode === 'puzzle';
  const left = pz ? (state.puz.undoUsed ? 0 : 1) : state.cls.undoLeft;
  u.classList.toggle('off', !ok);
  u.setAttribute('aria-disabled', String(!ok));
  $('undoBadge').hidden = !left;
  $('undoBadge').textContent = left;
  u.setAttribute('aria-label', !left ? (pz ? 'Geri alma hakkı kullanıldı' : 'Geri alma hakların bitti') : ok ? `Son hamleyi geri al (${left} hak)` : 'Geri alınacak hamle yok');
}
// daily goal bar: three equal thirds, one per star, so the first target is as visible as the last
const goalPos = (sc, tg) => { let lo = 0; for (let i = 0; i < 3; i++) { if (sc < tg[i]) return (i + (sc - lo) / (tg[i] - lo)) / 3; lo = tg[i]; } return 1; };
let goalBuilt = 0; // goalShown: the bar has been drawn for this day, so newly lit stars may pop
function updateGoal() {
  const tg = dailyStart(state.gameDay).targets, st = starsFor(state.score, tg);
  if (goalBuilt !== state.gameDay) {
    goalBuilt = state.gameDay;
    $('goalDay').textContent = fmtDay(state.gameDay);
    $('goalMarks').innerHTML = tg.map((t, i) => `<span class="gmark" style="left:${(100 * (i + 1) / 3).toFixed(2)}%">${STAR_SVG}</span>`).join('');
  }
  $('goalFill').style.width = (100 * goalPos(state.score, tg)).toFixed(2) + '%';
  [...$('goalMarks').children].forEach((m, i) => {
    const was = m.classList.contains('on');
    m.classList.toggle('on', i < st);
    if (!was && i < st && state.goalShown === state.gameDay) { m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); }
  });
  state.goalShown = state.gameDay;
  const next = tg.find(t => t > state.score);
  $('goalNext').textContent = next ? fmtN(next) : 'Tamam!';
  $('goalRow').setAttribute('aria-label', `Günlük hedef: ${st} / 3 yıldız` + (next ? `, sonraki ${fmtN(next)}` : ''));
}
