import { rgba } from '../../core/color.js';
import { clamp01, inOut, lerp, rand } from '../../core/util.js';
import { chessPiece } from './helpers.js';
import { AMBIENTS } from '../registry.js';

Object.assign(AMBIENTS, {
  chessboard(th) { // a big board under the game; pieces make their moves one after another, the last move marked
    let q = 0, cols = 0, rows = 0, r0 = 0, base = null, bw = 0, bh = 0, t = 0, wait = 1, mv = null, last = null;
    let P = [];
    const DIRS = { 1: [[1, 0], [-1, 0], [0, 1], [0, -1]], 3: [[1, 1], [1, -1], [-1, 1], [-1, -1]] };
    function build(w, h) {
      bw = w; bh = h; q = Math.max(42, Math.min(w, h) * 0.13); cols = Math.ceil(w / q); rows = Math.ceil(h / q); r0 = Math.ceil(h * 0.18 / q); // pieces stay below the score
      base = document.createElement('canvas'); base.width = Math.ceil(w); base.height = Math.ceil(h);
      const g = base.getContext('2d');
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { g.fillStyle = (r + c) % 2 ? 'rgba(0,0,0,.18)' : 'rgba(255,236,200,.05)'; g.fillRect(c * q, r * q, q, q); }
      P = [];
      const kinds = [0, 0, 1, 2, 3, 4, 5, 0, 2, 3];
      kinds.forEach((k, i) => { for (let tries = 0; tries < 30; tries++) { const c = (Math.random() * cols) | 0, r = r0 + ((Math.random() * (rows - r0)) | 0); if (!P.some(p => p.c === c && p.r === r)) { P.push({ k, side: i % 2, c, r, x: c, y: r, gone: 0 }); break; } } });
    }
    function plan() {
      const p = P[(Math.random() * P.length) | 0]; if (!p || p.gone) return;
      const ok = (c, r) => c >= 0 && r >= r0 && c < cols && r < rows && !P.some(o => o !== p && !o.gone && o.c === c && o.r === r && o.side === p.side);
      let opts = [];
      if (p.k === 2) opts = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].map(([dc, dr]) => [p.c + dc, p.r + dr]);
      else if (p.k === 0) opts = [[p.c, p.r + (p.side ? 1 : -1)], [p.c + 1, p.r + (p.side ? 1 : -1)], [p.c - 1, p.r + (p.side ? 1 : -1)]];
      else if (p.k === 5) for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) { if (dc || dr) opts.push([p.c + dc, p.r + dr]); }
      else { const D = p.k === 4 ? [...DIRS[1], ...DIRS[3]] : DIRS[p.k]; for (const [dc, dr] of D) for (let n = 1; n <= 3; n++) opts.push([p.c + dc * n, p.r + dr * n]); }
      opts = opts.filter(([c, r]) => ok(c, r));
      if (!opts.length) { if (p.k === 0) p.side ^= 1; return; } // a pawn stuck at the edge turns round
      const [c, r] = opts[(Math.random() * opts.length) | 0];
      const victim = P.find(o => o !== p && !o.gone && o.c === c && o.r === r);
      mv = { p, c0: p.c, r0: p.r, c, r, t: 0, victim };
    }
    return {
      step(dt) {
        t += dt;
        for (const p of P) if (p.gone) { p.gone += dt; if (p.gone > 3) { p.gone = 0; for (let tries = 0; tries < 30; tries++) { const c = (Math.random() * cols) | 0, r = r0 + ((Math.random() * (rows - r0)) | 0); if (!P.some(o => o !== p && o.c === c && o.r === r)) { p.c = p.x = c; p.r = p.y = r; break; } } } }
        if (mv) {
          mv.t += dt / 0.7; const e = inOut(clamp01(mv.t));
          mv.p.x = lerp(mv.c0, mv.c, e); mv.p.y = lerp(mv.r0, mv.r, e);
          if (mv.t >= 1) { mv.p.c = mv.c; mv.p.r = mv.r; if (mv.victim) mv.victim.gone = 0.001; last = mv; mv = null; wait = rand(0.8, 1.6); }
        } else if (q) { wait -= dt; if (wait <= 0) plan(); }
      },
      draw(g, w, h, a) {
        if (!base || Math.abs(w - bw) > 1 || Math.abs(h - bh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(base, 0, 0, w, h); g.globalAlpha = 1;
        const hl = mv || last;
        if (hl) { g.fillStyle = rgba(th.accent, 0.13 * a); g.fillRect(hl.c0 * q, hl.r0 * q, q, q); g.fillRect(hl.c * q, hl.r * q, q, q); }
        for (const p of P) {
          const hop = mv && mv.p === p && p.k === 2 ? Math.sin(Math.PI * clamp01(mv.t)) * q * 0.35 : 0;
          const fade = p.gone ? Math.max(0, 1 - p.gone * 2) : 1; if (fade <= 0) continue;
          const x = (p.x + 0.5) * q, y = (p.y + 0.5) * q - hop;
          g.fillStyle = `rgba(0,0,0,${0.25 * a * fade})`; chessPiece(g, p.k, x + q * 0.04, y + q * 0.05, q * 0.7, p.side === 1);
          g.fillStyle = p.side ? `rgba(30,22,16,${0.75 * a * fade})` : `rgba(250,240,220,${0.55 * a * fade})`; chessPiece(g, p.k, x, y, q * 0.7, p.side === 1);
        }
      },
    };
  },
});
