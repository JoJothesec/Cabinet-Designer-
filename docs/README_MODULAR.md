# Cabinet Designer - Modular Code Structure

## 🎯 What This Program Does

This is a **3D Cabinet Design Tool** that helps you:
- Design custom cabinets with doors, drawers, and shelves
- See your cabinets in 3D before building them
- Get precise measurements and cut lists for construction
- Calculate material costs and project pricing
- Save and load multiple cabinet projects

Think of it like **CAD software specifically for cabinet makers** - it does the math and measurements for you, shows you what the finished product will look like, and generates everything you need to build it.

---

## 📁 File Structure Overview

Your project is now organized into **clear, separate files** instead of one huge file. Here's what each file does:

```
Cabinet-Designer/
│
├── index.html                 ← The webpage (opens in browser)
├── styles.css                 ← Visual styling (colors, fonts, layouts)
├── scripts.js                 ← MAIN ENTRY POINT (starts everything)
│
└── modules/                   ← Folder with all the modular code
    ├── measurements.js        ← Fraction/decimal conversion functions
    ├── constants.js           ← Standard specs (door sizes, hardware)
    ├── cabinetClasses.js      ← Blueprints for cabinets/doors/drawers
    ├── icons.js               ← Visual icons for buttons
    ├── projectManager.js      ← Save/load project functions
    └── CabinetDesigner_original.js  ← Original full code (backup reference)
```

---

## 🔧 How The Files Work Together

Think of it like a workshop where each file is a different workbench:

1. **index.html** - The shop door (where you enter)
2. **scripts.js** - The master blueprint that coordinates everything
3. **modules/measurements.js** - The measurement conversion table
4. **modules/constants.js** - Your reference sheet of standard sizes
5. **modules/cabinetClasses.js** - Cabinet design templates
6. **modules/icons.js** - The pictures on your tools
7. **modules/projectManager.js** - Your filing cabinet for saving work

### How They Connect:

```
index.html
    ↓
scripts.js (imports everything)
    ↓
    ├─→ measurements.js (for converting fractions)
    ├─→ constants.js (for standard sizes)
    ├─→ cabinetClasses.js (for creating cabinets)
    ├─→ icons.js (for button graphics)
    └─→ projectManager.js (for saving/loading)
```

---

## 📘 Detailed File Descriptions

### **1. index.html** - The Webpage
**What it is:** The HTML file that loads in your web browser.

**What it does:**
- Sets up the page structure
- Loads all necessary libraries (React, Three.js, etc.)
- Loads your main application script

**When to edit:** Almost never, unless you need to add new libraries.

---

### **2. scripts.js** - Main Application Entry Point
**What it is:** The starting point that loads everything else.

**What it does:**
- Imports all the module files
- Starts the React application
- Displays the user interface

**When to edit:** When adding new modules or changing how the app starts.

**Important sections:**
- Import statements at the top (loads other files)
- `CabinetDesigner` component (the main app)
- `ReactDOM.render()` at the bottom (displays the app)

---

### **3. modules/measurements.js** - Measurement Conversions
**What it does:** Converts between fractions and decimals.

**Why you need it:** Carpenters think in fractions (3/4", 1 1/2"), but computers need decimals (0.75, 1.5). This file translates between them.

**Functions inside:**
- `parseFraction()` - Converts "3/4" to 0.75
- `decimalToFraction()` - Converts 0.75 to "3/4"
- `formatMeasurement()` - Displays both formats nicely

**When to edit:** When you want to change how measurements are displayed or add new fraction formats.

**Example use:**
```javascript
parseFraction("1 1/2")  // Returns 1.5
decimalToFraction(0.75)  // Returns "3/4""
```

---

### **4. modules/constants.js** - Standard Specifications
**What it does:** Stores all standard measurements and options.

**Why you need it:** Keeps all your standard sizes in one place. If you change a standard (like rail width), you only change it here.

**What's inside:**
- `DOOR_SPECS` - Measurements for shaker, flat, raised, and glass doors
- `DRAWER_BOX` - Standard drawer box dimensions
- `HINGE_TYPES` - List of available hinges
- `SLIDE_TYPES` - List of drawer slide options
- `PULL_TYPES` - List of handle/pull options
- `CONSTRUCTION_TYPES` - Frameless vs. face frame specs

**When to edit:** 
- When your shop standards change
- To add new hardware options
- To add new door styles

**Example - Changing shaker rail width:**
```javascript
// Find this in constants.js:
shaker: { 
    railWidth: 2.5,  // Change this number
    stileWidth: 2.5,
    panelThickness: 0.25,
    panelSetback: 0.375
}
```

