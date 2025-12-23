# Cabinet Designer - Visual Structure Guide

## File Structure Visualization

```
Cabinet-Designer/
│
├── CLAUDE.md ──────────────────── AI assistant instructions
├── README.md ──────────────────── Project overview
│
├── docs/ ──────────────────────── Documentation
│   ├── STRUCTURE_GUIDE.md ─────── This file
│   ├── README_MODULAR.md ──────── Complete module guide
│   ├── QUICK_REFERENCE.md ─────── Quick lookup
│   ├── RoadMap.md ─────────────── Feature roadmap
│   └── (other docs)
│
├── devlog/ ────────────────────── Development logs
│
└── site/ ──────────────────────── Web application
    │
    ├── index.html ─────────────── Entry point
    │       │
    │       ├─── Loads CDN libraries
    │       │    (React, Three.js, Babel)
    │       │
    │       └─── Loads local scripts
    │
    ├── styles.css ─────────────── All CSS styling
    │
    ├── scripts.js ─────────────── Main React app
    │       │
    │       ├─── CabinetDesigner component
    │       ├─── Fraction parsing utilities
    │       ├─── Wood texture generation
    │       ├─── Storage functions
    │       └─── Inline styles
    │
    └── modules/ ───────────────── Feature modules
        ├── measurements.js ────── Fraction/decimal conversion
        ├── constants.js ───────── Standards & specs
        ├── cabinetClasses.js ──── Cabinet/Door/Drawer classes
        ├── icons.js ───────────── SVG icon components
        ├── cameraPresets.js ───── 3D camera positions
        ├── validation.js ──────── Input validation rules
        ├── projectManager.js ──── localStorage save/load
        ├── historyManager.js ──── Undo/redo (50 states)
        ├── keyboardShortcuts.js ─ Keyboard event handling
        ├── shoppingListGenerator.js ─ Material aggregation
        ├── printExport.js ─────── PDF/print generation
        ├── fileImportExport.js ── JSON file download/upload
        └── CabinetDesigner_original.js ─ Legacy backup
```

---

## Running the Application

**A local web server is required** (browsers block `file://` for ES modules):

```bash
# Python (recommended)
python3 -m http.server 8000

# Or Node.js
npx http-server -p 8000
```

Then open: http://localhost:8000/site/index.html

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                     USER IN BROWSER                       │
│              (opens site/index.html)                      │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│                    INDEX.HTML LOADS:                      │
│  • React 18 (from CDN)                                    │
│  • Three.js (3D graphics)                                 │
│  • Babel (JSX transpiler)                                 │
│  • html2pdf.js (PDF export)                               │
│  • Module files (in dependency order)                     │
│  • scripts.js (main application)                          │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│               SCRIPTS.JS USES MODULES:                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  parseFraction() from measurements.js              │  │
│  │  DOOR_SPECS from constants.js                      │  │
│  │  Cabinet class from cabinetClasses.js              │  │
│  │  Icon components from icons.js                     │  │
│  │  saveProjectToStorage() from projectManager.js     │  │
│  │  HistoryManager from historyManager.js             │  │
│  │  generateShoppingList() from shoppingListGenerator │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│           APPLICATION RENDERS IN BROWSER:                 │
│  • 3D cabinet view (Three.js WebGL)                       │
│  • Controls and inputs                                    │
│  • Cut lists and pricing                                  │
│  • Save/load interface                                    │
│  • Shopping list & print features                         │
└──────────────────────────────────────────────────────────┘
```

---

## Module Responsibility Map

```
┌─────────────────────────────────────────────────────┐
│              USER ACTION: "Add Cabinet"              │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │     scripts.js         │
        │  createNewCabinet()    │◄──── Uses default values
        └────────┬───────────────┘       from constants.js
                 │
                 ├─→ Creates new Cabinet object
                 │   (from cabinetClasses.js)
                 │
                 ├─→ Applies default specs
                 │   (from constants.js)
                 │
                 ├─→ Adds to undo history
                 │   (via historyManager.js)
                 │
                 └─→ Updates UI with icons
                     (from icons.js)

┌─────────────────────────────────────────────────────┐
│         USER ACTION: "Enter Measurement"             │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │   measurements.js      │
        │   parseFraction()      │◄──── Converts "1 1/2" to 1.5
        └────────┬───────────────┘
                 │
                 ├─→ validation.js checks constraints
                 │
                 └─→ Returns decimal to scripts.js
                     which updates cabinet dimensions

┌─────────────────────────────────────────────────────┐
│          USER ACTION: "Save Project"                 │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │   projectManager.js    │
        │ saveProjectToStorage() │◄──── Receives cabinet data
        └────────┬───────────────┘       from scripts.js
                 │
                 └─→ Saves to browser localStorage

