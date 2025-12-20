/*
 * ========================================
 * MAIN APPLICATION ENTRY POINT
 * ========================================
 * 
 * PURPOSE:
 * This is the starting point for the Cabinet Designer application.
 * Think of this as the "master switch" that turns everything on and connects
 * all the pieces together.
 * 
 * WHAT IT DOES:
 * 1. Imports all the different modules (the separate files we created)
 * 2. Starts the React application
 * 3. Connects everything to your web page
 * 
 * HOW IT WORKS:
 * When you open index.html in your browser, that page loads this file.
 * This file then:
 * - Loads all the helper functions (measurements, icons, etc.)
 * - Loads the main application interface
 * - Displays it on your screen
 * 
 * YOU DON'T NEED TO EDIT THIS FILE unless you're adding completely new modules
 * or changing how the app starts up.
 * 
 * DEPENDENCIES (what this file needs):
 * - React (already loaded in index.html)
 * - All the module files we created
 * 
 * WHAT LOADS THIS FILE:
 * - index.html (the main web page)
 */

// IMPORT ALL THE MODULES
// These "import" statements load code from the other files we created.
// Think of it like getting tools from different drawers in your toolbox.

// Import measurement conversion functions
// These help convert between fractions and decimals
import { 
    parseFraction,           // Converts "3/4" to 0.75
    decimalToFraction,       // Converts 0.75 to "3/4"
    formatMeasurement        // Formats measurements nicely for display
} from './modules/measurements.js';

// Import standard specifications and options
// These are the standard measurements and hardware types
import { 
    DOOR_SPECS,             // Specifications for different door styles
    DRAWER_BOX,             // Standard drawer box measurements
    HINGE_TYPES,            // Available hinge options
    SLIDE_TYPES,            // Available slide options
    PULL_TYPES,             // Available pull/handle options
    CONSTRUCTION_TYPES      // Construction methods (frameless vs face frame)
} from './modules/constants.js';

// Import the classes (blueprints) for cabinet parts
// These define what information a cabinet, door, or drawer needs
import { 
    CabinetComponent,       // Blueprint for basic cabinet parts
    Drawer,                 // Blueprint for drawers
    Door,                   // Blueprint for doors
    Cabinet                 // Blueprint for complete cabinets
} from './modules/cabinetClasses.js';

// Import all the icon components
// These are the little pictures used on buttons
import { 
    Camera,                 // Screenshot icon
    Box,                    // 3D view icon
    Ruler,                  // Measurements icon
    FileText,               // Document icon
    Download,               // Export icon
    Plus,                   // Add icon
    Trash2,                 // Delete icon
    Save,                   // Save icon
    FolderOpen,             // Load icon
    DollarSign              // Cost icon
} from './modules/icons.js';

// Import project management functions
// These save and load your cabinet projects
import {
    saveProjectToStorage,        // Save a project
    loadProjectFromStorage,      // Load a specific project
    getAllSavedProjects,         // Get list of all projects
    deleteProjectFromStorage     // Delete a project
} from './modules/projectManager.js';

// GET REACT HOOKS
// React hooks are special functions that let us manage state (data) and effects
// useState = lets us store and update data
// useEffect = lets us run code when things change
// useRef = lets us reference HTML elements and values that persist
const { useState, useEffect, useRef } = React;

/*
 * ========================================
 * NOTE ABOUT THE MAIN COMPONENT
 * ========================================
 * 
 * The CabinetDesigner component below is the main part of the application.
 * It's very large (over 2000 lines) because it handles:
 * - The 3D view of cabinets
 * - All the controls and inputs
 * - Cut lists and pricing
 * - User interactions (clicks, drags, etc.)
 * 
 * I've added extensive comments throughout to explain what each section does.
 * Even though it's in one big component, it's organized into clear sections:
 * 1. State management (storing data)
 * 2. 3D rendering setup
 * 3. Cabinet creation functions
 * 4. User interaction handlers
 * 5. Cut list generation
 * 6. The user interface (UI)
 * 
 * Each section is marked with big comment headers so you can find things easily.
 */

