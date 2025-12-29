# Cabinet Designer Pro - Test Plan

## Status: ✅ Implemented

All testing infrastructure described in this plan has been implemented and is working.

---

## Approach

**No changes to existing source files.** All tests run without modifying the codebase.

- **Unit Tests:** Use VM evaluation to load global functions from module files
- **E2E Tests:** Playwright runs in real browser - no code changes needed

---

## Testing Stack

| Tool | Purpose | Status |
|------|---------|--------|
| Vitest | Unit test runner | ✅ Implemented |
| jsdom + vitest-canvas-mock | DOM/Canvas environment | ✅ Implemented |
| Playwright | E2E browser testing | ✅ Implemented |
| GitHub Actions | CI/CD pipeline | ✅ Implemented |

---

## Unit Tests

### Test Results Summary

| Test File | Module | Tests | Status |
|-----------|--------|-------|--------|
| measurements.test.js | measurements.js | 19 | ✅ Pass |
| validation.test.js | validation.js | 36 | ✅ Pass |
| constants.test.js | constants.js | 25 | ✅ Pass |
| historyManager.test.js | historyManager.js | 40 | ✅ Pass |
| cabinetClasses.test.js | cabinetClasses.js | 46 | ✅ Pass |
| **Total** | | **166** | ✅ **All Pass** |

### VM Module Loader

Since modules define global functions without exports, we use a helper to load them:

```javascript
// tests/helpers/loadModule.js
import { readFileSync } from 'fs';
import vm from 'vm';

export function loadModule(modulePath, preloadContext = {}) {
  const code = readFileSync(modulePath, 'utf-8');
  const context = vm.createContext({ ...preloadContext, console, Math, JSON, ... });
  // Wrap code to capture const/let declarations
  vm.runInContext(wrappedCode, context);
  return context;
}
```

### Test Coverage Details

#### 1. measurements.test.js ✅
**Module:** `site/modules/measurements.js`

| Function | Test Cases |
|----------|-----------|
| `parseFraction()` | Whole numbers, decimals, simple fractions, mixed numbers, quotes, empty strings, whitespace, invalid input |
| `decimalToFraction()` | Whole numbers, zero, halves, quarters, eighths, sixteenths, mixed numbers, rounding to 32nds |
| `formatMeasurement()` | Zero/negative values, combined fraction and decimal output |

#### 2. validation.test.js ✅
**Module:** `site/modules/validation.js`

| Test Area | Test Cases |
|-----------|-----------|
| `DIMENSION_CONSTRAINTS` | Width/height/depth limits, positive min values, max > min, drawer constraints, door constraints |
| `validateDimension()` | Valid dimensions, below/above min/max for all dimension types, boundary values, unknown types |
| `validateCabinetDimensions()` | Proper sizing, extreme ratios, depth vs width warnings |
| `validateDrawerConfiguration()` | No drawers, height limits, overlapping drawers, extending beyond cabinet |
| `validateCabinet()` | Full validation, error separation |
| `getValidationSummary()` | Success message, error/warning/suggestion formatting |

#### 3. constants.test.js ✅
**Module:** `site/modules/constants.js`

| Constant | Test Cases |
|----------|-----------|
| `DOOR_SPECS` | All door styles defined, required properties for shaker/flat/raised/glass, positive values |
| `DRAWER_BOX` | All properties defined, positive values |
| `HINGE_TYPES` | Array with expected options, string values |
| `SLIDE_TYPES` | Array with expected options, string values |
| `PULL_TYPES` | Array with expected options, string values |
| `CONSTRUCTION_TYPES` | Frameless and faceFrame types with properties |

#### 4. historyManager.test.js ✅
**Module:** `site/modules/historyManager.js`

| Method | Test Cases |
|--------|-----------|
| Constructor | Empty history, currentIndex = -1, maxSize = 50 |
| `pushState()` | Adds state, increments index, deep copies, stores metadata, clears redo stack, enforces 50-state limit |
| `undo()` | Returns previous state, decrements index, null at beginning, maintains redo stack |
| `redo()` | Returns next state, increments index, null at end |
| `canUndo()`/`canRedo()` | Correct boolean returns for all states |
| `getCurrentState()` | Returns current, null when empty |
| `jumpTo()` | Jumps to index, returns state, null for invalid |
| `getTimeline()` | Returns entries with descriptions, marks current |
| `clear()`/`size()` | Clears history, returns size |
| Description methods | Current, undo, redo descriptions |

#### 5. cabinetClasses.test.js ✅
**Module:** `site/modules/cabinetClasses.js`

| Class | Test Cases |
|-------|-----------|
| `CabinetComponent` | Constructor sets dimensions, material defaults to Oak, thickness defaults to 0.75 |
| `Drawer` | Dimensions, material, thickness (default 0.5), slide/pull types |
| `Door` | Dimensions, material, door style (default shaker), hinge/pull types |
| `Cabinet` | Constructor creates sides/back/empty drawers/null door |
| `Cabinet.addDrawer()` | Adds to array, returns drawer, accepts custom params |
| `Cabinet.removeDrawer()` | Removes by index, handles invalid indices |
| `Cabinet.setDoor()` | Creates door, replaces existing, custom params |
| `Cabinet.removeDoor()` | Sets door to null |
| `Cabinet.updateSides()`/`updateBack()` | Updates components with new dimensions |

---

## E2E Tests (Playwright) ✅

### cabinet-workflow.spec.js

| Test Category | Tests |
|--------------|-------|
| App Loading | Console errors, 3D canvas renders, sidebar visible |
| Cabinet Creation | Default cabinet creation |
| Dimension Inputs | Width/height/depth inputs, fraction format |
| Camera Controls | View buttons, mouse interaction |
| Undo/Redo | Buttons visible, Ctrl+Z shortcut |
| Project Save/Load | Save/load buttons visible |
| Export Features | Export/print button visible |
| Door and Drawer Controls | Door style selector, add drawer control |
| Material Selection | Material selector visible |
| Responsive Layout | Mobile viewport adjustment |

---

## File Structure

```
tests/
├── test-plan.md             # This file
├── setup.js                 # Vitest setup (canvas mock)
├── helpers/
│   └── loadModule.js        # VM-based module loader
├── unit/
│   ├── measurements.test.js
│   ├── validation.test.js
│   ├── cabinetClasses.test.js
│   ├── historyManager.test.js
│   └── constants.test.js
└── e2e/
    └── cabinet-workflow.spec.js
```

---

## Running Tests

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run E2E tests (first time: npx playwright install)
npm run test:e2e

# Run all tests
npm run test:all
```

---

## CI/CD

GitHub Actions workflow (`.github/workflows/test.yml`) runs automatically on:
- Push to `main` or `create-tests` branches
- Pull requests to `main`

Pipeline:
1. Unit tests with coverage
2. E2E tests (after unit tests pass)
3. Uploads test reports as artifacts

---

## Coverage Notes

V8 coverage cannot instrument code loaded via Node's VM module. Coverage reports show 0% for source modules, but this does not reflect actual test coverage. All 166 unit tests verify module functionality through the VM loader approach.

See `docs/testing.md` for detailed documentation.
