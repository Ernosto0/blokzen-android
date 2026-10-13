// Game modes register themselves here, the way themes register in themes/registry.js.
// The game asks the active mode (mode()) instead of checking state.mode: flags below say how a mode plays, and
// optional hooks carry what only that mode does. A mode file calls defineMode({ id, ... }) once.
//
// Flags (defaults in BASE):
//   saveKey      localStorage key of this mode's own game
//   button       id of the menu card's main button
//   restartLabel what the restart button announces
//   volume       sound level factor
//   levels       score levels: the level multiplier, level-up banner and level badge
//   shake        the board shakes on a clear
//   records      single-game records (best score, longest combo...) count; totals always do
//   countsGame   a finished game counts as one played game
//   themeLocked  the theme never changes mid-game; unlocks wait for the end card
//   endless      the game never ends: a gentler dealer and no late-game pressure
//   fullCap      most full clears whose bonus keeps growing
//
// Hooks (all optional; a mode defines only what it needs):
//   hud()          what the top bar shows, as hudInfo({ best, bestTitle, icon, goalRow, puzRow, undo })
//   updateHud()    extra HUD work only this mode has (the daily goal bar, the puzzle row, the undo badge)
//   undoInfo       { left(), spent } for the undo badge: moves left and what to announce when none are
//   remember()     called before a piece is placed (what undo will restore)
//   cellCleared(r, c)  a cell is cleared: return 1 if it held something special (a gem) and take it off
//   cleared({ gemHit, rows, cols }), gemPraise(gemHit)   what a clear means to the mode
//   afterMove({ now, midX, lines })   the mode's bookkeeping after every move
//   finishMove(now)  ends the move its own way (return true), else the shared ending runs
//   skipOver()     true when there is nothing to check (a won level)
//   stuck()        no piece fits: return true when the mode handles it (zen breathes out), else the game is over
//   ended(now)     the game just ended: count it (default), or mark a failure (puzzle)
//   keepSave()     keep the saved game although it ended (classic, while a second chance is open)
//   playTime(dt)   play-time counters; default adds to the shared total
//   boardGems()    cells drawn with a gem, or nothing
//   bodyClass      class on <body> while this mode is active
//   canUndo(), undo()        the undo button
//   canRevive(), revive()    a second chance on the game-over card
//   overCard(rv)   fills in the game-over card (rv: a second chance is on offer); a mode that never ends has none
//   levelCard      the card is a level result (puzzle) rather than a game result
//   again()        the card's main button; return true when the mode handled it, else a new game starts
import { state } from '../core/state.js';

export const MODE_KEY = 'blokzen.mode'; // which mode was played last
export const MODES = {};

const BASE = {
  levelCard: false, volume: 1, levels: true, shake: true, records: true, countsGame: true, themeLocked: false, endless: false, fullCap: Infinity,
};
export const defineMode = def => (MODES[def.id] = { ...BASE, ...def });

export const mode = () => MODES[state.mode];
// the top bar's best box and which rows are shown; icon is 'best' | 'zen' | 'puz'
export const hudInfo = o => ({ icon: 'best', goalRow: false, puzRow: false, undo: false, ...o });
export const saveKey = () => mode().saveKey;
// the hooks below are optional, so these answer "no" / do nothing for a mode without them
export const canUndo = () => { const m = mode(); return !!(m.canUndo && m.canUndo()); };
export const canRevive = () => { const m = mode(); return !!(m.canRevive && m.canRevive()); };
export const doUndo = () => { const m = mode(); if (m.undo) m.undo(); };
export const doRevive = () => { const m = mode(); if (m.revive) m.revive(); };
