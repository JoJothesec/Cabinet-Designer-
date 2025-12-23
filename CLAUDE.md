# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cabinet Designer Pro is a browser-based 3D cabinet design tool built with React 18 and Three.js. It runs entirely client-side with no backend - all data is stored in browser localStorage.

## Running the Application

**A local web server is required** (browser CORS blocks `file://` protocol):

```bash
# Python (recommended)
python3 -m http.server 8000

# Or Node.js
npx http-server -p 8000
```

Then open: http://localhost:8000/site/index.html

## Development Workflow

- No build step required - edit files and hard refresh (Ctrl+F5 / Cmd+Shift+R)
- All JavaScript uses ES6+ with JSX transpiled by Babel in-browser
- Check browser console (F12) for errors after changes

## Code Architecture

### Entry Point
`site/index.html` loads CDN libraries (React, Three.js, Babel, html2pdf) then module files in order, then `site/scripts.js`.

### Main Files
- **site/scripts.js** - Main React component (`CabinetDesigner`), fraction parsing utilities, storage functions, wood texture generation, and inline styles
- **site/styles.css** - All CSS styling

### Module Files (modules/)
Files must load in dependency order (handled by index.html):

| Module | Purpose |
|--------|---------|
| measurements.js | Fraction/decimal conversion (`parseFraction`, `decimalToFraction`) |
| constants.js | Standard specs: `DOOR_SPECS`, `DRAWER_BOX`, `HINGE_TYPES`, `SLIDE_TYPES` |
| cabinetClasses.js | Classes: `Cabinet`, `Door`, `Drawer`, `CabinetComponent` |
| icons.js | SVG icon React components |
| cameraPresets.js | 3D camera positioning presets |
| validation.js | Input validation rules and `DIMENSION_CONSTRAINTS` |
| projectManager.js | localStorage save/load operations |
| historyManager.js | Undo/redo state management (50 states) |
| keyboardShortcuts.js | `KEYBOARD_SHORTCUTS` and keyboard event handling |
| shoppingListGenerator.js | Material aggregation logic |
| printExport.js | PDF/print generation |
| fileImportExport.js | JSON file download/upload |

## Key Patterns

### State Management
All cabinet data flows through React's `useState`. State changes trigger 3D re-renders:
```
User Input → Validation → setCabinets() → Three.js Re-render
```

### Measurement System
Supports multiple input formats: `36`, `36.5`, `3/4`, `1 1/2`, `36 3/8`. Use `parseFraction()` to convert to decimal, `decimalToFraction()` to display.

### Three.js Integration
- WebGL canvas renders cabinets in real-time
- Wood textures generated dynamically with Canvas API
- `createWoodTexture()` in scripts.js handles material colors

### Data Storage
Projects stored as JSON in localStorage. Export/import via file download creates `.json` files.

## Common Modifications

| Task | Location |
|------|----------|
| Change default cabinet size | `scripts.js` → `createNewCabinet()` |
| Add door style | `constants.js` → `DOOR_SPECS` object |
| Add hardware option | `constants.js` → `HINGE_TYPES`, `SLIDE_TYPES`, or `PULL_TYPES` |
| Change material prices | `scripts.js` → `materialCosts` useState |
| Modify validation rules | `validation.js` → `DIMENSION_CONSTRAINTS` |
| Add keyboard shortcut | `keyboardShortcuts.js` → `KEYBOARD_SHORTCUTS` |
| Change camera angles | `cameraPresets.js` → `CAMERA_PRESETS` |
| Modify 3D material colors | `scripts.js` → `createWoodTexture()` |

## Project Structure

```
Cabinet-Designer-/
├── site/
│   ├── index.html          # Entry point - loads all scripts
│   ├── scripts.js          # Main React app (~3800 lines)
│   ├── styles.css          # Styling
│   └── modules/            # Feature modules (symlinked to ../modules)
├── modules/                # Modular JS files
├── docs/                   # Project documentation and roadmaps
└── README.md
```

## Debugging

- App doesn't load: Check console for errors, verify HTTP server running
- Changes don't appear: Hard refresh browser, check for JS syntax errors
- Projects not saving: Check localStorage limits, browser privacy mode disables storage
- 3D view issues: Verify Three.js loaded, check WebGL support