┌─────────────────────────────────────────────────────┐
│          USER ACTION: "Export to File"               │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │   fileImportExport.js  │
        │   exportProject()      │◄──── Creates JSON file
        └────────┬───────────────┘       for download
                 │
                 └─→ Downloads .json file

┌─────────────────────────────────────────────────────┐
│          USER ACTION: "Print/PDF"                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │     printExport.js     │
        │   generatePDF()        │◄──── Uses html2pdf.js
        └────────┬───────────────┘
                 │
                 └─→ Creates printable document

┌─────────────────────────────────────────────────────┐
│          USER ACTION: "Ctrl+Z" (Undo)                │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │   historyManager.js    │
        │   undo()               │◄──── Restores previous state
        └────────┬───────────────┘       (up to 50 states)
                 │
                 └─→ Updates cabinet state
```

---

## Module Dependencies

### measurements.js
```
┌─────────────────┐
│ measurements.js │
└─────────────────┘
  ↓ Exports:
  • parseFraction()
  • decimalToFraction()
  • formatMeasurement()

  ✓ No dependencies
  ✓ Pure utility functions
```

### constants.js
```
┌─────────────────┐
│  constants.js   │
└─────────────────┘
  ↓ Exports:
  • DOOR_SPECS
  • DRAWER_BOX
  • HINGE_TYPES
  • SLIDE_TYPES
  • PULL_TYPES
  • CONSTRUCTION_TYPES

  ✓ No dependencies
  ✓ Data-only module
```

### cabinetClasses.js
```
┌─────────────────┐
│cabinetClasses.js│
└─────────────────┘
  ↑ Imports from:
  • constants.js

  ↓ Exports:
  • CabinetComponent class
  • Drawer class
  • Door class
  • Cabinet class
```

### validation.js
```
┌─────────────────┐
│  validation.js  │
└─────────────────┘
  ↓ Exports:
  • DIMENSION_CONSTRAINTS
  • validateInput()

  ✓ No dependencies
  ✓ Input validation rules
```

### icons.js
```
┌─────────────────┐
│    icons.js     │
└─────────────────┘
  ↓ Exports:
  • Camera component
  • Box component
  • Save component
  • (all SVG icons)

  ✓ Depends on React (global)
  ✓ UI components only
```

### cameraPresets.js
```
┌─────────────────┐
│cameraPresets.js │
└─────────────────┘
  ↓ Exports:
  • CAMERA_PRESETS

  ✓ No dependencies
  ✓ 3D camera positions
```

### projectManager.js
```
┌─────────────────┐
│projectManager.js│
└─────────────────┘
  ↓ Exports:
  • saveProjectToStorage()
  • loadProjectFromStorage()
  • getAllSavedProjects()
  • deleteProjectFromStorage()

  ✓ Uses browser localStorage
```

### historyManager.js
```
┌─────────────────┐
│historyManager.js│
└─────────────────┘
  ↓ Exports:
  • HistoryManager class
  • undo(), redo()

  ✓ Manages 50 state history
  ✓ No external dependencies
```

### keyboardShortcuts.js
```
┌────────────────────┐
│keyboardShortcuts.js│
└────────────────────┘
  ↓ Exports:
  • KEYBOARD_SHORTCUTS
  • handleKeyboardEvent()

  ✓ No dependencies
  ✓ Keyboard event handling
```

### shoppingListGenerator.js
```
┌────────────────────────┐
│shoppingListGenerator.js│
└────────────────────────┘
  ↓ Exports:
  • generateShoppingList()
  • aggregateMaterials()

  ✓ No dependencies
  ✓ Material calculation logic
```

### printExport.js
```
┌─────────────────┐
│  printExport.js │
└─────────────────┘
  ↓ Exports:
  • generatePDF()
  • formatForPrint()

  ✓ Uses html2pdf.js (global)
```

### fileImportExport.js
```
┌───────────────────┐
│fileImportExport.js│
└───────────────────┘
  ↓ Exports:
  • exportProject()
  • importProject()

  ✓ JSON file download/upload
```

### scripts.js (Main)
```
┌─────────────────┐
│   scripts.js    │
└─────────────────┘
  ↑ Uses ALL modules (loaded globally by index.html)

  ↓ Exports:
  • CabinetDesigner component

  ✓ Coordinates everything
  ✓ Main application logic
  ✓ ~3800 lines
