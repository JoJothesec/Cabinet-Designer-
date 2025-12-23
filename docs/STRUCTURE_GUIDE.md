# Cabinet Designer - Visual Structure Guide

## 🎨 File Structure Visualization

```
Cabinet-Designer/
│
├── 🌐 ENTRY POINT
│   └── index.html ──────────────┐
│                                 │
├── 🎨 STYLING                    │
│   └── styles.css                │
│                                 │
├── 📜 MAIN SCRIPT                │
│   └── scripts.js  ◄─────────────┘
│        │
│        ├─── Imports all modules
│        ├─── Coordinates everything
│        ├─── Starts the application
│        └─── Displays the UI
│
├── 📚 DOCUMENTATION
│   ├── README_MODULAR.md ──────── Complete guide
│   ├── QUICK_REFERENCE.md ──────── Quick lookup
│   └── REFACTORING_SUMMARY.md ─── This refactoring
│
├── 💾 BACKUPS
│   └── scripts.js.backup ──────── Original code
│
└── 📁 modules/ ──────────────────── Organized code modules
    ├── measurements.js ─────────── Fraction ↔ Decimal
    ├── constants.js ───────────── Standards & Options
    ├── cabinetClasses.js ──────── Cabinet Blueprints
    ├── icons.js ───────────────── UI Icons
    ├── projectManager.js ──────── Save/Load
    └── CabinetDesigner_original.js ─ Full original
```

---

## 🔄 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                     USER IN BROWSER                       │
│                  (opens index.html)                       │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│                    INDEX.HTML LOADS:                      │
│  • React library                                          │
│  • Three.js (3D graphics)                                 │
│  • Babel (JavaScript transformer)                         │
│  • scripts.js (main application)                          │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│                   SCRIPTS.JS IMPORTS:                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │  import { parseFraction } from 'measurements.js'   │  │
│  │  import { DOOR_SPECS } from 'constants.js'         │  │
│  │  import { Cabinet } from 'cabinetClasses.js'       │  │
│  │  import { Save } from 'icons.js'                   │  │
│  │  import { saveProject } from 'projectManager.js'   │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│              MODULES PROVIDE FUNCTIONALITY:               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │measurements.js│  │ constants.js │  │cabinetClasses│   │
│  │              │  │              │  │    .js       │   │
│  │• Convert     │  │• Door specs  │  │• Cabinet     │   │
│  │  fractions   │  │• Hardware    │  │• Door        │   │
│  │• Format      │  │• Standards   │  │• Drawer      │   │
│  │  display     │  │              │  │  classes     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                           │
│  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │   icons.js   │  │     projectManager.js            │ │
│  │              │  │                                  │ │
│  │• Camera      │  │• Save to localStorage            │ │
│  │• Save        │  │• Load projects                   │ │
│  │• Plus        │  │• Delete projects                 │ │
│  │• etc.        │  │• List all projects               │ │
│  └──────────────┘  └──────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│           APPLICATION RENDERS IN BROWSER:                 │
│  • 3D cabinet view                                        │
│  • Controls and inputs                                    │
│  • Cut lists and pricing                                  │
│  • Save/load interface                                    │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Module Responsibility Map

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
```

---

## 📦 Module Dependencies

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
  ✓ Standalone module
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
  ✓ Easy to modify
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
  
  ✓ Depends on constants
  ✓ Provides blueprints
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
  • (all icons)
  
  ✓ Depends on React
  ✓ UI components only
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
  ✓ No other dependencies
```

### scripts.js (Main)
```
┌─────────────────┐
│   scripts.js    │
└─────────────────┘
  ↑ Imports ALL modules:
  • measurements.js
  • constants.js
  • cabinetClasses.js
  • icons.js
  • projectManager.js
  
  ↓ Exports:
  • CabinetDesigner component
  
  ✓ Coordinates everything
  ✓ Main application logic
```

---

## 🔍 Finding Features: Visual Guide

```
WANT TO CHANGE SOMETHING?
         │
         ├─ Measurements/Units? ─────→ modules/measurements.js
         │
         ├─ Standard Sizes? ─────────→ modules/constants.js
         │   ├─ Door dimensions
         │   ├─ Drawer specs
         │   └─ Hardware options
         │
         ├─ Cabinet Properties? ─────→ modules/cabinetClasses.js
         │   ├─ Add new property
         │   ├─ Modify behavior
         │   └─ Add methods
         │
         ├─ Button Icons? ───────────→ modules/icons.js
         │   ├─ Modify existing
         │   └─ Add new icon
         │
         ├─ Save/Load? ─────────────→ modules/projectManager.js
         │   ├─ Change save format
         │   └─ Modify storage
         │
         └─ App Behavior? ──────────→ scripts.js
             ├─ Default cabinet settings
             ├─ Material costs
             └─ UI logic
```

