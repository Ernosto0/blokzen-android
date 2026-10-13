import { THEMES } from '../themes/catalog.js';
import { rgba } from '../core/color.js';
import { bctx } from '../ui/dom.js';
import { state, theme, THEME_DUR } from '../core/state.js';
import { TH } from '../themes/progress.js';
import { clamp01, inOut, rand } from '../core/util.js';
import { BDPR, BH, BW } from './layout.js';

/* ---------- Living backgrounds ---------- */

// drips hanging from the top edge that swell and let a drop fall (chocolate, slime)
export function makeDrips(n, col) {
  const D = [...Array(n)].map(() => ({ x: Math.random(), len: rand(0, 0.06), max: rand(0.05, 0.14), sp: rand(0.006, 0.02), drop: null }));
  return {
    step(dt) {
      for (const d of D) {
        if (d.drop) { d.drop.v += 1.4 * dt; d.drop.y += d.drop.v * dt; if (d.drop.y > 1.1) d.drop = null; }
        d.len += d.sp * dt;
        if (d.len > d.max) { d.drop = { y: d.len, v: 0.02 }; d.len = 0.015; d.max = rand(0.05, 0.14); d.sp = rand(0.006, 0.02); }
      }
    },
    draw(g, w, h, a) {
      const u = Math.min(w, h), bw = u * 0.013;
      const top = g.createLinearGradient(0, 0, 0, u * 0.03); top.addColorStop(0, rgba(col, 0.85 * a)); top.addColorStop(1, rgba(col, 0));
      g.fillStyle = top; g.fillRect(0, 0, w, u * 0.03);
      for (const d of D) {
        const x = d.x * w, len = d.len * h;
        g.fillStyle = rgba(col, 0.8 * a);
        g.beginPath(); g.moveTo(x - bw * 1.8, 0); g.quadraticCurveTo(x - bw * 0.6, len * 0.5, x - bw, len);
        g.arc(x, len, bw, Math.PI, 0, true); g.quadraticCurveTo(x + bw * 0.6, len * 0.5, x + bw * 1.8, 0); g.fill();
        g.beginPath(); g.arc(x - bw * 0.35, len - bw * 0.1, bw * 0.3, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.35 * a})`; g.fill();
        if (d.drop) { g.beginPath(); g.ellipse(x, d.drop.y * h, bw * 0.9, bw * 1.25, 0, 0, Math.PI * 2); g.fillStyle = rgba(col, 0.75 * a); g.fill(); }
      }
    },
  };
}

export function paintBase(g, th, w, h, a) {
  g.globalAlpha = a;
  const R = Math.hypot(w, h) * 0.8;
  const gr = g.createRadialGradient(w / 2, h * 0.14, 0, w / 2, h * 0.14, R);
  gr.addColorStop(0, th.glow); gr.addColorStop(0.72, th.bg); gr.addColorStop(1, th.bg);
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.globalAlpha = 1;
}
export function drawBg(now, dt) {
  const g = bctx;
  g.setTransform(BDPR, 0, 0, BDPR, 0, 0);
  const m = inOut(clamp01((now - theme.t0) / THEME_DUR));
  const sdt = state.REDUCED ? dt * 0.15 : dt;
  if (m < 1 && state.ambPrev) {
    paintBase(g, THEMES[theme.prev], BW, BH, 1);
    state.ambPrev.step(sdt); state.ambPrev.draw(g, BW, BH, 1 - m);
    paintBase(g, TH(), BW, BH, m);
  } else {
    state.ambPrev = null;
    paintBase(g, TH(), BW, BH, 1);
  }
  state.ambCur.step(sdt); state.ambCur.draw(g, BW, BH, theme.prev === theme.cur ? 1 : m);
}
