# Quick Reference Guide - Cabinet Designer

## 🚀 Quick Start (5 Minutes)

### To Run the Program:
1. Open `index.html` in your web browser
2. Click "+ Add" to create a cabinet
3. Use the right panel to adjust dimensions
4. Click "Save" when done

---

## 📂 Which File Do I Edit?

| **What You Want To Change** | **File To Edit** | **What To Look For** |
|------------------------------|------------------|----------------------|
| Default cabinet size | `scripts.js` | `createNewCabinet()` function |
| Standard door rail width | `modules/constants.js` | `DOOR_SPECS.shaker.railWidth` |
| Material costs | `scripts.js` | `useState` for `materialCosts` |
| Add new hinge type | `modules/constants.js` | `HINGE_TYPES` array |
| Change fraction display | `modules/measurements.js` | `decimalToFraction()` function |
| Add new icon | `modules/icons.js` | Create new icon component |
| Change how projects save | `modules/projectManager.js` | `saveProjectToStorage()` function |

---

## 🔍 Common Code Locations

### Adding a New Door Style:
**File:** `modules/constants.js`
```javascript
const DOOR_SPECS = {
    shaker: { ... },
    flat: { ... },
    raised: { ... },
    glass: { ... },
    yourNewStyle: {  // Add here
        railWidth: 2.5,
        stileWidth: 2.5,
        ...
    }
}
```

### Changing Default Material:
**File:** `scripts.js` → `createNewCabinet()`
```javascript
material: 'plywood',  // Change this
```

### Adding New Hardware:
**File:** `modules/constants.js`
```javascript
const HINGE_TYPES = [
    'Concealed (Blum)',
    'Your New Hinge'  // Add here
];
```

---

## 🎨 Understanding the Module Structure

```
Your Browser
    ↓
index.html (loads everything)
    ↓
scripts.js (main coordinator)
    ↓
    ├─→ measurements.js ← Converts fractions to decimals
    ├─→ constants.js ← Standard sizes and options
    ├─→ cabinetClasses.js ← Cabinet blueprints
    ├─→ icons.js ← Button graphics
    └─→ projectManager.js ← Save/load projects
```

---

## 💡 Key Programming Concepts (Plain English)

### Import/Export
- **Export** = "Here's some code others can use"
- **Import** = "Let me use code from another file"

Example:
```javascript
// In constants.js
export const DOOR_SPECS = { ... };  // Make this available

// In scripts.js  
import { DOOR_SPECS } from './modules/constants.js';  // Use it here
```

### State (useState)
- **What:** Data that can change
- **When it changes:** The screen updates automatically

Example:
```javascript
const [cabinets, setCabinets] = useState([]);
// cabinets = current list
// setCabinets = function to change the list
```

### Classes
- **What:** A template for creating objects
- **Like:** A blank form you fill out repeatedly

Example:
```javascript
class Cabinet {
    constructor(width, height, depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
}

// Create actual cabinets from the template:
let kitchen = new Cabinet(24, 30, 24);
let bathroom = new Cabinet(18, 30, 18);
```

---

## 🐛 Quick Troubleshooting

| **Problem** | **Solution** |
|-------------|--------------|
| Nothing loads | Open browser console (F12), check for errors |
| Changes don't appear | Hard refresh: Ctrl+F5 (PC) or Cmd+Shift+R (Mac) |
| 3D view is black | Check if Three.js loaded in console |
| Measurements are wrong | Check `modules/measurements.js` |
| Can't find a function | Use editor search (Ctrl+F or Cmd+F) |

---

## 📋 Measurement Input Formats

You can enter measurements in any of these formats:

| **Input** | **Result** | **Type** |
|-----------|-----------|----------|
| `36` | 36.0" | Whole number |
| `36.5` | 36.5" | Decimal |
| `3/4` | 0.75" | Simple fraction |
| `1 1/2` | 1.5" | Mixed fraction |
| `36 3/8` | 36.375" | Mixed number |

The program automatically converts between these formats.

---

## 🎯 Making Your First Change

### Example: Change Default Cabinet Width to 30"

1. Open `scripts.js`
2. Find the `createNewCabinet()` function (use Ctrl+F to search)
3. Look for:
   ```javascript
   width: 24,
   ```
4. Change to:
   ```javascript
   width: 30,
   ```
5. Save the file
6. Refresh your browser (F5)
7. Click "+ Add" to create a new cabinet
8. It will now default to 30" wide!

---

## 📐 Standard Measurements Reference

### Default Cabinet:
- Width: 24"
- Height: 34.5"
- Depth: 24"
- Side thickness: 3/4"

### Default Door Specs (Shaker):
- Rail width: 2.5"
- Stile width: 2.5"
- Panel thickness: 1/4"
- Panel setback: 3/8"

### Default Drawer Box:
- Side thickness: 1/2"
- Bottom thickness: 1/4"
- Front/back height: 4"
- Slide clearance: 1/2"

All these can be changed in `modules/constants.js`

---

## 🔧 Useful Code Snippets

### Adding a Custom Validation:
```javascript
// In scripts.js, in the updateCabinet function
if (property === 'width' && value < 12) {
    alert('Cabinet width must be at least 12 inches');
    return;
}
```

### Adding a New Default Option:
```javascript
// In createNewCabinet()
myNewOption: true,  // Add new property
myNewValue: 5,      // With a default value
```

### Logging for Debugging:
```javascript
// Add this anywhere to see what's happening
console.log('Current cabinets:', cabinets);
console.log('Selected ID:', selectedCabinetId);
```

---

## 📞 Where to Get Help

### In the Code:
- Read the comments (lines starting with //)
- Look for section headers (big comment blocks)
- Check the README_MODULAR.md for detailed explanations

### Online Resources:
- JavaScript: [MDN Web Docs](https://developer.mozilla.org)
- React: [React Official Docs](https://react.dev)
- Three.js: [Three.js Docs](https://threejs.org/docs)

---

## ✅ Remember These Tips

1. **Always make a backup** before editing
2. **Change one thing at a time** and test
3. **Read error messages** - they usually tell you what's wrong
4. **Use browser console** (F12) to see what's happening
5. **Comments are your friends** - read them!

---

## 🎓 Learning Path

### Week 1: Get Comfortable
- Read through all the module files
- Make small changes to default values
- Experiment with different settings

### Week 2: Understand Flow
- Follow how a cabinet is created
- Trace imports from scripts.js to modules
- Understand state management

### Week 3: Make Modifications
- Add a new material type
- Create a new door style
- Customize the default cabinet

### Week 4: Build Features
- Add a new cabinet component type
- Create custom calculations
- Enhance the cut list

---

**Remember:** Every expert was once a beginner. This modular structure makes it easier to learn because everything is organized and explained. Take it step by step! 🚀
