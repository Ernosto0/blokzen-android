import { mixHex, rgba, shade } from '../../core/color.js';
import { KITS, Sfx } from '../../audio/sfx.js';
import { ctx } from '../../ui/dom.js';
import { state } from '../../core/state.js';
import { rand } from '../../core/util.js';
import { poly, rr, sparkle } from '../../render/sprites.js';
import { seeded, STYLES } from '../../render/blocks.js';
import { softGlint, speckle, TEX, texIn } from '../../render/textures.js';
import { AMBIENTS } from '../../render/backgrounds.js';
import { PARTS } from '../../render/render.js';

/* ---------- Daily collection: newspaper, tear-off calendar, tea garden, spice bazaar ---------- */
Object.assign(STYLES, {
  news: { // a colour panel printed on newsprint
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.06, s * 0.92, s * 0.9, s * 0.04); g.fillStyle = 'rgba(0,0,0,.18)'; g.fill();
      rr(g, s * 0.04, s * 0.03, s * 0.92, s * 0.9, s * 0.04); g.fillStyle = '#f4efe2'; g.fill();
      g.save(); rr(g, s * 0.1, s * 0.09, s * 0.8, s * 0.78, s * 0.02); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s);
      TEX.news(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
  leaflet: { // a tear-off calendar leaf: coloured header with binder holes, perforation, curled corner
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.07, s * 0.9, s * 0.88, s * 0.08); g.fillStyle = 'rgba(0,0,0,.28)'; g.fill();
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.08); g.fillStyle = mixHex(c, '#ffffff', 0.8); g.fill();
      g.save(); rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.88, s * 0.08); g.clip();
      g.fillStyle = c; g.fillRect(0, 0, s, s * 0.34);
      TEX.leaflet(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
  teaglass: { // tea in a glass: clear top, coloured brew, sugar at the bottom
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.14); g.fillStyle = mixHex(c, '#0a0604', 0.6); g.fill();
      g.save(); rr(g, s * 0.08, s * 0.06, s * 0.84, s * 0.86, s * 0.12); g.clip();
      g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(0, 0, s, s);
      const lg = g.createLinearGradient(0, s * 0.24, 0, s); lg.addColorStop(0, shade(c, 0.15)); lg.addColorStop(1, shade(c, -0.35));
      g.fillStyle = lg; g.fillRect(0, s * 0.25, s, s);
      TEX.teaglass(g, s, c, seeded(c), 1);
      g.restore();
      rr(g, s * 0.08, s * 0.06, s * 0.84, s * 0.86, s * 0.12); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = Math.max(1, s * 0.025); g.stroke();
    },
  },
  spice: { // a heap of ground spice in a brass bowl
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = shade(c, -0.6); g.fill();
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.1); g.fillStyle = shade(c, -0.3); g.fill();
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.1); g.clip();
      g.beginPath(); g.moveTo(-s * 0.02, s * 0.8); g.quadraticCurveTo(s * 0.5, -s * 0.12, s * 1.02, s * 0.8); g.lineTo(s, s); g.lineTo(0, s); g.closePath();
      const gr = g.createRadialGradient(s * 0.42, s * 0.34, s * 0.03, s * 0.5, s * 0.55, s * 0.6);
      gr.addColorStop(0, shade(c, 0.32)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.22));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); TEX.spice(g, s, c, seeded(c), 1); g.restore();
      const br = g.createLinearGradient(0, s * 0.74, 0, s); br.addColorStop(0, '#f0cc6a'); br.addColorStop(0.5, '#b8862c'); br.addColorStop(1, '#7a5418');
      g.fillStyle = br; g.fillRect(0, s * 0.76, s, s * 0.24);
      g.fillStyle = 'rgba(255,240,190,.6)'; g.fillRect(0, s * 0.76, s, Math.max(1, s * 0.025));
      g.restore();
    },
  },
});

Object.assign(TEX, {
  news(g, s, c, rnd, k) { // halftone dots growing toward one corner, a headline and a column of text
    const step = s / 9;
    g.save(); g.globalAlpha = 0.35 * k; g.fillStyle = shade(c, -0.5);
    for (let y = 0, row = 0; y < s + step; y += step, row++) for (let x = (row % 2) * step / 2; x < s + step; x += step) {
      g.beginPath(); g.arc(x, y, step * (0.08 + 0.32 * (x + y) / (2 * s)), 0, Math.PI * 2); g.fill();
    }
    g.restore();
    g.fillStyle = `rgba(20,18,14,${0.55 * k})`; g.fillRect(s * 0.16, s * 0.16, s * (0.42 + rnd() * 0.2), s * 0.08);
    g.fillStyle = `rgba(20,18,14,${0.28 * k})`;
    for (let i = 0; i < 4; i++) g.fillRect(s * 0.16, s * (0.34 + i * 0.12), s * (i === 3 ? 0.36 : 0.6 - rnd() * 0.1), Math.max(1, s * 0.035));
  },
  leaflet(g, s, c, rnd, k) { // binder holes, a perforated tear line, a couple of pencil notes, a curled corner
    g.fillStyle = `rgba(0,0,0,${0.38 * k})`;
    for (const x of [0.3, 0.7]) { g.beginPath(); g.arc(s * x, s * 0.15, s * 0.045, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = `rgba(255,255,255,${0.75 * k})`; g.lineWidth = Math.max(1, s * 0.022); g.setLineDash([s * 0.04, s * 0.035]);
    g.beginPath(); g.moveTo(0, s * 0.34); g.lineTo(s, s * 0.34); g.stroke(); g.setLineDash([]);
    g.fillStyle = `rgba(40,40,60,${0.16 * k})`;
    g.fillRect(s * 0.16, s * 0.5, s * (0.5 + rnd() * 0.15), Math.max(1, s * 0.03));
    g.fillRect(s * 0.16, s * 0.62, s * (0.3 + rnd() * 0.15), Math.max(1, s * 0.03));
    const q = s * 0.22;
    poly(g, [[s - q, s], [s, s - q], [s, s]], `rgba(0,0,0,${0.3 * k})`);
    poly(g, [[s - q, s], [s, s - q], [s - q * 0.95, s - q * 0.95]], `rgba(255,255,255,${0.6 * k})`);
  },
  teaglass(g, s, c, rnd, k) { // the surface of the tea, a glass shine, a waisted glass, sugar and bubbles
    g.fillStyle = `rgba(255,236,200,${0.55 * k})`; g.beginPath(); g.ellipse(s * 0.5, s * 0.26, s * 0.42, s * 0.045, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = `rgba(0,0,0,${0.2 * k})`;
    for (const x of [0, 1]) { g.beginPath(); g.ellipse(s * x, s * 0.6, s * 0.12, s * 0.26, 0, 0, Math.PI * 2); g.fill(); }
    const hl = g.createLinearGradient(s * 0.14, 0, s * 0.32, 0);
    hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(0.5, `rgba(255,255,255,${0.38 * k})`); hl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hl; g.fillRect(s * 0.14, s * 0.08, s * 0.18, s * 0.84);
    for (let i = 0; i < 3; i++) {
      g.save(); g.translate(s * (0.4 + rnd() * 0.3), s * (0.8 + rnd() * 0.06)); g.rotate(rnd() * 1.5);
      const q = s * 0.06; g.fillStyle = `rgba(255,252,245,${0.75 * k})`; g.fillRect(-q / 2, -q / 2, q, q); g.restore();
    }
    g.strokeStyle = `rgba(255,240,210,${0.5 * k})`; g.lineWidth = Math.max(0.8, s * 0.012);
    for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(s * (0.3 + rnd() * 0.45), s * (0.38 + rnd() * 0.35), Math.max(0.8, s * (0.012 + rnd() * 0.015)), 0, Math.PI * 2); g.stroke(); }
  },
  spice(g, s, c, rnd, k) { // fine grains, lighter and darker, a soft sheen on top
    speckle(g, s, rnd, 90, 0.004, 0.011, () => rnd() < 0.5 ? `rgba(255,236,190,${0.3 * k})` : `rgba(30,10,0,${0.3 * k})`);
    softGlint(g, s * 0.42, s * 0.3, s * 0.2, 0.3 * k);
  },
});

Object.assign(PARTS, {
  newsclip(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.2 + 0.8 * Math.abs(Math.sin(p.life * 6 + p.ph)));
    ctx.fillStyle = '#f4efe2'; ctx.fillRect(-s * 0.55, -s * 0.42, s * 1.1, s * 0.84);
    ctx.fillStyle = p.color; ctx.fillRect(-s * 0.45, -s * 0.32, s * 0.9, s * 0.2);
    ctx.fillStyle = 'rgba(30,28,24,.4)'; ctx.fillRect(-s * 0.45, 0, s * 0.8, s * 0.07); ctx.fillRect(-s * 0.45, s * 0.16, s * 0.6, s * 0.07);
  },
  leaflet(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(1, 0.2 + 0.8 * Math.abs(Math.sin(p.life * 5 + p.ph)));
    ctx.fillStyle = '#fdf8ee'; ctx.fillRect(-s * 0.5, -s * 0.55, s, s * 1.1);
    ctx.fillStyle = p.color; ctx.fillRect(-s * 0.5, -s * 0.55, s, s * 0.35);
  },
  sugar(p, s) {
    ctx.rotate(p.rot); rr(ctx, -s * 0.35, -s * 0.35, s * 0.7, s * 0.7, s * 0.08); ctx.fillStyle = '#fffaf0'; ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.1)'; ctx.fillRect(-s * 0.35, s * 0.15, s * 0.7, s * 0.2);
  },
  grain(p, s) {
    ctx.fillStyle = shade(p.color, 0.1);
    for (const [x, y, r] of [[0, 0, 0.22], [0.35, 0.2, 0.15], [-0.3, 0.25, 0.13], [0.1, -0.35, 0.12]]) { ctx.beginPath(); ctx.arc(x * s, y * s, Math.max(0.8, r * s), 0, Math.PI * 2); ctx.fill(); }
  },
});

