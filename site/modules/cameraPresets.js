// ========== CAMERA PRESETS MODULE ==========
// This module provides preset camera views for the 3D cabinet designer.
// It includes front, side, top, and isometric views with smooth transitions.
//
// Usage:
//   import { CAMERA_PRESETS, applyCameraPreset } from './modules/cameraPresets.js';
//   applyCameraPreset(camera, 'front', cameraAngle, cameraDistance, updateCameraPosition);
//
// The camera system uses spherical coordinates (theta, phi, distance):
//   - theta: Horizontal rotation angle (0 = front, π/2 = side)
//   - phi: Vertical angle (0 = looking from below, π/2 = looking from top)
//   - distance: How far the camera is from the cabinet

// ========== CAMERA PRESET DEFINITIONS ==========
// Each preset defines the spherical coordinates for optimal viewing angles

const CAMERA_PRESETS = {
    // Front view - looks straight at the cabinet front
    // User sees doors, drawer fronts, and overall cabinet face
    front: {
        theta: 0,                    // 0 degrees - directly facing cabinet
        phi: Math.PI / 6,           // 30 degrees up from horizon
        distance: 80,                // Standard viewing distance
        label: 'Front',
        description: 'View cabinet from the front'
    },
    
    // Side view - looks at cabinet from the right side
    // User sees cabinet depth, side panels, and door swing clearance
    side: {
        theta: Math.PI / 2,         // 90 degrees - right side view
        phi: Math.PI / 6,           // 30 degrees up from horizon
        distance: 80,
        label: 'Side',
        description: 'View cabinet from the side'
    },
    
    // Top view - looks down from above
    // User sees cabinet footprint, layout, and top dimensions
    top: {
        theta: 0,                    // 0 degrees horizontal
        phi: Math.PI / 2 - 0.1,     // Nearly 90 degrees (straight down with slight angle)
        distance: 60,                // Closer for better top view
        label: 'Top',
        description: 'View cabinet from above'
    },
    
    // Isometric view - classic 3D technical drawing angle
    // User sees front, side, and top simultaneously for best overall understanding
    isometric: {
        theta: Math.PI / 4,         // 45 degrees - corner view
        phi: Math.PI / 6,           // 30 degrees up (technical drawing standard)
        distance: 80,
        label: 'Isometric',
        description: 'Classic 3D perspective view'
    },
    
    // Left side view - looks at cabinet from the left side
    // Alternative side view for complete cabinet inspection
    left: {
        theta: -Math.PI / 2,        // -90 degrees - left side view
        phi: Math.PI / 6,           // 30 degrees up from horizon
        distance: 80,
        label: 'Left Side',
        description: 'View cabinet from the left side'
    }
};

// ========== CAMERA PRESET APPLICATION ==========
// Applies a preset camera angle to the 3D view
//
// Parameters:
//   camera - Three.js camera object to update
//   presetName - Name of preset from CAMERA_PRESETS (e.g., 'front', 'side', 'top', 'isometric')
//   cameraAngle - React ref object containing { theta, phi } for current camera angles
//   cameraDistance - React ref object containing the current camera distance
//   updateCameraPosition - Function to update the camera position based on angles
//
// Returns:
//   true if preset was applied successfully, false if preset name not found

function applyCameraPreset(camera, presetName, cameraAngle, cameraDistance, updateCameraPosition) {
    const preset = CAMERA_PRESETS[presetName];
    
    // Validate preset exists
    if (!preset) {
        console.warn(`Camera preset "${presetName}" not found`);
        return false;
    }
    
    // Update camera angle and distance refs
    cameraAngle.current = {
        theta: preset.theta,
        phi: preset.phi
    };
    cameraDistance.current = preset.distance;
    
    // Apply the new camera position
    updateCameraPosition(camera);
    
    return true;
}

// ========== CAMERA PRESET ICONS ==========
// SVG icons for camera preset buttons
// These provide visual indicators for each view type

const CameraPresetIcons = {
    front: ({ size = 20, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    
    side: ({ size = 20, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M3 7 L3 17 L10 21 L10 11 Z" />
            <path d="M10 11 L21 11 L21 21 L10 21" />
        </svg>
    ),
    
    top: ({ size = 20, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
    ),
    
    isometric: ({ size = 20, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M12 2 L2 7 L2 17 L12 22 L22 17 L22 7 Z" />
            <path d="M2 7 L12 12 L22 7" />
            <path d="M12 12 L12 22" />
        </svg>
    ),
    
    left: ({ size = 20, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M21 7 L21 17 L14 21 L14 11 Z" />
            <path d="M14 11 L3 11 L3 21 L14 21" />
        </svg>
    )
};

// ========== CAMERA PRESET BUTTON COMPONENT ==========
// React component that renders a button for a camera preset
//
// Props:
//   preset - Preset name (e.g., 'front', 'side')
//   onClick - Function to call when button is clicked
//   isActive - Boolean indicating if this is the currently active view

const CameraPresetButton = ({ preset, onClick, isActive = false }) => {
    const presetData = CAMERA_PRESETS[preset];
    const Icon = CameraPresetIcons[preset];
    
    if (!presetData || !Icon) return null;
    
    return (
        <button
            className={`camera-preset-btn ${isActive ? 'active' : ''}`}
            onClick={onClick}
            title={presetData.description}
            aria-label={presetData.description}
        >
            <Icon size={20} />
            <span className="camera-preset-label">{presetData.label}</span>
        </button>
    );
};

// ========== CAMERA PRESET TOOLBAR COMPONENT ==========
// Complete toolbar with all camera preset buttons
//
// Props:
//   onPresetSelect - Function called when a preset is selected, receives preset name
//   activePreset - Currently active preset name (optional)

const CameraPresetToolbar = ({ onPresetSelect, activePreset = null }) => {
    return (
        <div className="camera-preset-toolbar">
            <div className="camera-preset-group">
                <CameraPresetButton 
                    preset="front" 
                    onClick={() => onPresetSelect('front')}
                    isActive={activePreset === 'front'}
                />
                <CameraPresetButton 
                    preset="side" 
                    onClick={() => onPresetSelect('side')}
                    isActive={activePreset === 'side'}
                />
                <CameraPresetButton 
                    preset="left" 
                    onClick={() => onPresetSelect('left')}
                    isActive={activePreset === 'left'}
                />
                <CameraPresetButton 
                    preset="top" 
                    onClick={() => onPresetSelect('top')}
                    isActive={activePreset === 'top'}
                />
                <CameraPresetButton 
                    preset="isometric" 
                    onClick={() => onPresetSelect('isometric')}
                    isActive={activePreset === 'isometric'}
                />
            </div>
        </div>
    );
};

// Export all camera preset utilities
window.CAMERA_PRESETS = CAMERA_PRESETS;
window.applyCameraPreset = applyCameraPreset;
window.CameraPresetIcons = CameraPresetIcons;
window.CameraPresetButton = CameraPresetButton;
window.CameraPresetToolbar = CameraPresetToolbar;
