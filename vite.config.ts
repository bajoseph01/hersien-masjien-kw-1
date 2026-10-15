import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      base: './',
      build: { outDir: 'docs' },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      css: { postcss: { plugins: [] } },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