Object.assign(AMBIENTS, {
  newsroom() { // column rules and a halftone corner on the page, a coffee ring, sheets of newspaper drifting down
    let page = null, sheet = null, pw = 0, ph = 0;
    const mkSheet = () => {
      const c = document.createElement('canvas'); c.width = 120; c.height = 160;
      const g = c.getContext('2d');
      g.fillStyle = '#fbf8f0'; g.fillRect(0, 0, 120, 160);
      g.fillStyle = '#2a2824'; g.fillRect(10, 10, 100, 14);
      g.fillRect(10, 30, 100, 2);
      g.fillStyle = '#c8321e'; g.fillRect(10, 38, 62, 9);
      g.fillStyle = 'rgba(42,40,36,.35)';
      for (let col = 0; col < 3; col++) for (let y = 54; y < 150; y += 6) g.fillRect(10 + col * 34, y, 30 - ((y * 7 + col * 13) % 9), 2);
      g.fillStyle = 'rgba(42,40,36,.18)'; g.fillRect(78, 38, 32, 30);
      return c;
    };
    const S2 = [...Array(7)].map(() => ({ x: Math.random(), y: Math.random(), rot: rand(-0.6, 0.6), vr: rand(-0.3, 0.3), v: rand(0.015, 0.035), ph: rand(0, 6.3), s: rand(0.7, 1.2) }));
    let t = 0;
    function build(w, h) {
      pw = w; ph = h; page = document.createElement('canvas'); page.width = Math.ceil(w); page.height = Math.ceil(h);
      const g = page.getContext('2d'), u = Math.min(w, h), cw = Math.max(70, w / 5);
      g.strokeStyle = 'rgba(40,36,30,.07)'; g.lineWidth = 1;
      for (let x = cw; x < w; x += cw) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      g.fillStyle = 'rgba(40,36,30,.07)';
      const st = u * 0.025;
      for (let y = 0; y < h * 0.4; y += st) for (let x = w * 0.55; x < w; x += st) { const r = st * 0.45 * (1 - y / (h * 0.4)) * ((x - w * 0.55) / (w * 0.45)); if (r > 0.4) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); } }
      g.strokeStyle = 'rgba(120,80,40,.16)'; g.lineWidth = u * 0.012;
      g.beginPath(); g.arc(w * 0.18, h * 0.82, u * 0.11, 0.3, Math.PI * 1.85); g.stroke();
      g.lineWidth = u * 0.004; g.beginPath(); g.arc(w * 0.18, h * 0.82, u * 0.095, 0, Math.PI * 2); g.stroke();
    }
    return {
      step(dt) { t += dt; for (const p of S2) { p.y += p.v * dt; p.rot += p.vr * dt; p.ph += dt; if (p.y > 1.15) { p.y = -0.15; p.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!page || Math.abs(w - pw) > 1 || Math.abs(h - ph) > 1) build(w, h);
        if (!sheet) sheet = mkSheet();
        g.globalAlpha = a; g.drawImage(page, 0, 0, w, h);
        const u = Math.min(w, h);
        for (const p of S2) {
          const sw = u * 0.16 * p.s, sh = sw * 4 / 3;
          g.save(); g.translate((p.x + Math.sin(t * 0.4 + p.ph) * 0.03) * w, p.y * h); g.rotate(p.rot); g.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(p.ph * 0.8)));
          g.globalAlpha = 0.5 * a; g.drawImage(sheet, -sw / 2, -sh / 2, sw, sh); g.restore();
        }
        g.globalAlpha = 1;
      },
    };
  },
  tearoff(th) { // a big faint month grid with today circled, leaves tearing off and fluttering down
    let grid2 = null, gw = 0, gh = 0, t = 0;
    const today = new Date(), first = new Date(today.getFullYear(), today.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7, day = today.getDate();
    const mk = init => ({ x: Math.random(), y: init ? Math.random() : -0.1, rot: rand(0, 6.3), vr: rand(-1.4, 1.4), v: rand(0.03, 0.06), ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0], s: rand(0.7, 1.2) });
    const LV = [...Array(14)].map(() => mk(true));
    let cell = { x: 0, y: 0, r: 0 };
    function build(w, h) {
      gw = w; gh = h; grid2 = document.createElement('canvas'); grid2.width = Math.ceil(w); grid2.height = Math.ceil(h);
      const g = grid2.getContext('2d'), cs = Math.min(w * 0.9 / 7, h * 0.7 / 6), ox = (w - cs * 7) / 2, oy = h * 0.14;
      g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 1.5;
      for (let i = 0; i < 42; i++) {
        const r = (i / 7) | 0, c = i % 7;
        g.strokeRect(ox + c * cs + 3, oy + r * cs + 3, cs - 6, cs - 6);
        const d = i - offset + 1;
        if (d >= 1 && d <= 31) { g.fillStyle = c >= 5 ? 'rgba(255,120,100,.14)' : 'rgba(255,255,255,.1)'; g.font = `700 ${cs * 0.26}px "Baloo 2", sans-serif`; g.fillText(String(d), ox + c * cs + cs * 0.14, oy + r * cs + cs * 0.36); }
        if (d === day) cell = { x: ox + c * cs + cs / 2, y: oy + r * cs + cs / 2, r: cs * 0.42 };
      }
    }
    return {
      step(dt) { t += dt; LV.forEach((l, i) => { l.y += l.v * dt; l.rot += l.vr * dt; l.ph += dt * 4; l.x += Math.sin(t + l.ph * 0.2) * 0.012 * dt; if (l.y > 1.1) LV[i] = mk(false); }); },
      draw(g, w, h, a) {
        if (!grid2 || Math.abs(w - gw) > 1 || Math.abs(h - gh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(grid2, 0, 0, w, h); g.globalAlpha = 1;
        if (cell.r) { g.beginPath(); g.arc(cell.x, cell.y, cell.r * (1 + 0.04 * Math.sin(t * 2)), 0, Math.PI * 2); g.strokeStyle = rgba(th.accent, 0.35 * a); g.lineWidth = 3; g.stroke(); }
        const u = Math.min(w, h);
        for (const l of LV) {
          const lw = u * 0.06 * l.s, lh = lw * 1.15;
          g.save(); g.translate(l.x * w, l.y * h); g.rotate(l.rot); g.scale(1, 0.25 + 0.75 * Math.abs(Math.sin(l.ph)));
          g.fillStyle = `rgba(253,248,238,${0.6 * a})`; g.fillRect(-lw / 2, -lh / 2, lw, lh);
          g.fillStyle = rgba(l.c, 0.7 * a); g.fillRect(-lw / 2, -lh / 2, lw, lh * 0.32);
          g.restore();
        }
      },
    };
  },
  bosphorus(th) { // the Istanbul skyline at sunrise over the water, a ferry crossing, gulls, steam from a tea glass
    let sky = null, sw = 0, sh = 0, t = 0, acc = 0, steam = [];
    const ferry = { x: -0.2, v: 0.02, puffs: [] };
    const GU = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.12, 0.38), v: rand(0.02, 0.04), ph: rand(0, 6.3) }));
    function build(w, h) {
      sw = w; sh = h; sky = document.createElement('canvas'); sky.width = Math.ceil(w); sky.height = Math.ceil(h * 0.2);
      const g = sky.getContext('2d'), H = sky.height, u = Math.min(w, h);
      g.fillStyle = 'rgba(16,26,40,.55)';
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, H * 0.7 - Math.sin(x * 0.004) * H * 0.18 - Math.sin(x * 0.013) * H * 0.06);
      g.lineTo(w, H); g.closePath(); g.fill();
      const dome = (x, r) => { // a dome with half domes and two minarets
        const base = H * 0.66;
        g.beginPath(); g.arc(x, base, r, Math.PI, 0); g.fill();
        g.beginPath(); g.arc(x - r * 1.1, base + r * 0.1, r * 0.55, Math.PI, 0); g.arc(x + r * 1.1, base + r * 0.1, r * 0.55, Math.PI, 0); g.fill();
        g.fillRect(x - r * 1.7, base, r * 3.4, H - base);
        for (const mx of [x - r * 2, x + r * 2]) { g.fillRect(mx - r * 0.07, base - r * 2.2, r * 0.14, r * 2.2 + H); g.beginPath(); g.moveTo(mx - r * 0.1, base - r * 2.2); g.lineTo(mx, base - r * 2.6); g.lineTo(mx + r * 0.1, base - r * 2.2); g.fill(); }
      };
      dome(w * 0.32, u * 0.05); dome(w * 0.7, u * 0.04);
      g.fillRect(w * 0.88, H * 0.3, u * 0.025, H); g.beginPath(); g.moveTo(w * 0.88 - u * 0.01, H * 0.3); g.lineTo(w * 0.88 + u * 0.0125, H * 0.18); g.lineTo(w * 0.88 + u * 0.035, H * 0.3); g.fill(); // a tower on the far hill
    }
    return {
      step(dt) {
        t += dt; acc += dt;
        ferry.x += ferry.v * dt; if (ferry.x > 1.25) ferry.x = -0.25;
        if (acc > 0.35) { acc = 0; ferry.puffs.push({ x: ferry.x, y: 0, life: 0 }); steam.push({ x: rand(0.42, 0.58), y: 1.02, life: 0, ph: rand(0, 6.3) }); }
        for (const p of ferry.puffs) p.life += dt / 3;
        ferry.puffs = ferry.puffs.filter(p => p.life < 1);
        for (const p of steam) { p.y -= 0.07 * dt; p.life += dt / 7; }
        steam = steam.filter(p => p.life < 1);
        for (const b of GU) { b.x += b.v * dt; b.ph += dt * 6; if (b.x > 1.1) { b.x = -0.1; b.y = rand(0.12, 0.38); } }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), hy = h * 0.82, sx = w * 0.82, sy = h * 0.3; // the shore sits low so the board does not hide it
        const sun = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.5);
        sun.addColorStop(0, `rgba(255,214,150,${0.45 * a})`); sun.addColorStop(1, 'rgba(255,214,150,0)');
        g.fillStyle = sun; g.fillRect(0, 0, w, h);
        g.beginPath(); g.arc(sx, sy, u * 0.06, 0, Math.PI * 2); g.fillStyle = `rgba(255,236,200,${0.7 * a})`; g.fill();
        if (!sky || Math.abs(w - sw) > 1 || Math.abs(h - sh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(sky, 0, hy - h * 0.2, w, h * 0.2); g.globalAlpha = 1;
        const sea = g.createLinearGradient(0, hy, 0, h); sea.addColorStop(0, `rgba(60,110,140,${0.5 * a})`); sea.addColorStop(1, `rgba(20,46,66,${0.6 * a})`);
        g.fillStyle = sea; g.fillRect(0, hy, w, h - hy);
        g.strokeStyle = `rgba(255,220,170,${0.3 * a})`; g.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) { const y = hy + (h - hy) * (0.12 + i * 0.15), len = u * (0.1 + i * 0.05), x0 = sx - len / 2 + Math.sin(t + i) * u * 0.02; g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + len, y); g.stroke(); }
        const fx = ferry.x * w, fy = hy + (h - hy) * 0.3, fs = u * 0.045;
        for (const p of ferry.puffs) { const r = fs * (0.25 + p.life * 0.8); g.beginPath(); g.arc(p.x * w + p.life * fs * 0.6, fy - fs * 0.9 - p.life * fs * 1.2, r, 0, Math.PI * 2); g.fillStyle = `rgba(230,230,235,${0.28 * (1 - p.life) * a})`; g.fill(); }
        g.fillStyle = `rgba(20,24,30,${0.85 * a})`; g.beginPath(); g.moveTo(fx - fs * 1.4, fy - fs * 0.2); g.lineTo(fx + fs * 1.5, fy - fs * 0.2); g.lineTo(fx + fs * 1.2, fy + fs * 0.25); g.lineTo(fx - fs * 1.2, fy + fs * 0.25); g.closePath(); g.fill();
        g.fillStyle = `rgba(245,242,235,${0.85 * a})`; g.fillRect(fx - fs, fy - fs * 0.6, fs * 2, fs * 0.4);
        g.fillStyle = `rgba(20,24,30,${0.85 * a})`; g.fillRect(fx - fs * 0.15, fy - fs * 0.95, fs * 0.22, fs * 0.36);
        g.strokeStyle = `rgba(20,30,40,${0.5 * a})`; g.lineWidth = 1.6;
        for (const b of GU) { const x = b.x * w, y = b.y * h, bs = u * 0.018, f = Math.sin(b.ph) * 0.5 + 0.5; g.beginPath(); g.moveTo(x - bs, y - bs * 0.3 * f); g.quadraticCurveTo(x - bs * 0.45, y - bs * 0.6 * f, x, y); g.quadraticCurveTo(x + bs * 0.45, y - bs * 0.6 * f, x + bs, y - bs * 0.3 * f); g.stroke(); }
        for (const p of steam) {
          const x = (p.x + Math.sin(p.y * 8 + t * 0.6 + p.ph) * 0.03) * w, y = p.y * h, r = u * (0.03 + p.life * 0.08), al = Math.sin(p.life * Math.PI) * 0.07 * a;
          const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,245,235,${al})`); gr.addColorStop(1, 'rgba(255,245,235,0)');
          g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
      },
    };
  },
  bazaar(th) { // striped stone arches, swaying mosaic lanterns, sacks of spice below, dust in the light
    let hall = null, hw = 0, hh = 0, t = 0;
    const LN = [0.14, 0.38, 0.62, 0.86].map((x, i) => ({ x, len: rand(0.1, 0.22), ph: rand(0, 6.3), c: th.blocks[[0, 5, 4, 6][i]] }));
    const DU = [...Array(36)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.012, -0.004), ph: rand(0, 6.3) }));
    function build(w, h) {
      hw = w; hh = h; hall = document.createElement('canvas'); hall.width = Math.ceil(w); hall.height = Math.ceil(h);
      const g = hall.getContext('2d'), u = Math.min(w, h), aw = Math.max(90, w / 3.2);
      for (let x = 0; x < w + aw; x += aw) { // striped arches
        for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(x, h * 0.32, aw * 0.5 - k * 5, Math.PI, Math.PI * 2); g.strokeStyle = k % 2 ? 'rgba(240,200,140,.07)' : 'rgba(150,60,30,.1)'; g.lineWidth = 5; g.stroke(); }
        g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x - aw * 0.06, h * 0.32, aw * 0.12, h);
      }
      const sy = h * 0.88;
      for (let i = 0; i < 9; i++) { // spice sacks along the floor
        const x = (i + 0.5) / 9 * w, r = u * rand(0.06, 0.08), c = th.blocks[i % 7];
        g.fillStyle = 'rgba(140,100,60,.4)'; rr(g, x - r, sy - r * 0.5, r * 2, h - sy + r, r * 0.4); g.fill();
        g.beginPath(); g.ellipse(x, sy - r * 0.45, r * 0.95, r * 0.5, 0, Math.PI, 0); g.fillStyle = rgba(c, 0.55); g.fill();
        g.fillStyle = 'rgba(90,60,30,.5)'; g.fillRect(x - r, sy - r * 0.5, r * 2, r * 0.12);
      }
    }
    return {
      step(dt) { t += dt; for (const d of DU) { d.y += d.v * dt; d.x += Math.sin(t * 0.5 + d.ph) * 0.004 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!hall || Math.abs(w - hw) > 1 || Math.abs(h - hh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(hall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        g.save(); g.translate(w * 0.9, 0); g.rotate(0.5);
        const beam = g.createLinearGradient(0, 0, 0, h * 1.2); beam.addColorStop(0, `rgba(255,210,140,${0.14 * a})`); beam.addColorStop(1, 'rgba(255,210,140,0)');
        g.fillStyle = beam; g.fillRect(-w * 0.12, 0, w * 0.24, h * 1.3); g.restore();
        for (const l of LN) {
          const sw = Math.sin(t * 0.8 + l.ph) * 0.08, x0 = l.x * w, L = l.len * h, x = x0 + Math.sin(sw) * L, y = Math.cos(sw) * L, r = u * 0.04;
          g.strokeStyle = `rgba(200,160,90,${0.5 * a})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x, y); g.stroke();
          const gl = g.createRadialGradient(x, y + r, 0, x, y + r, r * 4); gl.addColorStop(0, rgba(l.c, 0.35 * a)); gl.addColorStop(1, rgba(l.c, 0));
          g.fillStyle = gl; g.fillRect(x - r * 4, y + r - r * 4, r * 8, r * 8);
          g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + r * 1.1, y + r, x, y + r * 2.2); g.quadraticCurveTo(x - r * 1.1, y + r, x, y); g.fillStyle = rgba(l.c, 0.75 * a); g.fill();
          g.strokeStyle = `rgba(255,220,150,${0.6 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x - r * 0.75, y + r); g.lineTo(x + r * 0.75, y + r); g.stroke();
          g.fillStyle = `rgba(210,170,90,${0.8 * a})`; g.fillRect(x - r * 0.25, y + r * 2.15, r * 0.5, r * 0.25);
        }
        for (const d of DU) { const k = 0.5 + 0.5 * Math.sin(t * 2 + d.ph); g.fillStyle = `rgba(255,214,150,${(0.15 + 0.35 * k) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
});

