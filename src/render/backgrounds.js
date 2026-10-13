import { THEMES } from '../themes/catalog.js';
import { rgba } from '../core/color.js';
import { bctx } from '../ui/dom.js';
import { state, theme, THEME_DUR } from '../core/state.js';
import { TH } from '../themes/progress.js';
import { clamp01, inOut, rand } from '../core/util.js';
import { BDPR, BH, BW } from './layout.js';
import { hexPath, poly, sparkle } from './sprites.js';
import { beanMark, fruitSlice } from './blocks.js';

/* ---------- Living backgrounds ---------- */
export const AMBIENTS = {
  orbs(th) {
    const P = [...Array(7)].map((_, i) => ({ x: Math.random(), y: Math.random(), r: rand(0.18, 0.34), vx: rand(-0.014, 0.014), vy: rand(-0.012, 0.012), c: th.blocks[i % 7] }));
    return {
      step(dt) { for (const p of P) { p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < -0.15 || p.x > 1.15) p.vx *= -1; if (p.y < -0.15 || p.y > 1.15) p.vy *= -1; } },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const p of P) {
          const x = p.x * w, y = p.y * h, r = p.r * u;
          const gr = g.createRadialGradient(x, y, 0, x, y, r);
          gr.addColorStop(0, rgba(p.c, 0.17 * a)); gr.addColorStop(1, rgba(p.c, 0));
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
  bubbles(th) {
    const P = [...Array(34)].map(() => ({ x: Math.random(), y: rand(0, 1.1), r: rand(0.004, 0.016), sp: rand(0.03, 0.09), ph: rand(0, 6.3), wob: rand(0.004, 0.014) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y -= p.sp * dt; p.ph += dt * 1.6; if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h) * 1.6;
        for (let i = 0; i < 4; i++) { // light shafts from the surface
          const x = w * (0.15 + i * 0.24) + Math.sin(t * 0.3 + i * 1.7) * w * 0.05;
          const gr = g.createLinearGradient(0, 0, 0, h * 0.8);
          gr.addColorStop(0, rgba(th.accent, 0.09 * a)); gr.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gr;
          g.beginPath(); g.moveTo(x - w * 0.04, 0); g.lineTo(x + w * 0.05, 0); g.lineTo(x + w * 0.16, h * 0.8); g.lineTo(x - w * 0.02, h * 0.8); g.fill();
        }
        g.lineWidth = 1.2;
        for (const p of P) {
          const x = (p.x + Math.sin(p.ph) * p.wob) * w, y = p.y * h, r = p.r * u;
          g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
          g.strokeStyle = `rgba(255,255,255,${0.32 * a})`; g.stroke();
          g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, Math.PI * 2);
          g.fillStyle = `rgba(255,255,255,${0.45 * a})`; g.fill();
        }
      },
    };
  },
  fireflies(th) {
    const P = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, ph: rand(0, 6.3), f: rand(0.5, 1.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt; const damp = Math.pow(0.4, dt);
        for (const p of P) {
          p.vx = (p.vx + (Math.random() - 0.5) * 0.12 * dt) * damp; p.vy = (p.vy + (Math.random() - 0.5) * 0.12 * dt) * damp;
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < -0.05) p.x = 1.05; if (p.x > 1.05) p.x = -0.05; if (p.y < -0.05) p.y = 1.05; if (p.y > 1.05) p.y = -0.05;
        }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const fog = g.createLinearGradient(0, h * 0.6, 0, h);
        fog.addColorStop(0, rgba(th.glow, 0)); fog.addColorStop(1, rgba(th.glow, 0.45 * a));
        g.fillStyle = fog; g.fillRect(0, h * 0.6, w, h * 0.4);
        g.globalCompositeOperation = 'lighter';
        for (const p of P) {
          let b = Math.max(0, Math.sin(t * p.f * 2 + p.ph)); b = b * b * b * a;
          if (b < 0.01) continue;
          const x = p.x * w, y = p.y * h, r = u * 0.05;
          const gr = g.createRadialGradient(x, y, 0, x, y, r);
          gr.addColorStop(0, rgba(th.accent, 0.5 * b)); gr.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
          g.beginPath(); g.arc(x, y, Math.max(1, u * 0.005), 0, Math.PI * 2); g.fillStyle = `rgba(255,252,210,${b})`; g.fill();
        }
        g.globalCompositeOperation = 'source-over';
      },
    };
  },
  dust(th) {
    const P = [...Array(34)].map(() => ({ x: Math.random(), y: Math.random(), vx: rand(-0.01, 0.01), vy: rand(-0.025, -0.008), r: rand(0.6, 2), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.x += p.vx * dt; p.y += p.vy * dt; p.ph += dt; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const sx = w / 2, sy = h * 0.98, R = Math.max(w, h) * 0.55;
        g.save(); g.translate(sx, sy);
        for (let i = 0; i < 9; i++) {
          const ang = -Math.PI / 2 + (i - 4) * 0.28 + Math.sin(t * 0.25 + i) * 0.04;
          g.save(); g.rotate(ang);
          const gr = g.createLinearGradient(0, 0, R, 0);
          gr.addColorStop(0, rgba(th.accent, 0.14 * a)); gr.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(R, -R * 0.06); g.lineTo(R, R * 0.06); g.fill();
          g.restore();
        }
        const sun = g.createRadialGradient(0, 0, 0, 0, 0, R * 0.45);
        sun.addColorStop(0, rgba(th.accent, 0.55 * a)); sun.addColorStop(0.35, rgba('#ff9a62', 0.28 * a)); sun.addColorStop(1, rgba('#ff9a62', 0));
        g.fillStyle = sun; g.fillRect(-R, -R, 2 * R, 2 * R);
        g.restore();
        for (const p of P) {
          g.beginPath(); g.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
          g.fillStyle = `rgba(255,224,176,${(0.35 + 0.35 * Math.sin(p.ph * 2)) * a})`; g.fill();
        }
      },
    };
  },
  snow() {
    const P = [...Array(80)].map(() => { const r = rand(0.002, 0.009); return { x: Math.random(), y: Math.random(), r, sp: 0.03 + r * 6, ph: rand(0, 6.3), sw: rand(0.004, 0.02) }; });
    return {
      step(dt) { for (const p of P) { p.y += p.sp * dt; p.ph += dt * 1.2; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const hill = g.createLinearGradient(0, h * 0.75, 0, h);
        hill.addColorStop(0, 'rgba(255,255,255,0)'); hill.addColorStop(1, `rgba(255,255,255,${0.5 * a})`);
        g.fillStyle = hill; g.fillRect(0, h * 0.75, w, h * 0.25);
        for (const p of P) {
          g.beginPath(); g.arc((p.x + Math.sin(p.ph) * p.sw) * w, p.y * h, p.r * u, 0, Math.PI * 2);
          g.fillStyle = `rgba(255,255,255,${(p.r > 0.006 ? 0.6 : 0.9) * a})`; g.fill();
        }
      },
    };
  },
  grid(th) {
    const S = [...Array(40)].map(() => ({ x: Math.random(), y: Math.random() * 0.6, r: rand(0.5, 1.4), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        const hy = h * 0.68, R = Math.min(w, h) * 0.26;
        for (const s of S) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.sin(t * 2 + s.ph)) * a})`; g.fillRect(s.x * w, s.y * hy, s.r, s.r); }
        // synth sun
        g.save(); g.beginPath(); g.rect(0, 0, w, hy); g.clip();
        const sun = g.createLinearGradient(0, hy - R, 0, hy);
        sun.addColorStop(0, rgba('#ffd23a', 0.85 * a)); sun.addColorStop(1, rgba(th.accent, 0.85 * a));
        g.beginPath(); g.arc(w / 2, hy, R, Math.PI, 0); g.fillStyle = sun; g.fill();
        g.fillStyle = th.bg;
        for (let k = 0; k < 6; k++) { const y = hy - R * (0.08 + k * 0.13); g.fillRect(w / 2 - R, y, 2 * R, R * (0.012 + k * 0.012)); }
        g.restore();
        // floor grid
        g.fillStyle = rgba(th.bg, a); g.fillRect(0, hy, w, h - hy);
        g.save(); g.strokeStyle = rgba(th.accent, 0.55 * a); g.lineWidth = 1.2; g.shadowColor = th.accent; g.shadowBlur = 6;
        g.beginPath(); g.moveTo(0, hy); g.lineTo(w, hy); g.stroke();
        for (let i = -14; i <= 14; i++) { g.beginPath(); g.moveTo(w / 2 + i * w * 0.012, hy); g.lineTo(w / 2 + i * w * 0.13, h); g.stroke(); }
        const off = (t * 0.35) % 1;
        for (let j = 0; j < 12; j++) { const z = (j + off) / 12, y = hy + (h - hy) * z * z; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.restore();
      },
    };
  },
  petals() {
    const cols = ['#fff3f6', '#ffd1de', '#ffb3c8'];
    const P = [...Array(30)].map(() => ({ x: rand(-0.2, 1), y: Math.random(), s: rand(0.008, 0.018), rot: rand(0, 6.3), vr: rand(-1.5, 1.5), vx: rand(0.01, 0.04), vy: rand(0.03, 0.07), ph: rand(0, 6.3), c: cols[(Math.random() * 3) | 0] }));
    return {
      step(dt) { for (const p of P) { p.ph += dt * 2.2; p.x += (p.vx + Math.sin(p.ph) * 0.02) * dt; p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y > 1.05 || p.x > 1.1) { p.y = -0.05; p.x = rand(-0.2, 1); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h) * 1.4;
        for (const p of P) {
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(p.rot); g.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.ph)));
          g.beginPath(); g.ellipse(0, 0, p.s * u, p.s * u * 0.62, 0, 0, Math.PI * 2);
          g.fillStyle = rgba(p.c, 0.85 * a); g.fill(); g.restore();
        }
      },
    };
  },
  embers(th) {
    const P = [...Array(48)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.04, 0.13), ph: rand(0, 6.3), r: rand(0.8, 2.6), hot: Math.random() }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y -= p.vy * dt; p.ph += dt * 3; p.x += Math.sin(p.ph * 0.4) * 0.01 * dt; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const pulse = 0.8 + 0.2 * Math.sin(t * 1.3);
        const lava = g.createLinearGradient(0, h * 0.55, 0, h);
        lava.addColorStop(0, rgba(th.accent, 0)); lava.addColorStop(1, rgba(th.accent, 0.32 * a * pulse));
        g.fillStyle = lava; g.fillRect(0, h * 0.55, w, h * 0.45);
        g.globalCompositeOperation = 'lighter';
        for (const p of P) {
          const fl = (0.5 + 0.5 * Math.sin(p.ph)) * a * (0.4 + 0.6 * p.y);
          g.beginPath(); g.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
          g.fillStyle = p.hot > 0.5 ? `rgba(255,210,90,${fl})` : `rgba(255,120,40,${fl})`; g.fill();
        }
        g.globalCompositeOperation = 'source-over';
      },
    };
  },
  hive(th) {
    // honeycomb wall (pre-rendered), a few cells glowing with honey, drips from the top, bees drifting about
    let comb = null, cw = 0, ch = 0, cells = [];
    const R = 26;
    function build(w, h) {
      cw = w; ch = h; cells = [];
      comb = document.createElement('canvas'); comb.width = Math.ceil(w); comb.height = Math.ceil(h);
      const g = comb.getContext('2d'), dx = R * Math.sqrt(3), dy = R * 1.5;
      g.strokeStyle = rgba(th.accent, 0.13); g.lineWidth = 2; g.lineJoin = 'round';
      for (let row = -1, y = -R; y < h + R; row++, y += dy) {
        for (let x = (row & 1) ? dx / 2 : 0; x < w + dx; x += dx) {
          hexPath(g, x, y, R - 1.5); g.stroke();
          if (Math.random() < 0.09) cells.push({ x, y, ph: rand(0, 6.3), f: rand(0.3, 0.8) });
        }
      }
    }
    const drips = [...Array(6)].map(() => ({ x: Math.random(), len: rand(0, 0.06), max: rand(0.05, 0.13), sp: rand(0.006, 0.02), drop: null }));
    const bees = [...Array(5)].map(() => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const d of drips) {
          if (d.drop) { d.drop.v += 1.4 * dt; d.drop.y += d.drop.v * dt; if (d.drop.y > 1.1) d.drop = null; }
          d.len += d.sp * dt;
          if (d.len > d.max) { d.drop = { y: d.len, v: 0.02 }; d.len = 0.015; d.max = rand(0.05, 0.13); d.sp = rand(0.006, 0.02); }
        }
        const damp = Math.pow(0.5, dt);
        for (const b of bees) {
          b.vx = (b.vx + (Math.random() - 0.5) * 0.5 * dt) * damp; b.vy = (b.vy + (Math.random() - 0.5) * 0.5 * dt) * damp;
          b.x += b.vx * dt; b.y += b.vy * dt; b.ph += dt * 40;
          if (b.x < -0.05) b.x = 1.05; if (b.x > 1.05) b.x = -0.05; if (b.y < -0.05) b.y = 1.05; if (b.y > 1.05) b.y = -0.05;
        }
      },
      draw(g, w, h, a) {
        if (!comb || Math.abs(w - cw) > 1 || Math.abs(h - ch) > 1) build(w, h);
        const warm = g.createLinearGradient(0, h * 0.55, 0, h);
        warm.addColorStop(0, rgba(th.accent, 0)); warm.addColorStop(1, rgba(th.accent, 0.2 * a));
        g.fillStyle = warm; g.fillRect(0, h * 0.55, w, h * 0.45);
        g.globalAlpha = a; g.drawImage(comb, 0, 0, w, h); g.globalAlpha = 1;
        for (const c of cells) {
          const k = (0.5 + 0.5 * Math.sin(t * c.f + c.ph)) * a;
          hexPath(g, c.x, c.y, R - 3);
          g.fillStyle = rgba(th.accent, 0.05 + 0.13 * k); g.fill();
        }
        const u = Math.min(w, h);
        for (const d of drips) {
          const x = d.x * w, len = d.len * h, bw = u * 0.012;
          g.fillStyle = rgba('#f2a516', 0.75 * a);
          g.beginPath(); g.moveTo(x - bw * 1.8, 0); g.quadraticCurveTo(x - bw * 0.6, len * 0.5, x - bw, len);
          g.arc(x, len, bw, Math.PI, 0, true); g.quadraticCurveTo(x + bw * 0.6, len * 0.5, x + bw * 1.8, 0); g.fill();
          g.beginPath(); g.arc(x - bw * 0.35, len - bw * 0.1, bw * 0.3, 0, Math.PI * 2); g.fillStyle = `rgba(255,248,220,${0.6 * a})`; g.fill();
          if (d.drop) {
            const y = d.drop.y * h;
            g.beginPath(); g.ellipse(x, y, bw * 0.9, bw * 1.25, 0, 0, Math.PI * 2); g.fillStyle = rgba('#f2a516', 0.7 * a); g.fill();
          }
        }
        const top =g.createLinearGradient(0, 0, 0, u * 0.025);
        top.addColorStop(0, rgba('#f2a516', 0.8 * a)); top.addColorStop(1, rgba('#f2a516', 0));
        g.fillStyle = top; g.fillRect(0, 0, w, u * 0.025);
        const bs = u * 0.016;
        for (const b of bees) {
          const x = b.x * w, y = b.y * h, dir = b.vx < 0 ? -1 : 1, flap = 0.5 + 0.5 * Math.sin(b.ph);
          g.save(); g.translate(x, y); g.scale(dir, 1);
          g.fillStyle = `rgba(255,255,255,${0.45 * a})`;
          g.beginPath(); g.ellipse(-bs * 0.2, -bs * 1.1, bs * 0.9, bs * (0.35 + 0.4 * flap), -0.4, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.ellipse(bs * 0.4, -bs * 1.0, bs * 0.7, bs * (0.3 + 0.35 * flap), 0.3, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.ellipse(0, 0, bs * 1.4, bs, 0, 0, Math.PI * 2); g.fillStyle = rgba('#ffc93a', 0.9 * a); g.fill();
          g.save(); g.clip(); g.fillStyle = rgba('#2a1703', 0.9 * a);
          g.fillRect(-bs * 0.55, -bs, bs * 0.38, bs * 2); g.fillRect(bs * 0.15, -bs, bs * 0.38, bs * 2); g.restore();
          g.restore();
        }
      },
    };
  },
  stars(th) {
    const P = [...Array(110)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.5, 1.7), ph: rand(0, 6.3), f: rand(0.5, 2) }));
    const neb = [0, 1].map(i => ({ x: rand(0.1, 0.9), y: rand(0.1, 0.9), c: th.blocks[i ? 5 : 3] }));
    let t = 0, shoot = null, wait = rand(2, 5);
    return {
      step(dt) {
        t += dt; wait -= dt;
        if (!shoot && wait < 0 && !state.REDUCED) { shoot = { x: rand(0.1, 0.9), y: rand(0, 0.4), life: 0 }; wait = rand(3, 7); }
        if (shoot) { shoot.life += dt; if (shoot.life > 0.8) shoot = null; }
      },
      draw(g, w, h, a) {
        const u = Math.max(w, h);
        for (const n of neb) {
          const gr = g.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, u * 0.45);
          gr.addColorStop(0, rgba(n.c, 0.12 * a)); gr.addColorStop(1, rgba(n.c, 0));
          g.fillStyle = gr; g.fillRect(0, 0, w, h);
        }
        for (const p of P) {
          g.fillStyle = `rgba(255,255,255,${(0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * p.f + p.ph))) * a})`;
          g.fillRect(p.x * w, p.y * h, p.r, p.r);
        }
        if (shoot) {
          const k = shoot.life / 0.8, x = (shoot.x + k * 0.35) * w, y = (shoot.y + k * 0.2) * h, len = u * 0.12;
          const gr = g.createLinearGradient(x, y, x - len, y - len * 0.57);
          gr.addColorStop(0, `rgba(255,255,255,${(1 - k) * a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
          g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - len, y - len * 0.57); g.stroke();
        }
      },
    };
  },
};

