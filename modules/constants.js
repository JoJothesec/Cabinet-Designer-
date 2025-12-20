/*
 * ========================================
 * CONSTANTS MODULE
 * ========================================
 * 
 * PURPOSE:
 * This file stores all the standard measurements, specifications, and options
 * for cabinet construction. Think of it as your reference sheet that you'd 
 * keep posted on your shop wall - it has all the standard dimensions and 
 * hardware choices you use repeatedly.
 * 
 * WHAT IT DOES:
 * - Defines standard door styles and their dimensions
 * - Lists available hardware options (hinges, slides, pulls)
 * - Sets drawer box specifications
 * - Defines construction methods (frameless vs face frame)
 * 
 * WHY SEPARATE FILE?
 * Having all these standards in one place makes it easy to:
 * - Update measurements if your shop standards change
 * - See all your options in one location
 * - Add new hardware types or door styles
 * 
 * DEPENDENCIES (what this file needs):
 * - None! This is just a list of standards
 * 
 * USED BY (what files need this one):
 * - cabinetClasses.js (uses these specs when creating cabinets)
 * - CabinetDesigner.js (shows these options in dropdown menus)
 */

/**
 * DOOR_SPECS - Standard specifications for different door styles
 * 
 * WHAT IT IS:
 * This is like a recipe book for door styles. Each door type has its own
 * set of measurements that define how it's built.
 * 
 * DOOR TYPES EXPLAINED:
 * 
 * SHAKER DOOR:
 * - Most common cabinet door style
 * - Has a frame (rails and stiles) with a center panel
 * - railWidth: how wide the horizontal pieces are (top and bottom)
 * - stileWidth: how wide the vertical pieces are (left and right sides)
 * - panelThickness: how thick the center panel is
 * - panelSetback: how far back the panel sits in the frame groove
 * 
 * FLAT DOOR (also called slab door):
 * - Simplest style - just a flat piece of wood
 * - thickness: how thick the door panel is
 * 
 * RAISED PANEL DOOR:
 * - Traditional style with raised center
 * - Similar to shaker but the center is raised up
 * - centerRaise: how much the center sticks up from the edges
 * 
 * GLASS DOOR:
 * - Has a frame with glass insert instead of wood panel
 * - Typically narrower frame to show more glass
 * - glassThickness: how thick the glass pane is
 */
const DOOR_SPECS = {
    shaker: { 
        railWidth: 2.5,        // Horizontal frame pieces: 2.5 inches wide
        stileWidth: 2.5,       // Vertical frame pieces: 2.5 inches wide
        panelThickness: 0.25,  // Center panel: 1/4 inch thick
        panelSetback: 0.375    // Panel sits back 3/8 inch in the groove
    },
    flat: { 
        thickness: 0.75        // Simple flat door: 3/4 inch thick
    },
    raised: { 
        railWidth: 2.5,        // Frame pieces: 2.5 inches wide
        stileWidth: 2.5, 
        centerRaise: 0.25      // Center raised up 1/4 inch
    },
    glass: { 
        railWidth: 2,          // Narrower frame: 2 inches (to show more glass)
        stileWidth: 2, 
        glassThickness: 0.125  // Glass: 1/8 inch thick
    }
};

/**
 * DRAWER_BOX - Standard measurements for drawer box construction
 * 
 * WHAT IT IS:
 * The drawer box is the wooden box that slides in and out. This defines
 * how thick each part is and how much space to leave for the slides.
 * 
 * MEASUREMENTS EXPLAINED:
 * - sideThickness: How thick the left/right side pieces are (1/2 inch)
 * - bottomThickness: How thick the bottom panel is (1/4 inch, usually plywood)
 * - frontBackHeight: How tall the front and back pieces are (4 inches minimum)
 * - slidesClearance: Extra space needed on each side for drawer slides (1/2 inch)
 * 
 * WHY THESE NUMBERS?
 * - 1/2" sides are strong enough to hold together but not too bulky
 * - 1/4" bottom (plywood) is standard and sits in a groove
 * - 4" front/back height gives good strength for the drawer bottom groove
 * - 1/2" clearance per side gives room for standard drawer slides to move
 */
const DRAWER_BOX = {
    sideThickness: 0.5,      // Left and right sides: 1/2 inch thick
    bottomThickness: 0.25,   // Bottom panel: 1/4 inch thick (plywood)
    frontBackHeight: 4,      // Front and back: 4 inches tall minimum
    slidesClearance: 0.5     // Space needed for slides: 1/2 inch per side
};