Object.assign(KITS, (S => ({
  news: { // typewriter keys and a carriage bell, pages turning
    pick() { S.rustle({ vol: 0.04, dur: 0.05 }); },
    place() { S.knock(1500, { vol: 0.12 }); S.hiss({ dur: 0.03, vol: 0.08, type: 'highpass', freq: 3000 }); S.thud({ vol: 0.12, f: 140 }); },
    clear(n) {
      for (let i = 0; i < n + 3; i++) { S.knock(rand(1300, 1700), { when: i * 0.065, vol: 0.1 }); S.hiss({ dur: 0.02, vol: 0.05, type: 'highpass', freq: 3500, when: i * 0.065 }); }
      S.tink(2640, { when: (n + 3) * 0.065 + 0.05, vol: 0.09, dur: 0.6 });
    },
    deal() { S.hissL({ dur: 0.35, vol: 0.05, type: 'bandpass', freq: 1200, to: 3000, q: 0.7 }); },
  },
  calendar: { // a leaf torn off, several in a row on a clear
    pick() { S.hiss({ dur: 0.03, vol: 0.05, type: 'bandpass', freq: 2500, q: 1.5 }); },
    place() { S.hiss({ dur: 0.13, vol: 0.12, type: 'bandpass', freq: 1400, to: 4200, q: 2.2 }); S.thud({ vol: 0.14, f: 150 }); },
    clear(n) {
      for (let i = 0; i < Math.min(n + 1, 5); i++) S.hiss({ dur: 0.11, vol: 0.1, type: 'bandpass', freq: 1200 + i * 200, to: 4500, q: 2, when: i * 0.09 });
      S.rustle({ vol: 0.07, dur: 0.35, when: 0.2 });
    },
    deal() { S.rustle({ vol: 0.05, dur: 0.12 }); S.knock(1400, { vol: 0.04, when: 0.08 }); },
  },
  tea: { // spoon on glass, stirring, tea being poured, a ferry horn
    pick() { S.tink(3200, { vol: 0.04, dur: 0.08 }); },
    place() { S.thud({ vol: 0.16, f: 170 }); S.tink(rand(2300, 2600), { vol: 0.09, dur: 0.25 }); },
    clear(n) {
      for (let i = 0; i < n + 3; i++) S.tink(i % 2 ? 2900 : 2600, { when: i * 0.08, vol: 0.06, dur: 0.18 });
      S.tone(150, { type: 'triangle', dur: 0.9, vol: 0.07, when: 0.35, attack: 0.05, wet: true });
      S.tone(151.5, { type: 'triangle', dur: 0.9, vol: 0.05, when: 0.35, attack: 0.05 });
    },
    deal() { S.hissL({ dur: 0.35, vol: 0.05, type: 'lowpass', freq: 900, to: 400, q: 2 }); },
  },
  spice: { // grains poured from a scoop, brass scale pans, a darbuka "doum tek"
    pick() { S.hiss({ dur: 0.04, vol: 0.05, type: 'bandpass', freq: 3200, q: 2 }); },
    place() { S.hissL({ dur: 0.22, vol: 0.08, type: 'bandpass', freq: 2600, to: 1200, q: 1.2 }); S.thud({ vol: 0.2, f: 120 }); },
    clear(n) {
      S.tone(110, { dur: 0.25, vol: 0.28, to: 70 }); S.knock(1800, { vol: 0.12, when: 0.18 }); S.knock(1800, { vol: 0.1, when: 0.3 });
      if (n > 1) { S.tone(110, { dur: 0.2, vol: 0.22, to: 70, when: 0.45 }); S.knock(1800, { vol: 0.1, when: 0.6 }); }
      S.tink(1250, { vol: 0.07, when: 0.05, dur: 0.5 }); S.tink(1580, { vol: 0.05, when: 0.1, dur: 0.4 });
      S.hissL({ dur: 0.7, vol: 0.06, type: 'bandpass', freq: 3000, to: 1500, q: 1, when: 0.05 });
    },
    deal() { S.rustle({ vol: 0.05, dur: 0.15 }); },
  },
}))(Sfx));

/* ---------- Daily collection, part 2: desert hourglass, letters, picnic, midnight library ---------- */
Object.assign(STYLES, {
  dune: { // wind-rippled sand
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.16); g.fillStyle = shade(c, -0.42); g.fill();
      const gr = g.createLinearGradient(0, 0, s * 0.3, s); gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, shade(c, -0.12));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.84, s * 0.14); g.fillStyle = gr; g.fill();
      texIn(g, s, c, 'dune', 1, 0.06, 0.14);
    },
  },
  envelope: { // a cream envelope closed with a wax seal in the block colour
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.08, s * 0.92, s * 0.86, s * 0.06); g.fillStyle = 'rgba(0,0,0,.3)'; g.fill();
      rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.86, s * 0.06); g.fillStyle = mixHex(c, '#f6ecd8', 0.84); g.fill();
      g.save(); rr(g, s * 0.04, s * 0.05, s * 0.92, s * 0.86, s * 0.06); g.clip(); TEX.envelope(g, s, c, seeded(c), 1); g.restore();
    },
  },
  gingham: { // checked picnic cloth with stitched edges
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.07, s * 0.92, s * 0.9, s * 0.1); g.fillStyle = 'rgba(0,0,0,.16)'; g.fill();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.88, s * 0.1); g.fillStyle = mixHex(c, '#ffffff', 0.62); g.fill();
      g.save(); rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.88, s * 0.1); g.clip(); TEX.gingham(g, s, c, seeded(c), 1); g.restore();
      rr(g, s * 0.1, s * 0.1, s * 0.8, s * 0.76, s * 0.06);
      g.setLineDash([s * 0.05, s * 0.04]); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = Math.max(1, s * 0.022); g.stroke(); g.setLineDash([]);
    },
  },
  book: { // a leather-bound spine with gold bands and a title plate
    block(g, s, c) {
      rr(g, s * 0.05, s * 0.04, s * 0.9, s * 0.92, s * 0.08); g.fillStyle = shade(c, -0.55); g.fill();
      const lg = g.createLinearGradient(0, 0, s, 0);
      lg.addColorStop(0, shade(c, -0.28)); lg.addColorStop(0.3, shade(c, 0.12)); lg.addColorStop(0.7, c); lg.addColorStop(1, shade(c, -0.32));
      rr(g, s * 0.07, s * 0.05, s * 0.86, s * 0.86, s * 0.07); g.fillStyle = lg; g.fill();
      texIn(g, s, c, 'book', 1, 0.07, 0.07);
    },
  },
});

Object.assign(TEX, {
  dune(g, s, c, rnd, k) { // ripples with a lit crest and a shaded trough, loose grains
    g.lineCap = 'round';
    const ph = rnd() * 6.3;
    for (let i = 0; i < 6; i++) {
      const y0 = s * (0.12 + i * 0.16);
      const path = () => { g.beginPath(); for (let j = 0; j <= 12; j++) { const x = j * s / 12, y = y0 + Math.sin(x / s * 7 + ph + i * 0.7) * s * 0.035; j ? g.lineTo(x, y) : g.moveTo(x, y); } };
      path(); g.strokeStyle = `rgba(90,40,10,${0.22 * k})`; g.lineWidth = Math.max(1, s * 0.028); g.stroke();
      g.save(); g.translate(0, -s * 0.022); path(); g.strokeStyle = `rgba(255,240,200,${0.3 * k})`; g.lineWidth = Math.max(1, s * 0.018); g.stroke(); g.restore();
    }
    speckle(g, s, rnd, 40, 0.003, 0.008, () => rnd() < 0.5 ? `rgba(255,240,200,${0.3 * k})` : `rgba(80,40,10,${0.25 * k})`);
  },
  envelope(g, s, c, rnd, k) { // the folds of the envelope and a round wax seal with a pressed flower
    g.lineWidth = Math.max(1, s * 0.02); g.lineJoin = 'round';
    g.strokeStyle = `rgba(110,80,50,${0.38 * k})`;
    g.beginPath(); g.moveTo(0, s * 0.06); g.lineTo(s * 0.5, s * 0.52); g.lineTo(s, s * 0.06); g.stroke();
    g.strokeStyle = `rgba(110,80,50,${0.2 * k})`;
    g.beginPath(); g.moveTo(0, s * 0.95); g.lineTo(s * 0.4, s * 0.58); g.moveTo(s, s * 0.95); g.lineTo(s * 0.6, s * 0.58); g.stroke();
    const cx = s * 0.5, cy = s * 0.52, r = s * 0.17, wax = shade(c, -0.12);
    g.fillStyle = wax;
    for (let i = 0; i < 7; i++) { const an = i / 7 * Math.PI * 2 + rnd() * 0.4; g.beginPath(); g.arc(cx + Math.cos(an) * r * 0.95, cy + Math.sin(an) * r * 0.95, r * (0.22 + rnd() * 0.12), 0, Math.PI * 2); g.fill(); }
    const gr = g.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx, cy, r * 1.1); gr.addColorStop(0, shade(c, 0.3)); gr.addColorStop(1, shade(c, -0.25));
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    g.beginPath(); g.arc(cx, cy, r * 0.72, 0, Math.PI * 2); g.strokeStyle = shade(c, -0.4); g.lineWidth = Math.max(1, s * 0.015); g.stroke();
    g.fillStyle = shade(c, 0.35);
    for (let i = 0; i < 5; i++) { const an = i / 5 * Math.PI * 2; g.beginPath(); g.arc(cx + Math.cos(an) * r * 0.3, cy + Math.sin(an) * r * 0.3, r * 0.16, 0, Math.PI * 2); g.fill(); }
  },
  gingham(g, s, c, rnd, k) { // overlapping stripes make the checks; a fine weave on top
    const b = s / 8, dk = shade(c, -0.2);
    g.save(); g.globalAlpha = 0.5 * k; g.fillStyle = dk;
    for (let i = 0; i < 4; i++) { g.fillRect(i * s / 4 + b / 2, 0, b, s); g.fillRect(0, i * s / 4 + b / 2, s, b); }
    g.restore();
    g.strokeStyle = `rgba(255,255,255,${0.12 * k})`; g.lineWidth = 1;
    for (let x = 0; x < s; x += Math.max(2, s / 24)) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, s); g.stroke(); }
  },
  book(g, s, c, rnd, k) { // grained leather, gold bands and a dark title plate
    speckle(g, s, rnd, 40, 0.004, 0.01, () => rnd() < 0.5 ? `rgba(0,0,0,${0.18 * k})` : `rgba(255,240,220,${0.1 * k})`);
    g.fillStyle = `rgba(240,200,110,${0.85 * k})`;
    for (const y of [0.12, 0.17, 0.79, 0.84]) g.fillRect(0, s * y, s, Math.max(1, s * 0.025));
    rr(g, s * 0.24, s * 0.36, s * 0.52, s * 0.26, s * 0.03); g.fillStyle = `rgba(20,10,0,${0.4 * k})`; g.fill();
    g.strokeStyle = `rgba(240,200,110,${0.8 * k})`; g.lineWidth = Math.max(1, s * 0.015); g.stroke();
    g.fillStyle = `rgba(240,200,110,${0.75 * k})`;
    g.fillRect(s * 0.32, s * 0.44, s * 0.36, Math.max(1, s * 0.03)); g.fillRect(s * 0.38, s * 0.52, s * 0.24, Math.max(1, s * 0.025));
  },
});