---

## 📊 Code Organization Levels

```
Level 1: ENTRY
┌──────────────┐
│ index.html   │ ← Browser opens this
└──────┬───────┘
       │
       └─→ Loads scripts.js

Level 2: COORDINATION
┌──────────────┐
│ scripts.js   │ ← Imports and coordinates all modules
└──────┬───────┘
       │
       └─→ Imports from modules/

Level 3: MODULES (Functional Units)
┌─────────────────────────────────────────┐
│  measurements.js  │  constants.js       │
│  cabinetClasses.js│  icons.js           │
│  projectManager.js│                     │
└─────────────────────────────────────────┘
       │
       └─→ Each provides specific functionality

Level 4: DATA & UTILITIES
┌─────────────────────────────────────────┐
│  • Functions that transform data        │
│  • Classes that define structures       │
│  • Constants that store standards       │
│  • Components that display UI           │
└─────────────────────────────────────────┘
```

---

## 🎬 User Action Flow Example

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
5. User enters door width: "23 1/2"
   ↓
6. measurements.js: parseFraction("23 1/2")
   Returns: 23.5
   ↓
7. scripts.js: Updates cabinet door width to 23.5
   ↓
8. 3D view re-renders with new dimensions
   ↓
9. User clicks "Save"
   ↓
10. projectManager.js: saveProjectToStorage()
    Saves all cabinet data to browser
    ↓
11. Success! Project saved.
```

---

## 📈 Complexity Reduction

### Before Refactoring:
```
┌────────────────────────────────────────┐
│                                        │
│         scripts.js                     │
│         (2,639 lines)                  │
│                                        │
│  • Everything mixed together           │
│  • Hard to find features               │
│  • Risky to modify                     │
│  • Minimal documentation               │
│                                        │
└────────────────────────────────────────┘
```

### After Refactoring:
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│measure-  │constants │cabinet   │  icons   │ project  │
│ments.js  │   .js    │Classes   │   .js    │Manager   │
│(156 lines│(242 lines│   .js    │(191 lines│   .js    │
│          │          │(374 lines│          │(199 lines│
├──────────┴──────────┴──────────┴──────────┴──────────┤
│                  scripts.js                           │
│              (400+ lines, well-organized)             │
├───────────────────────────────────────────────────────┤
│  • Clear separation                                   │
│  • Easy to find features                              │
│  • Safe to modify                                     │
│  • Extensively documented                             │
└───────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Visual Reference

### To Change Default Cabinet Size:
```
scripts.js
   ↓
createNewCabinet() function
   ↓
width: 24,    ← Change this
height: 34.5, ← Change this  
depth: 24,    ← Change this
```

### To Add New Door Style:
```
modules/constants.js
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

### To Modify Fraction Display:
```
modules/measurements.js
   ↓
decimalToFraction() function
   ↓
Modify the conversion logic
```

---

## 🚀 Getting Started Path

```
START HERE
   │
   ↓
1. Read REFACTORING_SUMMARY.md (you are here!)
   │
   ↓
2. Skim README_MODULAR.md
   │
   ↓
3. Open each module file, read the header comments
   │
   ↓
4. Try running index.html in browser
   │
   ↓
5. Make a small change (use QUICK_REFERENCE.md)
   │
   ↓
6. Test your change
   │
   ↓
7. Experiment more!
   │
   ↓
BECOME PROFICIENT! 🎉
```

---

## 📝 Maintenance Workflow

```
WHEN YOU NEED TO MAKE A CHANGE:

1. Identify Feature
   ↓
2. Use QUICK_REFERENCE.md to find the right file
   ↓
3. Open that file
   ↓
4. Read the comments around that section
   ↓
5. Make your change
   ↓
6. Save the file
   ↓
7. Refresh browser (Ctrl+F5)
   ↓
8. Test the change
   ↓
9. Check browser console for errors
   ↓
10. If works: Done! ✅
    If broken: Undo change, try again 🔄
```

---

This visual guide helps you see the big picture of how everything connects. Keep this handy when navigating the codebase!

📚 See also:
- README_MODULAR.md for detailed explanations
- QUICK_REFERENCE.md for specific how-tos
- REFACTORING_SUMMARY.md for the complete overview
