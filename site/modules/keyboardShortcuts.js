// ========== KEYBOARD SHORTCUTS MODULE ==========
// Provides keyboard shortcut functionality for Cabinet Designer
// Includes common actions, view controls, and help overlay

/**
 * Keyboard Shortcut Configuration
 * Maps keyboard shortcuts to their actions and descriptions
 */
const KEYBOARD_SHORTCUTS = {
    // Common Actions
    'ctrl+s': { action: 'save', description: 'Save project', category: 'Actions' },
    'cmd+s': { action: 'save', description: 'Save project', category: 'Actions' },
    'ctrl+z': { action: 'undo', description: 'Undo last action', category: 'Actions' },
    'cmd+z': { action: 'undo', description: 'Undo last action', category: 'Actions' },
    'ctrl+y': { action: 'redo', description: 'Redo last action', category: 'Actions' },
    'cmd+shift+z': { action: 'redo', description: 'Redo last action', category: 'Actions' },
    'ctrl+shift+z': { action: 'redo', description: 'Redo last action', category: 'Actions' },
    'delete': { action: 'delete', description: 'Delete selected item', category: 'Actions' },
    'backspace': { action: 'delete', description: 'Delete selected item', category: 'Actions' },
    
    // View Shortcuts
    '1': { action: 'viewFront', description: 'Front view', category: 'View' },
    '2': { action: 'viewBack', description: 'Back view', category: 'View' },
    '3': { action: 'viewLeft', description: 'Left view', category: 'View' },
    '4': { action: 'viewRight', description: 'Right view', category: 'View' },
    '5': { action: 'viewTop', description: 'Top view', category: 'View' },
    '6': { action: 'viewBottom', description: 'Bottom view', category: 'View' },
    '7': { action: 'viewIsometric', description: 'Isometric view', category: 'View' },
    
    // Camera Controls
    'r': { action: 'rotateView', description: 'Rotate view (hold and drag)', category: 'Camera' },
    'z': { action: 'zoomIn', description: 'Zoom in', category: 'Camera' },
    'x': { action: 'zoomOut', description: 'Zoom out', category: 'Camera' },
    '+': { action: 'zoomIn', description: 'Zoom in', category: 'Camera' },
    '-': { action: 'zoomOut', description: 'Zoom out', category: 'Camera' },
    
    // Quick Actions
    'n': { action: 'newCabinet', description: 'New cabinet', category: 'Quick' },
    'c': { action: 'showCutList', description: 'Toggle cut list', category: 'Quick' },
    'm': { action: 'cycleMeasurement', description: 'Cycle measurement format', category: 'Quick' },
    
    // Help
    '?': { action: 'showHelp', description: 'Show keyboard shortcuts', category: 'Help' },
    'h': { action: 'showHelp', description: 'Show keyboard shortcuts', category: 'Help' },
    'shift+/': { action: 'showHelp', description: 'Show keyboard shortcuts', category: 'Help' },
    'escape': { action: 'closeHelp', description: 'Close help overlay', category: 'Help' },
};

/**
 * KeyboardShortcutsManager Component
 * Manages keyboard event handling and displays help overlay
 */