Object.assign(PARTS, {
  envelope(p, s) {
    ctx.rotate(p.rot * 0.4); ctx.scale(1, 0.3 + 0.7 * Math.abs(Math.sin(p.life * 4 + p.ph)));
    ctx.fillStyle = '#f6ecd8'; ctx.fillRect(-s * 0.55, -s * 0.38, s * 1.1, s * 0.76);
    ctx.strokeStyle = 'rgba(110,80,50,.5)'; ctx.lineWidth = Math.max(1, s * 0.06);
    ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.38); ctx.lineTo(0, s * 0.05); ctx.lineTo(s * 0.55, -s * 0.38); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, s * 0.05, s * 0.14, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
  },
  page(p, s) {
    ctx.rotate(p.rot * 0.5); ctx.scale(0.25 + 0.75 * Math.abs(Math.sin(p.life * 5 + p.ph)), 1);
    ctx.fillStyle = '#f6ead2'; ctx.fillRect(-s * 0.4, -s * 0.55, s * 0.8, s * 1.1);
    ctx.fillStyle = 'rgba(80,60,40,.35)'; for (let i = 0; i < 4; i++) ctx.fillRect(-s * 0.28, -s * 0.36 + i * s * 0.22, s * 0.56, Math.max(1, s * 0.06));
  },
});