---

### **5. modules/cabinetClasses.js** - Cabinet Blueprints
**What it does:** Defines what information a cabinet, door, or drawer needs.

**Why you need it:** Creates templates (classes) for cabinet parts. When you create a new cabinet, you use these templates.

**Classes inside:**
- `CabinetComponent` - Basic component (sides, shelves, etc.)
- `Drawer` - Drawer with all its properties
- `Door` - Door with all its properties  
- `Cabinet` - Complete cabinet with all parts

**When to edit:** When you want to add new properties to cabinets (like new options or features).

**Example - How a cabinet is created:**
```javascript
// Using the Cabinet class:
let myCabinet = new Cabinet(24, 30, 24);  // width, height, depth
myCabinet.addDrawer(22, 6, 22);  // Add a drawer
myCabinet.setDoor(23, 29, 0.75, 'Oak', 0.75, 'shaker');  // Add door
```

---

### **6. modules/icons.js** - Visual Icons
**What it does:** Defines all the small graphics (icons) used on buttons.

**Why you need it:** Makes buttons recognizable with pictures instead of just text.

**Icons included:**
- Camera, Box, Ruler, FileText, Download
- Plus, Trash2, Save, FolderOpen, DollarSign

**When to edit:** When you want to add new icons or change existing ones.

**Example - Using an icon:**
```javascript
<button>
  <Save size={18} />  {/* Shows save icon */}
  Save Project
</button>
```

---

### **7. modules/projectManager.js** - Save & Load Projects
**What it does:** Saves your work to the browser and loads it back later.

**Why you need it:** So you don't lose your work when you close the browser.

**Functions inside:**
- `saveProjectToStorage()` - Saves a project
- `loadProjectFromStorage()` - Loads a specific project
- `getAllSavedProjects()` - Lists all saved projects
- `deleteProjectFromStorage()` - Deletes a project

**Important to know:** 
- Data is saved in **your browser** (localStorage)
- Data stays on **your computer only**
- Clearing browser data will delete saved projects
- For permanent backups, export to PDF or CSV

**When to edit:** When you want to change how projects are saved or add new save features.

---

## 🎯 How to Use The Program

### Starting the Program:
1. Open `index.html` in a web browser (Chrome, Firefox, Safari, etc.)
2. The 3D cabinet designer will load
3. Click "Add" to create your first cabinet

### Basic Workflow:
1. **Add a Cabinet** - Click the "+ Add" button in the Cabinets panel
2. **Set Dimensions** - Use the right sidebar to enter width, height, depth
3. **Add Doors/Drawers** - Set how many doors and add drawers as needed
4. **View in 3D** - Rotate by dragging, zoom with mouse wheel
5. **Get Cut List** - Click "Cut List" to see all parts and measurements
6. **Save Project** - Click "Save" and give your project a name

### Tips:
- **Double-click** a cabinet in 3D to select it
- **Delete key** removes selected items
- Use **fractions** in inputs: type "1 1/2" or "3/4"
- **Drag** to rotate the 3D view
- **Mouse wheel** to zoom in/out

---

## 🛠️ Common Customizations

### Change Default Cabinet Size:
**File:** `scripts.js`  
**Section:** `createNewCabinet()` function  
**Edit:**
```javascript
width: 24,   // Change these numbers
height: 34.5,
depth: 24,
```

### Change Standard Door Rail Width:
**File:** `modules/constants.js`  
**Edit:**
```javascript
shaker: { 
    railWidth: 2.5,  // Change this
    stileWidth: 2.5,
    ...
}
```

### Add New Hardware Option:
**File:** `modules/constants.js`  
**Edit:**
```javascript
const HINGE_TYPES = [
    'Concealed (Blum)',
    'Concealed (Grass)',
    'European',
    'Butt Hinge',
    'Your New Hinge Type'  // Add here
];
```

### Change Material Costs:
**File:** `scripts.js`  
**Section:** `useState` for `materialCosts`  
**Edit:**
```javascript
const [materialCosts, setMaterialCosts] = useState({
    'plywood': 45,    // Change these prices
    'hardwood': 75,
    'mdf': 35,
    // Add new materials here
    'bamboo': 90
});
```

---

## 🔍 Understanding The Code Structure

### What is a "Module"?
A module is a separate file that contains related code. Instead of one giant file with everything mixed together, we split it into organized pieces.

**Benefits:**
- **Easier to find** things (measurements are in measurements.js)
- **Easier to edit** (change constants without touching other code)
- **Easier to understand** (each file has one clear purpose)
- **Easier to debug** (problems are isolated to specific files)

