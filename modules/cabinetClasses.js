/*
 * ========================================
 * CABINET CLASSES MODULE
 * ========================================
 * 
 * PURPOSE:
 * This file defines the "blueprints" (classes) for cabinets, doors, and drawers.
 * Think of a class like a template or form that you fill out. When you want to
 * create a new cabinet, you use the Cabinet class as a template and fill in
 * the specific measurements and materials.
 * 
 * WHAT IT DOES:
 * - Defines what information a cabinet needs (width, height, depth, etc.)
 * - Defines what information a door needs
 * - Defines what information a drawer needs
 * - Provides methods (actions) to add or remove doors and drawers
 * 
 * REAL-WORLD ANALOGY:
 * Imagine you have a blank order form for cabinets. The form has spaces for:
 * - Width: ___  Height: ___  Depth: ___
 * - Material: ___  Number of Drawers: ___
 * That blank form is like a "class". When you fill it out with specific numbers,
 * that filled-out form is an "object" or "instance" of the class.
 * 
 * DEPENDENCIES (what this file needs):
 * - constants.js (for default hardware types like hinges and slides)
 * 
 * USED BY (what files need this one):
 * - CabinetDesigner.js (creates actual cabinets using these blueprints)
 * - projectManager.js (saves and loads cabinet data)
 */

// Import the hardware options from the constants file
// This gives us access to the lists of available hinges, slides, and pulls
import { HINGE_TYPES, SLIDE_TYPES, PULL_TYPES } from './constants.js';

/**
 * CabinetComponent Class
 * 
 * WHAT IT IS:
 * A blueprint for any piece that makes up a cabinet (sides, back, shelves, etc.)
 * This is a basic building block - each component is just a flat piece with dimensions.
 * 
 * WHY USE IT:
 * Instead of tracking lots of separate variables, we bundle all the info about
 * one piece into a single object. This keeps things organized.
 * 
 * WHAT INFORMATION IT STORES:
 * - width: How wide the piece is (left to right)
 * - height: How tall the piece is (bottom to top)
 * - depth: How deep the piece is (front to back)
 * - material: What type of wood (Oak, Maple, Birch, etc.)
 * - thickness: How thick the board is (usually 3/4" for sides, 1/4" for backs)
 * 
 * EXAMPLE:
 * A cabinet side might be:
 * - width: 24 inches
 * - height: 30 inches
 * - depth: 24 inches
 * - material: "Oak"
 * - thickness: 0.75 inches
 */
class CabinetComponent {
    /**
     * Constructor - Creates a new cabinet component
     * 
     * WHAT "constructor" MEANS:
     * This is a special function that runs when you create a new component.
     * It sets up all the initial values.
     * 
     * PARAMETERS (the information you need to provide):
     * @param {number} width - Width in inches
     * @param {number} height - Height in inches
     * @param {number} depth - Depth in inches
     * @param {string} material - Wood type (default: 'Oak' if not specified)
     * @param {number} thickness - Board thickness in inches (default: 0.75)
     * 
     * DEFAULT VALUES:
     * If you don't specify material or thickness, it automatically uses
     * Oak and 3/4 inch. These are in the parentheses: = 'Oak' and = 0.75
     */
    constructor(width, height, depth, material = 'Oak', thickness = 0.75) {
        // Store each piece of information
        // "this" means "this specific component we're creating"
        this.width = width;           // Store the width
        this.height = height;         // Store the height
        this.depth = depth;           // Store the depth
        this.material = material;     // Store the wood type
        this.thickness = thickness;   // Store how thick it is
    }
}

/**
 * Drawer Class
 * 
 * WHAT IT IS:
 * A blueprint for a drawer. Contains all the information needed to build one drawer.
 * 
 * WHY IT'S SEPARATE FROM CabinetComponent:
 * Drawers need extra information beyond just dimensions - they need hardware
 * like slides and pulls. So we give them their own blueprint.
 * 
 * WHAT INFORMATION IT STORES:
 * - All the basic dimensions (width, height, depth, material, thickness)
 * - slide: What type of drawer slide to use
 * - pull: What type of handle or pull to use
 */
class Drawer {
    /**
     * Constructor - Creates a new drawer
     * 
     * PARAMETERS:
     * @param {number} width - Drawer width in inches
     * @param {number} height - Drawer height (front to back) in inches
     * @param {number} depth - How far back the drawer goes in inches
     * @param {string} material - Wood type (default: 'Oak')
     * @param {number} thickness - Side thickness (default: 0.5 for drawer sides)
     * 
     * NOTE: Drawers default to 1/2" thick sides (thinner than cabinet sides)
     * because drawer boxes don't need to be as beefy.
     */
    constructor(width, height, depth, material = 'Oak', thickness = 0.5) {
        // Store dimensions
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = material;
        this.thickness = thickness;
        
        // Set hardware defaults
        // SLIDE_TYPES[0] means "use the first option in the slides list"
        // which is 'Undermount (Blum)'
        this.slide = SLIDE_TYPES[0];  
        
        // PULL_TYPES[0] means "use the first option in the pulls list"
        // which is 'Bar Pull'
        this.pull = PULL_TYPES[0];
    }
}