Object.assign(AMBIENTS, {
  hourglass(th) { // layered dunes at sunset, wind-blown sand, an hourglass slowly running out
    let land = null, lw = 0, lh = 0, t = 0;
    const WI = [...Array(50)].map(() => ({ x: Math.random(), y: rand(0.35, 1), v: rand(0.08, 0.2), l: rand(0.01, 0.03) }));
    function build(w, h) {
      lw = w; lh = h; land = document.createElement('canvas'); land.width = Math.ceil(w); land.height = Math.ceil(h);
      const g = land.getContext('2d');
      [[0.66, 'rgba(230,160,90,.18)', 0.004, 0.05], [0.76, 'rgba(200,120,60,.26)', 0.006, 0.06], [0.87, 'rgba(140,76,36,.4)', 0.009, 0.05]].forEach(([y0, col, f, amp], i) => {
        g.beginPath(); g.moveTo(0, h);
        for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, h * y0 - Math.abs(Math.sin(x * f + i * 2)) * h * amp);
        g.lineTo(w, h); g.closePath(); g.fillStyle = col; g.fill();
      });
    }
    return {
      step(dt) { t += dt; for (const p of WI) { p.x += p.v * dt; if (p.x > 1.05) { p.x = -0.05; p.y = rand(0.35, 1); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), sx = w * 0.7, sy = h * 0.66;
        const gl = g.createRadialGradient(sx, sy, 0, sx, sy, u * 0.5); gl.addColorStop(0, rgba(th.accent, 0.4 * a)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(0, 0, w, h);
        g.beginPath(); g.arc(sx, sy, u * 0.13, 0, Math.PI * 2); g.fillStyle = `rgba(255,200,120,${0.55 * a})`; g.fill();
        if (!land || Math.abs(w - lw) > 1 || Math.abs(h - lh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(land, 0, 0, w, h); g.globalAlpha = 1;
        g.strokeStyle = `rgba(255,224,170,${0.25 * a})`; g.lineWidth = 1; g.beginPath();
        for (const p of WI) { const x = p.x * w, y = p.y * h + Math.sin(t * 2 + p.y * 30) * 2; g.moveTo(x, y); g.lineTo(x - p.l * w, y + 1); }
        g.stroke();
        const hx = w * 0.1, hy = h * 0.86, hs = u * 0.085, f = (t % 45) / 45, hw = y => hs * (0.06 + 0.49 * Math.abs(y - hy) / hs);
        const y1 = hy - hs * 0.85 * (1 - f);
        if (f < 1) poly(g, [[hx - hw(y1), y1], [hx + hw(y1), y1], [hx + hs * 0.06, hy], [hx - hs * 0.06, hy]], `rgba(240,190,110,${0.7 * a})`);
        const yb = hy + hs - hs * 0.8 * f;
        poly(g, [[hx - hs * 0.55, hy + hs], [hx + hs * 0.55, hy + hs], [hx + hw(yb) * 0.9, yb], [hx - hw(yb) * 0.9, yb]], `rgba(240,190,110,${0.7 * a})`);
        g.strokeStyle = `rgba(240,190,110,${0.7 * a})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx, yb); g.stroke();
        g.strokeStyle = `rgba(255,236,200,${0.55 * a})`; g.lineWidth = 2;
        g.beginPath(); g.moveTo(hx - hs * 0.55, hy - hs); g.lineTo(hx + hs * 0.55, hy - hs); g.lineTo(hx + hs * 0.06, hy); g.lineTo(hx + hs * 0.55, hy + hs); g.lineTo(hx - hs * 0.55, hy + hs); g.lineTo(hx - hs * 0.06, hy); g.closePath(); g.stroke();
        g.fillStyle = `rgba(110,62,26,${0.9 * a})`; g.fillRect(hx - hs * 0.72, hy - hs - hs * 0.14, hs * 1.44, hs * 0.14); g.fillRect(hx - hs * 0.72, hy + hs, hs * 1.44, hs * 0.14);
      },
    };
  },
  post(th) { // postmarks and stamps on the desk, envelopes gliding across
    let desk = null, dw = 0, dh = 0, t = 0;
    const mk = init => ({ x: init ? Math.random() : -0.15, y: rand(0.08, 0.92), v: rand(0.025, 0.05), s: rand(0.7, 1.3), ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0] });
    const E = [...Array(6)].map(() => mk(true));
    function build(w, h) {
      dw = w; dh = h; desk = document.createElement('canvas'); desk.width = Math.ceil(w); desk.height = Math.ceil(h);
      const g = desk.getContext('2d'), u = Math.min(w, h);
      for (let i = 0; i < 5; i++) { // round postmarks with wavy cancellation lines
        const x = Math.random() * w, y = Math.random() * h, r = u * rand(0.08, 0.12);
        g.strokeStyle = 'rgba(200,210,235,.08)'; g.lineWidth = 2;
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(x, y, r * 0.75, 0, Math.PI * 2); g.stroke();
        for (let k = 0; k < 4; k++) { g.beginPath(); for (let j = 0; j <= 20; j++) { const xx = x + r * 1.2 + j * u * 0.02, yy = y - r * 0.5 + k * r * 0.33 + Math.sin(j * 0.9) * u * 0.008; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
      }
      for (let i = 0; i < 6; i++) { // perforated stamp outlines
        const x = Math.random() * w, y = Math.random() * h, sw = u * 0.08, sh2 = u * 0.1;
        g.setLineDash([3, 3]); g.strokeStyle = 'rgba(232,90,74,.12)'; g.strokeRect(x, y, sw, sh2); g.setLineDash([]);
        g.fillStyle = 'rgba(232,90,74,.06)'; g.fillRect(x + 4, y + 4, sw - 8, sh2 - 8);
      }
    }
    return {
      step(dt) { t += dt; E.forEach((e, i) => { e.x += e.v * dt; if (e.x > 1.2) E[i] = mk(false); }); },
      draw(g, w, h, a) {
        if (!desk || Math.abs(w - dw) > 1 || Math.abs(h - dh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(desk, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const e of E) {
          const ew = u * 0.1 * e.s, eh = ew * 0.66, x = e.x * w, y = e.y * h + Math.sin(t * 1.2 + e.ph) * u * 0.015;
          g.save(); g.translate(x, y); g.rotate(Math.sin(t * 0.8 + e.ph) * 0.12);
          g.fillStyle = `rgba(246,236,216,${0.5 * a})`; g.fillRect(-ew / 2, -eh / 2, ew, eh);
          g.strokeStyle = `rgba(110,80,50,${0.4 * a})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-ew / 2, -eh / 2); g.lineTo(0, eh * 0.1); g.lineTo(ew / 2, -eh / 2); g.stroke();
          g.beginPath(); g.arc(0, eh * 0.1, ew * 0.1, 0, Math.PI * 2); g.fillStyle = rgba(e.c, 0.7 * a); g.fill();
          g.restore();
        }
      },
    };
  },
  park(th) { // drifting clouds, kites on long strings, butterflies, swaying grass and a line of ants
    let t = 0;
    const CL = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.05, 0.4), s: rand(0.7, 1.3), v: rand(0.006, 0.014) }));
    const KI = [0, 1].map(i => ({ x: i ? 0.8 : 0.22, y: i ? 0.14 : 0.24, c: th.blocks[i ? 4 : 0], c2: th.blocks[i ? 2 : 5], ph: rand(0, 6.3) }));
    const BF = [...Array(4)].map(() => ({ x: Math.random(), y: rand(0.3, 0.9), vx: 0, vy: 0, ph: rand(0, 6.3), c: th.blocks[(Math.random() * 7) | 0] }));
    const GR = [...Array(70)].map(() => ({ x: Math.random(), h: rand(0.03, 0.07), ph: rand(0, 6.3) }));
    return {
      step(dt) {
        t += dt;
        for (const c of CL) { c.x += c.v * dt; if (c.x > 1.3) c.x = -0.3; }
        const damp = Math.pow(0.5, dt);
        for (const b of BF) {
          b.vx = (b.vx + (Math.random() - 0.5) * 0.4 * dt) * damp; b.vy = (b.vy + (Math.random() - 0.5) * 0.4 * dt) * damp;
          b.x += b.vx * dt; b.y += b.vy * dt; b.ph += dt * 18;
          if (b.x < -0.05) b.x = 1.05; if (b.x > 1.05) b.x = -0.05; if (b.y < 0.2) b.vy += 0.05 * dt; if (b.y > 0.95) b.vy -= 0.05 * dt;
        }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const c of CL) {
          const cx = c.x * w, cy = c.y * h, r = u * 0.05 * c.s;
          g.beginPath(); for (const [dx, dy, q] of [[-1.2, 0.2, 0.8], [0, -0.2, 1.1], [1.2, 0.2, 0.8], [0.5, 0.3, 0.9], [-0.5, 0.3, 0.9]]) { g.moveTo(cx + dx * r + q * r, cy + dy * r); g.arc(cx + dx * r, cy + dy * r, q * r, 0, Math.PI * 2); }
          g.fillStyle = `rgba(255,255,255,${0.7 * a})`; g.fill();
        }
        for (const k of KI) {
          const x = k.x * w + Math.sin(t * 0.7 + k.ph) * u * 0.03, y = k.y * h + Math.cos(t * 0.9 + k.ph) * u * 0.02, r = u * 0.05, tilt = Math.sin(t * 0.8 + k.ph) * 0.2;
          g.strokeStyle = `rgba(60,60,60,${0.3 * a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + r); g.quadraticCurveTo(x + u * 0.1, h * 0.6, k.x * w - u * 0.05, h * 1.02); g.stroke();
          g.save(); g.translate(x, y); g.rotate(tilt);
          poly(g, [[0, -r], [r * 0.7, 0], [0, r * 1.2], [-r * 0.7, 0]], rgba(k.c, 0.85 * a));
          poly(g, [[0, -r], [r * 0.7, 0], [0, 0]], rgba(k.c2, 0.85 * a)); poly(g, [[0, r * 1.2], [-r * 0.7, 0], [0, 0]], rgba(k.c2, 0.85 * a));
          g.strokeStyle = `rgba(80,60,60,${0.5 * a})`; g.beginPath(); g.moveTo(0, r * 1.2);
          for (let i = 1; i <= 6; i++) g.lineTo(Math.sin(t * 3 + i + k.ph) * r * 0.3, r * 1.2 + i * r * 0.35); g.stroke();
          for (let i = 1; i <= 3; i++) { g.fillStyle = rgba(i % 2 ? k.c : k.c2, 0.8 * a); g.fillRect(Math.sin(t * 3 + i * 2 + k.ph) * r * 0.3 - 3, r * 1.2 + i * 2 * r * 0.35 - 2, 6, 4); }
          g.restore();
        }
        for (const b of BF) {
          const x = b.x * w, y = b.y * h, bs = u * 0.016, f = 0.25 + 0.75 * Math.abs(Math.sin(b.ph));
          g.fillStyle = rgba(b.c, 0.8 * a);
          for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(x + sd * bs * 0.6 * f, y - bs * 0.2, bs * 0.65 * f, bs * 0.8, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x + sd * bs * 0.45 * f, y + bs * 0.45, bs * 0.45 * f, bs * 0.5, 0, 0, Math.PI * 2); g.fill(); }
          g.fillStyle = `rgba(40,30,20,${0.8 * a})`; g.fillRect(x - 1, y - bs * 0.7, 2, bs * 1.4);
        }
        g.strokeStyle = `rgba(60,120,40,${0.55 * a})`; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath();
        for (const b of GR) { const x = b.x * w, hh = b.h * h, sw = Math.sin(t * 1.4 + b.ph) * hh * 0.25; g.moveTo(x, h); g.quadraticCurveTo(x, h - hh * 0.6, x + sw, h - hh); }
        g.stroke(); g.lineCap = 'butt';
        g.fillStyle = `rgba(40,25,15,${0.7 * a})`;
        const ay = h * 0.985, sp = u * 0.025, off = (t * u * 0.03) % sp;
        for (let x = -sp + off; x < w * 0.45; x += sp) { const bob = Math.sin(x * 0.3 + t * 8) * 0.8; g.fillRect(x, ay + bob, 3, 2); g.fillRect(x + 3.5, ay + bob, 2.5, 2); }
      },
    };
  },
  library(th) { // full bookshelves, two flickering candles, dust in the air
    let shelves = null, sw = 0, sh = 0, t = 0;
    const DU = [...Array(30)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.01, -0.003), ph: rand(0, 6.3) }));
    function build(w, h) {
      sw = w; sh = h; shelves = document.createElement('canvas'); shelves.width = Math.ceil(w); shelves.height = Math.ceil(h);
      const g = shelves.getContext('2d'), u = Math.min(w, h), rowH = u * 0.22;
      for (let y = rowH * 0.15; y < h; y += rowH) {
        for (let x = 0; x < w;) {
          const bw = u * rand(0.025, 0.05), bh = rowH * rand(0.6, 0.86), c = th.blocks[(Math.random() * 7) | 0];
          if (Math.random() < 0.08) { x += bw * 1.5; continue; } // a gap on the shelf
          g.fillStyle = rgba(c, 0.22); g.fillRect(x, y + rowH - bh - rowH * 0.08, bw - 1.5, bh);
          g.fillStyle = 'rgba(240,200,110,.12)'; g.fillRect(x, y + rowH - bh - rowH * 0.08 + bh * 0.12, bw - 1.5, 2); g.fillRect(x, y + rowH - rowH * 0.08 - bh * 0.15, bw - 1.5, 2);
          x += bw;
        }
        g.fillStyle = 'rgba(90,56,30,.5)'; g.fillRect(0, y + rowH - rowH * 0.08, w, rowH * 0.07);
      }
      const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
    }
    return {
      step(dt) { t += dt; for (const d of DU) { d.y += d.v * dt; d.x += Math.sin(t * 0.4 + d.ph) * 0.003 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!shelves || Math.abs(w - sw) > 1 || Math.abs(h - sh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(shelves, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        for (const cx of [0.08, 0.92]) {
          const x = cx * w, y = h * 0.9, fl = 0.85 + 0.15 * Math.sin(t * 11 + cx * 7) * Math.sin(t * 6.3 + cx), R = u * 0.4 * fl;
          const gl = g.createRadialGradient(x, y - u * 0.1, 0, x, y - u * 0.1, R); gl.addColorStop(0, rgba(th.accent, 0.3 * a)); gl.addColorStop(1, rgba(th.accent, 0));
          g.fillStyle = gl; g.fillRect(x - R, y - u * 0.1 - R, 2 * R, 2 * R);
          g.fillStyle = `rgba(240,228,200,${0.85 * a})`; g.fillRect(x - u * 0.014, y - u * 0.08, u * 0.028, u * 0.12);
          g.fillStyle = `rgba(160,120,60,${0.9 * a})`; g.fillRect(x - u * 0.03, y + u * 0.04, u * 0.06, u * 0.012);
          const fh = u * 0.04 * fl;
          g.beginPath(); g.moveTo(x, y - u * 0.08 - fh); g.quadraticCurveTo(x + u * 0.012, y - u * 0.08 - fh * 0.3, x, y - u * 0.078); g.quadraticCurveTo(x - u * 0.012, y - u * 0.08 - fh * 0.3, x, y - u * 0.08 - fh);
          g.fillStyle = `rgba(255,200,100,${0.95 * a})`; g.fill();
        }
        for (const d of DU) { const k = 0.5 + 0.5 * Math.sin(t * 1.5 + d.ph); g.fillStyle = `rgba(255,220,170,${(0.12 + 0.3 * k) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
});

Object.assign(KITS, (S => {
  const chirp = (when, vol = 0.04) => { S.tone(2600, { dur: 0.05, vol, to: 3600, when }); S.tone(3000, { dur: 0.05, vol: vol * 0.8, to: 3900, when: when + 0.07 }); };
  return {
    sand: { // sand poured and blown by the wind
      pick() { S.hiss({ dur: 0.05, vol: 0.04, type: 'lowpass', freq: 2500 }); },
      place() { S.hissL({ dur: 0.22, vol: 0.08, type: 'lowpass', freq: 1600, to: 600, q: 1 }); S.thud({ vol: 0.16, f: 110 }); },
      clear(n) { S.hissL({ dur: 0.9 + n * 0.1, vol: 0.09, type: 'bandpass', freq: 400, to: 1400, q: 0.6 }); S.hissL({ dur: 0.6, vol: 0.05, type: 'highpass', freq: 5000, when: 0.15 }); },
      deal() { S.hissL({ dur: 0.3, vol: 0.04, type: 'lowpass', freq: 2200, to: 900 }); },
    },
    letter: { // envelopes sliding, a wax stamp pressed, a little post bell
      pick() { S.hiss({ dur: 0.06, vol: 0.05, type: 'bandpass', freq: 2200, to: 1200, q: 1 }); },
      place() { S.thud({ vol: 0.28, f: 95 }); S.knock(600, { vol: 0.12, when: 0.01 }); },
      clear(n) {
        for (let i = 0; i < Math.min(n + 1, 4); i++) S.hiss({ dur: 0.12, vol: 0.07, type: 'bandpass', freq: 2400, to: 1100, q: 1, when: i * 0.08 });
        S.thud({ vol: 0.3, f: 90, when: 0.3 }); S.tink(2200, { vol: 0.07, dur: 0.6, when: 0.4 });
      },
      deal() { S.hiss({ dur: 0.15, vol: 0.05, type: 'bandpass', freq: 2000, to: 900, q: 1 }); },
    },
    picnic: { // birds, grass, a soda bottle opened
      pick() { S.tone(2900, { dur: 0.04, vol: 0.03, to: 3600 }); },
      place() { S.thud({ vol: 0.16, f: 150 }); S.rustle({ vol: 0.05, dur: 0.08 }); },
      clear(n) { S.pop({ vol: 0.16, f: 700 }); S.hissL({ dur: 0.6, vol: 0.04, type: 'highpass', freq: 5000, when: 0.05 }); for (let i = 0; i < Math.min(n + 1, 4); i++) chirp(0.15 + i * 0.18); },
      deal() { chirp(0, 0.03); },
    },
    library: { // pages turning, a heavy book closed, a candle crackling
      pick() { S.hiss({ dur: 0.05, vol: 0.04, type: 'bandpass', freq: 2200, q: 1.2 }); },
      place() { S.thud({ vol: 0.28, f: 100 }); S.knock(300, { vol: 0.12 }); },
      clear(n) {
        for (let i = 0; i < Math.min(n + 1, 4); i++) S.hissL({ dur: 0.14, vol: 0.07, type: 'bandpass', freq: 1500, to: 3500, q: 1, when: i * 0.1 });
        S.crunch({ vol: 0.05, n: 3, when: 0.2 }); S.thud({ vol: 0.32, f: 80, when: 0.45 });
      },
      deal() { S.hissL({ dur: 0.3, vol: 0.04, type: 'bandpass', freq: 1800, to: 3200, q: 1 }); },
    },
  };
})(Sfx));

/* ---------- Daily collection, part 3: stained glass, observatory, night train, moon phases ---------- */
Object.assign(STYLES, {
  vitray: { // glass lit from behind, held in lead
    block(g, s, c) {
      rr(g, s * 0.03, s * 0.03, s * 0.94, s * 0.94, s * 0.08); g.fillStyle = '#18141e'; g.fill();
      g.save(); rr(g, s * 0.08, s * 0.08, s * 0.84, s * 0.84, s * 0.05); g.clip();
      const gr = g.createRadialGradient(s * 0.45, s * 0.4, s * 0.02, s * 0.5, s * 0.5, s * 0.62);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.45)); gr.addColorStop(0.55, c); gr.addColorStop(1, shade(c, -0.35));
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      TEX.vitray(g, s, c, seeded(c), 1);
      g.restore();
    },
  },
  astrolabe: { // an enamelled dial in a brass rim
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.12); g.fillStyle = '#4a3410'; g.fill();
      const br = g.createLinearGradient(0, 0, s, s); br.addColorStop(0, '#f6dc8a'); br.addColorStop(0.5, '#b8862c'); br.addColorStop(1, '#e8c060');
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.88, s * 0.11); g.fillStyle = br; g.fill();
      const gr = g.createRadialGradient(s * 0.42, s * 0.38, s * 0.02, s * 0.5, s * 0.5, s * 0.4);
      gr.addColorStop(0, shade(c, 0.25)); gr.addColorStop(1, shade(c, -0.25));
      g.beginPath(); g.arc(s * 0.5, s * 0.49, s * 0.34, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      TEX.astrolabe(g, s, c, seeded(c), 1);
    },
  },
  carriage: { // a painted carriage panel with a lit window and rivets
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.fillStyle = shade(c, -0.55); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, shade(c, 0.18)); gr.addColorStop(1, shade(c, -0.2));
      rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.07); g.fillStyle = gr; g.fill();
      g.save(); rr(g, s * 0.06, s * 0.05, s * 0.88, s * 0.86, s * 0.07); g.clip(); TEX.carriage(g, s, c, seeded(c), 1); g.restore();
    },
  },
  lunar: { // a little moon in its phase, on a night tile
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.2); g.fillStyle = mixHex(c, '#08101e', 0.78); g.fill();
      const gr = g.createRadialGradient(s * 0.4, s * 0.38, s * 0.02, s * 0.5, s * 0.5, s * 0.42);
      gr.addColorStop(0, mixHex(c, '#ffffff', 0.5)); gr.addColorStop(1, shade(c, -0.15));
      g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
      g.save(); g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 0, Math.PI * 2); g.clip(); TEX.lunar(g, s, c, seeded(c), 1); g.restore();
      g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 0, Math.PI * 2); g.strokeStyle = rgba(c, 0.35); g.lineWidth = Math.max(1, s * 0.03); g.stroke();
    },
  },
});

