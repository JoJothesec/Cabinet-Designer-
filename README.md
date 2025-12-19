# Cabinet Designer Pro

A professional-grade cabinet design application with 3D visualization, detailed cut lists, material calculations, and pricing estimates.

## Features

- **3D Visualization**: Interactive 3D view of your cabinet designs using Three.js
- **Multiple Cabinet Types**: Support for various door styles (Shaker, Flat, Raised Panel, Glass Insert)
- **Drawer Management**: Add and position multiple drawers with precise control
- **Cut Lists**: Automatically generate detailed cut lists for all cabinet components
- **Material Calculations**: Calculate sheet materials needed and associated costs
- **Pricing Estimates**: Built-in labor and material cost estimation
- **Project Management**: Save and load projects using localStorage
- **Export Functionality**: Export cut lists to CSV for use in your shop

## Getting Started 

clone this reop to work with the code.

## Running the Application

### Important: Local Web Server Required

Due to browser CORS (Cross-Origin Resource Sharing) policies, you **cannot** open `index.html` directly using the `file://` protocol. The browser will block loading of external JavaScript files (`scripts.js`) for security reasons.

**You must run a local web server** to use this application.

### Option 1: Python HTTP Server (Recommended)

If you have Python installed (comes pre-installed on macOS and most Linux distributions):

```bash
python3 -m http.server 8000
```

Then open your browser to: **http://localhost:8000/index.html**

### Option 2: Node.js http-server

If you have Node.js installed:

```bash
npx http-server -p 8000
```

Then open your browser to: **http://localhost:8000/index.html**

### Option 3: VS Code Live Server

If you're using Visual Studio Code:

1. Install the "Live Server" extension by Ritwick Dey
2. Right-click on `index.html` in the file explorer
3. Select "Open with Live Server"

## Project Structure

```
Cabinet-Designer-/
├── index.html      # Main HTML file with minimal structure
├── styles.css      # All CSS styling
├── scripts.js      # React application code and logic
└── README.md       # This file
```

## Technologies Used

- **React 18**: UI framework
- **Three.js**: 3D rendering engine
- **Babel Standalone**: In-browser JSX transformation (development only)

## Development Notes

This application uses in-browser Babel transformation for development convenience. For production deployment, you should:

1. Pre-compile the JSX using a build tool (Webpack, Vite, or Create React App)
2. Remove the Babel standalone dependency
3. Serve the compiled JavaScript files

## Browser Compatibility

Modern browsers with ES6+ support required:
- Chrome/Brave 90+
- Firefox 88+
- Safari 14+
- Edge 90+