/**
 * Door Class
 * 
 * WHAT IT IS:
 * A blueprint for a cabinet door. Doors are more complex than drawers because
 * they have different construction styles (shaker, flat, raised panel, etc.)
 * 
 * WHY IT NEEDS ITS OWN CLASS:
 * Doors need to track:
 * - Basic dimensions
 * - What style of door (shaker, flat, etc.)
 * - What type of hinges
 * - What type of pulls
 * Each door style might be built differently.
 */
class Door {
    /**
     * Constructor - Creates a new door
     * 
     * PARAMETERS:
     * @param {number} width - Door width in inches
     * @param {number} height - Door height in inches  
     * @param {number} depth - Door thickness in inches
     * @param {string} material - Wood type (default: 'Oak')
     * @param {number} thickness - Door thickness (default: 0.75)
     * @param {string} doorType - Style of door (default: 'shaker')
     *                           Options: 'shaker', 'flat', 'raised', 'glass'
     */
    constructor(width, height, depth, material = 'Oak', thickness = 0.75, doorType = 'shaker') {
        // Store dimensions
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = material;
        this.thickness = thickness;
        
        // Store door style
        this.doorType = doorType;     // 'shaker', 'flat', 'raised', or 'glass'
        
        // Set hardware defaults
        this.hinge = HINGE_TYPES[0];  // Default to first hinge type: 'Concealed (Blum)'
        this.pull = PULL_TYPES[0];    // Default to first pull type: 'Bar Pull'
    }
}

/**
 * Cabinet Class
 * 
 * WHAT IT IS:
 * The main blueprint for a complete cabinet. This is like the master order form
 * that can have doors, drawers, and all the cabinet components.
 * 
 * WHY IT'S THE MOST COMPLEX:
 * A cabinet can have:
 * - Two sides (left and right)
 * - A back panel
 * - Multiple drawers (stored in an array/list)
 * - One or more doors
 * - Various other components
 * 
 * WHAT IT MANAGES:
 * - Overall cabinet dimensions
 * - All the parts (sides, back)
 * - List of drawers
 * - Door configuration
 * - Methods to add/remove components
 */
class Cabinet {
    /**
     * Constructor - Creates a new cabinet
     * 
     * PARAMETERS:
     * @param {number} cabinetWidth - Total width of the cabinet box
     * @param {number} cabinetHeight - Total height of the cabinet box
     * @param {number} cabinetDepth - Total depth of the cabinet box
     */
    constructor(cabinetWidth, cabinetHeight, cabinetDepth) {
        // Store the overall cabinet dimensions
        this.width = cabinetWidth;
        this.height = cabinetHeight;
        this.depth = cabinetDepth;
        
        // CREATE THE CABINET SIDES
        // Every cabinet has a left side and a right side
        // We store them together in an object with "left" and "right" properties
        this.sides = {
            left: new CabinetComponent(cabinetWidth, cabinetHeight, cabinetDepth),
            right: new CabinetComponent(cabinetWidth, cabinetHeight, cabinetDepth)
        };
        
        // CREATE THE BACK PANEL
        // The back is typically 1/4" thick (thinner than sides)
        this.back = new CabinetComponent(cabinetWidth, cabinetHeight, 0.25);
        
        // INITIALIZE DRAWERS LIST
        // Start with an empty array (list) that we can add drawers to later
        // An array is like a numbered list: [drawer1, drawer2, drawer3]
        this.drawers = [];
        
        // INITIALIZE DOOR
        // Start with no door (null means "nothing here yet")
        // We'll add a door later if the user wants one
        this.door = null;
    }
    
    /**
     * addDrawer - Adds a new drawer to this cabinet
     * 
     * WHAT IT DOES:
     * Creates a new drawer with the specified dimensions and adds it to
     * the cabinet's list of drawers.
     * 
     * HOW IT WORKS:
     * 1. Creates a new Drawer object with the given measurements
     * 2. Adds it to the end of the drawers array
     * 3. Returns the new drawer so you can modify it if needed
     * 
     * PARAMETERS:
     * @param {number} width - Drawer width
     * @param {number} height - Drawer height
     * @param {number} depth - Drawer depth
     * @param {string} material - Wood type (default: 'Oak')
     * @param {number} thickness - Side thickness (default: 0.5)
     * 
     * RETURNS: The newly created drawer object
     * 
     * EXAMPLE USE:
     * let cabinet = new Cabinet(24, 30, 24);
     * let myDrawer = cabinet.addDrawer(22, 6, 22);
     * myDrawer.slide = 'Side Mount';  // Can modify the returned drawer
     */
    addDrawer(width, height, depth, material = 'Oak', thickness = 0.5) {
        // Create a new drawer with the specified dimensions
        const drawer = new Drawer(width, height, depth, material, thickness);
        
        // Add this drawer to the end of the drawers list
        // .push() means "add to the end of the array"
        this.drawers.push(drawer);
        
        // Return the drawer in case the caller wants to modify it
        return drawer;
    }
    
