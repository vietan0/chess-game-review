import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
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