/**
 * HINGE_TYPES - Available cabinet hinge options
 * 
 * WHAT IT IS:
 * List of hinge types you can choose from when hanging doors.
 * Different hinges work better for different situations.
 * 
 * TYPES EXPLAINED:
 * - Concealed (Blum): Hidden hinge, Blum brand, premium quality, adjustable
 * - Concealed (Grass): Hidden hinge, Grass brand, good quality alternative
 * - European: Cup-style hinge that mounts in a 35mm hole, very adjustable
 * - Butt Hinge: Traditional exposed hinge, surface mounted, classic look
 * 
 * WHEN TO USE WHICH:
 * - Concealed: Modern cabinets, clean look, most common
 * - European: Frameless cabinets, very adjustable
 * - Butt: Traditional furniture, when you want visible hinges
 */
const HINGE_TYPES = [
    'Concealed (Blum)',   // Most common in modern cabinet shops
    'Concealed (Grass)',  // Good alternative to Blum
    'European',           // Standard for frameless construction
    'Butt Hinge'          // Traditional exposed hinge
];

/**
 * SLIDE_TYPES - Available drawer slide options
 * 
 * WHAT IT IS:
 * List of drawer slide types. The slide is the metal track that lets
 * the drawer roll in and out smoothly.
 * 
 * TYPES EXPLAINED:
 * - Undermount (Blum): Mounts under the drawer, completely hidden, smooth action
 * - Side Mount: Attaches to sides of drawer, visible but strong and reliable
 * - Center Mount: Single track under center of drawer, budget option
 * - Soft-Close: Any slide with damper that prevents slamming
 * 
 * WHEN TO USE WHICH:
 * - Undermount: High-end cabinets, clean look, most expensive
 * - Side Mount: Most common, good balance of cost and performance
 * - Center Mount: Budget projects, smaller drawers
 * - Soft-Close: Premium feature, prevents slamming and extends life
 */
const SLIDE_TYPES = [
    'Undermount (Blum)',  // Premium option, hidden under drawer
    'Side Mount',         // Most common, visible on sides
    'Center Mount',       // Budget option, single center track
    'Soft-Close'          // Special feature, prevents slamming
];

/**
 * PULL_TYPES - Available drawer pull and handle options
 * 
 * WHAT IT IS:
 * List of hardware you grab to open drawers and doors.
 * Different styles suit different cabinet designs.
 * 
 * TYPES EXPLAINED:
 * - Bar Pull: Horizontal bar, modern look, easy to grab
 * - Cup Pull: Curved cup shape, traditional, good for drawers
 * - Knob: Round or decorative, classic, takes less space
 * - Edge Pull: Attaches to top edge, modern, no visible hardware on front
 * - Recessed: Carved into door/drawer, flush with surface, very modern
 * 
 * STYLE GUIDE:
 * - Modern cabinets: Bar pulls or edge pulls
 * - Traditional: Knobs or cup pulls
 * - Contemporary: Recessed or edge pulls
 */
const PULL_TYPES = [
    'Bar Pull',      // Modern, horizontal bar
    'Cup Pull',      // Traditional, curved cup
    'Knob',          // Classic, round
    'Edge Pull',     // Modern, top-mounted
    'Recessed'       // Contemporary, carved in
];

/**
 * CONSTRUCTION_TYPES - Different methods of cabinet construction
 * 
 * WHAT IT IS:
 * The two main ways to build cabinet boxes. This affects how you
 * design and measure everything.
 * 
 * FRAMELESS (European Style):
 * - No face frame on the front of the box
 * - Doors attach directly to the sides
 * - Uses 32mm system (metric drilling pattern)
 * - More interior space
 * - Modern look
 * 
 * FACE FRAME (Traditional American):
 * - Has a wooden frame attached to the front of the box
 * - Doors attach to the frame
 * - Frame covers edges and provides rigidity
 * - Traditional look
 * - frameWidth: how wide each frame piece is (1.5 inches standard)
 * - frameThickness: how thick the frame is (3/4 inch, same as doors)
 * 
 * WHICH TO USE:
 * - Frameless: Modern designs, European-style, maximizes space
 * - Face Frame: Traditional American cabinets, easier to install level
 */
const CONSTRUCTION_TYPES = {
    frameless: {
        name: 'Frameless (European)',
        description: '32mm system, no face frame'
        // No frame means no frame dimensions needed
    },
    faceFrame: {
        name: 'Face Frame',
        description: 'Traditional face frame construction',
        frameWidth: 1.5,       // Each frame piece is 1.5 inches wide
        frameThickness: 0.75   // Frame is 3/4 inch thick (standard)
    }
};

// These constants are now globally available when this script loads
// Other scripts loaded after this one can use:
// DOOR_SPECS, DRAWER_BOX, HINGE_TYPES, SLIDE_TYPES, PULL_TYPES, CONSTRUCTION_TYPES
