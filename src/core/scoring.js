import { stageAt } from '../themes/catalog.js';
import { shuffle } from './dealer.js';
import { state } from './state.js';

/* ---------- Scoring: level, combo and full-clear multipliers ---------- */
const LINE_BASE = [0, 10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660, 780, 910, 1050, 1200, 1360];
export const levelOf = sc => stageAt(sc) + 1;                         // level rises with the same milestones as themes
export const levelMult = lvl => Math.min(4, 1 + 0.25 * (lvl - 1));    // ×1, ×1.25, ×1.5 ... up to ×4
export const comboMult = c => c <= 1 ? 1 : c + 0.1 * c * (c - 1);     // ×2.2, ×3.6, ×5.2, ×7 ... grows faster than the streak
export function scoreMove(size, lines, combo, fullClear, fullsBefore, sc) {
  const zen = state.mode === 'zen'; // zen: no levels, and the full-clear bonus stops growing at the fifth
  const lm = zen || state.mode === 'puzzle' ? 1 : levelMult(levelOf(sc)); // puzzle: always ×1 so score targets stay predictable
  return {
    lm,
    place: Math.round(size * lm),
    clear: lines ? Math.round(LINE_BASE[lines] * comboMult(combo) * lm) : 0,
    full: fullClear ? Math.round(500 * (zen ? Math.min(fullsBefore + 1, 5) : fullsBefore + 1) * lm) : 0, // 500, 1000, 1500 ... per full clear in the game
  };
}
export const fmtMult = m => '×' + m.toLocaleString('tr-TR', { maximumFractionDigits: 2 });

export function colorize(shapes) {
  const pool = shuffle([1, 2, 3, 4, 5, 6, 7]); // a real shuffle: a random sort comparator gives different results in different browsers
  return shapes.map((s, i) => ({ shape: s, color: pool[i] }));
}
