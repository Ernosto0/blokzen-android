// Draws the app icon, the splash screen and the Play Store graphics from the game's own logo (the 5x3 block mark on the
// main menu, drawn with the first theme's blocks), then writes them next to this file as PNGs.
//   node assets/make-assets.mjs
//   npx capacitor-assets generate --android --iconBackgroundColor "#1a1330" --splashBackgroundColor "#1a1330"
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const server = await createServer({ configFile: 'vite.config.js', logLevel: 'error', server: { host: '127.0.0.1', port: 5199, strictPort: true } });
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5199/');
  const files = await page.evaluate(async () => {
    const { sprite } = await import('/render/sprites.js');
    const { LOGO } = await import('/ui/menu.js');
    const { THEMES } = await import('/themes/catalog.js');
    await document.fonts.load('800 100px "Baloo 2"');
    const th = THEMES[0];
    const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    // the logo, `width` pixels wide, centred on (cx, cy)
    const logo = (g, cx, cy, width) => {
      const cs = width / 5, px = Math.ceil(cs);
      LOGO.forEach((row, r) => row.forEach((v, c) => { if (v) g.drawImage(sprite(0, v, px, 'classic'), cx - width / 2 + c * cs, cy - cs * 1.5 + r * cs, cs, cs); }));
    };
    const fill = (g, w, h) => { g.fillStyle = th.bg; g.fillRect(0, 0, w, h); };
    const out = {};
    const make = (name, w, h, paint) => { const c = canvas(w, h), g = c.getContext('2d'); paint(g, w, h); out[name] = c.toDataURL('image/png').split(',')[1]; };
    make('icon-background.png', 1024, 1024, (g, w, h) => fill(g, w, h));
    make('icon-foreground.png', 1024, 1024, (g, w, h) => logo(g, w / 2, h / 2, 740)); // fills most of the adaptive icon's 66dp safe circle
    make('icon-only.png', 1024, 1024, (g, w, h) => { fill(g, w, h); logo(g, w / 2, h / 2, 720); });
    for (const n of ['splash.png', 'splash-dark.png']) make(n, 2732, 2732, (g, w, h) => { fill(g, w, h); logo(g, w / 2, h / 2, 720); });
    make('play-store-icon-512.png', 512, 512, (g, w, h) => { fill(g, w, h); logo(g, w / 2, h / 2, 360); });
    make('play-feature-graphic-1024x500.png', 1024, 500, (g, w, h) => {
      fill(g, w, h);
      const glow = g.createRadialGradient(w * 0.3, h * 0.5, 10, w * 0.3, h * 0.5, w * 0.6);
      glow.addColorStop(0, th.glow + 'cc'); glow.addColorStop(1, th.glow + '00');
      g.fillStyle = glow; g.fillRect(0, 0, w, h);
      // logo and name as one group, centred
      g.font = '800 130px "Baloo 2"'; g.textBaseline = 'middle';
      const lw = 340, gap = 44, tw = g.measureText('Blokzen').width, x0 = (w - (lw + gap + tw)) / 2;
      logo(g, x0 + lw / 2, h / 2, lw);
      g.fillStyle = th.fg; g.fillText('Blokzen', x0 + lw + gap, h / 2 + 6);
    });
    return out;
  });
  for (const [name, b64] of Object.entries(files)) { writeFileSync(new URL(name, import.meta.url), Buffer.from(b64, 'base64')); console.log('wrote assets/' + name); }
} finally { await browser.close(); await server.close(); }
