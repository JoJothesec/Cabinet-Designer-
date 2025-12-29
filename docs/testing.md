# Testing Guide for Cabinet Designer Pro

This document describes how to run tests and understand the test infrastructure.

## Quick Start

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run unit tests in watch mode (re-runs on file changes)
npm run test:watch

# Run unit tests with coverage report
npm run test:coverage

# Run E2E tests (requires Playwright browsers)
npx playwright install  # First time only
npm run test:e2e

# Run all tests (unit + E2E)
npm run test:all
```

---

## Test Structure

```
tests/
├── unit-test-plan.md        # Original test plan document
├── setup.js                 # Vitest setup (canvas mock)
├── helpers/
│   └── loadModule.js        # VM-based module loader
├── unit/
│   ├── measurements.test.js # Fraction parsing tests
│   ├── validation.test.js   # Dimension validation tests
│   ├── cabinetClasses.test.js # Cabinet/Door/Drawer class tests
│   ├── historyManager.test.js # Undo/redo functionality tests
│   └── constants.test.js    # Constants and specs tests
└── e2e/
    └── cabinet-workflow.spec.js # Playwright browser tests
```

---

## Unit Tests

### Testing Approach

The source modules (`site/modules/*.js`) define global functions and classes without ES6 exports. To test them in isolation without modifying the source code, we use Node's VM module to:

1. Load each module into an isolated JavaScript context
2. Capture the global functions and constants defined by the module
3. Run tests against the captured functions

This approach is implemented in `tests/helpers/loadModule.js`.

### Running Unit Tests

```bash
# Run all unit tests
npm test

# Run specific test file
npx vitest run tests/unit/measurements.test.js

# Run tests matching a pattern
npx vitest run --grep "parseFraction"

# Watch mode - re-runs tests on file changes
npm run test:watch
```

### Test Modules

| Test File | Module Tested | Test Count |
|-----------|--------------|------------|
| measurements.test.js | `parseFraction()`, `decimalToFraction()`, `formatMeasurement()` | 19 |
| validation.test.js | `DIMENSION_CONSTRAINTS`, `validateDimension()`, `validateCabinet()` | 36 |
| constants.test.js | `DOOR_SPECS`, `HINGE_TYPES`, `SLIDE_TYPES`, `PULL_TYPES` | 25 |
| historyManager.test.js | `HistoryManager` class (undo/redo) | 40 |
| cabinetClasses.test.js | `Cabinet`, `Door`, `Drawer`, `CabinetComponent` classes | 46 |

**Total: 166 unit tests**

---

## E2E Tests (Playwright)

End-to-end tests run the full application in real browsers to verify user workflows.

### Setup

```bash
# Install Playwright browsers (one-time setup)
npx playwright install --with-deps
```

### Running E2E Tests

```bash
# Run E2E tests (starts local server automatically)
npm run test:e2e

# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run with UI mode (interactive debugging)
npx playwright test --ui

# Run headed (see the browser)
npx playwright test --headed

# Generate HTML report
npx playwright show-report
```

### E2E Test Coverage

The E2E tests verify:

- App loads without console errors
- 3D canvas renders
- Sidebar controls are visible
- Dimension inputs work
- Camera controls function
- Undo/redo buttons exist
- Save/load buttons exist
- Export functionality exists
- Responsive layout works

---

## Coverage

### About Coverage Limitations

The unit tests use Node's VM module to load source files in isolation. This approach was chosen to avoid modifying the existing source code (which uses global functions without ES6 exports).

**Important:** V8 coverage instrumentation does not work with code executed inside VM contexts. Therefore:

- Coverage reports will show 0% for the source modules
- This does NOT mean the code isn't tested
- All 166 tests verify the actual module functionality
- The tests provide functional coverage even if V8 can't measure it

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Alternative Coverage Approach

For accurate coverage metrics, you would need to:

1. Add ES6 exports to source modules
2. Import modules directly in tests instead of using VM
3. Run coverage with the modified imports

This was not done to preserve the original module structure.

---

## Continuous Integration

Tests run automatically on GitHub via `.github/workflows/test.yml`:

1. **On push** to `main` or `create-tests` branches
2. **On pull requests** to `main`

### CI Pipeline

1. **Unit Tests Job:**
   - Installs Node.js 20
   - Runs `npm ci`
   - Runs `npm test`
   - Runs `npm run test:coverage`
   - Uploads coverage artifacts

2. **E2E Tests Job:**
   - Runs after unit tests pass
   - Installs Playwright browsers
   - Runs `npm run test:e2e`
   - Uploads Playwright report artifacts

---

## Troubleshooting

### "Cannot find module" errors

Ensure dependencies are installed:
```bash
npm install
```

### Canvas/WebGL errors

The `vitest-canvas-mock` package mocks canvas for tests. If you see canvas errors, verify the setup file is loaded:

```js
// vitest.config.js should include:
setupFiles: ['./tests/setup.js']
```

### E2E tests fail to find elements

The E2E tests use flexible locators to find UI elements. If the UI structure changes significantly, tests may need updating to match new selectors.

### Playwright browsers not installed

```bash
npx playwright install --with-deps
```

---

## Writing New Tests

### Unit Test Template

```javascript
import { describe, it, expect, beforeAll } from 'vitest';
import { loadModule, getModulePath } from '../helpers/loadModule.js';

describe('Module Name', () => {
  let ctx;

  beforeAll(() => {
    ctx = loadModule(getModulePath('moduleName.js'));
  });

  describe('functionName()', () => {
    it('should do something', () => {
      const result = ctx.functionName(input);
      expect(result).toBe(expectedOutput);
    });
  });
});
```

### E2E Test Template

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/site/index.html');
    await page.waitForTimeout(1000);
  });

  test('should perform action', async ({ page }) => {
    const element = page.locator('selector');
    await expect(element).toBeVisible();
  });
});
```

---

## NPM Scripts Reference

| Script | Description |
|--------|-------------|
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:coverage` | Run unit tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:all` | Run both unit and E2E tests |
