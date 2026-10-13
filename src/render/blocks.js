import { rr } from './sprites.js';

/* ---------- Helpers shared by block looks (each theme's own look is in themes/<id>/block.js) ---------- */
export const seeded = c => { let x = (parseInt(c.slice(1), 16) % 2147483646) + 1; return () => (x = (x * 16807) % 2147483647) / 2147483647; };
function inner(g, s, k = 0.13) { rr(g, s * k, s * k, s * (1 - 2 * k), s * (1 - 2 * k), s * 0.04); g.clip(); }
