import { N } from './constants.js';

/* ---------- Bitboard helpers (fast placement search) ---------- */
export const LINES = [];
for (let r = 0; r < N; r++) {
  const m = (0xFF << ((r % 4) * 8)) >>> 0;
  LINES.push(r < 4 ? { lo: m, hi: 0 } : { lo: 0, hi: m });
}
for (let c = 0; c < N; c++) {
  const m = (0x01010101 << c) >>> 0;
  LINES.push({ lo: m, hi: m });
}
export const fits = (lo, hi, p) => (lo & p.lo) === 0 && (hi & p.hi) === 0;
export function applyBits(lo, hi, p) {
  lo = (lo | p.lo) >>> 0; hi = (hi | p.hi) >>> 0;
  let clo = 0, chi = 0, n = 0;
  for (const L of LINES) {
    if (((lo & L.lo) >>> 0) === L.lo && ((hi & L.hi) >>> 0) === L.hi) { clo |= L.lo; chi |= L.hi; n++; }
  }
  return [(lo & ~clo) >>> 0, (hi & ~chi) >>> 0, n];
}
export function bitsOf(grid) {
  let lo = 0, hi = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c]) {
    const i = r * N + c;
    if (i < 32) lo |= 1 << i; else hi |= 1 << (i - 32);
  }
  return [lo >>> 0, hi >>> 0];
}
export const popcount = x => { x >>>= 0; let n = 0; while (x) { x &= x - 1; n++; } return n; };
export const fitsAnywhere = (lo, hi, s) => s.pos.some(p => fits(lo, hi, p));

export function solvable(lo, hi, shapes) {
  let budget = 120000;
  const used = [false, false, false];
  function dfs(lo, hi, depth) {
    if (depth === shapes.length) return true;
    for (let i = 0; i < shapes.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      for (const p of shapes[i].pos) {
        if (--budget < 0) { used[i] = false; return false; }
        if (!fits(lo, hi, p)) continue;
        const [nlo, nhi] = applyBits(lo, hi, p);
        if (dfs(nlo, nhi, depth + 1)) { used[i] = false; return true; }
      }
      used[i] = false;
    }
    return false;
  }
  return dfs(lo, hi, 0);
}