const KeyboardShortcutsManager = ({ 
    onSave, 
    onUndo,
    onRedo,
    onDelete, 
    onNewCabinet, 
    onCameraPreset,
    onZoom,
    onToggleCutList,
    onCycleMeasurement,
    selectedCabinetId,
    selectedDrawerId,
    selectedDoorIndex 
}) => {
    const [showHelp, setShowHelp] = React.useState(false);

    // Handle keyboard events
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            // Build the key combination string
            let key = e.key.toLowerCase();
            if (e.ctrlKey || e.metaKey) {
                key = (e.ctrlKey ? 'ctrl+' : 'cmd+') + key;
            }
            if (e.shiftKey && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                key = e.ctrlKey ? 'ctrl+shift+z' : 'cmd+shift+z';
            }
            if (e.shiftKey && e.key === '/') {
                key = 'shift+/';
            }

            // Check if we're typing in an input field
            const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
            
            // Get the shortcut config
            const shortcut = KEYBOARD_SHORTCUTS[key];
            if (!shortcut) return;

            // Don't handle shortcuts when typing in inputs (except Escape)
            if (isInputFocused && key !== 'escape') return;

            // Prevent default browser behavior
            e.preventDefault();
            e.stopPropagation();

            // Execute the action
            handleShortcutAction(shortcut.action);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSave, onUndo, onRedo, onDelete, onNewCabinet, onCameraPreset, onZoom, onToggleCutList, onCycleMeasurement, selectedCabinetId, selectedDrawerId, selectedDoorIndex, showHelp]);

    // Handle shortcut actions
    const handleShortcutAction = (action) => {
        switch (action) {
            case 'save':
                onSave && onSave();
                break;
            case 'undo':
                onUndo && onUndo();
                break;
            case 'redo':
                onRedo && onRedo();
                break;
            case 'delete':
                onDelete && onDelete();
                break;
            case 'newCabinet':
                onNewCabinet && onNewCabinet();
                break;
            case 'viewFront':
                onCameraPreset && onCameraPreset('front');
                break;
            case 'viewBack':
                onCameraPreset && onCameraPreset('back');
                break;
            case 'viewLeft':
                onCameraPreset && onCameraPreset('left');
                break;
            case 'viewRight':
                onCameraPreset && onCameraPreset('right');
                break;
            case 'viewTop':
                onCameraPreset && onCameraPreset('top');
                break;
            case 'viewBottom':
                onCameraPreset && onCameraPreset('bottom');
                break;
            case 'viewIsometric':
                onCameraPreset && onCameraPreset('isometric');
                break;
            case 'zoomIn':
                onZoom && onZoom(-5);
                break;
            case 'zoomOut':
                onZoom && onZoom(5);
                break;
            case 'showCutList':
                onToggleCutList && onToggleCutList();
                break;
            case 'cycleMeasurement':
                onCycleMeasurement && onCycleMeasurement();
                break;
            case 'showHelp':
                setShowHelp(true);
                break;
            case 'closeHelp':
                setShowHelp(false);
                break;
            default:
                console.log('Shortcut action not implemented:', action);
        }
    };

    // Group shortcuts by category
    const groupedShortcuts = Object.entries(KEYBOARD_SHORTCUTS).reduce((groups, [key, config]) => {
        const category = config.category;
        if (!groups[category]) groups[category] = [];
        groups[category].push({ key, ...config });
        return groups;
    }, {});

    // Remove duplicate shortcuts (e.g., cmd+s and ctrl+s)
    const deduplicateShortcuts = (shortcuts) => {
        const seen = new Set();
        return shortcuts.filter(s => {
            if (seen.has(s.description)) return false;
            seen.add(s.description);
            return true;
        });
    };

    return (
        <>
            {/* Help Button */}
            <button
                onClick={() => setShowHelp(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                }}
                title="Keyboard Shortcuts (? or H)"
            >
                ?
            </button>

            {/* Keyboard Shortcuts Help Overlay */}
            {showHelp && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px',
                    }}
                    onClick={() => setShowHelp(false)}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '30px',
                            maxWidth: '800px',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#333' }}>⌨️ Keyboard Shortcuts</h2>
                            <button
                                onClick={() => setShowHelp(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666',
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                                <div key={category} style={{ marginBottom: '10px' }}>
                                    <h3 style={{ 
                                        color: '#4A90E2', 
                                        borderBottom: '2px solid #4A90E2',
                                        paddingBottom: '5px',
                                        marginBottom: '10px',
                                        fontSize: '16px',
                                    }}>
                                        {category}
                                    </h3>
                                    {deduplicateShortcuts(shortcuts).map((shortcut, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '8px 0',
                                                borderBottom: '1px solid #eee',
                                            }}
                                        >
                                            <span style={{ color: '#666', fontSize: '14px' }}>{shortcut.description}</span>
                                            <kbd
                                                style={{
                                                    backgroundColor: '#f5f5f5',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '3px',
                                                    padding: '2px 8px',
                                                    fontSize: '12px',
                                                    fontFamily: 'monospace',
                                                    color: '#333',
                                                    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                                                }}
                                            >
                                                {shortcut.key.replace('cmd+', '⌘').replace('ctrl+', 'Ctrl+').replace('shift+', 'Shift+').toUpperCase()}
                                            </kbd>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div style={{ 
                            marginTop: '20px', 
                            padding: '15px', 
                            backgroundColor: '#f0f8ff', 
                            borderRadius: '4px',
                            fontSize: '13px',
                            color: '#555',
                        }}>
                            <strong>💡 Tip:</strong> Press <kbd style={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #ccc', 
                                borderRadius: '3px', 
                                padding: '2px 6px',
                                fontFamily: 'monospace',
                            }}>ESC</kbd> or click outside to close this help overlay.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KeyboardShortcutsManager, KEYBOARD_SHORTCUTS };
}
