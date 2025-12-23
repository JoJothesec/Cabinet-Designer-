# Cabinet Designer Pro

A professional-grade cabinet design application with 3D visualization, detailed cut lists, material calculations, and pricing estimates. Runs entirely in the browser with no backend required.

## Features

- **3D Visualization**: Interactive 3D view of your cabinet designs using Three.js
- **Multiple Door Styles**: Shaker, Flat, Raised Panel, and Glass Insert
- **Drawer Management**: Add and position multiple drawers with precise control
- **Cut Lists**: Automatically generate detailed cut lists for all cabinet components
- **Shopping Lists**: Consolidated material and hardware lists
- **Material Calculations**: Calculate sheet materials needed and associated costs
- **Pricing Estimates**: Built-in labor and material cost estimation
- **Project Management**: Save and load projects using localStorage
- **Export Options**: Export to PDF, CSV, or JSON for backup and sharing
- **Keyboard Shortcuts**: Full keyboard support including undo/redo (Ctrl+Z/Y)
- **Fraction Support**: Enter measurements as decimals, fractions, or mixed numbers (e.g., `36 3/8`)

## Getting Started

Clone this repo to work with the code:

```bash
git clone https://github.com/jojothesec/Cabinet-Designer-.git
cd Cabinet-Designer-
```

## Running the Application

### Important: Local Web Server Required

Due to browser CORS policies, you **cannot** open `index.html` directly using the `file://` protocol. You must run a local web server.

### Option 1: Python HTTP Server (Recommended)

```bash
python3 -m http.server 8000
```

Then open: **http://localhost:8000/site/index.html**

### Option 2: Node.js http-server

```bash
npx http-server -p 8000
```

Then open: **http://localhost:8000/site/index.html**

### Option 3: VS Code Live Server

1. Install the "Live Server" extension by Ritwick Dey
2. Right-click on `site/index.html` in the file explorer
3. Select "Open with Live Server"

## Project Structure

```
Cabinet-Designer-/
├── site/                   # Application files (serve from here)
│   ├── index.html          # Entry point - loads all scripts in order
│   ├── scripts.js          # Main React application component
│   ├── styles.css          # All CSS styling
│   └── modules/            # Symlink to ../modules
│
├── modules/                # Modular JavaScript files
│   ├── measurements.js     # Fraction/decimal conversion utilities
│   ├── constants.js        # Standard specs, hardware options, defaults
│   ├── cabinetClasses.js   # Cabinet, Door, Drawer class definitions
│   ├── icons.js            # SVG icon React components
│   ├── validation.js       # Input validation and constraints
│   ├── projectManager.js   # localStorage save/load operations
│   ├── historyManager.js   # Undo/redo state management
│   ├── keyboardShortcuts.js# Keyboard bindings and handlers
│   ├── cameraPresets.js    # 3D camera view presets
│   ├── shoppingListGenerator.js # Material aggregation
│   ├── printExport.js      # PDF/print generation
│   └── fileImportExport.js # JSON file import/export
│
├── docs/                   # Project documentation
│   ├── README_MODULAR.md   # Detailed module guide
│   ├── STRUCTURE_GUIDE.md  # Architecture diagrams
│   ├── QUICK_REFERENCE.md  # Common tasks reference
│   ├── PRINT_EXPORT_GUIDE.md # Export feature docs
│   └── RoadMap*.md         # Project roadmap files
│
└── README.md               # This file
```

### Directory Roles

- **site/**: Production-ready application files. This is what you serve to run the app.
- **modules/**: Reusable JavaScript modules separated by concern. Each file handles a specific domain (measurements, validation, storage, etc.).
- **docs/**: Developer documentation including architecture guides, quick references, and project roadmaps.

## Technologies Used

- **React 18**: UI framework (loaded via CDN)
- **Three.js**: 3D rendering engine
- **Babel Standalone**: In-browser JSX transformation
- **html2pdf.js**: PDF export functionality

## Development

No build step required. Edit files and hard refresh your browser (Ctrl+F5 or Cmd+Shift+R).

All state changes flow through React's `useState` and automatically trigger 3D re-renders. See `docs/STRUCTURE_GUIDE.md` for architecture details.

## Browser Compatibility

Modern browsers with ES6+ and WebGL support required:
- Chrome/Brave 90+
- Firefox 88+
- Safari 14+
- Edge 90+