```

---

## Finding Features: Visual Guide

```
WANT TO CHANGE SOMETHING?
         │
         ├─ Measurements/Units? ─────→ site/modules/measurements.js
         │
         ├─ Standard Sizes? ─────────→ site/modules/constants.js
         │   ├─ Door dimensions
         │   ├─ Drawer specs
         │   └─ Hardware options
         │
         ├─ Cabinet Properties? ─────→ site/modules/cabinetClasses.js
         │   ├─ Add new property
         │   ├─ Modify behavior
         │   └─ Add methods
         │
         ├─ Input Validation? ───────→ site/modules/validation.js
         │   └─ DIMENSION_CONSTRAINTS
         │
         ├─ Button Icons? ───────────→ site/modules/icons.js
         │
         ├─ Camera Angles? ──────────→ site/modules/cameraPresets.js
         │
         ├─ Keyboard Shortcuts? ─────→ site/modules/keyboardShortcuts.js
         │
         ├─ Save/Load (localStorage)? → site/modules/projectManager.js
         │
         ├─ Undo/Redo? ──────────────→ site/modules/historyManager.js
         │
         ├─ Shopping List? ──────────→ site/modules/shoppingListGenerator.js
         │
         ├─ Print/PDF? ──────────────→ site/modules/printExport.js
         │
         ├─ File Export/Import? ─────→ site/modules/fileImportExport.js
         │
         └─ App Behavior? ───────────→ site/scripts.js
             ├─ Default cabinet settings
             ├─ Material costs
             ├─ 3D rendering (createWoodTexture)
             └─ Main UI logic
```

---

## Code Organization Levels

```
Level 1: ENTRY
┌──────────────────┐
│ site/index.html  │ ← Browser opens this
└──────┬───────────┘
       │
       └─→ Loads CDN libraries, then local modules, then scripts.js

Level 2: COORDINATION
┌──────────────────┐
│ site/scripts.js  │ ← Main React component, uses all modules
└──────┬───────────┘
       │
       └─→ Uses globals from modules/

Level 3: MODULES (Functional Units)
┌─────────────────────────────────────────────────────────┐
│  measurements.js  │  constants.js    │  validation.js   │
│  cabinetClasses.js│  icons.js        │  cameraPresets.js│
│  projectManager.js│  historyManager.js                  │
│  keyboardShortcuts.js│  shoppingListGenerator.js        │
│  printExport.js   │  fileImportExport.js                │
└─────────────────────────────────────────────────────────┘
       │
       └─→ Each provides specific functionality

Level 4: EXTERNAL LIBRARIES (CDN)
┌─────────────────────────────────────────────────────────┐
│  • React 18          │  • Three.js                      │
│  • Babel (JSX)       │  • html2pdf.js                   │
└─────────────────────────────────────────────────────────┘
```

---

## User Action Flow Example

### Example: User creates a cabinet with a door

```
1. USER CLICKS: "+ Add" button
   ↓
2. scripts.js: createNewCabinet() called
   ↓
3. Creates new cabinet object using Cabinet class
   (from cabinetClasses.js)
   ↓
4. Sets default specs from constants.js
   ↓
5. Adds state to undo history (historyManager.js)
   ↓
6. User enters door width: "23 1/2"
   ↓
7. measurements.js: parseFraction("23 1/2")
   Returns: 23.5
   ↓
8. validation.js: checks against DIMENSION_CONSTRAINTS
   ↓
9. scripts.js: Updates cabinet door width to 23.5
   ↓
10. 3D view re-renders with new dimensions
    ↓
11. User clicks "Save"
    ↓
12. projectManager.js: saveProjectToStorage()
    Saves all cabinet data to browser localStorage
    ↓
13. Success! Project saved.
```

---

## Development Workflow

```
MAKING CHANGES:

1. Start local server
   python3 -m http.server 8000
   ↓
2. Open http://localhost:8000/site/index.html
   ↓
3. Use QUICK_REFERENCE.md to find the right file
   ↓
4. Open that file in editor
   ↓
5. Make your change
   ↓
6. Save the file
   ↓
7. Hard refresh browser (Ctrl+F5 / Cmd+Shift+R)
   ↓
8. Check browser console (F12) for errors
   ↓
9. If works: Done!
   If broken: Undo change, check console errors
```

---

## Quick Reference

### To Change Default Cabinet Size:
```
site/scripts.js
   ↓
createNewCabinet() function
   ↓
width: 24,    ← Change this
height: 34.5, ← Change this
depth: 24,    ← Change this
```

### To Add New Door Style:
```
site/modules/constants.js
   ↓
DOOR_SPECS object
   ↓
Add new style:
yourStyle: {
  railWidth: X,
  stileWidth: Y,
  ...
}
```

### To Add Keyboard Shortcut:
```
site/modules/keyboardShortcuts.js
   ↓
KEYBOARD_SHORTCUTS object
   ↓
Add new shortcut:
'ctrl+n': { action: 'newCabinet', description: 'Create new cabinet' }
```

### To Change Camera Angle:
```
site/modules/cameraPresets.js
   ↓
CAMERA_PRESETS object
   ↓
Modify position values
```

### To Modify 3D Material Colors:
```
site/scripts.js
   ↓
createWoodTexture() function
   ↓
Modify color values
```

---

## See Also

- **README_MODULAR.md** - Detailed module explanations
- **QUICK_REFERENCE.md** - Specific how-tos
- **CLAUDE.md** - AI assistant instructions (root directory)