Object.assign(TEX, {
  vitray(g, s, c, rnd, k) { // facets meeting near the middle, each a slightly different shade, held by lead lines
    const cx = s * (0.38 + rnd() * 0.24), cy = s * (0.38 + rnd() * 0.24);
    const E = [[rnd() * s, 0], [s, rnd() * s], [rnd() * s, s], [0, rnd() * s]], C = [[s, 0], [s, s], [0, s], [0, 0]];
    for (let i = 0; i < 4; i++) {
      poly(g, [[cx, cy], E[i], C[i], E[(i + 1) % 4]], i % 2 ? `rgba(255,255,255,${0.14 * k})` : `rgba(0,0,0,${0.16 * k})`);
    }
    speckle(g, s, rnd, 14, 0.006, 0.014, () => `rgba(255,255,255,${0.35 * k})`);
    g.strokeStyle = `rgba(22,18,28,${0.92 * k})`; g.lineWidth = Math.max(1.5, s * 0.055); g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); for (const [x, y] of E) { g.moveTo(cx, cy); g.lineTo(x, y); } g.stroke();
    g.strokeStyle = `rgba(255,255,255,${0.2 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    g.beginPath(); for (const [x, y] of E) { g.moveTo(cx + 1.5, cy + 1.5); g.lineTo(x + 1.5, y + 1.5); } g.stroke();
  },
  astrolabe(g, s, c, rnd, k) { // degree ticks, an engraved circle and a rotating pointer with a star
    const cx = s * 0.5, cy = s * 0.49, R = s * 0.34;
    g.strokeStyle = `rgba(70,46,10,${0.7 * k})`; g.lineWidth = Math.max(1, s * 0.012);
    g.beginPath();
    for (let i = 0; i < 24; i++) { const an = i / 24 * Math.PI * 2, r0 = R * (i % 6 ? 1.06 : 1.0); g.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); g.lineTo(cx + Math.cos(an) * R * 1.18, cy + Math.sin(an) * R * 1.18); }
    g.stroke();
    g.strokeStyle = `rgba(255,236,190,${0.45 * k})`; g.lineWidth = Math.max(1, s * 0.015);
    g.beginPath(); g.arc(cx, cy, R * 0.62, 0, Math.PI * 2); g.stroke();
    const an = rnd() * 6.3;
    g.strokeStyle = `rgba(246,220,138,${0.9 * k})`; g.lineWidth = Math.max(1, s * 0.03); g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - Math.cos(an) * R * 0.5, cy - Math.sin(an) * R * 0.5); g.lineTo(cx + Math.cos(an) * R * 0.9, cy + Math.sin(an) * R * 0.9); g.stroke();
    g.beginPath(); g.arc(cx, cy, s * 0.04, 0, Math.PI * 2); g.fillStyle = `rgba(246,220,138,${0.95 * k})`; g.fill();
    sparkle(g, cx + Math.cos(an + 2) * R * 0.45, cy + Math.sin(an + 2) * R * 0.45, s * 0.07, 0.75 * k);
  },
  carriage(g, s, c, rnd, k) { // a lit window with a warm glow, a row of rivets and a lining stripe
    const wx = s * 0.2, wy = s * 0.16, ww = s * 0.6, wh = s * 0.36;
    const gl = g.createRadialGradient(s * 0.5, wy + wh / 2, 0, s * 0.5, wy + wh / 2, s * 0.5); gl.addColorStop(0, `rgba(255,200,110,${0.35 * k})`); gl.addColorStop(1, 'rgba(255,200,110,0)');
    g.fillStyle = gl; g.fillRect(0, 0, s, s);
    rr(g, wx - s * 0.03, wy - s * 0.03, ww + s * 0.06, wh + s * 0.06, s * 0.08); g.fillStyle = `rgba(20,16,12,${0.7 * k})`; g.fill();
    const wg = g.createLinearGradient(0, wy, 0, wy + wh); wg.addColorStop(0, `rgba(255,226,150,${0.95 * k})`); wg.addColorStop(1, `rgba(240,160,60,${0.95 * k})`);
    rr(g, wx, wy, ww, wh, s * 0.06); g.fillStyle = wg; g.fill();
    g.fillStyle = `rgba(60,30,10,${0.5 * k})`; g.fillRect(wx + ww * 0.15, wy + wh * 0.45, ww * 0.12, wh * 0.55); // a passenger's shadow
    g.beginPath(); g.arc(wx + ww * 0.21, wy + wh * 0.38, ww * 0.07, 0, Math.PI * 2); g.fill();
    g.fillStyle = `rgba(255,236,190,${0.6 * k})`; g.fillRect(0, s * 0.68, s, Math.max(1, s * 0.03));
    for (let i = 0; i < 5; i++) {
      const x = s * (0.14 + i * 0.18), y = s * 0.82;
      g.beginPath(); g.arc(x, y, s * 0.028, 0, Math.PI * 2); g.fillStyle = `rgba(0,0,0,${0.35 * k})`; g.fill();
      g.beginPath(); g.arc(x - s * 0.006, y - s * 0.006, s * 0.016, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${0.45 * k})`; g.fill();
    }
  },
  lunar(g, s, c, rnd, k) { // craters with a lit rim and the shadow of the phase sliding across
    for (let i = 0; i < 5; i++) {
      const x = s * (0.25 + rnd() * 0.5), y = s * (0.25 + rnd() * 0.5), r = s * (0.03 + rnd() * 0.05);
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = `rgba(0,0,0,${0.16 * k})`; g.fill();
      g.beginPath(); g.arc(x + r * 0.2, y + r * 0.2, r * 0.85, Math.PI * 0.1, Math.PI * 1.1); g.strokeStyle = `rgba(255,255,255,${0.35 * k})`; g.lineWidth = Math.max(0.8, s * 0.012); g.stroke();
    }
    const ph = 0.25 + rnd() * 0.6, dir = rnd() < 0.5 ? -1 : 1;
    g.beginPath(); g.arc(s * 0.5 + dir * s * 0.72 * ph, s * 0.5, s * 0.4, 0, Math.PI * 2); g.fillStyle = `rgba(8,14,30,${0.55 * k})`; g.fill();
  },
});

Object.assign(PARTS, {
  crescent(p, s) {
    ctx.rotate(p.rot * 0.3);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2); ctx.arc(s * 0.25, -s * 0.1, s * 0.48, 0, Math.PI * 2, true);
    ctx.fillStyle = mixHex(p.color, '#ffffff', 0.5); ctx.fill('evenodd');
  },
});

