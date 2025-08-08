import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    include: ['tests/**/*.{test,spec}.{ts,tsx,js}'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: [
      'tests/e2e/**',
      'node_modules/**',
      'dist/**'
    ],
    reporters: [
      'default',
      ['junit', { outputFile: 'test-results/vitest/results.xml' }]
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
    },
  },
})

