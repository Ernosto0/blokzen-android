import { THEMES } from '../themes/catalog.js';
import { N, OS_REDUCED } from './constants.js';

// classic: three undos and one continue per game
export const CLS_UNDOS = 3;
export const freshCls = () => ({ undoLeft: CLS_UNDOS, contUsed: false, hist: [], pendingEnd: false });

// Game state written by more than one module: read and write it as state.x.
// A variable with a single writer stays in that module and is exported from there.
export const state = {
  REDUCED: OS_REDUCED, // also on when the player picks low-effects mode
  dealRng: null, // null: Math.random
  grid: undefined,
  tray: undefined,
  score: undefined,
  best: undefined,
  combo: undefined,
  msc: undefined,
  over: undefined,
  overT0: undefined,
  newRecord: undefined,
  moves: 0,
  fulls: 0,
  flash: null,
  displayScore: 0,
  shownScore: -1,
  clearing: [],
  beams: [], // light sweeping along a line as it clears
  rings: [], // shockwaves from where the piece landed
  orbs: [], // score sparks flying from a clear up to the score counter; the counter waits for them
  particles: [],
  texts: [],
  shake: null,
  drag: null,
  banner: null,
  devMode: false,
  pendingTheme: null,
  gs: { multi: 0, calm: 0, broke: false, stars: 0, lines: 0, zcalm: 0, zrun: 0 },
  lastInput: 0,
  playAcc: 0, // play time only counts while someone is actually playing
  ambCur: null,
  ambPrev: null,
  mode: 'classic', // 'classic' | 'daily' | 'zen' | 'puzzle'
  gameDay: 0, // the day the running daily game belongs to
  puz: { li: 0, seq: 0, gems: null, gemTotal: 0, prev: null, undoUsed: false, won: false, fail: '', stars: 0, left: 0, newBest: false, failed: false, opened: [] },
  cls: freshCls(),
  shareTimer: 0,
  goalShown: 0, // goalShown: the bar has been drawn for this day, so newly lit stars may pop
};

/* ---------- Board and theme state (single writer: exported directly) ---------- */

export let pop = [...Array(N)].map(() => Array(N).fill(0));

export const emptyGrid = () => [...Array(N)].map(() => Array(N).fill(0));

// theme state
export const THEME_DUR = 1300;
export const theme = { cur: 0, prev: 0, t0: -1e9, start: 0, stage: 0, domDone: false, mode: 'classic', prevMode: 'classic' };
export let settings = { auto: true, fixed: 0, block: 'classic' };
export let earned = new Set([0]);   // themes the player has really unlocked (saved)
export let discovered = earned;      // themes shown as open: the same set, or every theme in developer mode
export const DEV_KEY = 'blokzen.dev';
// developer mode exists only in dev and test builds (.env.development, .env.test); the Play build has no way to switch it on
export const DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === '1';

export function syncOpen() { discovered = state.devMode ? new Set(THEMES.map((_, i) => i)) : earned; }

export let fresh = new Set(); // unlocked but not yet seen in the gallery