Object.assign(AMBIENTS, {
  cathedral(th) { // pointed windows high up, coloured light falling to the floor, dust in the beams
    let hall = null, hw = 0, hh = 0, t = 0;
    const DU = [...Array(36)].map(() => ({ x: Math.random(), y: Math.random(), v: rand(-0.01, -0.003), ph: rand(0, 6.3) }));
    const WIN = [0.2, 0.5, 0.8];
    function build(w, h) {
      hw = w; hh = h; hall = document.createElement('canvas'); hall.width = Math.ceil(w); hall.height = Math.ceil(h);
      const g = hall.getContext('2d'), u = Math.min(w, h);
      g.strokeStyle = 'rgba(255,255,255,.04)'; g.lineWidth = 1;
      for (let y = 0; y < h; y += u * 0.06) { const off = ((y / (u * 0.06)) | 0) % 2 * u * 0.06; for (let x = -off; x < w; x += u * 0.12) g.strokeRect(x, y, u * 0.12, u * 0.06); }
      for (const wx of WIN) { // a lancet window made of small coloured panes
        const cx = wx * w, ww = u * 0.11, top = h * 0.03, bot = h * 0.3;
        g.save(); g.beginPath(); g.moveTo(cx - ww, bot); g.lineTo(cx - ww, top + ww); g.quadraticCurveTo(cx - ww, top, cx, top - ww * 0.4); g.quadraticCurveTo(cx + ww, top, cx + ww, top + ww); g.lineTo(cx + ww, bot); g.closePath(); g.clip();
        for (let y = top - ww; y < bot; y += ww * 0.42) for (let x = cx - ww; x < cx + ww; x += ww * 0.5) { g.fillStyle = rgba(th.blocks[(Math.random() * 7) | 0], 0.28); g.fillRect(x + 1, y + 1, ww * 0.5 - 2, ww * 0.42 - 2); }
        g.restore();
      }
    }
    return {
      step(dt) { t += dt; for (const d of DU) { d.y += d.v * dt; d.x += Math.sin(t * 0.4 + d.ph) * 0.003 * dt; if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); } } },
      draw(g, w, h, a) {
        if (!hall || Math.abs(w - hw) > 1 || Math.abs(h - hh) > 1) build(w, h);
        g.globalAlpha = a; g.drawImage(hall, 0, 0, w, h); g.globalAlpha = 1;
        const u = Math.min(w, h);
        g.save(); g.globalCompositeOperation = 'lighter';
        WIN.forEach((wx, i) => { // a beam per window, its colour slowly changing
          const cx = wx * w, ww = u * 0.11, sh = Math.sin(t * 0.15 + i) * w * 0.05, c = th.blocks[(i * 2 + ((t / 6) | 0)) % 7];
          const gr = g.createLinearGradient(0, h * 0.3, 0, h); gr.addColorStop(0, rgba(c, 0.12 * a)); gr.addColorStop(1, rgba(c, 0.02 * a));
          g.fillStyle = gr; g.beginPath(); g.moveTo(cx - ww, h * 0.3); g.lineTo(cx + ww, h * 0.3); g.lineTo(cx + ww * 2.6 + sh, h); g.lineTo(cx - ww * 0.4 + sh, h); g.closePath(); g.fill();
          g.beginPath(); g.ellipse(cx + ww * 1.1 + sh, h * 0.95, ww * 1.6, ww * 0.35, 0, 0, Math.PI * 2); g.fillStyle = rgba(c, 0.12 * a); g.fill();
        });
        g.restore();
        for (const d of DU) { const k = 0.5 + 0.5 * Math.sin(t * 1.4 + d.ph); g.fillStyle = `rgba(255,236,200,${(0.1 + 0.3 * k) * a})`; g.fillRect(d.x * w, d.y * h, 2, 2); }
      },
    };
  },
  starchart(th) { // the sky turning round the pole star, constellation lines, brass rings, a telescope
    let t = 0;
    const ST = [...Array(120)].map(() => ({ r: Math.sqrt(Math.random()) * 1.1, an: rand(0, 6.3), s: rand(0.6, 1.8), ph: rand(0, 6.3) }));
    const CON = [...Array(5)].map(() => { const r0 = rand(0.25, 0.9), a0 = rand(0, 6.3); return [...Array(4 + ((Math.random() * 3) | 0))].map((_, i) => [r0 + rand(-0.08, 0.08), a0 + i * rand(0.08, 0.16)]); });
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h), px = w * 0.5, py = h * 0.12, rot = t * 0.02;
        const P = (r, an) => [px + Math.cos(an + rot) * r * M, py + Math.sin(an + rot) * r * M];
        for (const s2 of ST) { const [x, y] = P(s2.r, s2.an); g.fillStyle = `rgba(255,255,255,${(0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.3 + s2.ph))) * a})`; g.fillRect(x, y, s2.s, s2.s); }
        g.strokeStyle = rgba(th.accent, 0.22 * a); g.lineWidth = 1;
        for (const c of CON) { g.beginPath(); c.forEach(([r, an], i) => { const [x, y] = P(r, an); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); for (const [r, an] of c) { const [x, y] = P(r, an); g.beginPath(); g.arc(x, y, 2, 0, Math.PI * 2); g.fillStyle = rgba(th.accent, 0.6 * a); g.fill(); } }
        sparkle(g, px, py, u * 0.03, 0.9 * a);
        g.strokeStyle = rgba(th.accent, 0.16 * a); g.lineWidth = 2;
        for (const [R, sp] of [[0.5, -0.03], [0.62, 0.02]]) {
          g.beginPath(); g.arc(px, py, R * M, 0, Math.PI * 2); g.stroke();
          g.beginPath(); for (let i = 0; i < 72; i++) { const an = i / 72 * Math.PI * 2 + t * sp, l = i % 6 ? 0.012 : 0.03; g.moveTo(px + Math.cos(an) * R * M, py + Math.sin(an) * R * M); g.lineTo(px + Math.cos(an) * (R - l) * M, py + Math.sin(an) * (R - l) * M); } g.stroke();
        }
        const tx = w * 0.88, ty = h * 0.97; // telescope on its tripod
        g.strokeStyle = `rgba(200,170,110,${0.45 * a})`; g.lineWidth = 2; g.beginPath(); g.moveTo(tx, ty - u * 0.1); g.lineTo(tx - u * 0.05, ty); g.moveTo(tx, ty - u * 0.1); g.lineTo(tx + u * 0.05, ty); g.stroke();
        g.save(); g.translate(tx, ty - u * 0.1); g.rotate(-0.8); g.fillStyle = `rgba(200,170,110,${0.55 * a})`; g.fillRect(-u * 0.04, -u * 0.015, u * 0.16, u * 0.03); g.fillRect(u * 0.12, -u * 0.02, u * 0.03, u * 0.04); g.restore();
      },
    };
  },
  nighttrain(th) { // the view from the window: mountains, lights of towns and passing poles, the moon keeping up
    let far = null, fw = 0, fh = 0, t = 0;
    const TOWN = [...Array(28)].map(() => ({ x: Math.random(), y: rand(0.7, 0.8), ph: rand(0, 6.3), c: Math.random() < 0.7 ? '255,210,130' : '255,240,220' }));
    const ST = [...Array(60)].map(() => ({ x: Math.random(), y: Math.random() * 0.55, ph: rand(0, 6.3) }));
    function build(w, h) {
      fw = w; fh = h; far = document.createElement('canvas'); far.width = Math.ceil(w * 2); far.height = Math.ceil(h * 0.4);
      const g = far.getContext('2d'), H = far.height, W2 = far.width;
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W2; x += 8) { const p = x / W2 * Math.PI * 2; g.lineTo(x, H * 0.45 - (Math.sin(p * 3) * 0.22 + Math.sin(p * 7 + 1) * 0.1 + Math.sin(p * 13) * 0.04) * H); }
      g.lineTo(W2, H); g.closePath(); g.fillStyle = 'rgba(30,32,64,.85)'; g.fill();
    }
    return {
      step(dt) { t += dt; for (const l of TOWN) { l.x -= 0.03 * dt; if (l.x < -0.02) { l.x = 1.02; l.y = rand(0.7, 0.8); } } },
      draw(g, w, h, a) {
        const u = Math.min(w, h);
        for (const s2 of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.sin(t * 1.5 + s2.ph)) * a})`; g.fillRect(s2.x * w, s2.y * h, 1.5, 1.5); }
        const mx = w * 0.78, my = h * 0.16, mr = u * 0.07;
        const gl = g.createRadialGradient(mx, my, mr, mx, my, mr * 4); gl.addColorStop(0, `rgba(230,230,255,${0.2 * a})`); gl.addColorStop(1, 'rgba(230,230,255,0)');
        g.fillStyle = gl; g.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8);
        g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.fillStyle = `rgba(245,242,230,${0.9 * a})`; g.fill();
        if (!far || Math.abs(w - fw) > 1 || Math.abs(h - fh) > 1) build(w, h);
        const off = (t * w * 0.012) % (w * 2);
        g.globalAlpha = a; g.drawImage(far, -off, h * 0.42, w * 2, h * 0.4); g.drawImage(far, w * 2 - off, h * 0.42, w * 2, h * 0.4); g.globalAlpha = 1;
        g.fillStyle = `rgba(12,12,28,${0.9 * a})`; g.fillRect(0, h * 0.8, w, h * 0.2);
        for (const l of TOWN) { const k = 0.6 + 0.4 * Math.sin(t * 3 + l.ph); g.fillStyle = `rgba(${l.c},${0.7 * k * a})`; g.fillRect(l.x * w, l.y * h, 2.5, 2.5); }
        const sp = w * 0.55, po = (t * w * 0.6) % sp; // telegraph poles rushing past, wires sagging between them
        g.strokeStyle = `rgba(10,10,20,${0.8 * a})`; g.lineWidth = 3;
        for (let x = w + sp - po; x > -sp; x -= sp) { g.beginPath(); g.moveTo(x, h); g.lineTo(x, h * 0.6); g.moveTo(x - u * 0.03, h * 0.62); g.lineTo(x + u * 0.03, h * 0.62); g.stroke(); }
        g.lineWidth = 1; g.beginPath();
        for (let x = w + sp - po; x > -sp; x -= sp) { g.moveTo(x, h * 0.62); g.quadraticCurveTo(x - sp / 2, h * 0.67, x - sp, h * 0.62); } g.stroke();
        g.fillStyle = `rgba(0,0,0,${0.35 * a})`; g.fillRect(0, h * 0.93, w, h * 0.07); // window sill
      },
    };
  },
  tides(th) { // a big moon going through its phases over the sea, light on the water, clouds passing
    let t = 0;
    const ST = [...Array(80)].map(() => ({ x: Math.random(), y: Math.random() * 0.62, ph: rand(0, 6.3), s: rand(0.6, 1.6) }));
    const CL = [...Array(3)].map(() => ({ x: Math.random(), y: rand(0.08, 0.35), v: rand(0.006, 0.012), s: rand(0.8, 1.3) }));
    return {
      step(dt) { t += dt; for (const c of CL) { c.x += c.v * dt; if (c.x > 1.3) c.x = -0.3; } },
      draw(g, w, h, a) {
        const u = Math.min(w, h), hy = h * 0.68, mx = w * 0.5, my = h * 0.2, mr = u * 0.12;
        for (const s2 of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * s2.s + s2.ph))) * a})`; g.fillRect(s2.x * w, s2.y * h, s2.s, s2.s); }
        const gl = g.createRadialGradient(mx, my, mr, mx, my, mr * 3.5); gl.addColorStop(0, `rgba(220,232,255,${0.22 * a})`); gl.addColorStop(1, 'rgba(220,232,255,0)');
        g.fillStyle = gl; g.fillRect(mx - mr * 3.5, my - mr * 3.5, mr * 7, mr * 7);
        g.save(); g.beginPath(); g.arc(mx, my, mr, 0, Math.PI * 2); g.clip();
        g.fillStyle = `rgba(236,240,250,${0.92 * a})`; g.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
        g.fillStyle = `rgba(180,190,210,${0.5 * a})`; for (const [dx, dy, r] of [[-0.3, -0.2, 0.2], [0.25, 0.2, 0.26], [-0.1, 0.45, 0.13], [0.4, -0.35, 0.1]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2); g.fill(); }
        const ph = (t / 40) % 1, off = (ph * 2 - 1) * mr * 2.1; // one full cycle of phases every 40 seconds
        g.beginPath(); g.arc(mx + off, my, mr * 1.02, 0, Math.PI * 2); g.fillStyle = `rgba(8,16,34,${0.88 * a})`; g.fill();
        g.restore();
        for (const c of CL) {
          const cx = c.x * w, cy = c.y * h, r = u * 0.05 * c.s;
          g.beginPath(); for (const [dx, dy, q] of [[-1, 0.1, 0.7], [0, -0.15, 1], [1, 0.1, 0.7]]) { g.moveTo(cx + dx * r + q * r, cy + dy * r); g.arc(cx + dx * r, cy + dy * r, q * r, 0, Math.PI * 2); }
          g.fillStyle = `rgba(40,56,86,${0.6 * a})`; g.fill();
        }
        const sea = g.createLinearGradient(0, hy, 0, h); sea.addColorStop(0, `rgba(20,40,70,${0.65 * a})`); sea.addColorStop(1, `rgba(6,14,28,${0.75 * a})`);
        g.fillStyle = sea; g.fillRect(0, hy, w, h - hy);
        g.strokeStyle = `rgba(230,238,255,${0.4 * a})`; g.lineWidth = 2;
        for (let i = 0; i < 10; i++) { const y = hy + (h - hy) * (0.05 + i * 0.1), len = u * (0.05 + i * 0.03) * (0.7 + 0.3 * Math.sin(t * 1.5 + i)); g.beginPath(); g.moveTo(mx - len / 2 + Math.sin(t + i * 2) * u * 0.01, y); g.lineTo(mx + len / 2 + Math.sin(t + i * 2) * u * 0.01, y); g.stroke(); }
        g.strokeStyle = `rgba(200,215,240,${0.12 * a})`; g.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) { const y0 = hy + (h - hy) * (0.15 + i * 0.22); g.beginPath(); for (let x = 0; x <= w + 10; x += 10) { const y = y0 + Math.sin(x * 0.02 + t * (0.8 + i * 0.2) + i) * u * 0.006; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      },
    };
  },
});

Object.assign(KITS, (S => ({
  organ: { // glass clinks and an organ chord with a slow swell
    pick() { S.tink(3000, { vol: 0.035, dur: 0.15 }); },
    place() { S.thud({ vol: 0.18, f: 130 }); S.tink(rand(2000, 2600), { vol: 0.07, dur: 0.3 }); },
    clear(n) {
      const r = S.snd.root * 0.5;
      [0, 7, 12, n > 2 ? 16 : 19].forEach(st => { const f = r * Math.pow(2, st / 12); S.tone(f, { dur: 1.3, vol: 0.05, attack: 0.15, wet: true }); S.tone(f * 2, { type: 'triangle', dur: 1.1, vol: 0.02, attack: 0.15 }); });
      for (let i = 0; i < n + 2; i++) S.tink(rand(2200, 3800), { when: 0.05 + i * 0.06, vol: 0.035, dur: 0.4 });
    },
    deal() { S.tink(2600, { vol: 0.03, dur: 0.5 }); },
  },
  brass: { // ticking brass gears and an observatory bell
    pick() { S.knock(2600, { vol: 0.04 }); },
    place() { S.thud({ vol: 0.22, f: 120 }); S.tink(900, { vol: 0.07, dur: 0.25 }); },
    clear(n) { for (let i = 0; i < 6; i++) S.knock(2400, { vol: 0.04, when: i * 0.05 }); S.tink(660, { vol: 0.11, dur: 1.6, when: 0.3 }); if (n > 1) S.tink(990, { vol: 0.07, dur: 1.2, when: 0.45 }); },
    deal() { for (let i = 0; i < 3; i++) S.knock(2800, { vol: 0.03, when: i * 0.06 }); },
  },
  train: { // rail joints "ta-tak", a steam whistle on a clear
    pick() { S.knock(1800, { vol: 0.04 }); },
    place() { S.knock(210, { vol: 0.26 }); S.knock(180, { vol: 0.22, when: 0.09 }); },
    clear(n) {
      S.tone(740, { type: 'triangle', dur: 0.75, vol: 0.05, attack: 0.05, wet: true }); S.tone(932, { type: 'triangle', dur: 0.75, vol: 0.045, attack: 0.05 });
      S.hissL({ dur: 0.8, vol: 0.05, type: 'bandpass', freq: 2500, q: 0.8 });
      for (let i = 0; i < Math.min(n + 1, 4); i++) { S.knock(210, { vol: 0.18, when: 0.8 + i * 0.22 }); S.knock(180, { vol: 0.15, when: 0.89 + i * 0.22 }); }
    },
    deal() { for (let i = 0; i < 4; i++) S.hiss({ dur: 0.08, vol: 0.05, type: 'bandpass', freq: 900, q: 0.8, when: i * 0.12 }); },
  },
  moon: { // soft chimes on a pentatonic scale and a wave on the shore
    pick() { S.tink(2800, { vol: 0.03, dur: 0.4 }); },
    place() { S.thud({ vol: 0.14, f: 140 }); S.tone(S.snd.root * 0.5, { dur: 0.5, vol: 0.04, attack: 0.03, wet: true }); },
    clear(n) {
      const P = [0, 2, 4, 7, 9, 12, 14];
      for (let i = 0; i < n + 2; i++) S.tink(S.snd.root * 2 * Math.pow(2, P[i % 7] / 12), { when: 0.04 + i * 0.12, vol: 0.04, dur: 0.9 });
      S.hissL({ dur: 1.2, vol: 0.06, type: 'lowpass', freq: 700, to: 200, when: 0.2 });
    },
    deal() { S.hissL({ dur: 0.6, vol: 0.03, type: 'lowpass', freq: 600, to: 250 }); },
  },
}))(Sfx));

