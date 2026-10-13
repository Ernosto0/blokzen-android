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
import { state } from '../core/state.js';

export const MODE_KEY = 'blokzen.mode'; // which mode was played last
export const MODES = {};

const BASE = {
  volume: 1, levels: true, shake: true, records: true, countsGame: true, themeLocked: false, endless: false, fullCap: Infinity,
};
export const defineMode = def => (MODES[def.id] = { ...BASE, ...def });

export const mode = () => MODES[state.mode];
export const saveKey = () => mode().saveKey;