// drips hanging from the top edge that swell and let a drop fall (chocolate, slime)
function makeDrips(n, col) {
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
export function batShape(g, x, y, r, flap, fill, flip) {
  g.save(); g.translate(x, y); if (flip) g.scale(-1, 1);
  const wy = -r * 0.6 * flap;
  g.beginPath();
  g.moveTo(0, -r * 0.3);
  g.lineTo(r * 0.35, -r * 0.15 + wy * 0.4); g.lineTo(r * 1.15, wy - r * 0.15); g.lineTo(r * 0.9, wy + r * 0.2); g.lineTo(r * 0.6, wy * 0.6 + r * 0.15); g.lineTo(r * 0.3, r * 0.3);
  g.lineTo(0, r * 0.2);
  g.lineTo(-r * 0.3, r * 0.3); g.lineTo(-r * 0.6, wy * 0.6 + r * 0.15); g.lineTo(-r * 0.9, wy + r * 0.2); g.lineTo(-r * 1.15, wy - r * 0.15); g.lineTo(-r * 0.35, -r * 0.15 + wy * 0.4);
  g.closePath(); g.fillStyle = fill; g.fill();
  g.beginPath(); g.moveTo(-r * 0.15, -r * 0.3); g.lineTo(-r * 0.1, -r * 0.5); g.lineTo(0, -r * 0.32); g.lineTo(r * 0.1, -r * 0.5); g.lineTo(r * 0.15, -r * 0.3); g.fill();
  g.restore();
}
Object.assign(AMBIENTS, {
  coins(th) { // gold coins tumbling down, a glowing treasure pile below
    const P = [...Array(22)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.012, 0.024), vy: rand(0.05, 0.13), ph: rand(0, 6.3), sp: rand(2, 5) }));
    const G = [...Array(14)].map(() => ({ x: Math.random(), y: rand(0.75, 1), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y += p.vy * dt; p.ph += p.sp * dt; if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const pile = g.createRadialGradient(w / 2, h * 1.05, 0, w / 2, h * 1.05, Math.max(w, h) * 0.6);
        pile.addColorStop(0, rgba(th.accent, 0.38 * a)); pile.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = pile; g.fillRect(0, h * 0.4, w, h * 0.6);
        for (const s of G) { const k = Math.max(0, Math.sin(t * 1.7 + s.ph)); if (k > 0.6) sparkle(g, s.x * w, s.y * h, u * 0.02 * k, (k - 0.6) * 2.5 * a); }
        for (const p of P) {
          const x = p.x * w, y = p.y * h, r = p.r * u, sx = Math.abs(Math.cos(p.ph));
          g.beginPath(); g.ellipse(x, y, Math.max(0.8, r * sx), r, 0, 0, Math.PI * 2);
          g.fillStyle = rgba(sx > 0.3 ? '#f5c542' : '#b88a1c', 0.85 * a); g.fill();
          if (sx > 0.4) { g.beginPath(); g.ellipse(x, y, r * sx * 0.62, r * 0.62, 0, 0, Math.PI * 2); g.strokeStyle = rgba('#fff2b0', 0.6 * a); g.lineWidth = 1; g.stroke(); }
        }
      },
    };
  },
  prism(th) { // two rainbow beams through glass, glinting sparkles
    const RB = ['#ff5a6e', '#ffa64d', '#ffe45c', '#5cf08a', '#5cd6ff', '#7a7dff', '#d47aff'];
    const P = [...Array(26)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(-0.02, -0.006), ph: rand(0, 6.3), f: rand(0.6, 1.6) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y += p.vy * dt; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), len = Math.hypot(w, h);
        g.save(); g.globalCompositeOperation = 'lighter';
        for (let b = 0; b < 2; b++) {
          g.save(); g.translate(b ? w * 0.95 : w * 0.05, -h * 0.02); g.rotate((b ? 2.2 : 0.95) + Math.sin(t * 0.15 + b) * 0.05);
          RB.forEach((c, i) => {
            const gr = g.createLinearGradient(0, 0, len, 0); gr.addColorStop(0, rgba(c, 0.13 * a)); gr.addColorStop(1, rgba(c, 0));
            g.fillStyle = gr; g.fillRect(0, (i - 3.5) * u * 0.02, len, u * 0.02);
          });
          g.restore();
        }
        g.restore();
        for (const p of P) { const k = 0.5 + 0.5 * Math.sin(t * p.f * 2 + p.ph); sparkle(g, p.x * w, p.y * h, u * (0.006 + 0.01 * k), (0.25 + 0.6 * k) * a); }
      },
    };
  },
  cocoa(th) { // melting chocolate from the top, falling sprinkles
    const D = makeDrips(7, '#5a2c12');
    const SPR = ['#ff6b8a', '#ffd166', '#7ae0ff', '#a6f06b', '#ffffff', '#c58bff'];
    const P = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.03, 0.08), rot: rand(0, 6.3), vr: rand(-2, 2), c: SPR[(Math.random() * 6) | 0] }));
    return {
      step(dt) { D.step(dt); for (const p of P) { p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const warm = g.createLinearGradient(0, h * 0.6, 0, h); warm.addColorStop(0, rgba(th.glow, 0)); warm.addColorStop(1, rgba(th.glow, 0.5 * a));
        g.fillStyle = warm; g.fillRect(0, h * 0.6, w, h * 0.4);
        const u = Math.min(w, h), l = u * 0.012;
        g.lineCap = 'round'; g.lineWidth = Math.max(2, u * 0.008);
        for (const p of P) {
          const x = p.x * w, y = p.y * h, cx = Math.cos(p.rot) * l, cy = Math.sin(p.rot) * l;
          g.strokeStyle = rgba(p.c, 0.7 * a); g.beginPath(); g.moveTo(x - cx, y - cy); g.lineTo(x + cx, y + cy); g.stroke();
        }
        g.lineCap = 'butt';
        D.draw(g, w, h, a);
      },
    };
  },
  ooze(th) { // slime dripping from above into a bubbling pool
    const D = makeDrips(6, '#7ee03a');
    const B = [...Array(14)].map(() => ({ x: Math.random(), y: rand(0.82, 1), r: rand(0.006, 0.016), vy: rand(0.02, 0.06), life: Math.random() }));
    let t = 0;
    return {
      step(dt) { t += dt; D.step(dt); for (const b of B) { b.y -= b.vy * dt; b.life += dt * 0.4; if (b.life > 1) { b.life = 0; b.y = rand(0.88, 1); b.x = Math.random(); } } },
      draw(g, w, h, a) {
        const base = h * 0.86;
        g.beginPath(); g.moveTo(0, h);
        for (let x = 0; x <= w + 10; x += 10) g.lineTo(x, base + Math.sin(x * 0.02 + t * 1.2) * h * 0.012 + Math.sin(x * 0.047 - t * 0.8) * h * 0.008);
        g.lineTo(w, h); g.closePath();
        const gr = g.createLinearGradient(0, base, 0, h); gr.addColorStop(0, rgba('#8cf04a', 0.55 * a)); gr.addColorStop(1, rgba('#2c6e14', 0.7 * a));
        g.fillStyle = gr; g.fill();
        const u = Math.min(w, h);
        g.lineWidth = 1.5;
        for (const b of B) {
          const r = b.r * u * (0.6 + b.life * 0.6);
          g.beginPath(); g.arc(b.x * w, b.y * h, r, 0, Math.PI * 2); g.strokeStyle = `rgba(220,255,190,${0.5 * a * (1 - b.life)})`; g.stroke();
        }
        D.draw(g, w, h, a);
      },
    };
  },
  workshop() { // wooden planks, a window beam and drifting sawdust
    const P = [...Array(40)].map(() => ({ x: Math.random(), y: Math.random(), vx: rand(-0.01, 0.01), r: rand(0.6, 1.8), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.x += (p.vx + Math.sin(t * 0.5 + p.ph) * 0.006) * dt; p.y += 0.01 * dt; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } if (p.x < -0.03) p.x = 1.03; if (p.x > 1.03) p.x = -0.03; } },
      draw(g, w, h, a) {
        const pw = Math.max(60, w / 6);
        for (let i = 0; i * pw < w + pw; i++) {
          g.fillStyle = i % 2 ? `rgba(0,0,0,${0.05 * a})` : `rgba(255,255,255,${0.025 * a})`; g.fillRect(i * pw, 0, pw, h);
          g.fillStyle = `rgba(0,0,0,${0.3 * a})`; g.fillRect(i * pw, 0, 2, h);
          g.strokeStyle = `rgba(0,0,0,${0.08 * a})`; g.lineWidth = 1.2;
          for (let k = 0; k < 4; k++) { const x = i * pw + pw * (0.2 + k * 0.2); g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + pw * 0.08, h * 0.3, x - pw * 0.08, h * 0.6, x + pw * 0.03, h); g.stroke(); }
        }
        g.save(); g.translate(w * 0.8, 0); g.rotate(0.45);
        const beam = g.createLinearGradient(0, 0, 0, h * 1.2); beam.addColorStop(0, `rgba(255,217,160,${0.16 * a})`); beam.addColorStop(1, 'rgba(255,217,160,0)');
        g.fillStyle = beam; g.fillRect(-w * 0.18, 0, w * 0.36, h * 1.3); g.restore();
        for (const p of P) { g.beginPath(); g.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2); g.fillStyle = `rgba(255,226,170,${(0.3 + 0.3 * Math.sin(t * 2 + p.ph)) * a})`; g.fill(); }
      },
    };
  },
  gumballs(th) { // bubbles that blow up and pop
    const mk = () => ({ x: rand(0.05, 0.95), y: rand(0.05, 0.95), r: 0, max: rand(0.03, 0.08), sp: rand(0.01, 0.03), pop: 0, c: th.blocks[(Math.random() * 7) | 0] });
    const P = [...Array(9)].map(() => { const p = mk(); p.r = Math.random() * p.max; return p; });
    return {
      step(dt) { P.forEach((p, i) => { if (p.pop) { p.pop += dt * 3; if (p.pop > 1) P[i] = mk(); } else { p.r += p.sp * dt; p.y -= 0.01 * dt; if (p.r >= p.max) p.pop = 0.001; } }); },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const p of P) {
          const x = p.x * w, y = p.y * h, r = p.r * u;
          if (p.pop) {
            g.strokeStyle = rgba(p.c, (1 - p.pop) * 0.7 * a); g.lineWidth = 2;
            for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4, r1 = r * (1 + p.pop * 0.6), r2 = r * (1.2 + p.pop); g.beginPath(); g.moveTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1); g.lineTo(x + Math.cos(an) * r2, y + Math.sin(an) * r2); g.stroke(); }
            continue;
          }
          const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r);
          gr.addColorStop(0, `rgba(255,255,255,${0.5 * a})`); gr.addColorStop(0.4, rgba(p.c, 0.28 * a)); gr.addColorStop(1, rgba(p.c, 0.45 * a));
          g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
          g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.15, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.7 * a})`; g.fill();
        }
      },
    };
  },
  arcade(th) { // scrolling pixel stars, marching space invaders, scanlines
    const S = [...Array(70)].map(() => ({ x: Math.random(), y: Math.random(), z: rand(0.3, 1) }));
    const INV = ['00100000100', '00010001000', '00111111100', '01101110110', '11111111111', '10111111101', '10100000101', '00011011000'];
    let t = 0;
    return {
      step(dt) { t += dt; for (const s of S) { s.y += s.z * 0.12 * dt; if (s.y > 1) { s.y = 0; s.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), px = Math.max(2, Math.round(u * 0.006));
        for (const s of S) {
          const q = s.z > 0.7 ? px : Math.max(1, px / 2);
          g.fillStyle = `rgba(255,255,255,${(0.25 + 0.6 * s.z) * a})`; g.fillRect(Math.round(s.x * w / q) * q, Math.round(s.y * h / q) * q, q, q);
        }
        const step = Math.floor(t * 2), frame = step % 2, cw = 15 * px, ph = step % 16, march = (ph < 8 ? ph : 16 - ph) * px * 2;
        const ox = (w - 4 * cw) / 2 - 8 * px + march, oy = h * 0.06;
        const ic = [th.blocks[0], th.blocks[3], th.blocks[4], th.blocks[6]];
        for (let k = 0; k < 4; k++) {
          g.fillStyle = rgba(ic[k], 0.4 * a);
          INV.forEach((row, r) => { const rw = frame && r === 7 ? '01000000010' : row; for (let c = 0; c < 11; c++) if (rw[c] === '1') g.fillRect(ox + k * cw + c * px, oy + r * px, px, px); });
        }
        g.fillStyle = `rgba(0,0,0,${0.18 * a})`; for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 1.5);
      },
    };
  },
  cave(th) { // stalactites dripping water, glowing amethyst clusters, floating motes
    const top = [...Array(9)].map((_, i) => ({ x: (i + rand(0.1, 0.9)) / 9, len: rand(0.05, 0.14), wd: rand(0.03, 0.06) }));
    const drops = top.map(s => ({ s, y: -1, wait: rand(0.5, 5) }));
    const M = [...Array(24)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(-0.02, -0.005), ph: rand(0, 6.3) }));
    const CL = [[0.08, 1, 1], [0.92, 1, -1], [0.55, 1.02, 1]];
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const d of drops) { if (d.y < 0) { d.wait -= dt; if (d.wait < 0) d.y = d.s.len; } else { d.y += dt * 0.6; if (d.y > 1.05) { d.y = -1; d.wait = rand(1.5, 6); } } }
        for (const m of M) { m.y += m.vy * dt; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        g.fillStyle = rgba(th.board, 0.9 * a);
        for (const s of top) { const x = s.x * w, ww = s.wd * w; g.beginPath(); g.moveTo(x - ww, 0); g.lineTo(x + ww, 0); g.lineTo(x, s.len * h); g.closePath(); g.fill(); }
        g.fillStyle = rgba('#bfe6ff', 0.7 * a);
        for (const d of drops) if (d.y >= 0) { g.beginPath(); g.ellipse(d.s.x * w, d.y * h, u * 0.004, u * 0.007, 0, 0, Math.PI * 2); g.fill(); }
        for (const [cx, cy, dir] of CL) {
          const x = cx * w, y = cy * h, R = u * 0.32, pulse = 0.75 + 0.25 * Math.sin(t * 1.2 + cx * 5);
          const gl = g.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba(th.accent, 0.35 * a * pulse)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - R, 2 * R, 2 * R);
          for (let k = -2; k <= 2; k++) {
            const len = u * (0.16 - Math.abs(k) * 0.025), wd = u * 0.022;
            g.save(); g.translate(x + k * u * 0.03, y); g.rotate(k * 0.3 * dir);
            poly(g, [[-wd, 0], [-wd, -len], [0, -len - wd * 1.6], [0, 0]], rgba('#e6b8ff', 0.6 * a));
            poly(g, [[0, 0], [0, -len - wd * 1.6], [wd, -len], [wd, 0]], rgba('#8a4ad8', 0.7 * a));
            g.restore();
          }
        }
        for (const m of M) { const k = 0.5 + 0.5 * Math.sin(t * 2 + m.ph); g.beginPath(); g.arc(m.x * w, m.y * h, 1 + k * 1.5, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, (0.2 + 0.5 * k) * a); g.fill(); }
      },
    };
  },
  steam(th) { // steam rising from below, coffee beans drifting, warm cafe light
    const W3 = [0.2, 0.5, 0.8].map(x => ({ x, P: [] }));
    const BE = [...Array(10)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.015, 0.035), rot: rand(0, 6.3), vr: rand(-0.6, 0.6) }));
    let t = 0, acc = 0;
    return {
      step(dt) {
        t += dt; acc += dt;
        if (acc > 0.25) { acc = 0; for (const s of W3) s.P.push({ y: 1.02, life: 0, ph: rand(0, 6.3) }); }
        for (const s of W3) { for (const p of s.P) { p.y -= 0.12 * dt; p.life += dt / 6; } s.P = s.P.filter(p => p.life < 1); }
        for (const b of BE) { b.y += b.vy * dt; b.rot += b.vr * dt; if (b.y > 1.04) { b.y = -0.04; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        const warm = g.createRadialGradient(w / 2, h, 0, w / 2, h, Math.max(w, h) * 0.7); warm.addColorStop(0, rgba(th.accent, 0.22 * a)); warm.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = warm; g.fillRect(0, 0, w, h);
        for (const b of BE) beanMark(g, b.x * w, b.y * h, u * 0.018, b.rot, rgba('#2a160c', 0.6 * a), rgba('#8a5a3a', 0.55 * a));
        for (const s of W3) for (const p of s.P) {
          const x = (s.x + Math.sin(p.y * 7 + t * 0.6 + p.ph * 0.2) * 0.035) * w, y = p.y * h, r = u * (0.03 + p.life * 0.09);
          const al = Math.sin(p.life * Math.PI) * 0.07 * a;
          const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,245,235,${al})`); gr.addColorStop(1, 'rgba(255,245,235,0)');
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
  night() { // full moon, flapping bats, drifting fog
    const ST = [...Array(50)].map(() => ({ x: Math.random(), y: Math.random() * 0.6, ph: rand(0, 6.3) }));
    const BT = [...Array(6)].map(() => ({ x: Math.random(), y: rand(0.1, 0.5), vx: rand(0.04, 0.09) * (Math.random() < 0.5 ? -1 : 1), ph: rand(0, 6.3), s: rand(0.7, 1.3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const b of BT) { b.x += b.vx * dt; b.y += Math.sin(t * 2 + b.ph) * 0.02 * dt; b.ph += dt * 14; if (b.x > 1.1) b.x = -0.1; if (b.x < -0.1) b.x = 1.1; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const s of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.sin(t * 1.5 + s.ph)) * a})`; g.fillRect(s.x * w, s.y * h, 1.5, 1.5); }
        const mx = w * 0.78, my = h * 0.13, mr = u * 0.11;
        const gl = g.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 3.2); gl.addColorStop(0, `rgba(255,230,176,${0.25 * a})`); gl.addColorStop(1, 'rgba(255,230,176,0)');
        g.fillStyle = gl; g.fillRect(mx - mr * 3.2, my - mr * 3.2, mr * 6.4, mr * 6.4);
        g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.fillStyle = `rgba(255,240,200,${0.92 * a})`; g.fill();
        g.fillStyle = `rgba(232,212,160,${0.5 * a})`;
        for (const [dx, dy, r] of [[-0.3, -0.2, 0.18], [0.25, 0.15, 0.24], [-0.1, 0.4, 0.12]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2); g.fill(); }
        for (const b of BT) batShape(g, b.x * w, b.y * h, u * 0.03 * b.s, Math.sin(b.ph), `rgba(10,5,16,${0.9 * a})`, b.vx < 0);
        for (let i = 0; i < 3; i++) {
          const y = h * (0.78 + i * 0.08), off = Math.sin(t * 0.2 + i) * w * 0.1;
          const gr = g.createLinearGradient(0, y - h * 0.08, 0, y + h * 0.08);
          gr.addColorStop(0, 'rgba(180,160,200,0)'); gr.addColorStop(0.5, `rgba(180,160,200,${0.1 * a})`); gr.addColorStop(1, 'rgba(180,160,200,0)');
          g.fillStyle = gr; g.fillRect(off - w * 0.2, y - h * 0.08, w * 1.4, h * 0.16);
        }
      },
    };
  },
  lights() { // a string of twinkling bulbs and falling snow
    const BUL = ['#ff4a5a', '#ffd25a', '#4ad08a', '#5ab0ff', '#ff8ad0'];
    const SN = [...Array(60)].map(() => { const r = rand(0.002, 0.007); return { x: Math.random(), y: Math.random(), r, sp: 0.03 + r * 6, ph: rand(0, 6.3) }; });
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of SN) { p.y += p.sp * dt; p.ph += dt * 1.2; if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sag = h * 0.06, wireY = x => h * 0.02 + Math.pow(Math.sin(x * Math.PI * 3), 2) * sag;
        g.strokeStyle = `rgba(10,26,16,${0.9 * a})`; g.lineWidth = 2; g.beginPath();
        for (let i = 0; i <= 60; i++) { const x = i / 60; i ? g.lineTo(x * w, wireY(x)) : g.moveTo(0, wireY(0)); }
        g.stroke();
        const n = Math.max(8, Math.round(w / 45));
        for (let i = 0; i < n; i++) {
          const fx = (i + 0.5) / n, x = fx * w, y = wireY(fx) + u * 0.014, c = BUL[i % BUL.length], k = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.7);
          const R = u * 0.05 * k, gl = g.createRadialGradient(x, y, 0, x, y, R); gl.addColorStop(0, rgba(c, 0.5 * a * k)); gl.addColorStop(1, rgba(c, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - R, 2 * R, 2 * R);
          g.beginPath(); g.ellipse(x, y, u * 0.008, u * 0.013, 0, 0, Math.PI * 2); g.fillStyle = rgba(c, (0.6 + 0.4 * k) * a); g.fill();
        }
        for (const p of SN) { g.beginPath(); g.arc((p.x + Math.sin(p.ph) * 0.01) * w, p.y * h, p.r * u, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.8 * a})`; g.fill(); }
      },
    };
  },
  luxe(th) { // art deco sunburst, gold corner frames, floating gold leaf
    const P = [...Array(40)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(-0.015, -0.004), ph: rand(0, 6.3), f: rand(1, 3) }));
    let t = 0;
    return {
      step(dt) { t += dt; for (const p of P) { p.y += p.vy * dt; p.x += Math.sin(t * 0.4 + p.ph) * 0.004 * dt; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), cx = w / 2, cy = h * 1.02, R = Math.hypot(w, h);
        g.strokeStyle = rgba(th.accent, 0.13 * a); g.lineWidth = 1;
        for (let i = 0; i <= 24; i++) { const an = Math.PI + (i / 24) * Math.PI; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); g.stroke(); }
        for (let k = 1; k <= 4; k++) { g.beginPath(); g.arc(cx, cy, u * 0.22 * k, Math.PI, 0); g.stroke(); }
        g.strokeStyle = rgba(th.accent, 0.35 * a); g.lineWidth = 1.5;
        const m = u * 0.04, L3 = u * 0.18;
        for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
          const x = sx > 0 ? m : w - m, y = sy > 0 ? m : h - m;
          g.beginPath(); g.moveTo(x, y + sy * L3); g.lineTo(x, y); g.lineTo(x + sx * L3, y); g.stroke();
          g.beginPath(); g.moveTo(x + sx * 6, y + sy * L3 * 0.6); g.lineTo(x + sx * 6, y + sy * 6); g.lineTo(x + sx * L3 * 0.6, y + sy * 6); g.stroke();
        }
        for (const p of P) {
          const k = Math.max(0, Math.sin(t * p.f + p.ph)), sz = 1.5 + k * 2;
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(t * 0.5 + p.ph);
          g.fillStyle = rgba('#f0d27a', (0.25 + 0.65 * k) * a); g.fillRect(-sz / 2, -sz / 2, sz, sz * (0.3 + 0.7 * Math.abs(Math.cos(t + p.ph))));
          g.restore();
        }
      },
    };
  },
  cranes(th) { // paper planes gliding over lined paper
    const mk = () => ({ x: rand(-0.3, 0), y: rand(0.05, 0.85), vx: rand(0.04, 0.08), vy: rand(-0.01, 0.015), s: rand(0.7, 1.4), ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0] });
    const P = [...Array(7)].map(() => { const p = mk(); p.x = Math.random(); return p; });
    let t = 0;
    return {
      step(dt) { t += dt; P.forEach((p, i) => { p.x += p.vx * dt; p.y += (p.vy + Math.sin(t * 0.8 + p.ph) * 0.01) * dt; if (p.x > 1.2) P[i] = mk(); }); },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        g.strokeStyle = `rgba(138,122,90,${0.1 * a})`; g.lineWidth = 1;
        for (let y = u * 0.05; y < h; y += u * 0.06) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.strokeStyle = `rgba(226,85,58,${0.15 * a})`; g.beginPath(); g.moveTo(u * 0.12, 0); g.lineTo(u * 0.12, h); g.stroke();
        for (const p of P) {
          const r = u * 0.05 * p.s, tilt = Math.sin(t * 0.8 + p.ph) * 0.15 - 0.1;
          g.save(); g.translate(p.x * w, p.y * h); g.rotate(tilt);
          poly(g, [[r, 0], [-r, -r * 0.45], [-r * 0.55, 0]], rgba(p.c, 0.55 * a));
          poly(g, [[r, 0], [-r * 0.55, 0], [-r * 0.85, r * 0.35]], rgba(p.c, 0.85 * a));
          poly(g, [[r, 0], [-r * 0.55, 0], [-r * 0.2, r * 0.12]], `rgba(0,0,0,${0.15 * a})`);
          g.restore();
        }
      },
    };
  },
  summer(th) { // sun rays, fruit slices floating, fizzy bubbles
    const P = [...Array(9)].map(() => ({ x: Math.random(), y: Math.random(), vy: rand(0.015, 0.035), rot: rand(0, 6.3), vr: rand(-0.4, 0.4), r: rand(0.04, 0.07), c: th.blocks[(Math.random() * 7) | 0] }));
    const B = [...Array(24)].map(() => ({ x: Math.random(), y: Math.random(), r: rand(0.003, 0.008), vy: rand(0.03, 0.08), ph: rand(0, 6.3) }));
    let t = 0;
    return {
      step(dt) {
        t += dt;
        for (const p of P) { p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y > 1.1) { p.y = -0.1; p.x = Math.random(); } }
        for (const b of B) { b.y -= b.vy * dt; b.ph += dt * 2; if (b.y < -0.02) { b.y = 1.02; b.x = Math.random(); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), len = Math.hypot(w, h);
        g.save(); g.translate(w, 0);
        for (let i = 0; i < 7; i++) {
          g.save(); g.rotate(Math.PI / 2 + 0.1 + i * 0.2 + Math.sin(t * 0.2) * 0.03);
          const gr = g.createLinearGradient(0, 0, len, 0); gr.addColorStop(0, `rgba(255,255,230,${0.35 * a})`); gr.addColorStop(1, 'rgba(255,255,230,0)');
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(len, -len * 0.04); g.lineTo(len, len * 0.04); g.fill();
          g.restore();
        }
        g.restore();
        for (const p of P) { g.save(); g.globalAlpha = 0.5 * a; fruitSlice(g, p.x * w, p.y * h, p.r * u, p.c, p.rot); g.restore(); }
        g.lineWidth = 1.2;
        for (const b of B) { g.beginPath(); g.arc((b.x + Math.sin(b.ph) * 0.008) * w, b.y * h, b.r * u, 0, Math.PI * 2); g.strokeStyle = `rgba(255,255,255,${0.6 * a})`; g.stroke(); }
      },
    };
  },
});

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
