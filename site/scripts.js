const { useState, useEffect, useRef } = React;

// ========== FRACTION PARSING & CONVERSION FUNCTIONS ==========
// Converts fraction input like "3/4", "1 1/2", "36 3/8" to decimal
function parseFraction(input) {
    if (typeof input === 'number') return input;
    
    input = String(input).trim();
    
    // Remove any double quote marks
    input = input.replace(/"/g, '').trim();
    
    // Handle empty input
    if (input === '') return 0;
    
    // Handle decimal input
    if (!isNaN(input)) return parseFloat(input);
    
    // Handle mixed fractions like "1 1/2" or "36 3/8"
    const mixedMatch = input.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
        const whole = parseInt(mixedMatch[1]);
        const num = parseInt(mixedMatch[2]);
        const den = parseInt(mixedMatch[3]);
        return whole + (num / den);
    }
    
    // Handle simple fractions like "3/4" or "1/2"
    const fracMatch = input.match(/^(\d+)\/(\d+)$/);
    if (fracMatch) {
        const num = parseInt(fracMatch[1]);
        const den = parseInt(fracMatch[2]);
        return num / den;
    }
    
    // If nothing matches, try to parse as decimal
    return parseFloat(input) || 0;
}

// Converts decimal inches to fractional inches (down to 32nds)
function decimalToFraction(decimal) {
    const wholeInches = Math.floor(decimal);
    const fraction = decimal - wholeInches;
    
    // Convert to 32nds
    const thirtySeconds = Math.round(fraction * 32);
    
    // Simplify fraction
    let num = thirtySeconds;
    let den = 32;
    
    if (num === 0) {
        if (wholeInches > 0) return `${wholeInches}"`;
        return '0"';
    }
    
    // Reduce fraction
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(num, den);
    num = num / divisor;
    den = den / divisor;
    
    let result = '';
    if (wholeInches > 0) result += `${wholeInches}`;
    if (num > 0) {
        if (wholeInches > 0) result += ` ${num}/${den}"`;
        else result += `${num}/${den}"`;
    } else {
        result += '"';
    }
    
    return result.trim();
}

// Formats measurement as: fraction (decimal), fraction only, or decimal only
function formatMeasurement(decimal, format = 'both') {
    if (decimal <= 0) return '0"';
    const fraction = decimalToFraction(decimal);
    const decimalStr = `${decimal.toFixed(3)}"`;
    
    if (format === 'fraction') return fraction;
    if (format === 'decimal') return decimalStr;
    return `${fraction} (${decimalStr})`; // both
}

// construction specs
const DOOR_SPECS = {
    shaker: { railWidth: 2.5, stileWidth: 2.5, panelThickness: 0.25, panelSetback: 0.375 },
    flat: { thickness: 0.75 },
    raised: { railWidth: 2.5, stileWidth: 2.5, centerRaise: 0.25 },
    glass: { railWidth: 2, stileWidth: 2, glassThickness: 0.125 }
};

const DRAWER_BOX = {
    sideThickness: 0.5,
    bottomThickness: 0.25,
    frontBackHeight: 4,
    slidesClearance: 0.5
};

// Smart Defaults Constants
const SMART_DEFAULTS = {
    // Standard reveal (gap) between drawer fronts
    drawerReveal: 0.125, // 1/8 inch gap between drawers
    doorReveal: 0.125,   // 1/8 inch gap between doors
    
    // Optimal drawer heights for different purposes
    drawerHeights: {
        small: 4,      // Utensil/small items drawer
        medium: 6,     // Standard drawer
        large: 8,      // Large drawer
        deep: 10       // Deep drawer (pots/pans)
    },
    
    // Door width recommendations
    doorWidth: {
        min: 8,        // Minimum usable door width
        optimalMin: 12, // Optimal minimum for comfortable use
        optimalMax: 24, // Optimal maximum before needing to split
        max: 30        // Maximum before requiring split
    }
};

// hardware options
const HINGE_TYPES = ['Concealed (Blum)', 'Concealed (Grass)', 'European', 'Butt Hinge'];
const SLIDE_TYPES = ['Undermount (Blum)', 'Side Mount', 'Center Mount', 'Soft-Close'];
const PULL_TYPES = ['Bar Pull', 'Cup Pull', 'Knob', 'Edge Pull', 'Recessed'];

// ========== CABINET DATA STRUCTURE ==========
class CabinetComponent {
    constructor(width, height, depth, material = 'Oak', thickness = 0.75) {
        this.width = width;           // inches
        this.height = height;         // inches
        this.depth = depth;           // inches
        this.material = material;     // wood type
        this.thickness = thickness;   // inches
    }
}

class Drawer {
    constructor(width, height, depth, material = 'Oak', thickness = 0.5) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = material;
        this.thickness = thickness;
        this.slide = SLIDE_TYPES[0];  // default to first slide type
        this.pull = PULL_TYPES[0];    // default to first pull type
    }
}

class Door {
    constructor(width, height, depth, material = 'Oak', thickness = 0.75, doorType = 'shaker') {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = material;
        this.thickness = thickness;
        this.doorType = doorType;     // 'shaker', 'flat', 'raised', 'glass'
        this.hinge = HINGE_TYPES[0];  // default to first hinge type
        this.pull = PULL_TYPES[0];    // default to first pull type
    }
}

class Cabinet {
    constructor(cabinetWidth, cabinetHeight, cabinetDepth) {
        this.width = cabinetWidth;
        this.height = cabinetHeight;
        this.depth = cabinetDepth;
        
        // Cabinet components
        this.sides = {
            left: new CabinetComponent(cabinetWidth, cabinetHeight, cabinetDepth),
            right: new CabinetComponent(cabinetWidth, cabinetHeight, cabinetDepth)
        };
        
        this.back = new CabinetComponent(cabinetWidth, cabinetHeight, 0.25);
        this.drawers = [];  // array of Drawer objects
        this.door = null;   // single Door object or null
    }
    
    addDrawer(width, height, depth, material = 'Oak', thickness = 0.5) {
        const drawer = new Drawer(width, height, depth, material, thickness);
        this.drawers.push(drawer);
        return drawer;
    }
    
    removeDrawer(index) {
        if (index >= 0 && index < this.drawers.length) {
            this.drawers.splice(index, 1);
        }
    }
    
    setDoor(width, height, depth, material = 'Oak', thickness = 0.75, doorType = 'shaker') {
        this.door = new Door(width, height, depth, material, thickness, doorType);
        return this.door;
    }
    
    removeDoor() {
        this.door = null;
    }
    
    updateSides(width, height, depth, material, thickness) {
        this.sides.left = new CabinetComponent(width, height, depth, material, thickness);
        this.sides.right = new CabinetComponent(width, height, depth, material, thickness);
    }
    
    updateBack(width, height, material, thickness = 0.25) {
        this.back = new CabinetComponent(width, height, thickness, material, thickness);
    }
}

// construction types
const CONSTRUCTION_TYPES = {
    frameless: {
    name: 'Frameless (European)',
    description: '32mm system, no face frame'
    },
    faceFrame: {
    name: 'Face Frame',
    description: 'Traditional face frame construction',
    frameWidth: 1.5,
    frameThickness: 0.75
    }
};

// icons (keeping them compact)
const Camera = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

const Box = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

const Ruler = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0z"></path>
    <path d="m14.5 12.5 2-2"></path>
    <path d="m11.5 9.5 2-2"></path>
    <path d="m8.5 6.5 2-2"></path>
    <path d="m17.5 15.5 2-2"></path>
    </svg>
);

const FileText = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const Download = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const Upload = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const Plus = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const Trash2 = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const Save = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

const FolderOpen = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);

const DollarSign = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

// ========== PROJECT MANAGEMENT FUNCTIONS ==========
// Save project to localStorage
const saveProjectToStorage = (projectName, cabinets, materialCosts, laborRate) => {
    if (!projectName.trim()) {
        alert('Please enter a project name!');
        return false;
    }
    
    const projectData = {
        name: projectName,
        date: new Date().toISOString(),
        cabinets: cabinets,
        materialCosts: materialCosts,
        laborRate: laborRate
    };
    
    let savedProjects = JSON.parse(localStorage.getItem('cabinetProjects') || '[]');
    
    const existingIndex = savedProjects.findIndex(p => p.name === projectName);
    if (existingIndex >= 0) {
        if (confirm(`A project named "${projectName}" already exists. Do you want to overwrite it?`)) {
            savedProjects[existingIndex] = projectData;
        } else {
            return false;
        }
    } else {
        savedProjects.push(projectData);
    }
    
    localStorage.setItem('cabinetProjects', JSON.stringify(savedProjects));
    return true;
};

// Load project from localStorage
const loadProjectFromStorage = (projectName) => {
    const savedProjects = JSON.parse(localStorage.getItem('cabinetProjects') || '[]');
    return savedProjects.find(p => p.name === projectName);
};

// Get all saved projects
const getAllSavedProjects = () => {
    return JSON.parse(localStorage.getItem('cabinetProjects') || '[]');
};

// Delete project from localStorage
const deleteProjectFromStorage = (projectName) => {
    let savedProjects = JSON.parse(localStorage.getItem('cabinetProjects') || '[]');
    savedProjects = savedProjects.filter(p => p.name !== projectName);
    localStorage.setItem('cabinetProjects', JSON.stringify(savedProjects));
};

// main component
const createWoodTexture = (color) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < 30; i++) {
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * 512);

    for (let x = 0; x < 512; x += 10) {
        const y = Math.sin(x * 0.02 + i) * 15 + Math.random() * 512;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    }

    const imageData = ctx.getImageData(0, 0, 512, 512);
    for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10;
    imageData.data[i] += noise;
    imageData.data[i + 1] += noise;
    imageData.data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
};

