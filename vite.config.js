import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: './', // relative URLs: the Android WebView serves the files from the app bundle
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 0, // keep fonts as files
  },
  server: { host: true }, // reachable from a phone on the same network
});