### What are "Imports" and "Exports"?

**Export** = Making code available to other files  
**Import** = Using code from another file

```javascript
// In constants.js - EXPORT
export const DOOR_SPECS = { ... };

// In scripts.js - IMPORT
import { DOOR_SPECS } from './modules/constants.js';
```

Think of it like: 
- **Export** = "Here's a tool you can borrow"
- **Import** = "Let me borrow that tool"

---

## 🐛 Troubleshooting

### Problem: Program doesn't load
**Check:**
1. Are you opening index.html in a browser?
2. Are all files in the correct folders?
3. Open browser console (F12) to see error messages

### Problem: Can't see 3D view
**Check:**
1. Is Three.js loaded? (Check browser console)
2. Try refreshing the page
3. Make sure you've added a cabinet

### Problem: Measurements look wrong
**Check:**
1. Look in modules/measurements.js
2. Check if fractions are parsing correctly
3. Try entering measurements as decimals (like 36.5 instead of 36 1/2)

### Problem: Changes to constants.js don't show up
**Solution:**
1. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Make sure you saved the file

---

## 📝 Making Changes Safely

### Before Editing:
1. **Make a backup** - Copy the file before changing it
2. **Read the comments** - They explain what each part does
3. **Test small changes** - Change one thing at a time
4. **Keep the original** - We kept CabinetDesigner_original.js as backup

### Best Practices:
1. **Add your own comments** when you make changes
2. **Use version control** (like Git) to track changes
3. **Test thoroughly** after any modification
4. **Keep backups** of working versions

---

## 🎓 Learning Resources

### If You Want to Learn More:

**JavaScript Basics:**
- [Mozilla JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- Focus on: variables, functions, objects, arrays

**React (UI Framework):**
- [React Official Tutorial](https://react.dev/learn)
- Focus on: components, state, props

**Three.js (3D Graphics):**
- [Three.js Manual](https://threejs.org/docs/)
- Focus on: scenes, cameras, meshes, materials

---

## 💡 Key Concepts Explained

### State (React Concept)
**What it is:** Data that can change and causes the UI to update.

**Real-world analogy:** Like the current reading on a tape measure. When you move it, the reading changes, and you see the new measurement.

**In the code:**
```javascript
const [cabinets, setCabinets] = useState([]);
// cabinets = current list of cabinets
// setCabinets = function to update the list
```

### Classes (Programming Concept)
**What they are:** Templates or blueprints for creating objects.

**Real-world analogy:** Like a blank order form. The form (class) is the template. Each filled-out form (object) is a specific order.

**In the code:**
```javascript
class Cabinet {
    constructor(width, height, depth) {
        this.width = width;
        // ... more properties
    }
}
// Now create actual cabinets:
let myCabinet = new Cabinet(24, 30, 24);
```

### Components (React Concept)
**What they are:** Reusable pieces of UI.

**Real-world analogy:** Like standardized cabinet parts. You make one door template, then create many doors from it.

**In the code:**
```javascript
const SaveButton = () => (
    <button>
        <Save size={18} />
        Save
    </button>
);
// Use it anywhere:
<SaveButton />
```

---

## 📞 Additional Help

### Finding Things in the Code:
1. Use your text editor's **search function** (Ctrl+F or Cmd+F)
2. Look for the **section headers** in comments
3. Check the file names - they match what's inside

### Making Sense of Errors:
1. **Read the error message** - it usually tells you what's wrong
2. **Check the line number** - tells you where the problem is
3. **Look at recent changes** - did you just edit something?
4. **Check the browser console** (F12) for detailed errors

---

## ✅ Summary

You now have:
- ✅ **Modular file structure** (organized separate files)
- ✅ **Detailed comments** explaining what everything does
- ✅ **Clear documentation** of how it all works together
- ✅ **Reference guide** for making common changes
- ✅ **Original backup** (CabinetDesigner_original.js) for reference

### Your code went from:
❌ One 2,600-line file that's hard to navigate  
✅ Seven organized, well-documented files that are easy to understand

### You can now:
- Find specific features quickly
- Make changes without breaking everything
- Understand what each part does
- Add new features more easily
- Maintain and update the code

---

## 🎉 Next Steps

1. **Open each module file** and read through the comments
2. **Try making a small change** (like a default cabinet size)
3. **Test the program** to see your changes work
4. **Experiment** with adding new features using the patterns you see

Remember: **Programming is like carpentry** - you learn by doing. Start with small changes, test them, and build up to bigger modifications. Every carpenter started somewhere, and with these well-documented files, you have a great foundation to learn from!

Happy coding! 🛠️
