/*
 * ========================================
 * ICONS MODULE
 * ========================================
 * 
 * PURPOSE:
 * This file contains all the visual icons (symbols) used in the app's buttons
 * and interface. Icons are small pictures that help you recognize what a button
 * does without reading text - like how a trash can means "delete" or a camera
 * means "take picture."
 * 
 * WHAT ARE THESE ICONS?
 * These are SVG icons. SVG stands for "Scalable Vector Graphics" - they're 
 * images made from mathematical shapes instead of pixels, so they stay sharp 
 * at any size (unlike a photo that gets blurry when enlarged).
 * 
 * HOW THEY WORK:
 * Each icon is a React component (a reusable piece of interface). You can:
 * - Control the size: <Camera size={32} /> makes it 32 pixels
 * - Control the color: <Camera color="red" /> makes it red
 * - Use default values if you don't specify
 * 
 * DEPENDENCIES (what this file needs):
 * - React (already loaded in the HTML file)
 * 
 * USED BY (what files need this one):
 * - CabinetDesigner.js (uses these icons on all the buttons)
 */

/**
 * Camera Icon
 * 
 * USED FOR: Screenshot or capture view button
 * LOOKS LIKE: A camera with a lens
 * 
 * PARAMETERS:
 * @param {number} size - How big the icon is in pixels (default: 24)
 * @param {string} color - What color the icon is (default: currentColor = matches text color)
 */
const Camera = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Main camera body - a rounded rectangle */}
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        {/* Camera lens - a circle in the center */}
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

/**
 * Box Icon
 * 
 * USED FOR: Cabinet or 3D view button
 * LOOKS LIKE: A 3D box/cube
 */
const Box = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Outer box shape */}
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        {/* Top edges of the box to show 3D perspective */}
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        {/* Center line showing depth */}
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

/**
 * Ruler Icon
 * 
 * USED FOR: Measurements or dimensions button
 * LOOKS LIKE: A carpenter's ruler at an angle
 */
const Ruler = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Main body of the ruler */}
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0z"></path>
        {/* Measurement marks on the ruler */}
        <path d="m14.5 12.5 2-2"></path>
        <path d="m11.5 9.5 2-2"></path>
        <path d="m8.5 6.5 2-2"></path>
        <path d="m17.5 15.5 2-2"></path>
    </svg>
);

/**
 * FileText Icon
 * 
 * USED FOR: Documents, cut lists, or reports button
 * LOOKS LIKE: A paper document with text lines
 */
const FileText = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Paper outline */}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        {/* Folded corner at top right */}
        <polyline points="14 2 14 8 20 8"></polyline>
        {/* Text lines on the document */}
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

/**
 * Download Icon
 * 
 * USED FOR: Download or export button
 * LOOKS LIKE: A down arrow going into a box/tray
 */
const Download = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Bottom tray/box receiving the download */}
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        {/* Arrow pointing down */}
        <polyline points="7 10 12 15 17 10"></polyline>
        {/* Vertical line of the arrow */}
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

/**
 * Plus Icon
 * 
 * USED FOR: Add new item button (add cabinet, drawer, door, etc.)
 * LOOKS LIKE: A plus sign (+)
 */
const Plus = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Vertical line of the plus */}
        <line x1="12" y1="5" x2="12" y2="19"></line>
        {/* Horizontal line of the plus */}
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

/**
 * Trash2 Icon
 * 
 * USED FOR: Delete or remove button
 * LOOKS LIKE: A trash can/waste bin
 */
const Trash2 = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Top rim of the trash can */}
        <polyline points="3 6 5 6 21 6"></polyline>
        {/* Main body of the trash can */}
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        {/* Vertical lines inside the can showing it's hollow */}
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

/**
 * Save Icon
 * 
 * USED FOR: Save project button
 * LOOKS LIKE: An old-style floppy disk (classic save icon)
 */
const Save = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Outer shape of the floppy disk */}
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        {/* Lower section (the disk label area) */}
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        {/* Top section (where the write-protect tab was) */}
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

/**
 * FolderOpen Icon
 * 
 * USED FOR: Open or load project button
 * LOOKS LIKE: An open file folder
 */
const FolderOpen = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Folder shape with tab on the left */}
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);

/**
 * DollarSign Icon
 * 
 * USED FOR: Cost, pricing, or estimate button
 * LOOKS LIKE: A dollar sign ($)
 */
const DollarSign = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {/* Vertical line through the S */}
        <line x1="12" y1="1" x2="12" y2="23"></line>
        {/* The S shape of the dollar sign */}
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

/**
 * RotateCcw Icon
 * 
 * USED FOR: Undo button
 * LOOKS LIKE: An arrow rotating counter-clockwise
 */
const RotateCcw = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <polyline points="1 4 1 10 7 10"></polyline>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
    </svg>
);

/**
 * RotateCw Icon
 * 
 * USED FOR: Redo button
 * LOOKS LIKE: An arrow rotating clockwise
 */
const RotateCw = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"></path>
    </svg>
);

/**
 * Clock Icon
 * 
 * USED FOR: History timeline button
 * LOOKS LIKE: A clock face with hands
 */
const Clock = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

// Make icons globally available by attaching to window object
window.Camera = Camera;
window.Box = Box;
window.Ruler = Ruler;
window.FileText = FileText;
window.Download = Download;
window.Plus = Plus;
window.Trash2 = Trash2;
window.Save = Save;
window.FolderOpen = FolderOpen;
window.DollarSign = DollarSign;
window.RotateCcw = RotateCcw;
window.RotateCw = RotateCw;
window.Clock = Clock;

