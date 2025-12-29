# Cabinet Designer Pro - Test Plan

## Approach

**No changes to existing source files.** All tests run without modifying the codebase.

- **Unit Tests:** Use VM evaluation to load global functions from module files
- **E2E Tests:** Playwright runs in real browser - no code changes needed

---

## Testing Stack

| Tool | Purpose |
|------|---------|
| Vitest | Unit test runner |
| jsdom + vitest-canvas-mock | DOM/Canvas environment |
| Playwright | E2E browser testing |
| GitHub Actions | CI/CD pipeline |

---

## Unit Tests

### VM Module Loader

Since modules define global functions without exports, we'll use a helper to load them:

```javascript
// tests/helpers/loadModule.js
import { readFileSync } from 'fs';
import vm from 'vm';
import path from 'path';

export function loadModule(modulePath, preloadContext = {}) {
  const code = readFileSync(modulePath, 'utf-8');
  const context = vm.createContext({ ...preloadContext, console });
  vm.runInContext(code, context);
  return context;
}
```

### Test Files

#### 1. measurements.test.js
**Module:** `site/modules/measurements.js`

| Function | Test Cases |
|----------|-----------|
| `parseFraction()` | Whole numbers: `"36"` → `36` |
| | Decimals: `"36.5"` → `36.5` |
| | Simple fractions: `"3/4"` → `0.75` |
| | Mixed numbers: `"1 1/2"` → `1.5` |
| | Complex: `"36 3/8"` → `36.375` |
| | With quotes: `'3/4"'` → `0.75` |
| | Empty string: `""` → `0` |
| | Already a number: `36` → `36` |
| | Negative: `"-1/2"` → `-0.5` |
| `decimalToFraction()` | Whole: `36` → `"36"` |
| | Half: `0.5` → `"1/2"` |
| | Quarter: `0.25` → `"1/4"` |
| | Eighth: `0.125` → `"1/8"` |
| | Sixteenth: `0.0625` → `"1/16"` |
| | Mixed: `1.5` → `"1 1/2"` |
| | Complex: `36.375` → `"36 3/8"` |
| `formatMeasurement()` | Decimal format output |
| | Fraction format output |

#### 2. validation.test.js
**Module:** `site/modules/validation.js`

| Test Area | Test Cases |
|-----------|-----------|
| `DIMENSION_CONSTRAINTS` | Contains width, height, depth limits |
| | Min values are positive |
| | Max values exceed min values |
| `validateDimension()` | Valid dimensions pass |
| | Below min width fails/warns |
| | Above max width fails/warns |
| | Below min height fails/warns |
| | Above max height fails/warns |
| | Below min depth fails/warns |
| | Above max depth fails/warns |
| | Boundary values (exactly at min/max) |

#### 3. cabinetClasses.test.js
**Module:** `site/modules/cabinetClasses.js`
**Depends on:** `site/modules/constants.js` (preload)

| Class | Test Cases |
|-------|-----------|
| `CabinetComponent` | Constructor sets dimensions |
| | Constructor sets material |
| | Constructor sets thickness |
| `Cabinet` | Constructor with default values |
| | Constructor with custom dimensions |
| | Has sides (left, right) |
| | Has back panel |
| | Drawers array initialized empty |
| | Door initialized null |
| | `addDoor()` creates door |
| | `removeDoor()` clears door |
| | `addDrawer()` adds to array |
| | `removeDrawer()` removes from array |
| `Door` | Constructor sets dimensions |
| | Constructor sets style |
| | Hardware assignment |
| `Drawer` | Constructor sets dimensions |
| | Slide type assignment |
| | Pull type assignment |

#### 4. historyManager.test.js
**Module:** `site/modules/historyManager.js`

| Method | Test Cases |
|--------|-----------|
| Constructor | Initializes empty history |
| | Sets max states (50) |
| `pushState()` | Adds state to history |
| | Increments current index |
| | Clears redo stack on new push |
| | Enforces 50-state limit (drops oldest) |
| `undo()` | Returns previous state |
| | Decrements current index |
| | Returns null at beginning |
| | Maintains redo stack |
| `redo()` | Returns next state |
| | Increments current index |
| | Returns null at end |
| `canUndo()` | True when history exists |
| | False at beginning |
| `canRedo()` | True when redo available |
| | False at end |
| `jumpTo()` | Jumps to specific index |
| | Returns state at index |

#### 5. constants.test.js
**Module:** `site/modules/constants.js`

| Constant | Test Cases |
|----------|-----------|
| `DOOR_SPECS` | Contains expected door styles |
| | Each style has required properties |
| `HINGE_TYPES` | Contains expected hinge options |
| | Each has name and price |
| `SLIDE_TYPES` | Contains expected slide options |
| | Each has name and price |
| `PULL_TYPES` | Contains expected pull options |
| | Each has name and price |

---

## E2E Tests (Playwright)

### cabinet-workflow.spec.js

| Test | Description |
|------|-------------|
| App loads | Page loads without console errors |
| | 3D canvas renders |
| | Sidebar controls visible |
| Create cabinet | Default cabinet appears in scene |
| | Cabinet has correct default dimensions |
| Modify dimensions | Width input changes cabinet |
| | Height input changes cabinet |
| | Depth input changes cabinet |
| | Fraction input works (`"36 1/2"`) |
| Add door | Door appears on cabinet |
| | Door style selector works |
| Add drawer | Drawer appears on cabinet |
| | Multiple drawers can be added |
| Camera controls | Number keys switch views |
| | Mouse drag rotates view |
| | Scroll wheel zooms |
| Undo/Redo | Ctrl+Z undoes last action |
| | Ctrl+Y redoes action |
| | Undo button works |
| | Redo button works |
| Project save | Save button works |
| | Project persists after reload |
| Export | PDF export triggers download |
| | JSON export triggers download |

---

## File Structure

```
tests/
├── unit-test-plan.md        # This file
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

## Implementation Order

1. Create `package.json` and install dependencies
2. Create `vitest.config.js`
3. Create `tests/setup.js`
4. Create `tests/helpers/loadModule.js`
5. Create `tests/unit/measurements.test.js` (validate setup works)
6. Create remaining unit tests
7. Create `playwright.config.js`
8. Create `tests/e2e/cabinet-workflow.spec.js`
9. Create `.github/workflows/test.yml`

---

## Dependencies

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "jsdom": "^25.0.0",
    "vitest-canvas-mock": "^0.3.0",
    "@playwright/test": "^1.48.0"
  }
}
```

---

## npm Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```
