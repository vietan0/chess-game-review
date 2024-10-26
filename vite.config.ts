import dsv from '@rollup/plugin-dsv';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), dsv()],
  server: {
    open: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude!,
        '**/{ignore,test}',
        '**/{commitlint,postcss,tailwind}.config.*',
      ],
    },
  },
});
