import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default defineConfig({
  root: 'src',
  envDir: '..', // .env.development and .env.test sit next to package.json; the Play build has no .env and no dev tools
  define: { __APP_VERSION__: JSON.stringify(version) }, // shown in Settings → About, and the Android versionName
  base: './', // relative URLs: the Android WebView serves the files from the app bundle
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: ['chrome70', 'safari13'], // syntax for older Android WebViews; compat.js covers the missing built-ins
    assetsInlineLimit: 0, // keep fonts as files
  },
  server: { host: true }, // reachable from a phone on the same network
});
