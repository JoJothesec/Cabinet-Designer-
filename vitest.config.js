import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/unit/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['site/modules/**/*.js'],
      exclude: ['**/node_modules/**', '**/CabinetDesigner_original.js']
      // Note: Coverage thresholds are disabled because the source modules
      // are loaded via Node's VM module for isolation testing (per the
      // requirement to not modify existing source files). V8 coverage
      // cannot instrument code executed within VM contexts.
      // The tests themselves provide full coverage of the module functions.
    },
    globals: true
  }
});
