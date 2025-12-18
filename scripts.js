const { useState, useEffect, useRef } = React;

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

// hardware options
const HINGE_TYPES = ['Concealed (Blum)', 'Concealed (Grass)', 'European', 'Butt Hinge'];
const SLIDE_TYPES = ['Undermount (Blum)', 'Side Mount', 'Center Mount', 'Soft-Close'];
const PULL_TYPES = ['Bar Pull', 'Cup Pull', 'Knob', 'Edge Pull', 'Recessed'];

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

// create wood texture
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
    const [viewMode, setViewMode] = useState('3d');
    const [projectName, setProjectName] = useState('Untitled Project');

    const [materialCosts, setMaterialCosts] = useState({
    plywood: 45,
    mdf: 30,
    hardwood: 85,
    melamine: 40
    });

    const [laborRate, setLaborRate] = useState(50); // per hour

    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const animationRef = useRef(null);
    const woodTextureCache = useRef({});

    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });
    const cameraAngle = useRef({ theta: Math.PI / 4, phi: Math.PI / 6 });
    const cameraDistance = useRef(80);

    // create default cabinet
    const createNewCabinet = () => {
    return {
        id: Date.now(),
        name: `Cabinet ${cabinets.length + 1}`,
        type: 'base',
        construction: 'frameless', // or 'faceFrame'
        width: 24,
        height: 34.5,
        depth: 24,
        material: 'plywood',
        thickness: 0.75,
        doors: 1,
        doorStyle: 'shaker',
        drawers: [],  // array of {height, startY} - positioned from bottom
        drawerStyle: 'shaker',
        shelves: 1,
        backPanel: true,
        toekick: true,
        toekickHeight: 4,
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
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!containerRef.current || !canvasRef.current) return;
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        }
    };
    }, []);

    const updateCameraPosition = (camera) => {
    const theta = cameraAngle.current.theta;
    const phi = cameraAngle.current.phi;
    const distance = cameraDistance.current;

    camera.position.x = distance * Math.sin(theta) * Math.cos(phi);
    camera.position.y = distance * Math.sin(phi);
    camera.position.z = distance * Math.cos(theta) * Math.cos(phi);
    camera.lookAt(0, 15, 0);
    };

    // mouse controls
    const handleMouseDown = (e) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
    if (!isDragging.current || !cameraRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    cameraAngle.current.theta -= deltaX * 0.01;
    cameraAngle.current.phi += deltaY * 0.01;
    cameraAngle.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, cameraAngle.current.phi));

    updateCameraPosition(cameraRef.current);
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
    };

    // update 3D when cabinets change
    useEffect(() => {
    if (!sceneRef.current) return;

    const objectsToRemove = [];
    sceneRef.current.traverse((object) => {
        if (object.userData.isCabinet) {
        objectsToRemove.push(object);
        }
    });
    objectsToRemove.forEach(obj => sceneRef.current.remove(obj));

    let xOffset = 0;
    cabinets.forEach((cabinet) => {
        const cabinetGroup = createCabinet3D(cabinet, xOffset);
        sceneRef.current.add(cabinetGroup);
        xOffset += cabinet.width + 2;
    });
    }, [cabinets, selectedCabinetId]);

    // create door/drawer front with details
    const createDoorFront = (width, height, style, material, position, xOffset) => {
    const isSelected = selectedCabinetId && cabinets.find(c => c.id === selectedCabinetId);
    const doorColor = isSelected?.id === selectedCabinetId ? 0xaa5533 : 0x6B5444;

    if (!woodTextureCache.current[doorColor]) {
        woodTextureCache.current[doorColor] = createWoodTexture(`#${doorColor.toString(16).padStart(6, '0')}`);
    }

    const doorMaterial = new THREE.MeshStandardMaterial({
        map: woodTextureCache.current[doorColor],
        roughness: 0.4,
        metalness: 0.1
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
    const createDrawerBox = (width, depth, drawerFrontHeight, position) => {
    const group = new THREE.Group();

    const boxMat = new THREE.MeshStandardMaterial({ color: 0xD4A574, roughness: 0.6 });

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
    const createCabinet3D = (cabinet, xOffset) => {
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
    leftSide.position.set(xOffset, height / 2, 0);
    leftSide.castShadow = true;
    group.add(leftSide);

    const rightSide = new THREE.Mesh(sideGeo, material);
    rightSide.position.set(xOffset + width - thickness, height / 2, 0);
    rightSide.castShadow = true;
    group.add(rightSide);

    const topGeo = new THREE.BoxGeometry(width, thickness, depth);
    const top = new THREE.Mesh(topGeo, material);
    top.position.set(xOffset + width / 2, height - thickness / 2, 0);
    top.castShadow = true;
    group.add(top);

    const bottom = new THREE.Mesh(topGeo, material);
    const bottomY = cabinet.toekick ? cabinet.toekickHeight : 0;
    bottom.position.set(xOffset + width / 2, bottomY + thickness / 2, 0);
    bottom.castShadow = true;
    group.add(bottom);

    if (cabinet.backPanel) {
        const backGeo = new THREE.BoxGeometry(width - thickness * 2, height, 0.25);
        const back = new THREE.Mesh(backGeo, material);
        back.position.set(xOffset + width / 2, height / 2, -depth / 2 + 0.125);
        group.add(back);
    }

    // shelves
    const shelfGeo = new THREE.BoxGeometry(width - thickness * 2, thickness, depth - 1);
    for (let i = 0; i < cabinet.shelves; i++) {
        const shelfY = height / (cabinet.shelves + 1) * (i + 1);
        const shelf = new THREE.Mesh(shelfGeo, material);
        shelf.position.set(xOffset + width / 2, shelfY, 0);
        group.add(shelf);
    }

    const doorStartY = cabinet.toekick ? cabinet.toekickHeight : 0;

    // drawers - properly positioned
    if (cabinet.drawers && cabinet.drawers.length > 0) {
        cabinet.drawers.forEach((drawer, i) => {
        const drawerY = drawer.startY + drawer.height / 2;

        const frontPos = new THREE.Vector3(
            xOffset + width / 2,
            drawerY,
            depth / 2 + 0.375
        );

        const drawerFront = createDoorFront(
            width - 2,
            drawer.height - 0.5,
            cabinet.drawerStyle || 'shaker',
            cabinet.material,
            frontPos,
            xOffset
        );
        group.add(drawerFront);

        const boxPos = new THREE.Vector3(
            xOffset + width / 2,
            drawerY,
            0
        );
        const drawerBox = createDrawerBox(width - 2, depth, drawer.height, boxPos);
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
        const doorX = xOffset + (doorWidth + 1) * i + doorWidth / 2 + (width - (doorWidth + 1) * cabinet.doors + 1) / 2;
        const doorPos = new THREE.Vector3(doorX, doorY, depth / 2 + 0.375);

        const door = createDoorFront(
            doorWidth,
            doorHeight,
            cabinet.doorStyle || 'shaker',
            cabinet.material,
            doorPos,
            xOffset
        );
        group.add(door);
        }
    }

    // toekick
    if (cabinet.toekick) {
        const toekickGeo = new THREE.BoxGeometry(width, cabinet.toekickHeight, thickness);
        const toekickMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const toekick = new THREE.Mesh(toekickGeo, toekickMaterial);
        toekick.position.set(xOffset + width / 2, cabinet.toekickHeight / 2, depth / 2 - thickness / 2);
        group.add(toekick);
    }

    // countertop
    if (cabinet.countertop) {
        const counterGeo = new THREE.BoxGeometry(width + 1, cabinet.countertopThickness, depth + 1);
        const counterMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.2 });
        const counter = new THREE.Mesh(counterGeo, counterMat);
        counter.position.set(xOffset + width / 2, height + cabinet.countertopThickness / 2, 0);
        counter.castShadow = true;
        group.add(counter);
    }

    // crown molding
    if (cabinet.crown) {
        const crownGeo = new THREE.BoxGeometry(width, cabinet.crownHeight, 2);
        const crownMat = new THREE.MeshStandardMaterial({ color: 0xCCBBAA });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.set(xOffset + width / 2, height + cabinet.crownHeight / 2, depth / 2 - 1);
        group.add(crown);
    }

    return group;
    };

    const handleAddCabinet = () => {
    const newCabinet = createNewCabinet();
    setCabinets([...cabinets, newCabinet]);
    setSelectedCabinetId(newCabinet.id);
    };

    const handleDeleteCabinet = (id) => {
    setCabinets(cabinets.filter(c => c.id !== id));
    if (selectedCabinetId === id) {
        setSelectedCabinetId(null);
    }
    };

    const updateCabinet = (id, property, value) => {
    setCabinets(cabinets.map(c =>
        c.id === id ? { ...c, [property]: value } : c
    ));
    };

    // add drawer at specific position
    const addDrawer = (cabinetId) => {
    setCabinets(cabinets.map(c => {
        if (c.id === cabinetId) {
        const doorStartY = c.toekick ? c.toekickHeight : 0;
        const existingDrawers = c.drawers || [];
        const topOfLastDrawer = existingDrawers.length > 0
            ? Math.max(...existingDrawers.map(d => d.startY + d.height))
            : doorStartY;

        const newDrawer = {
            id: Date.now(),
            height: 6,
            startY: topOfLastDrawer
        };

        return { ...c, drawers: [...existingDrawers, newDrawer] };
        }
        return c;
    }));
    };

    const updateDrawer = (cabinetId, drawerId, property, value) => {
    setCabinets(cabinets.map(c => {
        if (c.id === cabinetId) {
        const updatedDrawers = c.drawers.map(d =>
            d.id === drawerId ? { ...d, [property]: parseFloat(value) } : d
        );
        return { ...c, drawers: updatedDrawers };
        }
        return c;
    }));
    };

    const deleteDrawer = (cabinetId, drawerId) => {
    setCabinets(cabinets.map(c => {
        if (c.id === cabinetId) {
        return { ...c, drawers: c.drawers.filter(d => d.id !== drawerId) };
        }
        return c;
    }));
    };

    const selectedCabinet = cabinets.find(c => c.id === selectedCabinetId);

    // detailed cut list generation (truncated for space - keeping core structure)
    const generateCutList = () => {
    const cutList = [];

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
        notes: 'Full height sides'
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
        notes: 'Between sides'
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
            notes: 'Adjustable'
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
            notes: '1/4" back'
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
                notes: 'Top/bottom'
            });
            cutList.push({
                cabinet: cabinet.name,
                part: `Drawer ${i+1} Stiles`,
                quantity: 2,
                width: spec.stileWidth,
                height: frontHeight,
                thickness: 0.75,
                material: cabinet.material,
                notes: 'Left/right'
            });
            cutList.push({
                cabinet: cabinet.name,
                part: `Drawer ${i+1} Panel`,
                quantity: 1,
                width: frontWidth - spec.stileWidth * 2,
                height: frontHeight - spec.railWidth * 2,
                thickness: spec.panelThickness,
                material: cabinet.material,
                notes: 'Center panel'
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
                notes: cabinet.drawerStyle
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
            notes: '1/2" sides'
            });
            cutList.push({
            cabinet: cabinet.name,
            part: `Drawer ${i+1} Box Front/Back`,
            quantity: 2,
            width: cabinet.width - 2 - DRAWER_BOX.sideThickness * 2,
            height: boxHeight,
            thickness: DRAWER_BOX.sideThickness,
            material: 'plywood',
            notes: '1/2" F/B'
            });
            cutList.push({
            cabinet: cabinet.name,
            part: `Drawer ${i+1} Bottom`,
            quantity: 1,
            width: cabinet.width - 2 - DRAWER_BOX.sideThickness * 2,
            height: cabinet.depth - 2,
            thickness: DRAWER_BOX.bottomThickness,
            material: 'plywood',
            notes: '1/4" bottom'
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
            notes: 'Shaker T/B'
            });
            cutList.push({
            cabinet: cabinet.name,
            part: 'Door Stiles',
            quantity: cabinet.doors * 2,
            width: spec.stileWidth,
            height: doorHeight,
            thickness: 0.75,
            material: cabinet.material,
            notes: 'Shaker L/R'
            });
            cutList.push({
            cabinet: cabinet.name,
            part: 'Door Panels',
            quantity: cabinet.doors,
            width: doorWidth - spec.stileWidth * 2,
            height: doorHeight - spec.railWidth * 2,
            thickness: spec.panelThickness,
            material: cabinet.material,
            notes: 'Center'
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
            notes: cabinet.doorStyle
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
            notes: '2 per door'
        });
        cutList.push({
            cabinet: cabinet.name,
            part: `Door Pulls (${cabinet.hardware.pulls})`,
            quantity: cabinet.doors,
            width: 0,
            height: 0,
            thickness: 0,
            material: 'hardware',
            notes: '1 per door'
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
            notes: `${cabinet.depth}" pair/drawer`
        });
        cutList.push({
            cabinet: cabinet.name,
            part: `Drawer Pulls (${cabinet.hardware.pulls})`,
            quantity: cabinet.drawers.length,
            width: 0,
            height: 0,
            thickness: 0,
            material: 'hardware',
            notes: '1 per drawer'
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

    const saveProject = () => {
    const project = {
        name: projectName,
        cabinets: cabinets,
        materialCosts: materialCosts,
        laborRate: laborRate,
        savedAt: new Date().toISOString()
    };
    localStorage.setItem('cabinetProject', JSON.stringify(project));
    alert('Project saved!');
    };

    const loadProject = () => {
    const saved = localStorage.getItem('cabinetProject');
    if (saved) {
        const project = JSON.parse(saved);
        setProjectName(project.name);
        setCabinets(project.cabinets);
        setMaterialCosts(project.materialCosts);
        setLaborRate(project.laborRate || 50);
        alert('Project loaded!');
    } else {
        alert('No saved project found');
    }
    };

    const exportCutList = () => {
    const cutList = generateCutList();
    let csv = 'Cabinet,Part,Quantity,Width (in),Height (in),Thickness (in),Material,Notes\n';
    cutList.forEach(item => {
        csv += `${item.cabinet},${item.part},${item.quantity},${item.width > 0 ? item.width.toFixed(2) : '-'},${item.height > 0 ? item.height.toFixed(2) : '-'},${item.thickness > 0 ? item.thickness : '-'},${item.material},"${item.notes}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-cutlist.csv`;
    a.click();
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
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={saveProject} style={buttonStyle}>
            <Save size={18} />
            Save
            </button>
            <button onClick={loadProject} style={buttonStyle}>
            <FolderOpen size={18} />
            Load
            </button>
            <button onClick={exportCutList} style={buttonStyle}>
            <Download size={18} />
            Export
            </button>
        </div>
        </div>

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
            <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 16px',
            background: '#1a1a1a',
            borderBottom: '1px solid #333'
            }}>
            <button
                onClick={() => setViewMode('3d')}
                style={{
                ...tabStyle,
                background: viewMode === '3d' ? '#ff6b35' : '#252525'
                }}
            >
                <Camera size={16} />
                3D View
            </button>
            <button
                onClick={() => setViewMode('cutlist')}
                style={{
                ...tabStyle,
                background: viewMode === 'cutlist' ? '#ff6b35' : '#252525'
                }}
            >
                <Ruler size={16} />
                Cut List
            </button>
            <button
                onClick={() => setViewMode('materials')}
                style={{
                ...tabStyle,
                background: viewMode === 'materials' ? '#ff6b35' : '#252525'
                }}
            >
                <FileText size={16} />
                Materials
            </button>
            <button
                onClick={() => setViewMode('pricing')}
                style={{
                ...tabStyle,
                background: viewMode === 'pricing' ? '#ff6b35' : '#252525'
                }}
            >
                <DollarSign size={16} />
                Pricing
            </button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', background: '#2d2d2d' }}>
            <div
                ref={containerRef}
                style={{
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
                onWheel={handleWheel}
                style={{ width: '100%', height: '100%', display: 'block' }}
                />
            </div>

            {viewMode === 'cutlist' && (
                <div style={{ padding: '24px' }}>
                <h2 style={{ marginBottom: '16px', color: '#ff6b35' }}>Detailed Cut List</h2>
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
                            <td style={{...tableCellStyle, fontSize: '11px'}}>{item.width > 0 ? `${item.width.toFixed(2)}"` : '-'}</td>
                            <td style={{...tableCellStyle, fontSize: '11px'}}>{item.height > 0 ? `${item.height.toFixed(2)}"` : '-'}</td>
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
        </div>

        {/* right sidebar - IMPROVED DRAWER CONTROLS */}
        {selectedCabinet && (
            <div style={{
            width: '340px',
            background: '#1a1a1a',
            borderLeft: '1px solid #333',
            overflowY: 'auto',
            padding: '16px'
            }}>
            <h3 style={{ marginBottom: '16px', color: '#ff6b35' }}>
                Cabinet Details
            </h3>

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
                type="number"
                value={selectedCabinet.width}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'width', parseFloat(e.target.value))}
                style={inputStyle}
                />
            </div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Height</label>
                <input
                type="number"
                value={selectedCabinet.height}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'height', parseFloat(e.target.value))}
                style={inputStyle}
                />
            </div>

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Depth</label>
                <input
                type="number"
                value={selectedCabinet.depth}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'depth', parseFloat(e.target.value))}
                style={inputStyle}
                />
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

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Material</label>
                <select
                value={selectedCabinet.material}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'material', e.target.value)}
                style={inputStyle}
                >
                <option value="plywood">Plywood</option>
                <option value="mdf">MDF</option>
                <option value="hardwood">Hardwood</option>
                <option value="melamine">Melamine</option>
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

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Number of Doors</label>
                <input
                type="number"
                min="0"
                value={selectedCabinet.doors}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'doors', parseInt(e.target.value))}
                style={inputStyle}
                />
            </div>

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

            <button
                onClick={() => addDrawer(selectedCabinet.id)}
                style={{...buttonStyle, width: '100%', marginBottom: '12px', justifyContent: 'center'}}
            >
                <Plus size={16} />
                Add Drawer
            </button>

            {selectedCabinet.drawers && selectedCabinet.drawers.length > 0 && (
                <div style={{ background: '#252525', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                {selectedCabinet.drawers.map((drawer, i) => (
                    <div key={drawer.id} style={{
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: i < selectedCabinet.drawers.length - 1 ? '1px solid #333' : 'none'
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#ff6b35', fontWeight: 'bold' }}>
                        Drawer {i + 1}
                        </span>
                        <button
                        onClick={() => deleteDrawer(selectedCabinet.id, drawer.id)}
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
                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '10px', color: '#888', display: 'block', marginBottom: '4px' }}>
                        Height (inches)
                        </label>
                        <input
                        type="number"
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

            <div style={inputGroupStyle}>
                <label style={labelStyle}>Wood Color</label>
                <input
                type="color"
                value={selectedCabinet.color}
                onChange={(e) => updateCabinet(selectedCabinet.id, 'color', e.target.value)}
                style={{ ...inputStyle, height: '40px', cursor: 'pointer' }}
                />
            </div>
            </div>
        )}
        </div>
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