/* ---------- Daily collection, part 4: Zeugma mosaic and the finale, the comet ---------- */
Object.assign(STYLES, {
  tesserae: { // small stone tiles set in mortar
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.fillStyle = '#b8a890'; g.fill();
      g.save(); rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.08); g.clip(); TEX.tesserae(g, s, c, seeded(c), 1); g.restore();
    },
  },
  cometcore: { // an icy core racing up the tile with its tail behind it
    block(g, s, c) {
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.18); g.fillStyle = mixHex(c, '#04061a', 0.82); g.fill();
      g.save(); rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.18); g.clip();
      const neb = g.createRadialGradient(s * 0.62, s * 0.38, 0, s * 0.5, s * 0.5, s * 0.7); neb.addColorStop(0, rgba(c, 0.45)); neb.addColorStop(1, rgba(c, 0.05));
      g.fillStyle = neb; g.fillRect(0, 0, s, s);
      TEX.cometcore(g, s, c, seeded(c), 1);
      g.restore();
      rr(g, s * 0.04, s * 0.04, s * 0.92, s * 0.92, s * 0.18); g.strokeStyle = rgba(c, 0.55); g.lineWidth = Math.max(1, s * 0.03); g.stroke();
    },
  },
});

Object.assign(TEX, {
  tesserae(g, s, c, rnd, k) { // a 4 x 4 set of slightly uneven tiles, each a shade of its own, with mortar lines between
    const n = 4, q = s / n;
    g.fillStyle = `rgba(150,130,100,${0.55 * k})`; g.fillRect(0, 0, s, s);
    for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) {
      const j = () => (rnd() - 0.5) * q * 0.1, x = cc * q + q * 0.08 + j(), y = r * q + q * 0.08 + j(), w = q * 0.84 + j(), h = q * 0.84 + j();
      const v = (rnd() - 0.5) * 0.3;
      g.fillStyle = v > 0 ? mixHex(c, '#ffffff', v) : shade(c, v);
      g.globalAlpha = k; rr(g, x, y, w, h, q * 0.12); g.fill();
      g.fillStyle = `rgba(255,255,255,${0.18 * k})`; g.fillRect(x + w * 0.1, y + h * 0.1, w * 0.35, h * 0.12);
      g.globalAlpha = 1;
    }
  },
  cometcore(g, s, c, rnd, k) { // tail streaks, a glowing core and a few stars
    const hx = s * 0.68, hy = s * 0.32;
    g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const off = (i - 2) * s * 0.05, len = s * (0.6 + rnd() * 0.25);
      const gr = g.createLinearGradient(hx, hy, hx - len * 0.7, hy + len * 0.7);
      gr.addColorStop(0, `rgba(255,255,255,${0.75 * k})`); gr.addColorStop(0.3, rgba(c, 0.6 * k)); gr.addColorStop(1, rgba(c, 0));
      g.strokeStyle = gr; g.lineWidth = Math.max(1, s * (i === 2 ? 0.09 : 0.035));
      g.beginPath(); g.moveTo(hx + off * 0.7, hy + off * 0.7); g.lineTo(hx - len * 0.7 + off * 0.7, hy + len * 0.7 + off * 0.7); g.stroke();
    }
    const gl = g.createRadialGradient(hx, hy, 0, hx, hy, s * 0.22); gl.addColorStop(0, `rgba(255,255,255,${0.95 * k})`); gl.addColorStop(0.35, rgba(c, 0.6 * k)); gl.addColorStop(1, rgba(c, 0));
    g.fillStyle = gl; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 3; i++) sparkle(g, s * (0.15 + rnd() * 0.3), s * (0.1 + rnd() * 0.3), s * (0.03 + rnd() * 0.03), 0.8 * k);
  },
});

Object.assign(AMBIENTS, {
  mosaicfloor(th) { // a floor mosaic coming to light tile by tile from the middle, a brush of dust at the edge
    let tiles = [], tw = 0, thh = 0, t = 0, q = 0;
    const DU = [...Array(24)].map(() => ({ x: Math.random(), y: Math.random(), ph: rand(0, 6.3) }));
    function build(w, h) {
      tw = w; thh = h; tiles = []; q = Math.max(10, Math.min(w, h) * 0.035);
      const cols = Math.ceil(w / q), rows = Math.ceil(h / q), cx = cols / 2, cy = rows / 2;
      const B = th.blocks;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const edge = Math.min(r, c, rows - 1 - r, cols - 1 - c);
        let col;
        if (edge === 0) col = '#4a2a1a';
        else if (edge === 1 || edge === 2) col = ((c + r + (edge === 2 ? 1 : 0)) % 4 < 2) ? B[0] : B[6]; // a running wave band
        else if (edge === 3) col = '#4a2a1a';
        else {
          const d = Math.hypot(c - cx, (r - cy) * 1.0), ring = Math.floor(d / 1.6);
          const an = Math.atan2(r - cy, c - cx), petal = Math.cos(an * 8) > 0.3;
          col = d < 1.5 ? B[2] : ring % 3 === 0 ? B[4] : ring % 3 === 1 ? (petal ? B[1] : B[6]) : (petal ? B[3] : B[6]);
        }
        const v = (Math.random() - 0.5) * 0.25; // each stone a little lighter or darker, worked out once
        tiles.push({ x: c * q, y: r * q, fill: v > 0 ? mixHex(col, '#ffffff', v) : shade(col, v), d: Math.hypot(c, rows - r) + Math.random() * 2.5 }); // uncovered from the bottom-left corner, which the board does not hide
      }
      tiles.sort((a, b) => a.d - b.d);
    }
    return {
      step(dt) { t += dt; },
      draw(g, w, h, a) {
        if (!tiles.length || Math.abs(w - tw) > 1 || Math.abs(h - thh) > 1) build(w, h);
        const cyc = 44, ct = t % cyc, reveal = Math.min(1, ct / 24), fade = ct > 40 ? 1 - (ct - 40) / 4 : 1;
        const n = Math.floor(tiles.length * reveal);
        g.globalAlpha = 0.32 * a * fade;
        for (let i = 0; i < n; i++) { const p = tiles[i]; g.fillStyle = p.fill; g.fillRect(p.x + 1, p.y + 1, q - 2, q - 2); }
        g.globalAlpha = 1;
        if (n < tiles.length && n > 0) { // dust being brushed off at the edge of what has been uncovered
          const e = tiles[n - 1], R = q * 3;
          for (const d of DU) { const x = e.x + Math.cos(d.ph + t * 2) * R * d.x, y = e.y + Math.sin(d.ph + t * 2) * R * d.y; g.fillStyle = `rgba(230,210,180,${0.4 * a})`; g.fillRect(x, y, 2, 2); }
        }
      },
    };
  },
  comet(th) { // a great comet sweeping across the sky with a dust tail, stars, a nebula and now and then a meteor
    let t = 0, dust = [], met = null, mwait = rand(2, 5);
    const ST = [...Array(130)].map(() => ({ x: Math.random(), y: Math.random(), s: rand(0.5, 1.8), ph: rand(0, 6.3), f: rand(0.5, 2) }));
    const head = () => { const k = (t % 24) / 24; return [-0.15 + k * 1.3, 0.97 - k * 0.2]; }; // low across the sky, below the board
    return {
      step(dt) {
        t += dt;
        const [hx, hy] = head();
        if (!state.REDUCED) for (let i = 0; i < 3; i++) dust.push({ x: hx, y: hy, vx: -rand(0.02, 0.06), vy: rand(0.005, 0.03), life: 0, c: th.blocks[(Math.random() * 7) | 0] });
        for (const p of dust) { p.x += p.vx * dt; p.y += p.vy * dt; p.life += dt / 2.5; }
        dust = dust.filter(p => p.life < 1);
        mwait -= dt;
        if (!met && mwait < 0 && !state.REDUCED) { met = { x: rand(0.2, 1), y: rand(0, 0.3), life: 0 }; mwait = rand(3, 7); }
        if (met) { met.life += dt / 0.7; if (met.life >= 1) met = null; }
      },
      draw(g, w, h, a) {
        const u = Math.min(w, h), M = Math.max(w, h);
        const neb = g.createRadialGradient(w * 0.3, h * 0.7, 0, w * 0.3, h * 0.7, M * 0.6); neb.addColorStop(0, rgba(th.blocks[5], 0.14 * a)); neb.addColorStop(1, rgba(th.blocks[5], 0));
        g.fillStyle = neb; g.fillRect(0, 0, w, h);
        for (const s2 of ST) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * s2.f + s2.ph))) * a})`; g.fillRect(s2.x * w, s2.y * h, s2.s, s2.s); }
        const [hx, hy] = head(), x = hx * w, y = hy * h, L = M * 0.55;
        g.save(); g.globalCompositeOperation = 'lighter';
        for (const p of dust) { g.fillStyle = rgba(p.c, 0.5 * (1 - p.life) * a); g.fillRect(p.x * w, p.y * h, 2, 2); }
        g.translate(x, y); g.rotate(Math.atan2(0.2 * h, -1.3 * w) + Math.PI); // the tail points away from where it is heading
        for (const [wd, al, col] of [[0.16, 0.18, th.accent], [0.07, 0.35, '#ffffff'], [0.22, 0.08, th.blocks[6]]]) {
          const gr = g.createLinearGradient(0, 0, -L, 0); gr.addColorStop(0, rgba(col, al * a)); gr.addColorStop(1, rgba(col, 0));
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(-L, -L * wd); g.lineTo(-L, L * wd); g.closePath(); g.fill();
        }
        g.restore();
        const gl = g.createRadialGradient(x, y, 0, x, y, u * 0.08); gl.addColorStop(0, `rgba(255,255,255,${0.95 * a})`); gl.addColorStop(0.3, rgba(th.accent, 0.6 * a)); gl.addColorStop(1, rgba(th.accent, 0));
        g.fillStyle = gl; g.fillRect(x - u * 0.08, y - u * 0.08, u * 0.16, u * 0.16);
        if (met) {
          const k = met.life, mx = (met.x - k * 0.25) * w, my = (met.y + k * 0.18) * h, len = u * 0.15;
          const gr = g.createLinearGradient(mx, my, mx + len, my - len * 0.72); gr.addColorStop(0, `rgba(255,255,255,${(1 - k) * a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
          g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + len, my - len * 0.72); g.stroke();
        }
      },
    };
  },
});

Object.assign(KITS, (S => ({
  mosaic: { // stone tiles set down one by one, a brush sweeping the dust
    pick() { S.knock(2200, { vol: 0.04 }); },
    place() { S.knock(900, { vol: 0.16 }); S.knock(1200, { vol: 0.1, when: 0.04 }); S.thud({ vol: 0.12, f: 140 }); },
    clear(n) { for (let i = 0; i < n * 3 + 4; i++) S.knock(rand(900, 1600), { when: i * 0.035 + Math.random() * 0.02, vol: 0.07 }); S.hissL({ dur: 0.5, vol: 0.05, type: 'bandpass', freq: 2500, to: 1200, q: 0.8, when: 0.1 }); },
    deal() { for (let i = 0; i < 3; i++) S.knock(1400 + i * 150, { vol: 0.04, when: i * 0.05 }); },
  },
  comet: { // shimmering ice and a whoosh as the comet passes
    pick() { S.tink(3600, { vol: 0.03, dur: 0.3 }); },
    place() { S.thud({ vol: 0.15, f: 140 }); S.tone(S.snd.root * 0.5, { dur: 0.35, vol: 0.04, to: S.snd.root, wet: true }); },
    clear(n) {
      for (let i = 0; i < n + 4; i++) S.tink(S.snd.root * 2 * Math.pow(2, [0, 4, 7, 11, 12, 16, 19, 23][i % 8] / 12), { when: i * 0.06, vol: 0.04, dur: 0.6 });
      S.hissL({ dur: 0.9, vol: 0.07, type: 'bandpass', freq: 300, to: 4000, q: 0.7 });
    },
    deal() { S.tink(3200, { vol: 0.03, dur: 0.4 }); S.tink(4200, { vol: 0.02, dur: 0.3, when: 0.06 }); },
  },
}))(Sfx));