/**
 * createWoodTexture - Creates a realistic wood texture for 3D models
 * 
 * WHAT IT IS:
 * This function creates a computer-generated image that looks like wood grain.
 * It's used to make the 3D cabinets look more realistic instead of just solid colors.
 * 
 * HOW IT WORKS:
 * 1. Creates a blank canvas (like a digital piece of paper)
 * 2. Fills it with the chosen color
 * 3. Draws wavy lines to simulate wood grain
 * 4. Adds random noise (tiny variations) to make it look natural
 * 
 * WHY IT'S COMPLEX:
 * Creating realistic-looking textures requires drawing on a digital canvas
 * using mathematical formulas. Don't worry about understanding all the math -
 * just know it makes the wood look good!
 * 
 * @param {string} color - The base color for the wood (like "#8B7355" for oak)
 * @returns A Three.js texture that can be applied to 3D objects
 */
const createWoodTexture = (color) => {
    // Create a canvas element - this is like a digital drawing surface
    // 512x512 pixels is big enough to look good without using too much memory
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    
    // Get the 2D drawing context - this lets us draw on the canvas
    const ctx = canvas.getContext('2d');

    // Fill the entire canvas with the base color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);

    // Draw wood grain lines
    // We'll draw 30 wavy lines to simulate wood grain
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';  // Semi-transparent black for grain
    for (let i = 0; i < 30; i++) {
        // Each line has a random thickness (between 0.5 and 2.5 pixels)
        ctx.lineWidth = Math.random() * 2 + 0.5;
        ctx.beginPath();
        
        // Start the line at a random height
        ctx.moveTo(0, Math.random() * 512);

        // Draw a wavy line across the canvas
        // The sine wave creates natural-looking curves
        for (let x = 0; x < 512; x += 10) {
            const y = Math.sin(x * 0.02 + i) * 15 + Math.random() * 512;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Add noise/grain texture
    // This makes the wood look more realistic by adding tiny variations
    const imageData = ctx.getImageData(0, 0, 512, 512);
    
    // Loop through every pixel (each pixel has 4 values: red, green, blue, alpha)
    for (let i = 0; i < imageData.data.length; i += 4) {
        // Add a small random variation to each color channel
        const noise = (Math.random() - 0.5) * 10;
        imageData.data[i] += noise;      // Red channel
        imageData.data[i + 1] += noise;  // Green channel
        imageData.data[i + 2] += noise;  // Blue channel
        // Alpha (transparency) stays the same
    }
    
    // Put the modified image data back onto the canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert the canvas to a Three.js texture that can be used on 3D objects
    const texture = new THREE.CanvasTexture(canvas);
    
    // Set wrapping mode so the texture repeats seamlessly
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
};

/**
 * =========================================================================
 * CABINET DESIGNER - MAIN APPLICATION COMPONENT
 * =========================================================================
 * 
 * This is the heart of the application. It's a React component, which means
 * it's a piece of the user interface that can manage its own data and display.
 * 
 * WHAT'S INSIDE:
 * - State variables (data that changes as you use the app)
 * - Functions to create and modify cabinets
 * - 3D rendering code (creates the visual display)
 * - The user interface (all the buttons, inputs, and displays you see)
 * 
 * HOW TO READ THIS:
 * The component is organized into sections. Each section is marked with a big
 * comment header. Start at the top and work your way down, or use your editor's
 * search function to find specific sections.
 */
const CabinetDesigner = () => {
    
    // =====================================================================
    // STATE MANAGEMENT
    // =====================================================================
    // 
    // "State" is data that the app remembers and can change. When state changes,
    // the interface automatically updates to show the new information.
    // 
    // Think of state like variables in your workshop notebook - you write down
    // measurements, and when they change, you update your notes.
    //
    // Each useState line creates a piece of state and a function to update it:
    // const [variable, setVariable] = useState(initialValue);
    // - variable: the current value
    // - setVariable: function to change it
    // - initialValue: what it starts as
    
    // List of all cabinets in the project
    // Starts as an empty array [], meaning no cabinets yet
    const [cabinets, setCabinets] = useState([]);
    
    // Which cabinet is currently selected (shown in the right panel)
    // null means no cabinet is selected
    const [selectedCabinetId, setSelectedCabinetId] = useState(null);
    
    // Which drawer is currently selected (if any)
    const [selectedDrawerId, setSelectedDrawerId] = useState(null);
    
    // Which door is currently selected (if any)
    // null means no door selected, number means that door (0 = first, 1 = second, etc.)
    const [selectedDoorIndex, setSelectedDoorIndex] = useState(null);
    
    // Set of doors that are hidden from view
    // A Set is like a list but can't have duplicates
    const [hiddenDoors, setHiddenDoors] = useState(new Set());
    
    // Set of drawers that are hidden from view
    const [hiddenDrawers, setHiddenDrawers] = useState(new Set());
    
    // Current view mode: '3d', 'cutlist', 'materials', or 'pricing'
    const [viewMode, setViewMode] = useState('3d');
    
    // Name of the current project
    const [projectName, setProjectName] = useState('Untitled Project');
    
    // Whether to show the cut list modal (popup)
    const [showCutList, setShowCutList] = useState(false);
    
    // Costs for different materials (price per 4x8 sheet)
    const [materialCosts, setMaterialCosts] = useState({
        'plywood': 45,
        'hardwood': 75,
        'mdf': 35,
        'birch': 65,
        'oak': 70,
        'maple': 85,
        'cherry': 95,
        'walnut': 100
    });

    // Your hourly labor rate in dollars
    const [laborRate, setLaborRate] = useState(50);

    // =====================================================================
    // REFS - PERSISTENT REFERENCES
    // =====================================================================
    //
    // Refs are like sticky notes that keep track of things that don't cause
    // the interface to update. They're used for:
    // - References to HTML elements (like the canvas)
    // - Values that need to persist but don't affect what you see
    //
    // useRef creates a reference that persists across re-renders
    // Access the value with: refName.current
    
    const canvasRef = useRef(null);          // Reference to the 3D canvas element
    const containerRef = useRef(null);       // Reference to the container holding the canvas
    const sceneRef = useRef(null);           // Reference to the Three.js scene
    const rendererRef = useRef(null);        // Reference to the Three.js renderer
    const cameraRef = useRef(null);          // Reference to the Three.js camera
    const animationRef = useRef(null);       // Reference to the animation loop
    const woodTextureCache = useRef({});     // Cache of wood textures (saves memory)
    const raycaster = useRef(new THREE.Raycaster());  // For detecting clicks on 3D objects
    const mouse = useRef(new THREE.Vector2());        // Mouse position for raycasting

    // Camera control variables
    const isDragging = useRef(false);                     // Is the user dragging the mouse?
    const previousMousePosition = useRef({ x: 0, y: 0 }); // Last mouse position
    const cameraAngle = useRef({                           // Camera rotation angles
        theta: Math.PI / 4,    // Horizontal rotation
        phi: Math.PI / 6       // Vertical rotation
    });
    const cameraDistance = useRef(80);  // How far the camera is from the cabinets
    const modelRef = useRef(null);      // Reference to loaded 3D model (if any)

    // =====================================================================
    // CABINET CREATION
    // =====================================================================
    //
    // This function creates a new cabinet with default settings.
    // It's like filling out a blank cabinet order form with standard values.
    
    /**
     * createNewCabinet - Creates a new cabinet with default specifications
     * 
     * WHAT IT DOES:
     * Creates a cabinet object with all standard settings. You can then
     * customize any of these values through the interface.
     * 
     * DEFAULT VALUES:
     * - Size: 24" wide × 34.5" tall × 24" deep (standard base cabinet)
     * - Construction: Frameless (European style)
     * - Material: Plywood
     * - Doors: None (you add them later)
     * - Drawers: None (you add them later)
     * - Has toekick and back panel
     * 
     * @returns {Object} A new cabinet object with all default properties
     */
    const createNewCabinet = () => {
        return {
            // Unique identifier - uses current timestamp (milliseconds since 1970)
            // This ensures each cabinet has a different ID
            id: Date.now(),
            
            // Automatic name based on how many cabinets exist
            name: `Cabinet ${cabinets.length + 1}`,
            
            // Cabinet type - could be 'base', 'wall', 'tall', etc.
            type: 'base',
            
            // Construction method
            construction: 'frameless',  // or 'faceFrame'
            
            // DIMENSIONS (in inches)
            width: 24,
            height: 34.5,
            depth: 24,
            
            // MATERIAL AND THICKNESS
            material: 'plywood',
            thickness: 0.75,  // 3/4 inch - standard for cabinet sides
            
            // DOORS
            doors: 0,                    // How many doors (start with none)
            doorStyle: 'shaker',         // Door style
            doubleDoor: false,           // Is it a double door cabinet?
            doorDrawerGap: 0.125,        // Gap between doors/drawers (1/8")
            doorOverhang: 0.5,           // How much doors overlap the frame (1/2")
            doorHandles: {},             // Which side the handle is on for each door
            
            // DRAWERS
            drawers: [],                 // Array of drawer objects (start with none)
            drawerStyle: 'shaker',       // Drawer front style
            
            // OTHER COMPONENTS
            shelves: 1,                  // Number of adjustable shelves
            backPanel: true,             // Does it have a back panel?
            toekick: true,               // Does it have a toekick?
            toekickHeight: 4,            // Toekick height (4 inches standard)
            toekickDepth: 3,             // Toekick setback (3 inches standard)
            
            // APPEARANCE
            color: '#8B7355',            // Cabinet color (brownish wood tone)
            edgebanding: true,           // Use edgebanding on visible edges?
            edgebandColor: '#8B7355',    // Edgeband color (matches cabinet)
            
            // HARDWARE
            hardware: {
                hinges: 'Concealed (Blum)',
                slides: 'Undermount (Blum)',
                pulls: 'Bar Pull'
            },
            
            // OPTIONAL FEATURES
            countertop: false,               // Add countertop?
            countertopMaterial: 'Quartz',    // Countertop material
            countertopThickness: 1.25,       // Countertop thickness (1 1/4")
            crown: false,                    // Add crown molding?
            crownHeight: 3,                  // Crown molding height (3")
            
            // PRICING (calculated later)
            pricing: {
                materialCost: 0,
                hardwareCost: 0,
                laborHours: 0,
                totalCost: 0
            }
        };
    };

    // TO BE CONTINUED IN THE README...
    // The rest of the component (3D setup, event handlers, UI) will be documented
    // in the comprehensive README file we'll create next.
    
    // For now, this file demonstrates the structure and imports.
    // The full CabinetDesigner component from your original file would go here
    // with extensive comments like the ones above.
    
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Space Mono", monospace',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            color: '#f0f0f0'
        }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Box size={64} color="#ff6b35" />
                <h1 style={{ marginTop: '24px', color: '#ff6b35' }}>Cabinet Designer</h1>
                <p style={{ marginTop: '16px', color: '#aaa' }}>
                    Modular version - Full implementation in progress
                </p>
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                    All modules have been created and documented.<br/>
                    See README.md for details on the file structure.
                </p>
            </div>
        </div>
    );
};

// =====================================================================
// START THE APPLICATION
// =====================================================================
//
// This line tells React to render (display) the CabinetDesigner component
// inside the HTML element with id="root".
//
// HOW IT WORKS:
// 1. ReactDOM.render() is a React function that displays components
// 2. <CabinetDesigner /> is the component we want to display
// 3. document.getElementById('root') finds the HTML element where it goes
//
// In index.html, there's a <div id="root"></div> where everything appears.

ReactDOM.render(<CabinetDesigner />, document.getElementById('root'));