// main component
const CabinetDesigner = () => {
    const [cabinets, setCabinets] = useState([]);
    const [selectedCabinetId, setSelectedCabinetId] = useState(null);
    const [selectedDrawerId, setSelectedDrawerId] = useState(null);
    const [selectedDoorIndex, setSelectedDoorIndex] = useState(null);
    const [hiddenDoors, setHiddenDoors] = useState(new Set()); // Set of "cabinetId-doorIndex" strings
    const [hiddenDrawers, setHiddenDrawers] = useState(new Set()); // Set of drawer IDs
    const [viewMode, setViewMode] = useState('3d');
    const [projectName, setProjectName] = useState('Untitled Project');
    const [showCutList, setShowCutList] = useState(false);
    const [showShoppingList, setShowShoppingList] = useState(false);
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

    const [laborRate, setLaborRate] = useState(50); // per hour
    const [activeCameraPreset, setActiveCameraPreset] = useState('isometric'); // Track active camera view
    const [measurementFormat, setMeasurementFormat] = useState(() => {
        // Load measurement preference from localStorage, default to 'both'
        return localStorage.getItem('measurementFormat') || 'both';
    });
    const [showHistoryTimeline, setShowHistoryTimeline] = useState(false); // Show/hide history timeline
    const [validationResults, setValidationResults] = useState(null); // Store validation results for selected cabinet
    const [isMovingCabinet, setIsMovingCabinet] = useState(false); // Track if in move mode

    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const animationRef = useRef(null);
    const woodTextureCache = useRef({});
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const historyManager = useRef(new window.HistoryManager()); // History manager for undo/redo
    const isRestoringHistory = useRef(false); // Flag to prevent circular history updates

    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });
    const cameraAngle = useRef({ theta: Math.PI / 4, phi: Math.PI / 6 });
    const cameraDistance = useRef(80);
    const modelRef = useRef(null); // Reference to the loaded GLB model
    
    // Move mode state
    const isMoveMode = useRef(false);
    const movingCabinetId = useRef(null);
    const cameraTarget = useRef(new THREE.Vector3(0, 15, 0));
    const clickStartTime = useRef(0);
    const DOUBLE_CLICK_THRESHOLD = 300; // ms

    // Save measurement format preference to localStorage
    useEffect(() => {
        localStorage.setItem('measurementFormat', measurementFormat);
    }, [measurementFormat]);

    // create default cabinet
    const createNewCabinet = () => {
    // Calculate X position - place new cabinet to the right of existing ones
    let xPosition = 0;
    if (cabinets.length > 0) {
        const rightmostCabinet = cabinets.reduce((rightmost, cab) => {
            const cabRight = cab.xPosition + cab.width;
            const rightmostRight = rightmost.xPosition + rightmost.width;
            return cabRight > rightmostRight ? cab : rightmost;
        });
        xPosition = rightmostCabinet.xPosition + rightmostCabinet.width;
    }

    return {
        id: Date.now(),
        name: `Cabinet ${cabinets.length + 1}`,
        type: 'base',
        construction: 'frameless', // or 'faceFrame'
        xPosition: xPosition, // X position in layout (inches)
        zPosition: 0, // Z position (depth/forward-back)
        width: 24,
        height: 34.5,
        depth: 24,
        material: 'plywood',
        thickness: 0.75,
        doors: 0,
        doorStyle: 'shaker',
        doubleDoor: false,
        doorDrawerGap: 0.125, // 1/8" default gap
        doorOverhang: 0.5, // 1/2" default overhang
        doorHandles: {}, // {doorIndex: 'left'|'right'} for each door
        drawers: [],  // array of {height, startY} - positioned from bottom
        drawerStyle: 'shaker',
        shelves: 1,
        backPanel: true,
        toekick: true,
        toekickHeight: 4,
        toekickDepth: 3,
        color: '#8B7355',
        edgebanding: true,
        edgebandColor: '#8B7355',
        hardware: {
        hinges: 'Concealed (Blum)',
        slides: 'Undermount (Blum)',
        pulls: 'Bar Pull'
        },
        countertop: false,
        countertopMaterial: 'Quartz',
        countertopThickness: 1.25,
        crown: false,
        crownHeight: 3,
        pricing: {
        materialCost: 0,
        hardwareCost: 0,
        laborHours: 0,
        totalCost: 0
        }
    };
    };

    // setup 3D scene
    useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
        50,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
    );
    updateCameraPosition(camera);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(200, 40, 0x888888, 0xdddddd);
    scene.add(gridHelper);

    const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        
        // Rotate the GLB model if it exists
        if (modelRef.current) {
            modelRef.current.rotation.y += 0.005;
        }
        
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!containerRef.current || !canvasRef.current) return;
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            // Exit move mode if active
            if (isMoveMode.current) {
                exitMoveMode();
            }
        } else if (e.key === 'Delete') {
        if (selectedDrawerId && selectedCabinetId) {
            deleteDrawer(selectedCabinetId, selectedDrawerId);
            setSelectedDrawerId(null);
        } else if (selectedDoorIndex !== null && selectedCabinetId) {
            const cabinet = cabinets.find(c => c.id === selectedCabinetId);
            if (cabinet && cabinet.doors > 0) {
            updateCabinet(selectedCabinetId, 'doors', cabinet.doors - 1);
            setSelectedDoorIndex(null);
            }
        } else if (selectedCabinetId) {
            if (confirm('Delete this cabinet and all its contents?')) {
            handleDeleteCabinet(selectedCabinetId);
            }
        }
        }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    canvasRef.current?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        canvasRef.current?.removeEventListener('wheel', handleWheel);
        if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        }
    };
    }, []);

    // Load GLB model
    useEffect(() => {
        if (!sceneRef.current) return;

        // Check if GLTFLoader is available
        if (typeof THREE === 'undefined' || !THREE.GLTFLoader) {
            console.warn('GLTFLoader not yet available, retrying...');
            const timeout = setTimeout(() => {
                // Retry after a short delay
                if (THREE && THREE.GLTFLoader) {
                    const loader = new THREE.GLTFLoader();
                    loadModel(loader, sceneRef.current);
                }
            }, 500);
            return () => clearTimeout(timeout);
        }

        const loader = new THREE.GLTFLoader();
        loadModel(loader, sceneRef.current);
    }, []);

    const loadModel = (loader, scene) => {
        loader.load(
            'myNewModel.glb',
            (gltf) => {
                const model = gltf.scene;
                
                // Remove old model if it exists
                if (modelRef.current) {
                    scene.remove(modelRef.current);
                }
                
                // Scale the model to fit nicely in the scene
                model.scale.set(0.1, 0.1, 0.1);
                
                // Center the model in the scene
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                
                // Add basic rotation animation
                model.userData.isModel = true;
                
                scene.add(model);
                modelRef.current = model;
            },
            (progress) => {
                console.log('Loading model: ' + (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading GLB model:', error);
            }
        );
    };

    const updateCameraPosition = (camera, enforceTarget = false) => {
    const theta = cameraAngle.current.theta;
    const phi = cameraAngle.current.phi;
    const distance = cameraDistance.current;
    
    // Get the target point (cabinet center if in move mode, otherwise scene center)
    const target = cameraTarget.current;

    // Calculate camera position relative to target
    camera.position.x = target.x + distance * Math.sin(theta) * Math.cos(phi);
    camera.position.y = target.y + distance * Math.sin(phi);
    camera.position.z = target.z + distance * Math.cos(theta) * Math.cos(phi);
    
    // Apply boundary constraints to keep view within design area
    const maxBoundary = 150; // Maximum distance from origin
    const minY = 5; // Minimum camera height
    const maxY = 100; // Maximum camera height
    
    // Clamp camera position to boundaries
    camera.position.x = Math.max(-maxBoundary, Math.min(maxBoundary, camera.position.x));
    camera.position.y = Math.max(minY, Math.min(maxY, camera.position.y));
    camera.position.z = Math.max(-maxBoundary, Math.min(maxBoundary, camera.position.z));
    
    camera.lookAt(target);
    };

    // mouse controls
    const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    
    // Check if we're clicking on a cabinet
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(sceneRef.current.children, true);
    
    let clickedOnCabinet = false;
    
    // Check if we clicked on a cabinet
    for (let intersection of intersects) {
        let obj = intersection.object;
        
        while (obj) {
            if (obj.userData.cabinetId) {
                clickedOnCabinet = true;
                const cabinetId = obj.userData.cabinetId;
                
                // Handle double-click detection (enter move mode)
                const now = Date.now();
                const timeSinceLastClick = now - clickStartTime.current;
                
                if (timeSinceLastClick < DOUBLE_CLICK_THRESHOLD && selectedCabinetId === cabinetId) {
                    // Double-click detected - enter move mode
                    enterMoveMode(cabinetId);
                    return;
                } else {
                    // Single click - just select
                    if (!isMoveMode.current) {
                        setSelectedCabinetId(cabinetId);
                        setSelectedDrawerId(null);
                        setSelectedDoorIndex(null);
                    }
                }
                
                clickStartTime.current = now;
                break;
            }
            obj = obj.parent;
        }
        
        if (clickedOnCabinet) break;
    }
    
    // If clicked on empty space
    if (!clickedOnCabinet) {
        if (isMoveMode.current) {
            // Exit move mode
            exitMoveMode();
        } else {
            // Start camera rotation
            isDragging.current = true;
            previousMousePosition.current = { x: e.clientX, y: e.clientY };
        }
    } else if (isMoveMode.current) {
        // In move mode, clicking on a cabinet starts dragging it
        isDragging.current = true;
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
    }
    };
    
    const enterMoveMode = (cabinetId) => {
    isMoveMode.current = true;
    movingCabinetId.current = cabinetId;
    setIsMovingCabinet(true);
    
    // Update camera target to cabinet position
    const cabinet = cabinets.find(c => c.id === cabinetId);
    if (cabinet) {
        cameraTarget.current.set(
            cabinet.xPosition + cabinet.width / 2,
            cabinet.height / 2,
            cabinet.zPosition || 0
        );
        updateCameraPosition(cameraRef.current);
    }
    };
    
    const exitMoveMode = () => {
    isMoveMode.current = false;
    movingCabinetId.current = null;
    setIsMovingCabinet(false);
    // Reset camera target to scene center
    cameraTarget.current.set(0, 15, 0);
    updateCameraPosition(cameraRef.current);
    };
    
    const handleDoubleClick = (e) => {
    // This is now handled in handleMouseDown for better control
    };

    const handleMouseMove = (e) => {
    if (!isDragging.current || !cameraRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    if (isMoveMode.current && movingCabinetId.current) {
        // Move the cabinet in move mode - supports all 8 directions
        const cabinet = cabinets.find(c => c.id === movingCabinetId.current);
        if (cabinet) {
            // Calculate movement in world space - faster movement
            const movementScale = 0.15; // Increased from 0.1 for faster movement
            const newXPosition = cabinet.xPosition + deltaX * movementScale;
            const newZPosition = (cabinet.zPosition || 0) - deltaY * movementScale; // Inverted Y for intuitive forward/back
            
            // Update cabinet positions for both axes
            const updatedCabinet = { 
                ...cabinet, 
                xPosition: newXPosition,
                zPosition: newZPosition
            };
            setCabinets(cabinets.map(c => 
                c.id === movingCabinetId.current ? updatedCabinet : c
            ));
            
            // Update camera target to follow cabinet smoothly
            cameraTarget.current.set(
                newXPosition + cabinet.width / 2,
                cabinet.height / 2,
                newZPosition
            );
            
            updateCameraPosition(cameraRef.current);
        }
    } else {
        // Regular camera rotation - 1 degree per pixel
        const degreesPerPixel = Math.PI / 180; // Convert 1 degree to radians
        cameraAngle.current.theta -= deltaX * degreesPerPixel;
        cameraAngle.current.phi += deltaY * degreesPerPixel;
        cameraAngle.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, cameraAngle.current.phi));

        updateCameraPosition(cameraRef.current);
        
        // Clear active preset when user manually moves camera
        setActiveCameraPreset(null);
    }

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
    isDragging.current = false;
    };

    const handleWheel = (e) => {
    e.preventDefault();
    if (!cameraRef.current) return;

    cameraDistance.current += e.deltaY * 0.05;
    cameraDistance.current = Math.max(30, Math.min(150, cameraDistance.current));
    updateCameraPosition(cameraRef.current);
    
    // Clear active preset when user manually zooms
    setActiveCameraPreset(null);
    };

    // Handle camera preset selection
    const handleCameraPresetSelect = (presetName) => {
    if (!cameraRef.current) return;
    
    // Apply the camera preset using the imported function
    const success = window.applyCameraPreset(
        cameraRef.current,
        presetName,
        cameraAngle,
        cameraDistance,
        updateCameraPosition
    );
    
    // Update active preset state if successful
    if (success) {
        setActiveCameraPreset(presetName);
    }
    };

    // update 3D when cabinets change or selection changes
    useEffect(() => {
    if (!sceneRef.current) return;

    const objectsToRemove = [];
    sceneRef.current.traverse((object) => {
        if (object.userData.isCabinet) {
        objectsToRemove.push(object);
        }
    });
    objectsToRemove.forEach(obj => sceneRef.current.remove(obj));

    // Use xPosition and zPosition from each cabinet for layout positioning
    cabinets.forEach((cabinet) => {
        const xOffset = cabinet.xPosition || 0; // Use cabinet's X position
        const zOffset = cabinet.zPosition || 0; // Use cabinet's Z position
        const cabinetGroup = createCabinet3D(cabinet, xOffset, zOffset);
        sceneRef.current.add(cabinetGroup);
    });
    }, [cabinets, selectedCabinetId, selectedDrawerId, selectedDoorIndex, hiddenDoors, hiddenDrawers]);

    // create door/drawer front with details
    const createDoorFront = (width, height, style, material, position, xOffset, isHighlighted = false) => {
    const isSelected = selectedCabinetId && cabinets.find(c => c.id === selectedCabinetId);
    const doorColor = isHighlighted ? 0xff8855 : (isSelected?.id === selectedCabinetId ? 0xaa5533 : 0x6B5444);

    if (!woodTextureCache.current[doorColor]) {
        woodTextureCache.current[doorColor] = createWoodTexture(`#${doorColor.toString(16).padStart(6, '0')}`);
    }

    const doorMaterial = new THREE.MeshStandardMaterial({
        map: woodTextureCache.current[doorColor],
        roughness: isHighlighted ? 0.2 : 0.4,
        metalness: isHighlighted ? 0.3 : 0.1
    });

    const group = new THREE.Group();

    if (style === 'shaker') {
        const spec = DOOR_SPECS.shaker;

        // rails and stiles
        const topRailGeo = new THREE.BoxGeometry(width, spec.railWidth, 0.75);
        const topRail = new THREE.Mesh(topRailGeo, doorMaterial);
        topRail.position.set(position.x, position.y + height/2 - spec.railWidth/2, position.z);
        topRail.castShadow = true;
        group.add(topRail);

        const bottomRail = new THREE.Mesh(topRailGeo, doorMaterial);
        bottomRail.position.set(position.x, position.y - height/2 + spec.railWidth/2, position.z);
        bottomRail.castShadow = true;
        group.add(bottomRail);

        const stileGeo = new THREE.BoxGeometry(spec.stileWidth, height, 0.75);
        const leftStile = new THREE.Mesh(stileGeo, doorMaterial);
        leftStile.position.set(position.x - width/2 + spec.stileWidth/2, position.y, position.z);
        leftStile.castShadow = true;
        group.add(leftStile);

        const rightStile = new THREE.Mesh(stileGeo, doorMaterial);
        rightStile.position.set(position.x + width/2 - spec.stileWidth/2, position.y, position.z);
        rightStile.castShadow = true;
        group.add(rightStile);

        // center panel
        const panelWidth = width - spec.stileWidth * 2;
        const panelHeight = height - spec.railWidth * 2;
        const panelGeo = new THREE.BoxGeometry(panelWidth, panelHeight, spec.panelThickness);
        const panelMat = new THREE.MeshStandardMaterial({
        map: woodTextureCache.current[doorColor],
        roughness: 0.5
        });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.set(position.x, position.y, position.z - spec.panelSetback);
        group.add(panel);

    } else if (style === 'raised') {
        const spec = DOOR_SPECS.raised;

        const frameGeo = new THREE.BoxGeometry(width, height, 0.75);
        const frame = new THREE.Mesh(frameGeo, doorMaterial);
        frame.position.copy(position);
        frame.castShadow = true;
        group.add(frame);

        const centerWidth = width - spec.stileWidth * 2;
        const centerHeight = height - spec.railWidth * 2;
        const raisedGeo = new THREE.BoxGeometry(centerWidth, centerHeight, 0.75 + spec.centerRaise);
        const raised = new THREE.Mesh(raisedGeo, doorMaterial);
        raised.position.set(position.x, position.y, position.z + spec.centerRaise/2);
        group.add(raised);

    } else if (style === 'glass') {
        const spec = DOOR_SPECS.glass;

        const topRailGeo = new THREE.BoxGeometry(width, spec.railWidth, 0.75);
        const top = new THREE.Mesh(topRailGeo, doorMaterial);
        top.position.set(position.x, position.y + height/2 - spec.railWidth/2, position.z);
        group.add(top);

        const bottom = new THREE.Mesh(topRailGeo, doorMaterial);
        bottom.position.set(position.x, position.y - height/2 + spec.railWidth/2, position.z);
        group.add(bottom);

        const sideGeo = new THREE.BoxGeometry(spec.stileWidth, height, 0.75);
        const left = new THREE.Mesh(sideGeo, doorMaterial);
        left.position.set(position.x - width/2 + spec.stileWidth/2, position.y, position.z);
        group.add(left);

        const right = new THREE.Mesh(sideGeo, doorMaterial);
        right.position.set(position.x + width/2 - spec.stileWidth/2, position.y, position.z);
        group.add(right);

        const glassWidth = width - spec.stileWidth * 2;
        const glassHeight = height - spec.railWidth * 2;
        const glassGeo = new THREE.BoxGeometry(glassWidth, glassHeight, spec.glassThickness);
        const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xccddff,
        transparent: true,
        opacity: 0.3,
        roughness: 0,
        metalness: 0.1,
        transmission: 0.9
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.copy(position);
        group.add(glass);

    } else { // flat
        const spec = DOOR_SPECS.flat;
        const doorGeo = new THREE.BoxGeometry(width, height, spec.thickness);
        const door = new THREE.Mesh(doorGeo, doorMaterial);
        door.position.copy(position);
        door.castShadow = true;
        group.add(door);
    }

    // handle
    const handleGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.2 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(position.x + (width / 3), position.y, position.z + 0.8);
    group.add(handle);

    return group;
    };

    // create drawer box
    const createDrawerBox = (width, depth, drawerFrontHeight, position, isHighlighted = false) => {
    const group = new THREE.Group();

    const boxColor = isHighlighted ? 0xff8855 : 0xD4A574;
    const boxMat = new THREE.MeshStandardMaterial({ 
        color: boxColor, 
        roughness: isHighlighted ? 0.2 : 0.6,
        metalness: isHighlighted ? 0.3 : 0
    });

    const boxHeight = Math.min(DRAWER_BOX.frontBackHeight, drawerFrontHeight - 1);

    // sides
    const sideGeo = new THREE.BoxGeometry(DRAWER_BOX.sideThickness, boxHeight, depth - 2);
    const leftSide = new THREE.Mesh(sideGeo, boxMat);
    leftSide.position.set(position.x - width/2 + DRAWER_BOX.sideThickness/2, position.y, position.z - 1);
    group.add(leftSide);

    const rightSide = new THREE.Mesh(sideGeo, boxMat);
    rightSide.position.set(position.x + width/2 - DRAWER_BOX.sideThickness/2, position.y, position.z - 1);
    group.add(rightSide);

    // back
    const frontBackGeo = new THREE.BoxGeometry(width - DRAWER_BOX.sideThickness * 2, boxHeight, DRAWER_BOX.sideThickness);
    const back = new THREE.Mesh(frontBackGeo, boxMat);
    back.position.set(position.x, position.y, position.z - depth/2 + DRAWER_BOX.sideThickness/2);
    group.add(back);

    // bottom
    const bottomGeo = new THREE.BoxGeometry(width - DRAWER_BOX.sideThickness * 2, DRAWER_BOX.bottomThickness, depth - 2);
    const bottom = new THREE.Mesh(bottomGeo, boxMat);
    bottom.position.set(position.x, position.y - boxHeight/2 + DRAWER_BOX.bottomThickness/2, position.z - 1);
    group.add(bottom);

    return group;
    };

    // build 3D cabinet
    const createCabinet3D = (cabinet, xOffset, zOffset = 0) => {
    const group = new THREE.Group();
    group.userData.isCabinet = true;
    group.userData.cabinetId = cabinet.id;

    const { width, height, depth, thickness } = cabinet;
    const isSelected = cabinet.id === selectedCabinetId;

    const cabinetColorHex = isSelected ? 0xff8855 : new THREE.Color(cabinet.color).getHex();
    if (!woodTextureCache.current[cabinetColorHex]) {
        woodTextureCache.current[cabinetColorHex] = createWoodTexture(isSelected ? '#ff8855' : cabinet.color);
    }

    const material = new THREE.MeshStandardMaterial({
        map: woodTextureCache.current[cabinetColorHex],
        roughness: 0.7,
        metalness: 0.1
    });

    // cabinet box
    const sideGeo = new THREE.BoxGeometry(thickness, height, depth);
    const leftSide = new THREE.Mesh(sideGeo, material);
    leftSide.position.set(xOffset, height / 2, zOffset);
    leftSide.castShadow = true;
    group.add(leftSide);

    const rightSide = new THREE.Mesh(sideGeo, material);
    rightSide.position.set(xOffset + width - thickness, height / 2, zOffset);
    rightSide.castShadow = true;
    group.add(rightSide);

    // top stretchers - front and back (runs left to right)
    const stretcher_thickness = 1.5;
    
    // Front stretcher (runs left to right)
    const frontStretcher_geo = new THREE.BoxGeometry(width - thickness * 2, stretcher_thickness, thickness * 3);
    const frontStretcher = new THREE.Mesh(frontStretcher_geo, material);
    frontStretcher.position.set(xOffset + width / 2, height - stretcher_thickness / 2, zOffset + depth / 2 - thickness * 1.5);
    frontStretcher.castShadow = true;
    group.add(frontStretcher);

    // Back stretcher (runs left to right)
    const backStretcher_geo = new THREE.BoxGeometry(width - thickness * 2, stretcher_thickness, thickness * 3);
    const backStretcher = new THREE.Mesh(backStretcher_geo, material);
    backStretcher.position.set(xOffset + width / 2, height - stretcher_thickness / 2, zOffset - depth / 2 + thickness * 1.5);
    backStretcher.castShadow = true;
    group.add(backStretcher);

    const topGeo = new THREE.BoxGeometry(width, thickness, depth);
    const bottom = new THREE.Mesh(topGeo, material);
    const bottomY = cabinet.toekick ? cabinet.toekickHeight : 0;
    bottom.position.set(xOffset + width / 2, bottomY + thickness / 2, zOffset);
    bottom.castShadow = true;
    group.add(bottom);

    if (cabinet.backPanel) {
        const backGeo = new THREE.BoxGeometry(width - thickness * 2, height, 0.25);
        const back = new THREE.Mesh(backGeo, material);
        back.position.set(xOffset + width / 2, height / 2, zOffset - depth / 2 + 0.125);
        group.add(back);
    }

    // face frame (for face frame construction)
    if (cabinet.construction === 'faceFrame') {
        const frameThickness = 0.75;
        const frameWidth = 1.5;
        
        // top rail
        const topRailGeo = new THREE.BoxGeometry(width - thickness * 2, frameWidth, frameThickness);
        const topRail = new THREE.Mesh(topRailGeo, material);
        topRail.position.set(xOffset + width / 2, height - frameWidth / 2, zOffset + depth / 2 - frameThickness / 2);
        topRail.castShadow = true;
        group.add(topRail);

        // bottom rail - positioned to sit on top of toe kick
        const bottomY = cabinet.toekick ? cabinet.toekickHeight : 0;
        const bottomRailGeo = new THREE.BoxGeometry(width - thickness * 2, frameWidth, frameThickness);
        const bottomRailMaterial = new THREE.MeshStandardMaterial({ 
            color: material.color,
            roughness: 0.4,
            metalness: 0.0
        });
        const bottomRail = new THREE.Mesh(bottomRailGeo, bottomRailMaterial);
        bottomRail.position.set(xOffset + width / 2, bottomY + frameWidth / 2, zOffset + depth / 2 - frameThickness / 2);
        bottomRail.castShadow = true;
        bottomRail.receiveShadow = true;
        group.add(bottomRail);

        // left stile
        const leftStileGeo = new THREE.BoxGeometry(frameWidth, height - frameWidth * 2, frameThickness);
        const leftStile = new THREE.Mesh(leftStileGeo, material);
        leftStile.position.set(xOffset + thickness + frameWidth / 2, height / 2, zOffset + depth / 2 - frameThickness / 2);
        leftStile.castShadow = true;
        group.add(leftStile);

        // right stile
        const rightStileGeo = new THREE.BoxGeometry(frameWidth, height - frameWidth * 2, frameThickness);
        const rightStile = new THREE.Mesh(rightStileGeo, material);
        rightStile.position.set(xOffset + width - thickness - frameWidth / 2, height / 2, zOffset + depth / 2 - frameThickness / 2);
        rightStile.castShadow = true;
        group.add(rightStile);
    }

    // shelves
    const shelfGeo = new THREE.BoxGeometry(width - thickness * 2, thickness, depth - 1);
    for (let i = 0; i < cabinet.shelves; i++) {
        const shelfY = height / (cabinet.shelves + 1) * (i + 1);
        const shelf = new THREE.Mesh(shelfGeo, material);
        shelf.position.set(xOffset + width / 2, shelfY, zOffset);
        group.add(shelf);
    }

    const doorStartY = cabinet.toekick ? cabinet.toekickHeight : 0;

    // drawers - properly positioned
    if (cabinet.drawers && cabinet.drawers.length > 0) {
        cabinet.drawers.forEach((drawer, i) => {
        // Skip rendering if drawer is hidden
        if (hiddenDrawers.has(drawer.id)) return;
        
        const drawerY = drawer.startY + drawer.height / 2;

        const frontPos = new THREE.Vector3(
            xOffset + width / 2,
            drawerY,
            zOffset + depth / 2 + 0.375
        );

        const drawerFront = createDoorFront(
            width - 2,
            drawer.height - 0.5,
            cabinet.drawerStyle || 'shaker',
            cabinet.material,
            frontPos,
            xOffset,
            selectedDrawerId === drawer.id // highlight if selected
        );
        drawerFront.userData.cabinetId = cabinet.id;
        drawerFront.userData.drawerId = drawer.id;
        drawerFront.userData.isDrawer = true;
        group.add(drawerFront);

        const boxPos = new THREE.Vector3(
            xOffset + width / 2,
            drawerY,
            zOffset
        );
        const drawerBox = createDrawerBox(width - 2, depth, drawer.height, boxPos, selectedDrawerId === drawer.id);
        drawerBox.userData.cabinetId = cabinet.id;
        drawerBox.userData.drawerId = drawer.id;
        drawerBox.userData.isDrawer = true;
        group.add(drawerBox);
        });
    }

    // doors - fill remaining space after drawers
    const totalDrawerHeight = cabinet.drawers?.reduce((sum, d) => sum + d.height, 0) || 0;
    const highestDrawerY = cabinet.drawers?.reduce((max, d) => Math.max(max, d.startY + d.height), doorStartY) || doorStartY;
    const availableHeight = height - highestDrawerY;
    const doorHeight = availableHeight - 1;

    if (cabinet.doors > 0 && doorHeight > 3) {
        const doorWidth = width / cabinet.doors - 1;
        const doorY = highestDrawerY + doorHeight / 2 + 0.5;

        for (let i = 0; i < cabinet.doors; i++) {
        // Skip rendering if door is hidden
        const doorKey = `${cabinet.id}-${i}`;
        if (hiddenDoors.has(doorKey)) continue;
        
        const doorX = xOffset + (doorWidth + 1) * i + doorWidth / 2 + (width - (doorWidth + 1) * cabinet.doors + 1) / 2;
        const doorPos = new THREE.Vector3(doorX, doorY, zOffset + depth / 2 + 0.375);

        const door = createDoorFront(
            doorWidth,
            doorHeight,
            cabinet.doorStyle || 'shaker',
            cabinet.material,
            doorPos,
            xOffset,
            selectedDoorIndex === i // highlight if selected
        );
        door.userData.cabinetId = cabinet.id;
        door.userData.doorIndex = i;
        door.userData.isDoor = true;
        group.add(door);
        }
    }

    // toekick
    if (cabinet.toekick) {
        const toekickDepth = cabinet.toekickDepth || 3;
        const toekickGeo = new THREE.BoxGeometry(width, cabinet.toekickHeight, toekickDepth);
        const toekickMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.6,
            metalness: 0.1
        });
        const toekick = new THREE.Mesh(toekickGeo, toekickMaterial);
        toekick.position.set(xOffset + width / 2, cabinet.toekickHeight / 2, zOffset + depth / 2 - toekickDepth / 2);
        toekick.castShadow = true;
        toekick.receiveShadow = true;
        group.add(toekick);
    }

    // countertop
    if (cabinet.countertop) {
        const counterGeo = new THREE.BoxGeometry(width + 1, cabinet.countertopThickness, depth + 1);
        const counterMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.2 });
        const counter = new THREE.Mesh(counterGeo, counterMat);
        counter.position.set(xOffset + width / 2, height + cabinet.countertopThickness / 2, zOffset);
        counter.castShadow = true;
        group.add(counter);
    }

    // crown molding
    if (cabinet.crown) {
        const crownGeo = new THREE.BoxGeometry(width, cabinet.crownHeight, 2);
        const crownMat = new THREE.MeshStandardMaterial({ color: 0xCCBBAA });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.set(xOffset + width / 2, height + cabinet.crownHeight / 2, zOffset + depth / 2 - 1);
        group.add(crown);
    }

    return group;
    };

    const handleAddCabinet = () => {
        const newCabinet = createNewCabinet();
        const newCabinets = [...cabinets, newCabinet];
        setCabinets(newCabinets);
        setSelectedCabinetId(newCabinet.id);
        
        // Save to history
        setTimeout(() => {
            if (!isRestoringHistory.current) {
                saveStateToHistory(`Added ${newCabinet.name}`);
            }
        }, 10);
    };

    const handleDeleteCabinet = (id) => {
        const deletedCabinet = cabinets.find(c => c.id === id);
        const cabinetName = deletedCabinet ? deletedCabinet.name : 'Cabinet';
        const newCabinets = cabinets.filter(c => c.id !== id);
        setCabinets(newCabinets);
        
        if (selectedCabinetId === id) {
            setSelectedCabinetId(null);
        }
        
        // Save to history
        setTimeout(() => {
            if (!isRestoringHistory.current) {
                saveStateToHistory(`Deleted ${cabinetName}`);
            }
        }, 10);
    };

    // Undo/Redo handlers
    const saveStateToHistory = (description) => {
        if (isRestoringHistory.current) return;
        
        const state = {
            cabinets,
            selectedCabinetId,
            selectedDrawerId,
            selectedDoorIndex,
            hiddenDoors: Array.from(hiddenDoors),
            hiddenDrawers: Array.from(hiddenDrawers),
            projectName,
            materialCosts,
            laborRate
        };
        
        historyManager.current.pushState(state, description);
    };

    const handleUndo = () => {
        if (!historyManager.current.canUndo()) return;
        
        isRestoringHistory.current = true;
        const previousState = historyManager.current.undo();
        
        if (previousState) {
            restoreState(previousState);
        }
        
        isRestoringHistory.current = false;
    };

    const handleRedo = () => {
        if (!historyManager.current.canRedo()) return;
        
        isRestoringHistory.current = true;
        const nextState = historyManager.current.redo();
        
        if (nextState) {
            restoreState(nextState);
        }
        
        isRestoringHistory.current = false;
    };

    const restoreState = (state) => {
        setCabinets(state.cabinets);
        setSelectedCabinetId(state.selectedCabinetId);
        setSelectedDrawerId(state.selectedDrawerId);
        setSelectedDoorIndex(state.selectedDoorIndex);
        setHiddenDoors(new Set(state.hiddenDoors));
        setHiddenDrawers(new Set(state.hiddenDrawers));
        setProjectName(state.projectName);
        setMaterialCosts(state.materialCosts);
        setLaborRate(state.laborRate);
    };

    const handleJumpToHistory = (index) => {
        isRestoringHistory.current = true;
        const state = historyManager.current.jumpTo(index);
        
        if (state) {
            restoreState(state);
        }
        
        isRestoringHistory.current = false;
    };

    // Calculate maximum doors that can fit based on cabinet width
    const getMaxDoors = (cabinetWidth) => {
    const MIN_DOOR_WIDTH = 8; // inches - minimum usable door width
    const DOOR_SPACING = 1; // inch between doors
    // Formula: each door needs at least (MIN_DOOR_WIDTH + DOOR_SPACING) inches, except last door
    return Math.max(0, Math.floor((cabinetWidth - DOOR_SPACING) / (MIN_DOOR_WIDTH + DOOR_SPACING)));
    };

    const updateCabinet = (id, property, value) => {
    const newCabinets = cabinets.map(c => {
        if (c.id === id) {
        // If updating doors, validate against cabinet width or double door limit
        if (property === 'doors') {
            const numDoors = parseInt(value);
            if (c.doubleDoor) {
            if (numDoors > 2) {
                alert('Double Door mode allows maximum 2 doors.');
                return c;
            }
            } else {
            const maxDoors = getMaxDoors(c.width);
            if (numDoors > maxDoors) {
                alert(`Cannot add that many doors. Maximum for a ${c.width}" wide cabinet is ${maxDoors} door${maxDoors !== 1 ? 's' : ''}. Enable "Double Door" to add a 2nd door.`);
                return c;
            }
            }
        }
        // If updating width, check if current doors still fit (unless double door mode)
        if (property === 'width') {
            const newWidth = parseFloat(value);
            const maxDoors = getMaxDoors(newWidth);
            if (!c.doubleDoor && c.doors > maxDoors) {
            alert(`Cabinet width of ${newWidth}" can only fit ${maxDoors} door${maxDoors !== 1 ? 's' : ''}. Reducing door count.`);
            return { ...c, [property]: value, doors: maxDoors };
            }
        }
        return { ...c, [property]: value };
        }
        return c;
    });
    
    setCabinets(newCabinets);
    
    // Save to history
    setTimeout(() => {
        if (!isRestoringHistory.current) {
            const cabinet = newCabinets.find(c => c.id === id);
            const propName = property.charAt(0).toUpperCase() + property.slice(1);
            saveStateToHistory(`Updated ${cabinet?.name || 'cabinet'}: ${propName}`);
        }
    }, 10);
    };

    // add drawer at specific position
    const addDrawer = (cabinetId) => {
    const newCabinets = cabinets.map(c => {
        if (c.id === cabinetId) {
        const doorStartY = c.toekick ? c.toekickHeight : 0;
        const existingDrawers = c.drawers || [];
        const topOfLastDrawer = existingDrawers.length > 0
            ? Math.max(...existingDrawers.map(d => d.startY + d.height))
            : doorStartY;

        // Check if adding a 6-inch drawer would exceed cabinet height
        if (topOfLastDrawer + 6 > c.height) {
            alert('Cannot add drawer: would exceed cabinet height. Minimum drawer height is 2 inches.');
            return c;
        }

        const newDrawer = {
            id: Date.now(),
            height: 6,
            startY: topOfLastDrawer
        };

        return { ...c, drawers: [...existingDrawers, newDrawer] };
        }
        return c;
    });
    
    setCabinets(newCabinets);
    
    // Save to history
    setTimeout(() => {
        if (!isRestoringHistory.current) {
            const cabinet = newCabinets.find(c => c.id === cabinetId);
            saveStateToHistory(`Added drawer to ${cabinet?.name || 'cabinet'}`);
        }
    }, 10);
    };

    const updateDrawer = (cabinetId, drawerId, property, value) => {
    const newCabinets = cabinets.map(c => {
        if (c.id === cabinetId) {
        const numValue = parseFloat(value);
        const updatedDrawers = c.drawers.map(d => {
            if (d.id === drawerId) {
            // If updating height, enforce minimum 2 inches
            if (property === 'height') {
                if (numValue < 2) {
                alert('Drawer height must be at least 2 inches');
                return d;
                }
                // Check if new height would exceed cabinet height
                const otherDrawersHeight = c.drawers.filter(dr => dr.id !== drawerId).reduce((sum, dr) => sum + dr.height, 0);
                if (d.startY + numValue > c.height) {
                alert(`Drawer height cannot exceed remaining cabinet space. Maximum: ${(c.height - d.startY).toFixed(1)} inches`);
                return d;
                }
            }
            // If updating position, make sure it doesn't push drawer past cabinet height
            if (property === 'startY') {
                if (numValue + d.height > c.height) {
                alert('Drawer position would exceed cabinet height');
                return d;
                }
            }
            return { ...d, [property]: numValue };
            }
            return d;
        });
        return { ...c, drawers: updatedDrawers };
        }
        return c;
    });
    
    setCabinets(newCabinets);
    
    // Save to history
    setTimeout(() => {
        if (!isRestoringHistory.current) {
            const cabinet = newCabinets.find(c => c.id === cabinetId);
            saveStateToHistory(`Updated drawer in ${cabinet?.name || 'cabinet'}`);
        }
    }, 10);
    };

    const deleteDrawer = (cabinetId, drawerId) => {
    const newCabinets = cabinets.map(c => {
        if (c.id === cabinetId) {
        return { ...c, drawers: c.drawers.filter(d => d.id !== drawerId) };
        }
        return c;
    });
    
    setCabinets(newCabinets);
    
    // Save to history
    setTimeout(() => {
        if (!isRestoringHistory.current) {
            const cabinet = newCabinets.find(c => c.id === cabinetId);
            saveStateToHistory(`Deleted drawer from ${cabinet?.name || 'cabinet'}`);
        }
    }, 10);
    };

    // ========== SMART DEFAULTS FUNCTIONS ==========
    
    /**
     * Calculate optimal drawer heights based on cabinet height
     * Returns an array of drawer heights that fit evenly with proper reveals
     */
    const calculateOptimalDrawerHeights = (cabinetHeight, toekickHeight = 0) => {
        const availableHeight = cabinetHeight - toekickHeight;
        const reveal = SMART_DEFAULTS.drawerReveal;
        
        // Different drawer configurations based on available height
        if (availableHeight < 18) {
            // Small cabinet: 2 small drawers
            const drawerHeight = (availableHeight - reveal) / 2;
            return [drawerHeight, drawerHeight];
        } else if (availableHeight < 24) {
            // Medium cabinet: 3 small/medium drawers
            const drawerHeight = (availableHeight - reveal * 2) / 3;
            return [drawerHeight, drawerHeight, drawerHeight];
        } else if (availableHeight < 36) {
            // Standard base cabinet: 1 small + 2 medium drawers
            const totalReveals = reveal * 2;
            const smallDrawer = SMART_DEFAULTS.drawerHeights.small;
            const remaining = availableHeight - smallDrawer - totalReveals;
            const mediumDrawer = remaining / 2;
            return [smallDrawer, mediumDrawer, mediumDrawer];
        } else {
            // Tall cabinet: 1 small + 1 medium + 1 or more large drawers
            const totalReveals = reveal * 3;
            const smallDrawer = SMART_DEFAULTS.drawerHeights.small;
            const mediumDrawer = SMART_DEFAULTS.drawerHeights.medium;
            const remaining = availableHeight - smallDrawer - mediumDrawer - totalReveals;
            
            if (remaining < 16) {
                return [smallDrawer, mediumDrawer, remaining];
            } else {
                // Split remaining into 2 large drawers
                const largeDrawer = remaining / 2;
                return [smallDrawer, mediumDrawer, largeDrawer, largeDrawer];
            }
        }
    };

    /**
     * Auto-position drawers evenly with proper reveals
     */
    const applySmartDrawerDefaults = (cabinetId) => {
        const cabinet = cabinets.find(c => c.id === cabinetId);
        if (!cabinet) return;

        const toekickHeight = cabinet.toekick ? cabinet.toekickHeight : 0;
        const optimalHeights = calculateOptimalDrawerHeights(cabinet.height, toekickHeight);
        const reveal = SMART_DEFAULTS.drawerReveal;
        
        // Create new drawers with calculated heights and positions
        const newDrawers = [];
        let currentY = toekickHeight;
        
        optimalHeights.forEach((height, index) => {
            newDrawers.push({
                id: Date.now() + index,
                height: height,
                startY: currentY
            });
            currentY += height + reveal;
        });

        const newCabinets = cabinets.map(c => {
            if (c.id === cabinetId) {
                return { ...c, drawers: newDrawers };
            }
            return c;
        });

        setCabinets(newCabinets);
        
        // Save to history
        setTimeout(() => {
            if (!isRestoringHistory.current) {
                saveStateToHistory(`Applied smart defaults to ${cabinet.name || 'cabinet'}`);
            }
        }, 10);
    };

    /**
     * Suggest optimal number of doors based on cabinet width
     */
    const getSuggestedDoorCount = (cabinetWidth) => {
        const { optimalMax } = SMART_DEFAULTS.doorWidth;
        
        if (cabinetWidth <= optimalMax) {
            return 1; // Single door for narrow cabinets
        } else if (cabinetWidth <= optimalMax * 2) {
            return 2; // Double door for medium cabinets
        } else {
            // Multiple doors for wide cabinets
            return Math.ceil(cabinetWidth / optimalMax);
        }
    };

    /**
     * Apply suggested door count to cabinet
     */
    const applySmartDoorDefaults = (cabinetId) => {
        const cabinet = cabinets.find(c => c.id === cabinetId);
        if (!cabinet) return;

        const suggestedDoors = getSuggestedDoorCount(cabinet.width);
        updateCabinet(cabinetId, 'doors', suggestedDoors);
    };

    const selectedCabinet = cabinets.find(c => c.id === selectedCabinetId);

    // Run validation when selected cabinet changes
    useEffect(() => {
        if (selectedCabinet && typeof validateCabinet !== 'undefined') {
            const results = validateCabinet(selectedCabinet);
            setValidationResults(results);
        } else {
            setValidationResults(null);
        }
    }, [selectedCabinet, cabinets]);

    // detailed cut list generation (truncated for space - keeping core structure)
    const generateCutList = () => {
    const cutList = [];
    let assemblySequence = 1;

    cabinets.forEach(cabinet => {
        // box parts
        cutList.push({
        cabinet: cabinet.name,
        part: 'Side Panel',
        quantity: 2,
        width: cabinet.depth,
        height: cabinet.height,
        thickness: cabinet.thickness,
        material: cabinet.material,
        notes: 'Full height sides',
        grainDirection: 'vertical',
        edgebanding: 'front edge',
        hardware: 'Shelf pins if adjustable',
        assemblySequence: assemblySequence++
        });

        const topBottomWidth = cabinet.width - (cabinet.thickness * 2);
        cutList.push({
        cabinet: cabinet.name,
        part: 'Top/Bottom',
        quantity: 2,
        width: topBottomWidth,
        height: cabinet.depth,
        thickness: cabinet.thickness,
        material: cabinet.material,
        notes: 'Between sides',
        grainDirection: 'horizontal',
        edgebanding: 'front edge',
        hardware: 'None',
        assemblySequence: assemblySequence++
        });

        // shelves
        if (cabinet.shelves > 0) {
        cutList.push({
            cabinet: cabinet.name,
            part: 'Shelf',
            quantity: cabinet.shelves,
            width: topBottomWidth,
            height: cabinet.depth - 1,
            thickness: cabinet.thickness,
            material: cabinet.material,
            notes: 'Adjustable',
            grainDirection: 'horizontal',
            edgebanding: 'front edge',
            hardware: 'Shelf pins (4 per shelf)',
            assemblySequence: assemblySequence++
        });
        }

        // back panel
        if (cabinet.backPanel) {
        cutList.push({
            cabinet: cabinet.name,
            part: 'Back Panel',
            quantity: 1,
            width: cabinet.width - (cabinet.thickness * 2),
            height: cabinet.height,
            thickness: 0.25,
            material: cabinet.material,
            notes: '1/4" back',
            grainDirection: 'vertical',
            edgebanding: 'none',
            hardware: 'Brad nails or staples',
            assemblySequence: assemblySequence++
        });
        }

        // drawer parts
        if (cabinet.drawers && cabinet.drawers.length > 0) {
        cabinet.drawers.forEach((drawer, i) => {
            const frontWidth = cabinet.width - 2;
            const frontHeight = drawer.height - 0.5;

            if (cabinet.drawerStyle === 'shaker') {
            const spec = DOOR_SPECS.shaker;
            cutList.push({
                cabinet: cabinet.name,
                part: `Drawer ${i+1} Rails`,
                quantity: 2,
                width: frontWidth,
                height: spec.railWidth,
                thickness: 0.75,
                material: cabinet.material,
                notes: 'Top/bottom',
                grainDirection: 'horizontal',
                edgebanding: 'all edges',
                hardware: 'Cope & stick joints',
                assemblySequence: assemblySequence++
            });
            cutList.push({
                cabinet: cabinet.name,
                part: `Drawer ${i+1} Stiles`,
                quantity: 2,
                width: spec.stileWidth,
                height: frontHeight,
                thickness: 0.75,
                material: cabinet.material,
                notes: 'Left/right',
                grainDirection: 'vertical',
                edgebanding: 'all edges',
                hardware: 'Cope & stick joints',
                assemblySequence: assemblySequence++
            });
            cutList.push({
                cabinet: cabinet.name,
                part: `Drawer ${i+1} Panel`,
                quantity: 1,
                width: frontWidth - spec.stileWidth * 2,
                height: frontHeight - spec.railWidth * 2,
                thickness: spec.panelThickness,
                material: cabinet.material,
                notes: 'Center panel',
                grainDirection: 'vertical',
                edgebanding: 'none (fits in groove)',
                hardware: 'None',
                assemblySequence: assemblySequence++
            });
            } else {
            cutList.push({
                cabinet: cabinet.name,
                part: `Drawer ${i+1} Front`,
                quantity: 1,
                width: frontWidth,
                height: frontHeight,
                thickness: 0.75,
                material: cabinet.material,
                notes: cabinet.drawerStyle,
                grainDirection: 'vertical',
                edgebanding: 'all edges',
                hardware: 'Drawer pull',
                assemblySequence: assemblySequence++
            });
            }

            // drawer box
            const boxHeight = Math.min(DRAWER_BOX.frontBackHeight, drawer.height - 1);
            cutList.push({
            cabinet: cabinet.name,
            part: `Drawer ${i+1} Box Sides`,
            quantity: 2,
            width: cabinet.depth - 2,
            height: boxHeight,
            thickness: DRAWER_BOX.sideThickness,
            material: 'plywood',
            notes: '1/2" sides',
            grainDirection: 'horizontal',
            edgebanding: 'top edge only',
            hardware: 'Drawer slides mount here',
            assemblySequence: assemblySequence++
            });
            cutList.push({
            cabinet: cabinet.name,
            part: `Drawer ${i+1} Box Front/Back`,
            quantity: 2,
            width: cabinet.width - 2 - DRAWER_BOX.sideThickness * 2,
            height: boxHeight,
            thickness: DRAWER_BOX.sideThickness,
            material: 'plywood',
            notes: '1/2" F/B',
            grainDirection: 'horizontal',
            edgebanding: 'top edge only',
            hardware: 'Pocket screws or dados',
            assemblySequence: assemblySequence++
            });
            cutList.push({
            cabinet: cabinet.name,
            part: `Drawer ${i+1} Bottom`,
            quantity: 1,
            width: cabinet.width - 2 - DRAWER_BOX.sideThickness * 2,
            height: cabinet.depth - 2,
            thickness: DRAWER_BOX.bottomThickness,
            material: 'plywood',
            notes: '1/4" bottom',
            grainDirection: 'horizontal',
            edgebanding: 'none',
            hardware: 'Slides in groove',
            assemblySequence: assemblySequence++
            });
        });
        }

        // door parts
        if (cabinet.doors > 0) {
        const totalDrawerHeight = cabinet.drawers?.reduce((sum, d) => sum + d.height, 0) || 0;
        const highestDrawerY = cabinet.drawers?.reduce((max, d) => Math.max(max, d.startY + d.height), cabinet.toekick ? cabinet.toekickHeight : 0) || (cabinet.toekick ? cabinet.toekickHeight : 0);
        const doorHeight = cabinet.height - highestDrawerY - 1;
        const doorWidth = cabinet.width / cabinet.doors - 1;

        if (cabinet.doorStyle === 'shaker') {
            const spec = DOOR_SPECS.shaker;
            cutList.push({
            cabinet: cabinet.name,
            part: 'Door Rails',
            quantity: cabinet.doors * 2,
            width: doorWidth,
            height: spec.railWidth,
            thickness: 0.75,
            material: cabinet.material,
            notes: 'Shaker T/B',
            grainDirection: 'horizontal',
            edgebanding: 'all edges',
            hardware: 'Cope & stick joints',
            assemblySequence: assemblySequence++
            });
            cutList.push({
            cabinet: cabinet.name,
            part: 'Door Stiles',
            quantity: cabinet.doors * 2,
            width: spec.stileWidth,
            height: doorHeight,
            thickness: 0.75,
            material: cabinet.material,
            notes: 'Shaker L/R',
            grainDirection: 'vertical',
            edgebanding: 'all edges',
            hardware: 'Cope & stick joints',
            assemblySequence: assemblySequence++
            });
            cutList.push({
            cabinet: cabinet.name,
            part: 'Door Panels',
            quantity: cabinet.doors,
            width: doorWidth - spec.stileWidth * 2,
            height: doorHeight - spec.railWidth * 2,
            thickness: spec.panelThickness,
            material: cabinet.material,
            notes: 'Center',
            grainDirection: 'vertical',
            edgebanding: 'none (fits in groove)',
            hardware: 'None',
            assemblySequence: assemblySequence++
            });
        } else {
            cutList.push({
            cabinet: cabinet.name,
            part: 'Door',
            quantity: cabinet.doors,
            width: doorWidth,
            height: doorHeight,
            thickness: 0.75,
            material: cabinet.material,
            notes: cabinet.doorStyle,
            grainDirection: 'vertical',
            edgebanding: 'all edges',
            hardware: 'Hinges (2 per door) + pull',
            assemblySequence: assemblySequence++
            });
        }
        }

        // hardware
        if (cabinet.doors > 0) {
        cutList.push({
            cabinet: cabinet.name,
            part: `Hinges (${cabinet.hardware.hinges})`,
            quantity: cabinet.doors * 2,
            width: 0,
            height: 0,
            thickness: 0,
            material: 'hardware',
            notes: '2 per door',
            grainDirection: 'n/a',
            edgebanding: 'n/a',
            hardware: 'Install 2-3" from top/bottom',
            assemblySequence: assemblySequence++
        });
        cutList.push({
            cabinet: cabinet.name,
            part: `Door Pulls (${cabinet.hardware.pulls})`,
            quantity: cabinet.doors,
            width: 0,
            height: 0,
            thickness: 0,
            material: 'hardware',
            notes: '1 per door',
            grainDirection: 'n/a',
            edgebanding: 'n/a',
            hardware: 'Center or offset per design',
            assemblySequence: assemblySequence++
        });
        }

        if (cabinet.drawers && cabinet.drawers.length > 0) {
        cutList.push({
            cabinet: cabinet.name,
            part: `Drawer Slides (${cabinet.hardware.slides})`,
            quantity: cabinet.drawers.length * 2,
            width: 0,
            height: 0,
            thickness: 0,
            material: 'hardware',
            notes: `${cabinet.depth}" pair/drawer`,
            grainDirection: 'n/a',
            edgebanding: 'n/a',
            hardware: 'Mount flush with drawer bottom',
            assemblySequence: assemblySequence++
        });
        cutList.push({
            cabinet: cabinet.name,
            part: `Drawer Pulls (${cabinet.hardware.pulls})`,
            quantity: cabinet.drawers.length,
            width: 0,
            height: 0,
            thickness: 0,
            material: 'hardware',
            notes: '1 per drawer',
            grainDirection: 'n/a',
            edgebanding: 'n/a',
            hardware: 'Center horizontally, upper 1/3',
            assemblySequence: assemblySequence++
        });
        }
    });

    return cutList;
    };

    const calculateMaterials = () => {
    const cutList = generateCutList();
    const materialUsage = {};

    cutList.forEach(item => {
        if (item.material === 'hardware' || item.material === 'glass') return;

        const material = item.material;
        const area = (item.width * item.height * item.quantity) / 144;

        if (!materialUsage[material]) {
        materialUsage[material] = { area: 0, sheets: 0, cost: 0 };
        }
        materialUsage[material].area += area;
    });

    Object.keys(materialUsage).forEach(material => {
        const sheets = Math.ceil(materialUsage[material].area / 32);
        materialUsage[material].sheets = sheets;
        materialUsage[material].cost = sheets * materialCosts[material];
    });

    return materialUsage;
    };

    // Sheet cut optimization - groups parts by size and calculates sheet requirements
    const generateSheetOptimization = () => {
        const cutList = generateCutList();
        const sheetSize = { width: 96, height: 48 }; // 4x8 sheet in inches
        const sheetArea = sheetSize.width * sheetSize.height; // 4608 sq in
        
        // Group parts by material and thickness
        const partsByMaterial = {};
        
        cutList.forEach(item => {
            if (item.material === 'hardware' || item.material === 'glass' || item.width === 0 || item.height === 0) return;
            
            const key = `${item.material}-${item.thickness}`;
            if (!partsByMaterial[key]) {
                partsByMaterial[key] = {
                    material: item.material,
                    thickness: item.thickness,
                    parts: [],
                    totalArea: 0,
                    sheetsNeeded: 0,
                    wastePercent: 0
                };
            }
            
            for (let i = 0; i < item.quantity; i++) {
                const partArea = item.width * item.height;
                partsByMaterial[key].parts.push({
                    name: item.part,
                    cabinet: item.cabinet,
                    width: item.width,
                    height: item.height,
                    area: partArea
                });
                partsByMaterial[key].totalArea += partArea;
            }
        });
        
        // Calculate sheets needed for each material/thickness combination
        Object.values(partsByMaterial).forEach(group => {
            // Add 10% waste factor for saw kerf and edge trimming
            const adjustedArea = group.totalArea * 1.1;
            group.sheetsNeeded = Math.ceil(adjustedArea / sheetArea);
            group.wastePercent = ((group.sheetsNeeded * sheetArea - group.totalArea) / (group.sheetsNeeded * sheetArea) * 100).toFixed(1);
            
            // Sort parts by area (largest first) for better visualization
            group.parts.sort((a, b) => b.area - a.area);
        });
        
        return partsByMaterial;
    };

    const saveProject = () => {
    const success = saveProjectToStorage(projectName, cabinets, materialCosts, laborRate);
    if (success) {
        // Also save PDF
        savePDF();
        alert(`Project "${projectName}" saved successfully!`);
    }
    };

    // Handle delete for keyboard shortcuts
    const handleDelete = () => {
        if (selectedDrawerId) {
            // Delete selected drawer
            const cabinet = cabinets.find(c => c.id === selectedCabinetId);
            if (cabinet) {
                removeDrawer(selectedCabinetId, selectedDrawerId);
            }
        } else if (selectedDoorIndex !== null && selectedCabinetId) {
            // Can't delete individual doors, but deselect
            setSelectedDoorIndex(null);
        } else if (selectedCabinetId) {
            // Delete selected cabinet
            if (confirm('Delete this cabinet?')) {
                handleDeleteCabinet(selectedCabinetId);
            }
        }
    };

    // Handle cycling measurement format
    const handleCycleMeasurement = () => {
        const formats = ['both', 'fraction', 'decimal'];
        const currentIndex = formats.indexOf(measurementFormat);
        const nextIndex = (currentIndex + 1) % formats.length;
        setMeasurementFormat(formats[nextIndex]);
    };

    // Handle zoom from keyboard
    const handleZoom = (delta) => {
        cameraDistance.current = Math.max(20, Math.min(200, cameraDistance.current + delta));
    };

    const handleLoadProject = () => {
    const allProjects = getAllSavedProjects();
    
    if (allProjects.length === 0) {
        alert('No saved projects found!');
        return;
    }
    
    let message = 'Saved Projects:\n\n';
    allProjects.forEach((project, index) => {
        const date = new Date(project.date).toLocaleDateString();
        message += `${index + 1}. ${project.name} - Saved: ${date}\n`;
    });
    message += '\nEnter project number to load:';
    
    const selection = prompt(message);
    
    if (selection) {
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < allProjects.length) {
            const project = allProjects[index];
            setProjectName(project.name);
            setCabinets(project.cabinets);
            setMaterialCosts(project.materialCosts || materialCosts);
            setLaborRate(project.laborRate || 50);
            alert(`Project "${project.name}" loaded!`);
        } else {
            alert('Invalid selection!');
        }
    }
    };

    const handleShowSavedProjects = () => {
    const allProjects = getAllSavedProjects();
    
    if (allProjects.length === 0) {
        alert('No saved projects found!');
        return;
    }
    
    let message = 'Saved Projects:\n\n';
    allProjects.forEach((project, index) => {
        const date = new Date(project.date).toLocaleDateString();
        message += `${index + 1}. ${project.name}\n`;
        message += `   Cabinets: ${project.cabinets.length}\n`;
        message += `   Saved: ${date}\n\n`;
    });
    
    message += 'Enter project number to DELETE (or click Cancel):';
    
    const selection = prompt(message);
    
    if (selection) {
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < allProjects.length) {
            const projectName = allProjects[index].name;
            if (confirm(`Are you sure you want to delete "${projectName}"?`)) {
                deleteProjectFromStorage(projectName);
                alert(`Project "${projectName}" deleted!`);
            }
        } else {
            alert('Invalid selection!');
        }
    }
    };

    // Export project to file
    const handleExportToFile = () => {
        const projectData = {
            name: projectName || 'Untitled Project',
            cabinets: cabinets,
            materialCosts: materialCosts,
            laborRate: laborRate,
            selectedUnit: selectedUnit,
            createdDate: new Date().toISOString()
        };
        
        const result = exportProjectToFile(projectData);
        
        if (result.success) {
            alert(`Project exported as ${result.fileName}`);
        } else {
            alert(`Export failed: ${result.error}`);
        }
    };

    // Import project from file
    const handleImportFromFile = () => {
        if (cabinets.length > 0) {
            const confirmImport = confirm('Importing will replace your current project. Continue?');
            if (!confirmImport) return;
        }
        
        importProjectFromFile((success, data, errorMessage) => {
            if (success) {
                setCabinets(data.cabinets || []);
                setProjectName(data.name || 'Imported Project');
                setMaterialCosts(data.materialCosts || materialCosts);
                setLaborRate(data.laborRate || 50);
                setSelectedUnit(data.selectedUnit || 'inches');
                
                alert(`Project "${data.name}" loaded successfully!`);
            } else {
                alert(`Import failed: ${errorMessage}`);
            }
        });
    };

    const savePDF = () => {
    // Get canvas screenshot
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const imgData = canvas.toDataURL('image/png');
    const cutList = generateCutList();
    const materials = calculateMaterials();
    
    // Create HTML content for PDF
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.background = 'white';
    element.style.color = 'black';
    element.innerHTML = `
        <h1>${projectName} - Cabinet Design</h1>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        
        <h2>3D View</h2>
        <img src="${imgData}" style="max-width: 100%; max-height: 400px; border: 1px solid #ccc; margin-bottom: 20px;">
        
        <h2>Material List</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Material</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Square Feet</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sheets (4x8)</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cost per Sheet</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total Cost</th>
            </tr>
            ${Object.entries(materials).map(([material, data]) => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${material}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${data.area.toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${data.sheets}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">$${materialCosts[material]?.toFixed(2) || '0.00'}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">$${data.cost.toFixed(2)}</td>
                </tr>
            `).join('')}
            <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total Material Cost:</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${Object.values(materials).reduce((sum, data) => sum + data.cost, 0).toFixed(2)}</td>
            </tr>
        </table>
        
        <h2>Cut List</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Cabinet</th>
                <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Part</th>
                <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Qty</th>
                <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Width</th>
                <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Height</th>
                <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Thickness</th>
                <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Material</th>
                <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Notes</th>
            </tr>
            ${cutList.map(item => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.cabinet}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.part}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.width > 0 ? formatMeasurement(item.width, measurementFormat) : '-'}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.height > 0 ? formatMeasurement(item.height, measurementFormat) : '-'}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.thickness > 0 ? item.thickness : '-'}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.material}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.notes}</td>
                </tr>
            `).join('')}
        </table>
    `;
    
    const opt = {
        margin: 10,
        filename: `${projectName}-design.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'letter' }
    };
    
    html2pdf().set(opt).from(element).save();
    };

    const exportCutList = () => {
    const cutList = generateCutList();
    let csv = 'Cabinet,Part,Quantity,Width (in),Height (in),Thickness (in),Material,Notes\n';
    cutList.forEach(item => {
        csv += `${item.cabinet},${item.part},${item.quantity},${item.width > 0 ? formatMeasurement(item.width, measurementFormat) : '-'},${item.height > 0 ? formatMeasurement(item.height, measurementFormat) : '-'},${item.thickness > 0 ? item.thickness : '-'},${item.material},"${item.notes}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-cutlist.csv`;
    a.click();
    };

    const CutListModal = () => {
    const cutList = generateCutList();
    const materials = calculateMaterials();
    
    if (!showCutList) return null;
    
    return (
        <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
        }}>
        <div style={{
            background: '#1a1a1a',
            border: '2px solid #ff6b35',
            borderRadius: '8px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '24px',
            color: '#f0f0f0'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Cut List & Material List</h2>
            <button
                onClick={() => setShowCutList(false)}
                style={{
                background: '#ff6b35',
                color: '#000',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
                }}
            >
                Close
            </button>
            </div>
            
            <h3>Material Summary</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <tr style={{ background: '#ff6b35', color: '#000' }}>
                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Material</th>
                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Sq Ft</th>
                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Sheets</th>
                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Cost/Sheet</th>
                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Total</th>
            </tr>
            {Object.entries(materials).map(([material, data]) => (
                <tr key={material}>
                <td style={{ border: '1px solid #444', padding: '8px' }}>{material}</td>
                <td style={{ border: '1px solid #444', padding: '8px' }}>{data.area.toFixed(2)}</td>
                <td style={{ border: '1px solid #444', padding: '8px' }}>{data.sheets}</td>
                <td style={{ border: '1px solid #444', padding: '8px' }}>${materialCosts[material]?.toFixed(2) || '0.00'}</td>
                <td style={{ border: '1px solid #444', padding: '8px' }}>${data.cost.toFixed(2)}</td>
                </tr>
            ))}
            <tr style={{ background: '#333', fontWeight: 'bold' }}>
                <td colSpan="4" style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Total:</td>
                <td style={{ border: '1px solid #444', padding: '8px' }}>${Object.values(materials).reduce((sum, data) => sum + data.cost, 0).toFixed(2)}</td>
            </tr>
            </table>
            
            <h3>Cut List Details</h3>
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <tr style={{ background: '#ff6b35', color: '#000' }}>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'center' }}>Seq</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'left' }}>Cabinet</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'left' }}>Part</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'center' }}>Qty</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'right' }}>Width</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'right' }}>Height</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'right' }}>Thick</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'left' }}>Material</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'left' }}>Grain</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'left' }}>Edgebanding</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'left' }}>Hardware/Notes</th>
                <th style={{ border: '1px solid #444', padding: '4px', textAlign: 'left' }}>Notes</th>
                </tr>
                {cutList.map((item, idx) => (
                <tr key={idx}>
                    <td style={{ border: '1px solid #444', padding: '4px', textAlign: 'center', fontWeight: 'bold', background: '#2a2a2a' }}>{item.assemblySequence || '-'}</td>
                    <td style={{ border: '1px solid #444', padding: '4px' }}>{item.cabinet}</td>
                    <td style={{ border: '1px solid #444', padding: '4px' }}>{item.part}</td>
                    <td style={{ border: '1px solid #444', padding: '4px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ border: '1px solid #444', padding: '4px', textAlign: 'right' }}>{item.width > 0 ? formatMeasurement(item.width, measurementFormat) : '-'}</td>
                    <td style={{ border: '1px solid #444', padding: '4px', textAlign: 'right' }}>{item.height > 0 ? formatMeasurement(item.height, measurementFormat) : '-'}</td>
                    <td style={{ border: '1px solid #444', padding: '4px', textAlign: 'right' }}>{item.thickness > 0 ? item.thickness : '-'}</td>
                    <td style={{ border: '1px solid #444', padding: '4px' }}>{item.material}</td>
                    <td style={{ border: '1px solid #444', padding: '4px' }}>
                        <span style={{ fontSize: '10px', padding: '2px 6px', background: item.grainDirection === 'vertical' ? '#4a5568' : '#2d3748', borderRadius: '3px', display: 'inline-block' }}>
                            {item.grainDirection === 'vertical' ? '↕️' : item.grainDirection === 'horizontal' ? '↔️' : item.grainDirection || '-'}
                        </span>
                    </td>
                    <td style={{ border: '1px solid #444', padding: '4px', fontSize: '10px' }}>{item.edgebanding || '-'}</td>
                    <td style={{ border: '1px solid #444', padding: '4px', fontSize: '10px' }}>{item.hardware || '-'}</td>
                    <td style={{ border: '1px solid #444', padding: '4px', fontSize: '10px' }}>{item.notes}</td>
                </tr>
                ))}
            </table>
            </div>
        </div>
        </div>
    );
    };

    // Shopping List Modal Component
    const ShoppingListModal = () => {
        if (!showShoppingList) return null;
        
        const shoppingList = generateShoppingList(cabinets, materialCosts);
        
        const handleExportCSV = () => {
            const csv = exportShoppingListCSV(shoppingList, projectName);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${projectName}-shopping-list.csv`;
            a.click();
        };
        
        const handleExportHTML = () => {
            const html = exportShoppingListHTML(shoppingList, projectName);
            const blob = new Blob([html], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        };
        
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    background: '#1a1a1a',
                    border: '2px solid #ff6b35',
                    borderRadius: '8px',
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    padding: '24px',
                    color: '#f0f0f0'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Shopping List</h2>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button
                                onClick={handleExportCSV}
                                style={{
                                    background: '#4CAF50',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Download size={16} />
                                Export CSV
                            </button>
                            <button
                                onClick={handleExportHTML}
                                style={{
                                    background: '#2196F3',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <FileText size={16} />
                                Print/View
                            </button>
                            <button
                                onClick={() => setShowShoppingList(false)}
                                style={{
                                    background: '#ff6b35',
                                    color: '#000',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    
                    {/* Summary Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8855 100%)',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        color: '#000'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>Total Estimated Cost</h3>
                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                            ${shoppingList.summary.totalCost.toFixed(2)}
                        </div>
                        <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                            Surface area to finish: {shoppingList.finishMaterials.totalSurfaceArea.toFixed(1)} sq ft
                        </p>
                    </div>
                    
                    {/* Sheet Materials */}
                    <h3 style={{ color: '#ff6b35', borderBottom: '2px solid #ff6b35', paddingBottom: '8px' }}>
                        Sheet Materials
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                        <thead>
                            <tr style={{ background: '#ff6b35', color: '#000' }}>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Material</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Total Sq Ft</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>Sheets Needed</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>Sheet Size</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>Waste %</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Cost/Sheet</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(shoppingList.sheetMaterials).map(([material, data]) => (
                                <tr key={material}>
                                    <td style={{ border: '1px solid #444', padding: '8px' }}>{material}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>{data.totalArea.toFixed(2)}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{data.sheets.sheetsNeeded}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>{data.sheets.sheetSize}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>{data.sheets.wastePercent}%</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>${data.cost.toFixed(2)}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#ff6b35' }}>${data.totalCost.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Hardware Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        {/* Hinges */}
                        {Object.keys(shoppingList.hardware.hinges).length > 0 && (
                            <div>
                                <h3 style={{ color: '#ff6b35', borderBottom: '2px solid #ff6b35', paddingBottom: '8px' }}>
                                    Hinges
                                </h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ background: '#333' }}>
                                            <th style={{ border: '1px solid #444', padding: '6px', textAlign: 'left' }}>Type</th>
                                            <th style={{ border: '1px solid #444', padding: '6px', textAlign: 'center' }}>Qty</th>
                                            <th style={{ border: '1px solid #444', padding: '6px', textAlign: 'right' }}>Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(shoppingList.hardware.hinges).map(([type, data]) => (
                                            <tr key={type}>
                                                <td style={{ border: '1px solid #444', padding: '6px' }}>{type}</td>
                                                <td style={{ border: '1px solid #444', padding: '6px', textAlign: 'center' }}>{data.quantity}</td>
                                                <td style={{ border: '1px solid #444', padding: '6px', textAlign: 'right', color: '#ff6b35', fontWeight: 'bold' }}>${data.totalCost.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* Drawer Slides */}
                        {Object.keys(shoppingList.hardware.slides).length > 0 && (
                            <div>
                                <h3 style={{ color: '#ff6b35', borderBottom: '2px solid #ff6b35', paddingBottom: '8px' }}>
                                    Drawer Slides
                                </h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ background: '#333' }}>
                                            <th style={{ border: '1px solid #444', padding: '6px', textAlign: 'left' }}>Type</th>
                                            <th style={{ border: '1px solid #444', padding: '6px', textAlign: 'center' }}>Pairs</th>
                                            <th style={{ border: '1px solid #444', padding: '6px', textAlign: 'right' }}>Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(shoppingList.hardware.slides).map(([type, data]) => (
                                            <tr key={type}>
                                                <td style={{ border: '1px solid #444', padding: '6px' }}>{type}</td>
                                                <td style={{ border: '1px solid #444', padding: '6px', textAlign: 'center' }}>{data.pairs}</td>
                                                <td style={{ border: '1px solid #444', padding: '6px', textAlign: 'right', color: '#ff6b35', fontWeight: 'bold' }}>${data.totalCost.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* Pulls & Knobs */}
                        {Object.keys(shoppingList.hardware.pulls).length > 0 && (
                            <div>
                                <h3 style={{ color: '#ff6b35', borderBottom: '2px solid #ff6b35', paddingBottom: '8px' }}>
                                    Pulls & Knobs
                                </h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ background: '#333' }}>
                                            <th style={{ border: '1px solid #444', padding: '6px', textAlign: 'left' }}>Type</th>
                                            <th style={{ border: '1px solid #444', padding: '6px', textAlign: 'center' }}>Qty</th>
                                            <th style={{ border: '1px solid #444', padding: '6px', textAlign: 'right' }}>Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(shoppingList.hardware.pulls).map(([type, data]) => (
                                            <tr key={type}>
                                                <td style={{ border: '1px solid #444', padding: '6px' }}>{type}</td>
                                                <td style={{ border: '1px solid #444', padding: '6px', textAlign: 'center' }}>{data.quantity}</td>
                                                <td style={{ border: '1px solid #444', padding: '6px', textAlign: 'right', color: '#ff6b35', fontWeight: 'bold' }}>${data.totalCost.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    
                    {/* Edgebanding */}
                    <h3 style={{ color: '#ff6b35', borderBottom: '2px solid #ff6b35', paddingBottom: '8px' }}>
                        Edgebanding
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                        <thead>
                            <tr style={{ background: '#333' }}>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Linear Feet</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>Rolls Needed (200' ea)</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Price/Roll</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #444', padding: '8px' }}>{shoppingList.edgebanding.totalLinearFeet.toFixed(1)}</td>
                                <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{shoppingList.edgebanding.rollsNeeded}</td>
                                <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>${EDGEBANDING_SPECS.pricePerRoll.toFixed(2)}</td>
                                <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#ff6b35' }}>${shoppingList.edgebanding.totalCost.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    {/* Finish Materials */}
                    <h3 style={{ color: '#ff6b35', borderBottom: '2px solid #ff6b35', paddingBottom: '8px' }}>
                        Finish Materials
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                        <thead>
                            <tr style={{ background: '#333' }}>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Material</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>Gallons</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Price/Gallon</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(shoppingList.finishMaterials.materials).map(([material, data]) => (
                                <tr key={material}>
                                    <td style={{ border: '1px solid #444', padding: '8px' }}>{material}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{data.gallons}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>${data.pricePerGallon.toFixed(2)}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#ff6b35' }}>${data.totalCost.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Miscellaneous Supplies */}
                    <h3 style={{ color: '#ff6b35', borderBottom: '2px solid #ff6b35', paddingBottom: '8px' }}>
                        Miscellaneous Supplies
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                        <thead>
                            <tr style={{ background: '#333' }}>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Item</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>Quantity</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Price Each</th>
                                <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(shoppingList.miscSupplies).map(([item, data]) => (
                                <tr key={item}>
                                    <td style={{ border: '1px solid #444', padding: '8px' }}>{item}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'center' }}>{data.quantity}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'right' }}>${data.priceEach.toFixed(2)}</td>
                                    <td style={{ border: '1px solid #444', padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#ff6b35' }}>${data.totalCost.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div style={{
                        background: '#2a2a2a',
                        padding: '16px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontStyle: 'italic'
                    }}>
                        <strong>Note:</strong> Prices are estimates based on typical retail costs. 
                        Actual prices may vary by supplier, location, and current market conditions. 
                        Always verify current pricing before purchasing.
                    </div>
                </div>
            </div>
        );
    };

    // History Timeline Modal
    const HistoryTimelineModal = () => {
        if (!showHistoryTimeline) return null;
        
        const timeline = historyManager.current.getTimeline();
        
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '350px',
                background: '#1a1a1a',
                borderLeft: '2px solid #ff6b35',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                color: '#f0f0f0'
            }}>
                <div style={{
                    padding: '16px',
                    background: '#0a0a0a',
                    borderBottom: '2px solid #ff6b35',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={20} color="#ff6b35" />
                        History Timeline
                    </h3>
                    <button
                        onClick={() => setShowHistoryTimeline(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '24px',
                            padding: '4px'
                        }}
                    >
                        ×
                    </button>
                </div>
                
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px'
                }}>
                    {timeline.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '32px 16px',
                            color: '#666',
                            fontSize: '14px'
                        }}>
                            No history yet.<br/>Make changes to see them here.
                        </div>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            {/* Timeline line */}
                            <div style={{
                                position: 'absolute',
                                left: '11px',
                                top: '0',
                                bottom: '0',
                                width: '2px',
                                background: '#333'
                            }}></div>
                            
                            {timeline.map((entry, idx) => {
                                const date = new Date(entry.timestamp);
                                const timeStr = date.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                });
                                
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleJumpToHistory(entry.index)}
                                        style={{
                                            position: 'relative',
                                            paddingLeft: '32px',
                                            paddingBottom: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {/* Timeline dot */}
                                        <div style={{
                                            position: 'absolute',
                                            left: '6px',
                                            top: '4px',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: entry.isCurrent ? '#ff6b35' : '#666',
                                            border: entry.isCurrent ? '3px solid #fff' : '2px solid #333',
                                            boxSizing: 'border-box'
                                        }}></div>
                                        
                                        {/* Entry content */}
                                        <div style={{
                                            background: entry.isCurrent ? '#2a2a2a' : '#1f1f1f',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: entry.isCurrent ? '1px solid #ff6b35' : '1px solid #333',
                                            ':hover': {
                                                background: '#2a2a2a'
                                            }
                                        }}>
                                            <div style={{
                                                fontWeight: entry.isCurrent ? 'bold' : 'normal',
                                                marginBottom: '4px',
                                                color: entry.isCurrent ? '#ff6b35' : '#f0f0f0'
                                            }}>
                                                {entry.description}
                                                {entry.isCurrent && (
                                                    <span style={{
                                                        marginLeft: '8px',
                                                        fontSize: '10px',
                                                        background: '#ff6b35',
                                                        color: '#000',
                                                        padding: '2px 6px',
                                                        borderRadius: '3px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        CURRENT
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: '#888'
                                            }}>
                                                {timeStr}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                <div style={{
                    padding: '12px 16px',
                    background: '#0a0a0a',
                    borderTop: '1px solid #333',
                    fontSize: '12px',
                    color: '#666'
                }}>
                    {timeline.length > 0 && (
                        <div>
                            {historyManager.current.currentIndex + 1} of {timeline.length} states
                        </div>
                    )}
                    <div style={{ marginTop: '4px' }}>
                        Click any state to jump to it
                    </div>
                </div>
            </div>
        );
    };

    return (
    <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Space Mono", monospace',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#f0f0f0'
    }}>
        {/* header */}
        <div style={{
        padding: '16px 24px',
        background: '#0a0a0a',
        borderBottom: '2px solid #ff6b35',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Box size={32} color="#ff6b35" />
            <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                outline: 'none'
            }}
            />
            
            {/* Undo/Redo buttons */}
            <div style={{ display: 'flex', gap: '4px', marginLeft: '16px' }}>
                <button 
                    onClick={handleUndo} 
                    disabled={!historyManager.current.canUndo()}
                    title={historyManager.current.canUndo() ? `Undo: ${historyManager.current.getUndoDescription()}` : 'Nothing to undo'}
                    style={{
                        ...buttonStyle,
                        padding: '6px 12px',
                        opacity: historyManager.current.canUndo() ? 1 : 0.4,
                        cursor: historyManager.current.canUndo() ? 'pointer' : 'not-allowed'
                    }}
                >
                    <RotateCcw size={16} />
                    Undo
                </button>
                <button 
                    onClick={handleRedo} 
                    disabled={!historyManager.current.canRedo()}
                    title={historyManager.current.canRedo() ? `Redo: ${historyManager.current.getRedoDescription()}` : 'Nothing to redo'}
                    style={{
                        ...buttonStyle,
                        padding: '6px 12px',
                        opacity: historyManager.current.canRedo() ? 1 : 0.4,
                        cursor: historyManager.current.canRedo() ? 'pointer' : 'not-allowed'
                    }}
                >
                    <RotateCw size={16} />
                    Redo
                </button>
                <button 
                    onClick={() => setShowHistoryTimeline(!showHistoryTimeline)}
                    style={{
                        ...buttonStyle,
                        padding: '6px 12px',
                        background: showHistoryTimeline ? '#666' : '#ff6b35'
                    }}
                    title="Show history timeline"
                >
                    <Clock size={16} />
                    History
                </button>
            </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={saveProject} style={{...buttonStyle, padding: '6px 10px'}} title="Save Project">
            <Save size={16} />
            </button>
            <button onClick={handleLoadProject} style={{...buttonStyle, padding: '6px 10px'}} title="Load Project">
            <FolderOpen size={16} />
            </button>
            <button onClick={handleShowSavedProjects} style={{...buttonStyle, padding: '6px 10px'}} title="View All Projects">
            <FileText size={16} />
            </button>
            <button onClick={handleExportToFile} style={{...buttonStyle, padding: '6px 10px', background: '#2196F3'}} title="Export to File">
            <Download size={16} />
            </button>
            <button onClick={handleImportFromFile} style={{...buttonStyle, padding: '6px 10px', background: '#2196F3'}} title="Import from File">
            <Upload size={16} />
            </button>
            <div style={{width: '1px', background: '#333', margin: '0 4px'}}></div>
            <button onClick={() => setShowCutList(true)} style={{...buttonStyle, padding: '6px 10px'}} title="View Cut List">
            <FileText size={16} />
            </button>
            <button onClick={() => setShowShoppingList(true)} style={{...buttonStyle, background: '#4CAF50', padding: '6px 10px'}} title="Shopping List">
            <Download size={16} />
            </button>
            <button onClick={exportCutList} style={{...buttonStyle, padding: '6px 10px'}} title="Export CSV">
            <Download size={16} />
            </button>
            <div style={{width: '1px', background: '#333', margin: '0 4px'}}></div>
            <button onClick={() => {
                window.exportProjectAsPDF(cabinets, projectName, {
                    includeCoverPage: true,
                    includeCutList: true,
                    includeShoppingList: true,
                    includeShopDrawings: true
                });
            }} style={{...buttonStyle, background: '#2196F3', padding: '6px 10px'}} title="Export PDF with Shop Drawings">
            <FileText size={16} />
            </button>
            <button onClick={() => {
                window.openPrintPreview(cabinets, projectName, {
                    includeCoverPage: true,
                    includeCutList: false,
                    includeShoppingList: false,
                    includeShopDrawings: true
                });
            }} style={{...buttonStyle, background: '#9C27B0', padding: '6px 10px'}} title="Print Shop Drawings">
            <FileText size={16} />
            </button>
        </div>
        </div>

        <CutListModal />
        <ShoppingListModal />
        <HistoryTimelineModal />

        {/* main content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* left sidebar */}
        <div style={{
            width: '280px',
            background: '#1a1a1a',
            borderRight: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <div style={{
            padding: '16px',
            borderBottom: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
            }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>CABINETS</span>
            <button onClick={handleAddCabinet} style={{
                ...buttonStyle,
                padding: '6px 12px',
                fontSize: '12px'
            }}>
                <Plus size={16} />
                Add
            </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {cabinets.length === 0 ? (
                <div style={{
                textAlign: 'center',
                padding: '32px 16px',
                color: '#666',
                fontSize: '14px'
                }}>
                No cabinets yet.<br/>Click "Add" to start.
                </div>
            ) : (
                cabinets.map(cabinet => (
                <div
                    key={cabinet.id}
                    onClick={() => setSelectedCabinetId(cabinet.id)}
                    style={{
                    padding: '12px',
                    margin: '4px 0',
                    background: cabinet.id === selectedCabinetId ? '#ff6b35' : '#252525',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                    }}
                >
                    <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {cabinet.name}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        {cabinet.width}" × {cabinet.height}" × {cabinet.depth}"
                    </div>
                    </div>
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCabinet(cabinet.id);
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        padding: '4px'
                    }}
                    >
                    <Trash2 size={16} />
                    </button>
                </div>
                ))
            )}
            </div>
        </div>

        {/* center view */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Camera Preset Toolbar - Only show in 3D view */}
            {viewMode === '3d' && (
            <div style={{
                padding: '12px 16px',
                background: '#0a0a0a',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1 }}></div>
                <window.CameraPresetToolbar 
                onPresetSelect={handleCameraPresetSelect}
                activePreset={activeCameraPreset}
                />
                <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    gap: '8px'
                }}>
                    <button
                        onClick={() => {
                            const formats = ['both', 'fraction', 'decimal'];
                            const currentIndex = formats.indexOf(measurementFormat);
                            const nextIndex = (currentIndex + 1) % formats.length;
                            setMeasurementFormat(formats[nextIndex]);
                        }}
                        style={{
                            ...buttonStyle,
                            padding: '6px 12px',
                            fontSize: '11px',
                            background: '#ff6b35',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                        title="Toggle measurement display format"
                    >
                        📏 {measurementFormat === 'both' ? 'Both' : measurementFormat === 'fraction' ? 'Fractions' : 'Decimals'}
                    </button>
                </div>
            </div>
            )}

            <div 
                ref={containerRef}
                style={{
                flex: 1,
                position: 'relative',
                width: '100%',
                height: '100%',
                display: viewMode === '3d' ? 'block' : 'none'
                }}
            >
                <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                style={{ width: '100%', height: '100%', display: 'block' }}
                />
                
                {/* Move Mode Indicator */}
                {isMovingCabinet && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 107, 53, 0.95)',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    🎯 Move Mode: Drag to move cabinet | Click elsewhere or press ESC to exit
                </div>
                )}
            </div>

            {viewMode === 'cutlist' && (
                <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ color: '#ff6b35', margin: 0 }}>Detailed Cut List</h2>
                    <button
                        onClick={() => window.print()}
                        style={{
                            ...buttonStyle,
                            padding: '8px 16px',
                            background: '#2196F3',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        title="Print cut list"
                    >
                        🖨️ Print Cut List
                    </button>
                </div>
                {cabinets.length === 0 ? (
                    <p style={{ color: '#666' }}>Add cabinets to generate cut list</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                        <tr style={{ background: '#1a1a1a', borderBottom: '2px solid #ff6b35' }}>
                        <th style={{...tableHeaderStyle, fontSize: '11px'}}>Cabinet</th>
                        <th style={{...tableHeaderStyle, fontSize: '11px'}}>Part</th>
                        <th style={{...tableHeaderStyle, fontSize: '11px'}}>Qty</th>
                        <th style={{...tableHeaderStyle, fontSize: '11px'}}>Width</th>
                        <th style={{...tableHeaderStyle, fontSize: '11px'}}>Height</th>
                        <th style={{...tableHeaderStyle, fontSize: '11px'}}>Thick</th>
                        <th style={{...tableHeaderStyle, fontSize: '11px'}}>Material</th>
                        <th style={{...tableHeaderStyle, fontSize: '11px'}}>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generateCutList().map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{...tableCellStyle, fontSize: '11px'}}>{item.cabinet}</td>
                            <td style={{...tableCellStyle, fontSize: '11px'}}>{item.part}</td>
                            <td style={{...tableCellStyle, fontSize: '11px'}}>{item.quantity}</td>
                            <td style={{...tableCellStyle, fontSize: '11px'}}>{item.width > 0 ? formatMeasurement(item.width, measurementFormat) : '-'}</td>
                            <td style={{...tableCellStyle, fontSize: '11px'}}>{item.height > 0 ? formatMeasurement(item.height, measurementFormat) : '-'}</td>
                            <td style={{...tableCellStyle, fontSize: '11px'}}>{item.thickness > 0 ? `${item.thickness}"` : '-'}</td>
                            <td style={{...tableCellStyle, fontSize: '11px'}}>{item.material}</td>
                            <td style={{...tableCellStyle, fontSize: '10px', color: '#aaa'}}>{item.notes}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
                </div>
            )}

            {viewMode === 'materials' && (
                <div style={{ padding: '24px' }}>
                <h2 style={{ marginBottom: '16px', color: '#ff6b35' }}>Material Requirements</h2>
                {cabinets.length === 0 ? (
                    <p style={{ color: '#666' }}>Add cabinets to calculate materials</p>
                ) : (
                    <div>
                    {Object.entries(calculateMaterials()).map(([material, data]) => (
                        <div key={material} style={{
                        background: '#1a1a1a',
                        padding: '16px',
                        marginBottom: '12px',
                        borderRadius: '4px',
                        border: '1px solid #333'
                        }}>
                        <h3 style={{
                            textTransform: 'capitalize',
                            marginBottom: '8px',
                            color: '#ff6b35'
                        }}>
                            {material}
                        </h3>
                        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                            <div>Area needed: {data.area.toFixed(1)} sq ft</div>
                            <div>Sheets (4x8): {data.sheets}</div>
                            <div>Cost: ${data.cost.toFixed(2)}</div>
                        </div>
                        </div>
                    ))}
                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        background: '#ff6b35',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}>
                        Total Material Cost: ${Object.values(calculateMaterials())
                        .reduce((sum, data) => sum + data.cost, 0)
                        .toFixed(2)}
                    </div>

                    {/* Sheet Cut Optimization Section */}
                    <div style={{ marginTop: '32px' }}>
                        <h2 style={{ marginBottom: '16px', color: '#ff6b35' }}>📋 Sheet Cut Optimization</h2>
                        <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '16px' }}>
                            Optimized grouping for 4' x 8' (48" x 96") sheets with 10% waste factor
                        </p>
                        {Object.entries(generateSheetOptimization()).map(([key, group]) => (
                            <div key={key} style={{
                                background: '#1a1a1a',
                                padding: '16px',
                                marginBottom: '16px',
                                borderRadius: '4px',
                                border: '1px solid #4CAF50'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '12px',
                                    paddingBottom: '12px',
                                    borderBottom: '1px solid #333'
                                }}>
                                    <h3 style={{
                                        textTransform: 'capitalize',
                                        color: '#4CAF50',
                                        margin: 0
                                    }}>
                                        {group.material} ({group.thickness}")
                                    </h3>
                                    <div style={{ fontSize: '14px', color: '#fff' }}>
                                        <strong>{group.sheetsNeeded}</strong> sheets needed
                                    </div>
                                </div>
                                
                                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '12px' }}>
                                    <div>Total area: {(group.totalArea / 144).toFixed(1)} sq ft</div>
                                    <div>Waste: {group.wastePercent}% (includes saw kerf & trimming)</div>
                                    <div style={{ marginTop: '8px', color: '#fff' }}>Parts to cut: {group.parts.length}</div>
                                </div>

                                {/* Show top 10 largest parts */}
                                <details style={{ marginTop: '12px' }}>
                                    <summary style={{ 
                                        cursor: 'pointer', 
                                        color: '#4CAF50',
                                        fontSize: '12px',
                                        padding: '4px 0'
                                    }}>
                                        📦 View parts list ({group.parts.length} parts)
                                    </summary>
                                    <div style={{ 
                                        marginTop: '8px',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        fontSize: '11px'
                                    }}>
                                        {group.parts.slice(0, 20).map((part, i) => (
                                            <div key={i} style={{ 
                                                padding: '4px 0',
                                                borderBottom: '1px solid #252525',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                                <span style={{ color: '#ccc' }}>
                                                    {part.cabinet} - {part.name}
                                                </span>
                                                <span style={{ color: '#aaa' }}>
                                                    {formatMeasurement(part.width, 'fraction')} × {formatMeasurement(part.height, 'fraction')}
                                                </span>
                                            </div>
                                        ))}
                                        {group.parts.length > 20 && (
                                            <div style={{ padding: '8px 0', color: '#666', fontStyle: 'italic' }}>
                                                ...and {group.parts.length - 20} more parts
                                            </div>
                                        )}
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                    </div>
                )}
                </div>
            )}

            {viewMode === 'pricing' && (
                <div style={{ padding: '24px' }}>
                <h2 style={{ marginBottom: '16px', color: '#ff6b35' }}>Project Pricing</h2>
                {cabinets.length === 0 ? (
                    <p style={{ color: '#666' }}>Add cabinets to calculate pricing</p>
                ) : (
                    <div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{...labelStyle, display: 'block', marginBottom: '8px'}}>Labor Rate ($/hour)</label>
                        <input
                        type="number"
                        value={laborRate}
                        onChange={(e) => setLaborRate(parseFloat(e.target.value))}
                        style={{...inputStyle, maxWidth: '200px'}}
                        />
                    </div>
                    <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '16px', lineHeight: '2' }}>
                        <div>Material Cost: ${Object.values(calculateMaterials()).reduce((sum, data) => sum + data.cost, 0).toFixed(2)}</div>
                        <div>Estimated Labor: {(cabinets.length * 4).toFixed(1)} hours</div>
                        <div>Labor Cost: ${(cabinets.length * 4 * laborRate).toFixed(2)}</div>
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #ff6b35', fontWeight: 'bold', fontSize: '20px', color: '#ff6b35' }}>
                            Total Estimate: ${(Object.values(calculateMaterials()).reduce((sum, data) => sum + data.cost, 0) + cabinets.length * 4 * laborRate).toFixed(2)}
                        </div>
                        </div>
                    </div>
                    </div>
                )}
                </div>
            )}
            </div>

            {/* right sidebar - IMPROVED DRAWER CONTROLS */}
            {selectedCabinet && (
            <div style={{
            width: '420px',
            background: '#1a1a1a',
            borderLeft: '1px solid #333',
            overflowY: 'auto',
            padding: '16px'
            }}>
            <h3 style={{ marginBottom: '16px', color: '#ff6b35' }}>
                Cabinet Details
            </h3>

            {/* Validation Results */}
            {validationResults && (validationResults.errors.length > 0 || validationResults.warnings.length > 0 || validationResults.suggestions.length > 0) && (
                <div style={{
                    marginBottom: '16px',
                    padding: '12px',
                    background: '#252525',
                    borderRadius: '4px',
                    border: validationResults.errors.length > 0 ? '1px solid #ff4444' : '1px solid #333'
                }}>
                    <div style={{ 
                        fontWeight: 'bold', 
                        marginBottom: '8px',
                        color: validationResults.errors.length > 0 ? '#ff4444' : '#ff6b35'
                    }}>
                        {validationResults.errors.length > 0 ? '🚫 Validation Errors' : validationResults.warnings.length > 0 ? '⚠️ Validation Warnings' : '💡 Suggestions'}
                    </div>
                    
                    {validationResults.errors.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                            {validationResults.errors.map((error, i) => (
                                <div key={i} style={{ 
                                    fontSize: '12px', 
                                    color: '#ff4444',
                                    marginBottom: '4px',
                                    lineHeight: '1.4'
                                }}>
                                    {error}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {validationResults.warnings.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                            {validationResults.warnings.map((warning, i) => (
                                <div key={i} style={{ 
                                    fontSize: '12px', 
                                    color: '#ffaa44',
                                    marginBottom: '4px',
                                    lineHeight: '1.4'
                                }}>
                                    {warning}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {validationResults.suggestions.length > 0 && (
                        <div>
                            {validationResults.suggestions.map((suggestion, i) => (
                                <div key={i} style={{ 
                                    fontSize: '12px', 
                                    color: '#88ccff',
                                    marginBottom: '4px',
                                    lineHeight: '1.4'
                                }}>
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Name</label>
                <input
                value={selectedCabinet.name}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'name', e.target.value)}
                style={inputStyle}
                />
            </div>

            <div className="section-header">DIMENSIONS</div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Width</label>
                <input
                type="text"
                placeholder="36 or 36 3/4 or 3/4"
                value={decimalToFraction(selectedCabinet.width)}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'width', parseFraction(e.target.value))}
                style={inputStyle}
                />
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{formatMeasurement(selectedCabinet.width, measurementFormat)}</div>
            </div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Height</label>
                <input
                type="text"
                placeholder="36 or 36 3/4 or 3/4"
                value={decimalToFraction(selectedCabinet.height)}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'height', parseFraction(e.target.value))}
                style={inputStyle}
                />
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{formatMeasurement(selectedCabinet.height, measurementFormat)}</div>
            </div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Depth</label>
                <input
                type="text"
                placeholder="24 or 24 3/4 or 3/4"
                value={decimalToFraction(selectedCabinet.depth)}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'depth', parseFraction(e.target.value))}
                style={inputStyle}
                />
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{formatMeasurement(selectedCabinet.depth, measurementFormat)}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <button
                    onClick={() => {
                        // Snap to adjacent cabinet (find cabinet to the left)
                        const sortedCabinets = [...cabinets].sort((a, b) => a.xPosition - b.xPosition);
                        const currentIndex = sortedCabinets.findIndex(c => c.id === selectedCabinet.id);
                        
                        if (currentIndex > 0) {
                            const leftCabinet = sortedCabinets[currentIndex - 1];
                            const snapPosition = leftCabinet.xPosition + leftCabinet.width;
                            updateCabinet(selectedCabinet.id, 'xPosition', snapPosition);
                        } else if (currentIndex < sortedCabinets.length - 1) {
                            // If it's the leftmost, snap to the right cabinet
                            const rightCabinet = sortedCabinets[currentIndex + 1];
                            const snapPosition = rightCabinet.xPosition - selectedCabinet.width;
                            updateCabinet(selectedCabinet.id, 'xPosition', Math.max(0, snapPosition));
                        }
                    }}
                    style={{...buttonStyle, width: '100%', fontSize: '12px', background: '#4CAF50'}}
                    title="Snap to adjacent cabinet"
                >
                    🧲 Snap Together
                </button>
            </div>

            <div className="section-header">CONSTRUCTION</div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Type</label>
                <select
                value={selectedCabinet.construction}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'construction', e.target.value)}
                style={inputStyle}
                >
                <option value="frameless">Frameless (32mm)</option>
                <option value="faceFrame">Face Frame</option>
                </select>
            </div>

            <div className="section-header">DOORS</div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Door Style</label>
                <select
                value={selectedCabinet.doorStyle}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'doorStyle', e.target.value)}
                style={inputStyle}
                >
                <option value="shaker">Shaker</option>
                <option value="flat">Flat/Slab</option>
                <option value="raised">Raised Panel</option>
                <option value="glass">Glass Insert</option>
                </select>
            </div>

            <div style={{ ...inputGroupStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                type="checkbox"
                id="doubleDoor"
                checked={selectedCabinet.doubleDoor || false}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'doubleDoor', e.target.checked)}
                style={{ cursor: 'pointer', flexShrink: 0 }}
                />
                <label htmlFor="doubleDoor" style={{ ...labelStyle, margin: 0, cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
                Double Door
                </label>
            </div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Number of Doors</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                    type="number"
                    min="0"
                    max={selectedCabinet.doubleDoor ? 2 : getMaxDoors(selectedCabinet.width)}
                    value={selectedCabinet.doors}
                    onChange={(e) => {
                        const newDoors = parseInt(e.target.value);
                        updateCabinet(selectedCabinet.id, 'doors', newDoors);
                        // Clear door selection if no doors
                        if (newDoors === 0) setSelectedDoorIndex(null);
                    }}
                    style={{...inputStyle, flex: 1}}
                    />
                    <button
                        onClick={() => applySmartDoorDefaults(selectedCabinet.id)}
                        style={{
                            ...buttonStyle,
                            padding: '8px 12px',
                            background: '#4a90e2',
                            border: '1px solid #5aa3ff',
                            fontSize: '11px',
                            whiteSpace: 'nowrap'
                        }}
                        title="Suggest optimal door count based on cabinet width"
                    >
                        ✨ Auto
                    </button>
                </div>
            </div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Door/Drawer Gap</label>
                <input
                type="text"
                placeholder="1/8 or 0.125"
                value={decimalToFraction(selectedCabinet.doorDrawerGap)}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'doorDrawerGap', parseFraction(e.target.value))}
                style={inputStyle}
                />
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{formatMeasurement(selectedCabinet.doorDrawerGap, measurementFormat)}</div>
            </div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Door/Drawer Overhang</label>
                <input
                type="text"
                placeholder="1/2 or 0.5"
                value={decimalToFraction(selectedCabinet.doorOverhang)}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'doorOverhang', parseFraction(e.target.value))}
                style={inputStyle}
                />
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{formatMeasurement(selectedCabinet.doorOverhang, measurementFormat)}</div>
            </div>

            {selectedCabinet.doors > 0 && (
                <div style={{ background: '#252525', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                {Array.from({length: selectedCabinet.doors}).map((_, i) => (
                    <div 
                        key={i} 
                        onClick={() => setSelectedDoorIndex(i)}
                        style={{
                        marginBottom: '12px',
                        paddingBottom: '12px',
                        borderBottom: i < selectedCabinet.doors - 1 ? '1px solid #333' : 'none',
                        cursor: 'pointer',
                        background: selectedDoorIndex === i ? '#333' : 'transparent',
                        padding: '8px',
                        borderRadius: '4px',
                        border: selectedDoorIndex === i ? '2px solid #ff6b35' : '2px solid transparent',
                        transition: 'all 0.2s'
                        }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#ff6b35', fontWeight: 'bold' }}>
                        Door {i + 1}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const doorKey = `${selectedCabinet.id}-${i}`;
                            const newHidden = new Set(hiddenDoors);
                            if (newHidden.has(doorKey)) {
                                newHidden.delete(doorKey);
                            } else {
                                newHidden.add(doorKey);
                            }
                            setHiddenDoors(newHidden);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: hiddenDoors.has(`${selectedCabinet.id}-${i}`) ? '#888' : '#ff6b35',
                            cursor: 'pointer',
                            padding: '4px',
                            fontSize: '11px'
                        }}
                        title={hiddenDoors.has(`${selectedCabinet.id}-${i}`) ? 'Show door' : 'Hide door'}
                        >
                        {hiddenDoors.has(`${selectedCabinet.id}-${i}`) ? '👁️' : '🚪'}
                        </button>
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (selectedCabinet.doors > 0) {
                            updateCabinet(selectedCabinet.id, 'doors', selectedCabinet.doors - 1);
                            if (selectedDoorIndex === i) setSelectedDoorIndex(null);
                            }
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff6b35',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                        >
                        <Trash2 size={14} />
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}

            {selectedDoorIndex !== null && selectedCabinet.doors > 0 && (
                <div style={{ background: '#252525', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#ff6b35', fontWeight: 'bold', marginBottom: '8px' }}>
                    Door {selectedDoorIndex + 1} Settings
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Handle Position</label>
                    <select
                    value={selectedCabinet.doorHandles?.[selectedDoorIndex] || 'left'}
                    onChange={(e) => {
                        const newHandles = { ...(selectedCabinet.doorHandles || {}) };
                        newHandles[selectedDoorIndex] = e.target.value;
                        updateCabinet(selectedCabinet.id, 'doorHandles', newHandles);
                    }}
                    style={inputStyle}
                    >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    </select>
                </div>
                </div>
            )}

            <div className="section-header">DRAWERS</div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Drawer Style</label>
                <select
                value={selectedCabinet.drawerStyle}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'drawerStyle', e.target.value)}
                style={inputStyle}
                >
                <option value="shaker">Shaker</option>
                <option value="flat">Flat/Slab</option>
                <option value="raised">Raised Panel</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <button
                    onClick={() => addDrawer(selectedCabinet.id)}
                    style={{...buttonStyle, flex: 1, justifyContent: 'center', fontSize: '11px', padding: '4px 6px'}}
                >
                    <Plus size={12} />
                    Add
                </button>
                <button
                    onClick={() => applySmartDrawerDefaults(selectedCabinet.id)}
                    style={{
                        ...buttonStyle, 
                        flex: 1, 
                        justifyContent: 'center',
                        background: '#4a90e2',
                        border: '1px solid #5aa3ff',
                        fontSize: '11px',
                        padding: '4px 6px'
                    }}
                    title="Auto-calculate and position drawers evenly with optimal heights"
                >
                    ✨ Smart
                </button>
            </div>

            {selectedCabinet.drawers && selectedCabinet.drawers.length > 0 && (
                <div style={{ background: '#252525', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                {selectedCabinet.drawers.map((drawer, i) => (
                    <div 
                        key={drawer.id} 
                        onClick={() => setSelectedDrawerId(drawer.id)}
                        style={{
                        marginBottom: '12px',
                        paddingBottom: '12px',
                        borderBottom: i < selectedCabinet.drawers.length - 1 ? '1px solid #333' : 'none',
                        cursor: 'pointer',
                        background: selectedDrawerId === drawer.id ? '#333' : 'transparent',
                        padding: '8px',
                        borderRadius: '4px',
                        border: selectedDrawerId === drawer.id ? '2px solid #ff6b35' : '2px solid transparent',
                        transition: 'all 0.2s'
                        }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#ff6b35', fontWeight: 'bold' }}>
                        Drawer {i + 1}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const newHidden = new Set(hiddenDrawers);
                            if (newHidden.has(drawer.id)) {
                                newHidden.delete(drawer.id);
                            } else {
                                newHidden.add(drawer.id);
                            }
                            setHiddenDrawers(newHidden);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: hiddenDrawers.has(drawer.id) ? '#888' : '#ff6b35',
                            cursor: 'pointer',
                            padding: '4px',
                            fontSize: '11px'
                        }}
                        title={hiddenDrawers.has(drawer.id) ? 'Show drawer' : 'Hide drawer'}
                        >
                        {hiddenDrawers.has(drawer.id) ? '👁️' : '🔲'}
                        </button>
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteDrawer(selectedCabinet.id, drawer.id);
                            setSelectedDrawerId(null);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff6b35',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                        >
                        <Trash2 size={14} />
                        </button>
                        </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '10px', color: '#888', display: 'block', marginBottom: '4px' }}>
                        Height (inches)
                        </label>
                        <input
                        type="number"
                        min="2"
                        step="0.5"
                        value={drawer.height.toFixed(2)}
                        onChange={(e) => updateDrawer(selectedCabinet.id, drawer.id, 'height', e.target.value)}
                        style={{...inputStyle, fontSize: '12px'}}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '10px', color: '#888', display: 'block', marginBottom: '4px' }}>
                        Position from bottom (inches)
                        </label>
                        <input
                        type="number"
                        step="0.5"
                        value={drawer.startY.toFixed(2)}
                        onChange={(e) => updateDrawer(selectedCabinet.id, drawer.id, 'startY', e.target.value)}
                        style={{...inputStyle, fontSize: '12px'}}
                        />
                    </div>
                    </div>
                ))}
                </div>
            )}

            <div className="section-header">HARDWARE</div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Hinges</label>
                <select
                value={selectedCabinet.hardware.hinges}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'hardware', {...selectedCabinet.hardware, hinges: e.target.value})}
                style={inputStyle}
                >
                {HINGE_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
            </div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Drawer Slides</label>
                <select
                value={selectedCabinet.hardware.slides}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'hardware', {...selectedCabinet.hardware, slides: e.target.value})}
                style={inputStyle}
                >
                {SLIDE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Pulls/Knobs</label>
                <select
                value={selectedCabinet.hardware.pulls}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'hardware', {...selectedCabinet.hardware, pulls: e.target.value})}
                style={inputStyle}
                >
                {PULL_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            <div className="section-header">OPTIONS</div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Shelves</label>
                <input
                type="number"
                min="0"
                value={selectedCabinet.shelves}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'shelves', parseInt(e.target.value))}
                style={inputStyle}
                />
            </div>

            <div style={{ ...inputGroupStyle, flexDirection: 'row', alignItems: 'center' }}>
                <input
                type="checkbox"
                checked={selectedCabinet.countertop}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'countertop', e.target.checked)}
                style={{ marginRight: '8px' }}
                />
                <label style={{ ...labelStyle, marginBottom: 0 }}>Countertop</label>
            </div>

            <div style={{ ...inputGroupStyle, flexDirection: 'row', alignItems: 'center' }}>
                <input
                type="checkbox"
                checked={selectedCabinet.crown}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'crown', e.target.checked)}
                style={{ marginRight: '8px' }}
                />
                <label style={{ ...labelStyle, marginBottom: 0 }}>Crown Molding</label>
            </div>

            <div style={{ ...inputGroupStyle, flexDirection: 'row', alignItems: 'center' }}>
                <input
                type="checkbox"
                checked={selectedCabinet.backPanel}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'backPanel', e.target.checked)}
                style={{ marginRight: '8px' }}
                />
                <label style={{ ...labelStyle, marginBottom: 0 }}>Back Panel</label>
            </div>

            <div style={{ ...inputGroupStyle, flexDirection: 'row', alignItems: 'center' }}>
                <input
                type="checkbox"
                checked={selectedCabinet.toekick}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'toekick', e.target.checked)}
                style={{ marginRight: '8px' }}
                />
                <label style={{ ...labelStyle, marginBottom: 0 }}>Toekick</label>
            </div>

            {selectedCabinet.toekick && (
                <>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Toekick Height (in)</label>
                    <input
                    type="number"
                    min="1"
                    max="8"
                    step="0.5"
                    value={selectedCabinet.toekickHeight}
                    onChange={(e) => updateCabinet(selectedCabinet.id, 'toekickHeight', parseFloat(e.target.value))}
                    style={inputStyle}
                    />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Toekick Depth (in)</label>
                    <input
                    type="number"
                    min="1"
                    max="8"
                    step="0.5"
                    value={selectedCabinet.toekickDepth}
                    onChange={(e) => updateCabinet(selectedCabinet.id, 'toekickDepth', parseFloat(e.target.value))}
                    style={inputStyle}
                    />
                </div>
                </>
            )}

            <div style={{ ...inputGroupStyle, flexDirection: 'row', alignItems: 'center' }}>
                <input
                type="checkbox"
                checked={selectedCabinet.edgebanding}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'edgebanding', e.target.checked)}
                style={{ marginRight: '8px' }}
                />
                <label style={{ ...labelStyle, marginBottom: 0 }}>Edgebanding</label>
            </div>

            <div className="section-header">APPEARANCE</div>
            </div>
            )}
        </div>

        {/* Keyboard Shortcuts Manager */}
        <KeyboardShortcutsManager
            onSave={saveProject}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onDelete={handleDelete}
            onNewCabinet={handleAddCabinet}
            onCameraPreset={handleCameraPresetSelect}
            onZoom={handleZoom}
            onToggleCutList={() => setShowCutList(!showCutList)}
            onCycleMeasurement={handleCycleMeasurement}
            selectedCabinetId={selectedCabinetId}
            selectedDrawerId={selectedDrawerId}
            selectedDoorIndex={selectedDoorIndex}
        />
    </div>
    );
};

// styles
const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#ff6b35',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.2s'
};

const tabStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    color: '#fff',
    transition: 'all 0.2s'
};

const tableHeaderStyle = {
    padding: '8px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '11px'
};

const tableCellStyle = {
    padding: '8px',
    fontSize: '11px'
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '12px'
};

const labelStyle = {
    fontSize: '11px',
    marginBottom: '4px',
    color: '#aaa',
    fontWeight: 'bold',
    textTransform: 'uppercase'
};

const inputStyle = {
    padding: '8px 12px',
    background: '#252525',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: 'inherit',
    fontSize: '13px'
};

ReactDOM.render(<CabinetDesigner />, document.getElementById('root'));
