import { N, SHAPES } from './constants.js';
import { mode } from '../modes/registry.js';
import { applyBits, bitsOf, fits, fitsAnywhere, LINES, popcount, solvable } from './bitboard.js';
import { state } from './state.js';

/* ---------- Random source for dealing ----------
   Classic games use Math.random. The daily challenge swaps in a seeded stream (state saved with the game), so the same
   day, board and moves always produce the same pieces on every device. */
export function dealStream(seed) {
  const g = { s: seed >>> 0, next() {
    let t = g.s = (g.s + 0x6D2B79F5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  } };
  return g;
}

const drand = () => state.dealRng ? state.dealRng.next() : Math.random();

/* ---------- Piece generation ----------
   1. Chunky pieces (2x2, 3x3, 3x2, long bars) are common; singles, dominoes and the small 3-cell L are rare.
   2. When the board can be wiped clean with up to three pieces, the dealer looks for such a set and usually deals it.
   3. Otherwise it deals sets that fit, lean toward completing lines, and keep the board open.
   Sets are judged by lines and cleared cells, never by how few cells they add, so small pieces are not favoured. */
const PROBES = [
  [SHAPES[10], 9], // 3x3
  [SHAPES[7], 5], [SHAPES[8], 5], // 1x5, 5x1
  [SHAPES[11], 4], [SHAPES[12], 4], // 3x2, 2x3
  [SHAPES[9], 3], // 2x2
];
const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
const bitAt = (lo, hi, i) => i < 32 ? (lo >>> i) & 1 : (hi >>> (i - 32)) & 1;
export const cellsOf = (lo, hi) => popcount(lo) + popcount(hi);
const ROWM = LINES.slice(0, N), COLM = LINES.slice(N);

// How usable the board's shape is, regardless of how full it is: no room for a big piece, or sealed holes, cost points.
// Holes are counted with bit masks (rows 0-3 live in lo, rows 4-7 in hi) so this stays fast enough to call thousands of times.
const NOT_C0 = 0xFEFEFEFE | 0, NOT_C7 = 0x7F7F7F7F | 0;
function boardShape(lo, hi) {
  let v = 0;
  for (const [s, w] of PROBES) if (!s.pos.some(p => fits(lo, hi, p))) v -= w;
  const el = ~lo, eh = ~hi;                                   // empty cells
  const ul = el << 8, uh = (eh << 8) | (el >>> 24);           // the cell above is empty
  const dl = (el >>> 8) | (eh << 24), dh = eh >>> 8;          // the cell below is empty
  const ll = (el << 1) & NOT_C0, lh = (eh << 1) & NOT_C0;     // the cell to the left is empty
  const rl = (el >>> 1) & NOT_C7, rh = (eh >>> 1) & NOT_C7;   // the cell to the right is empty
  const anyL = ul | dl | ll | rl, anyH = uh | dh | lh | rh;
  const twoL = (ul & dl) | (ul & ll) | (ul & rl) | (dl & ll) | (dl & rl) | (ll & rl);
  const twoH = (uh & dh) | (uh & lh) | (uh & rh) | (dh & lh) | (dh & rh) | (lh & rh);
  v -= 4 * (popcount(el & ~anyL) + popcount(eh & ~anyH));                 // sealed: no empty neighbour
  v -= 0.8 * (popcount(el & anyL & ~twoL) + popcount(eh & anyH & ~twoH)); // dead end: one empty neighbour
  return v;
}

// Best outcome of a set for a sensible player (greedy placement, every order). null if it cannot all be placed.
function playSet(lo0, hi0, set) {
  let best = null;
  const seen = new Set();
  for (const ord of PERMS) {
    const key = ord.map(k => set[k].id).join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    let l = lo0, h = hi0, lines = 0, cleared = 0, wipes = 0, ok = true;
    for (const k of ord) {
      let bv = -Infinity, bl = 0, bh = 0, bn = 0;
      const before = cellsOf(l, h) + set[k].size;
      for (const p of set[k].pos) {
        if (!fits(l, h, p)) continue;
        const [nl, nh, n] = applyBits(l, h, p);
        const v = boardShape(nl, nh) + n * 14 + (before - cellsOf(nl, nh)) * 0.5 + (n && !nl && !nh ? 400 : 0);
        if (v > bv) { bv = v; bl = nl; bh = nh; bn = n; }
      }
      if (bv === -Infinity) { ok = false; break; }
      cleared += before - cellsOf(bl, bh);
      if (bn && !bl && !bh) wipes++;
      l = bl; h = bh; lines += bn;
    }
    if (!ok) continue;
    const v = lines * 10 + cleared * 0.5 + wipes * 300 + boardShape(l, h);
    if (!best || v > best.v) best = { v, lines, wipes };
  }
  return best;
}

function pickShape(fill, moves) {
  let total = 0;
  const ws = SHAPES.map(s => {
    let w = s.weight;
    if (fill > 0.62) { if (s.size <= 3) w *= 1 + (fill - 0.62) * 5; else if (s.size >= 6) w *= 0.6; } // only a really crowded board gets smaller pieces
    total += w; return w;
  });
  let x = drand() * total;
  for (let i = 0; i < SHAPES.length; i++) { x -= ws[i]; if (x <= 0) return SHAPES[i]; }
  return SHAPES[0];
}
const pickFrom = list => { // weighted by the base weights
  let t = 0; for (const s of list) t += s.weight;
  let x = drand() * t;
  for (const s of list) { x -= s.weight; if (x <= 0) return s; }
  return list[list.length - 1];
};

// How kind the dealer is (0..1). Kind at the start, firmer as the game goes on, rescues a crowded board.
function kindness(moves, fill) {
  if (mode().endless) return 0.95; // zen never gets firmer, however long the session runs
  let k = moves < 150 ? 0.92 : moves < 350 ? 0.8 : moves < 700 ? 0.66 : moves < 1200 ? 0.52 : 0.42;
  if (fill > 0.5) k = Math.max(k, 0.55 + (fill - 0.5) * 1.5);
  return Math.min(k, 0.95);
}

// Cost of clearing what is left: each filled cell needs its row or its column finished, whichever is closer
function clearCost(lo, hi) {
  const cm = COLM.map(L => N - popcount(lo & L.lo) - popcount(hi & L.hi));
  let cost = 0;
  for (let r = 0; r < N; r++) {
    const row = ((r < 4 ? lo >>> (r * 8) : hi >>> ((r - 4) * 8)) & 255);
    if (!row) continue;
    const rm = N - popcount(row);
    for (let c = 0; c < N; c++) if (row & (1 << c)) cost += rm < cm[c] ? rm : cm[c];
  }
  return cost;
}

// Search for up to three pieces that leave the board completely empty. Beam search keeps it fast.
function findWipe(lo, hi, pool) {
  let beam = [{ lo, hi, s: null, up: null }];
  const path = st => { const a = []; for (; st && st.s; st = st.up) a.unshift(st.s); return a; };
  for (let d = 0; d < 3; d++) {
    const next = new Map(), last = d === 2;
    for (const st of beam) for (const s of pool) for (const p of s.pos) {
      if ((st.lo & p.lo) || (st.hi & p.hi)) continue;
      const [nl, nh] = applyBits(st.lo, st.hi, p);
      if (!nl && !nh) return [...path(st), s];
      if (last) continue;
      const key = nl * 4294967296 + nh;
      if (next.has(key)) continue;
      next.set(key, { lo: nl, hi: nh, s, up: st, h: -clearCost(nl, nh) + s.size * 0.15 + drand() * 0.5 });
    }
    if (last) break;
    beam = [...next.values()].sort((a, b) => b.h - a.h).slice(0, 50);
  }
  return null;
}
// A varied, weight-biased pool of shapes to search with, so wipe sets do not always use the same pieces
function wipePool() {
  const pool = new Set([SHAPES[9], SHAPES[10], SHAPES[11], SHAPES[12]]);
  while (pool.size < 18) pool.add(pickFrom(SHAPES));
  return [...pool];
}
export function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = (drand() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

export function generateSet(grid, moves) {
  const [lo, hi] = bitsOf(grid);
  const cells = cellsOf(lo, hi), fill = cells / 64;
  const kind = kindness(moves, fill);

  // Full-board clear: how often a found wipe is dealt depends on how much there is to wipe
  const zen = mode().endless;
  const pWipe = (cells >= 12 ? 0.75 : cells > 0 ? 0.5 : 0.2) * (moves > 900 && !zen ? 0.75 : 1);
  if (cells <= 36 && drand() < pWipe) { // more than 36 filled cells cannot be wiped by three pieces in practice
    const seq = findWipe(lo, hi, wipePool());
    if (seq) {
      while (seq.length < 3) seq.push(pickShape(0, moves)); // the board is empty after the wipe, so any piece fits
      return shuffle(seq);
    }
  }

  // Late game: now and then a raw set that only has to fit somewhere
  if (!zen && moves > 700 && fill < 0.4 && drand() < 0.08) {
    for (let a = 0; a < 20; a++) {
      const set = [pickShape(fill, moves), pickShape(fill, moves), pickShape(fill, moves)];
      if (set.some(s => fitsAnywhere(lo, hi, s))) return set;
    }
  }

  const clearers = SHAPES.filter(s => s.pos.some(p => fits(lo, hi, p) && applyBits(lo, hi, p)[2] > 0));
  const cands = [];
  for (let a = 0; a < 60 && cands.length < 18; a++) {
    const set = [pickShape(fill, moves), pickShape(fill, moves), pickShape(fill, moves)];
    if (clearers.length && drand() < 0.35 + 0.4 * kind) set[(drand() * 3) | 0] = pickFrom(clearers);
    const r = playSet(lo, hi, set);
    if (r) cands.push({ set, v: r.v });
  }
  if (cands.length) {
    cands.sort((a, b) => b.v - a.v);
    const idx = Math.floor(Math.pow(drand(), 1 + kind * 4) * cands.length);
    return cands[idx].set;
  }
  // Nothing passed: try the exhaustive search, then fall back to tiny pieces
  for (let a = 0; a < 30; a++) {
    const set = [pickShape(1, moves), pickShape(1, moves), pickShape(1, moves)];
    if (solvable(lo, hi, set)) return set;
  }
  const small = SHAPES.filter(s => s.size <= 2);
  return [0, 1, 2].map(() => small[(drand() * small.length) | 0]);
}