    /**
     * removeDrawer - Removes a drawer from this cabinet
     * 
     * WHAT IT DOES:
     * Removes a drawer from the cabinet's list based on its position number.
     * 
     * PARAMETERS:
     * @param {number} index - Which drawer to remove (0 = first, 1 = second, etc.)
     * 
     * HOW IT WORKS:
     * Arrays (lists) are numbered starting from 0, not 1:
     * - 0 = first drawer
     * - 1 = second drawer
     * - 2 = third drawer
     * This is called "zero-based indexing"
     * 
     * SAFETY CHECK:
     * Only removes if the index is valid (not negative and not too high)
     * 
     * EXAMPLE:
     * cabinet.removeDrawer(0);  // Removes the first drawer
     * cabinet.removeDrawer(2);  // Removes the third drawer
     */
    removeDrawer(index) {
        // Check if the index is valid
        // index >= 0: makes sure it's not negative
        // index < this.drawers.length: makes sure it's not too high
        if (index >= 0 && index < this.drawers.length) {
            // .splice() removes items from an array
            // (index, 1) means "starting at position 'index', remove 1 item"
            this.drawers.splice(index, 1);
        }
    }
    
    /**
     * setDoor - Adds or replaces a door on this cabinet
     * 
     * WHAT IT DOES:
     * Creates a new door with the specified dimensions and style, and
     * attaches it to this cabinet.
     * 
     * WHY "SET" INSTEAD OF "ADD":
     * Most cabinets have just one door (or one pair). Unlike drawers where
     * you can have many, this replaces any existing door.
     * 
     * PARAMETERS:
     * @param {number} width - Door width
     * @param {number} height - Door height  
     * @param {number} depth - Door thickness
     * @param {string} material - Wood type (default: 'Oak')
     * @param {number} thickness - Door thickness (default: 0.75)
     * @param {string} doorType - Door style (default: 'shaker')
     * 
     * RETURNS: The newly created door object
     * 
     * EXAMPLE:
     * let myDoor = cabinet.setDoor(23, 29, 0.75, 'Maple', 0.75, 'shaker');
     */
    setDoor(width, height, depth, material = 'Oak', thickness = 0.75, doorType = 'shaker') {
        // Create a new door with all the specified parameters
        this.door = new Door(width, height, depth, material, thickness, doorType);
        
        // Return the door so the caller can modify it if needed
        return this.door;
    }
    
    /**
     * removeDoor - Removes the door from this cabinet
     * 
     * WHAT IT DOES:
     * Simply removes the door by setting it to null (nothing).
     * 
     * WHEN TO USE:
     * If you want a cabinet with no door (like an open shelf unit)
     */
    removeDoor() {
        // Set door to null, which means "no door"
        this.door = null;
    }
    
    /**
     * updateSides - Updates both side panels with new dimensions
     * 
     * WHAT IT DOES:
     * Creates new left and right side panels with updated dimensions.
     * You'd use this if you resize the cabinet.
     * 
     * PARAMETERS:
     * @param {number} width - New width
     * @param {number} height - New height
     * @param {number} depth - New depth
     * @param {string} material - New material
     * @param {number} thickness - New thickness
     */
    updateSides(width, height, depth, material, thickness) {
        // Replace the left side with a new component
        this.sides.left = new CabinetComponent(width, height, depth, material, thickness);
        // Replace the right side with a new component
        this.sides.right = new CabinetComponent(width, height, depth, material, thickness);
    }
    
    /**
     * updateBack - Updates the back panel with new dimensions
     * 
     * WHAT IT DOES:
     * Creates a new back panel with updated dimensions.
     * 
     * PARAMETERS:
     * @param {number} width - New width
     * @param {number} height - New height
     * @param {string} material - New material
     * @param {number} thickness - New thickness (default: 0.25)
     * 
     * NOTE: Back panels are typically 1/4" thick, so that's the default
     */
    updateBack(width, height, material, thickness = 0.25) {
        // Replace the back panel with a new component
        // Note: we pass thickness as the third parameter (depth) since backs are flat
        this.back = new CabinetComponent(width, height, thickness, material, thickness);
    }
}

// EXPORT ALL CLASSES
// This makes these blueprints available to other files that need to create
// cabinets, drawers, or doors
export { CabinetComponent, Drawer, Door, Cabinet };
