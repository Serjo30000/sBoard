import { defineConfig } from 'vite';
import * as path from 'node:path';

export default defineConfig(() => ({
  base: '/sBoard/',

  server: {
    port: 5173,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },

  publicDir: 'public',

  resolve: {
    alias: {
      skia: path.resolve(__dirname, 'libs/skia'),
    },
  },
}));