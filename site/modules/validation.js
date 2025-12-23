/**
 * ============================================
 * VALIDATION MODULE
 * ============================================
 * Provides validation and constraints for cabinet dimensions and configurations
 * 
 * FEATURES:
 * - Min/max dimension warnings
 * - Structural integrity checks
 * - Standard size suggestions
 * - Conflict detection (drawer/door overlap)
 */

// Industry standard dimension constraints (in inches)
const DIMENSION_CONSTRAINTS = {
    width: {
        min: 6,           // Minimum practical width
        max: 48,          // Maximum width without center support
        standard: [9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 42, 48], // Standard widths
        warning: 36       // Warn if wider than this without double doors
    },
    height: {
        min: 12,          // Minimum practical height
        max: 96,          // Maximum standard height
        base: [30, 34.5], // Standard base cabinet heights
        wall: [12, 15, 18, 24, 30, 36, 42], // Standard wall cabinet heights
        tall: [84, 90, 96] // Standard tall cabinet heights
    },
    depth: {
        min: 6,           // Minimum practical depth
        max: 30,          // Maximum standard depth
        base: [24],       // Standard base cabinet depth
        wall: [12, 14],   // Standard wall cabinet depth
        tall: [24]        // Standard tall cabinet depth
    },
    drawer: {
        minHeight: 2,     // Minimum drawer height
        maxHeight: 12,    // Maximum practical drawer height
        minGap: 0.125,    // Minimum gap between drawers
        recommended: [4, 6, 8, 10] // Recommended drawer heights
    },
    door: {
        minWidth: 8,      // Minimum door width
        maxWidth: 24,     // Maximum door width without center stile
        minHeight: 12,    // Minimum door height
        gap: 0.125        // Standard reveal/gap
    }
};

/**
 * validateDimension - Validates a single dimension against constraints
 * 
 * @param {string} type - Type of dimension (width, height, depth)
 * @param {number} value - The dimension value to validate
 * @param {string} cabinetType - Type of cabinet (base, wall, tall)
 * @returns {Object} - { isValid, warnings, suggestions }
 */
function validateDimension(type, value, cabinetType = 'base') {
    const constraints = DIMENSION_CONSTRAINTS[type];
    if (!constraints) return { isValid: true, warnings: [], suggestions: [] };
    
    const warnings = [];
    const suggestions = [];
    
    // Check minimum
    if (value < constraints.min) {
        warnings.push(`⚠️ ${type.charAt(0).toUpperCase() + type.slice(1)} is below minimum (${constraints.min}"). This may cause structural issues.`);
    }
    
    // Check maximum
    if (value > constraints.max) {
        warnings.push(`⚠️ ${type.charAt(0).toUpperCase() + type.slice(1)} exceeds maximum (${constraints.max}"). Consider adding center support.`);
    }
    
    // Suggest standard sizes
    if (constraints.standard && constraints.standard.length > 0) {
        const closest = findClosestStandard(value, constraints.standard);
        if (Math.abs(value - closest) > 0.5) {
            suggestions.push(`💡 Consider standard size: ${closest}"`);
        }
    }
    
    // Type-specific suggestions
    if (type === 'height' && cabinetType && constraints[cabinetType]) {
        const typeStandards = constraints[cabinetType];
        const closestTypeStandard = findClosestStandard(value, typeStandards);
        if (Math.abs(value - closestTypeStandard) > 0.5) {
            suggestions.push(`💡 Standard ${cabinetType} height: ${closestTypeStandard}"`);
        }
    }
    
    if (type === 'depth' && cabinetType && constraints[cabinetType]) {
        const typeStandards = constraints[cabinetType];
        const closestTypeStandard = findClosestStandard(value, typeStandards);
        if (Math.abs(value - closestTypeStandard) > 0.5) {
            suggestions.push(`💡 Standard ${cabinetType} depth: ${closestTypeStandard}"`);
        }
    }
    
    const isValid = warnings.length === 0;
    return { isValid, warnings, suggestions };
}

/**
 * findClosestStandard - Finds the closest standard size to a given value
 */
function findClosestStandard(value, standards) {
    return standards.reduce((prev, curr) => 
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
}

/**
 * validateCabinetDimensions - Validates all cabinet dimensions together
 * 
 * @param {Object} cabinet - The cabinet object with width, height, depth
 * @returns {Object} - { isValid, warnings, suggestions }
 */
function validateCabinetDimensions(cabinet) {
    const allWarnings = [];
    const allSuggestions = [];
    
    // Validate each dimension
    const widthCheck = validateDimension('width', cabinet.width);
    const heightCheck = validateDimension('height', cabinet.height, 'base');
    const depthCheck = validateDimension('depth', cabinet.depth, 'base');
    
    allWarnings.push(...widthCheck.warnings, ...heightCheck.warnings, ...depthCheck.warnings);
    allSuggestions.push(...widthCheck.suggestions, ...heightCheck.suggestions, ...depthCheck.suggestions);
    
    // Check proportions
    if (cabinet.height / cabinet.width > 4) {
        allWarnings.push('⚠️ Cabinet is very tall relative to width. Consider adding a nailer or mounting system.');
    }
    
    if (cabinet.depth > cabinet.width) {
        allWarnings.push('⚠️ Cabinet depth exceeds width. This is unusual and may look odd.');
    }
    
    // Wide cabinet door warning
    if (cabinet.width > DIMENSION_CONSTRAINTS.width.warning && cabinet.doors === 1) {
        allSuggestions.push(`💡 Cabinet wider than ${DIMENSION_CONSTRAINTS.width.warning}" should use double doors or multiple doors.`);
    }
    
    const isValid = allWarnings.filter(w => w.startsWith('⚠️')).length === 0;
    return { isValid, warnings: allWarnings, suggestions: allSuggestions };
}

/**
 * validateDrawerConfiguration - Checks drawer heights and positions
 * 
 * @param {Object} cabinet - The cabinet object
 * @returns {Object} - { isValid, warnings, suggestions }
 */
function validateDrawerConfiguration(cabinet) {
    const warnings = [];
    const suggestions = [];
    
    if (!cabinet.drawers || cabinet.drawers.length === 0) {
        return { isValid: true, warnings, suggestions };
    }
    
    const doorStartY = cabinet.toekick ? cabinet.toekickHeight : 0;
    const availableHeight = cabinet.height - doorStartY;
    
    // Check each drawer
    cabinet.drawers.forEach((drawer, index) => {
        // Height check
        if (drawer.height < DIMENSION_CONSTRAINTS.drawer.minHeight) {
            warnings.push(`⚠️ Drawer ${index + 1}: Height (${drawer.height}") is below minimum (${DIMENSION_CONSTRAINTS.drawer.minHeight}").`);
        }
        
        if (drawer.height > DIMENSION_CONSTRAINTS.drawer.maxHeight) {
            warnings.push(`⚠️ Drawer ${index + 1}: Height (${drawer.height}") exceeds recommended maximum (${DIMENSION_CONSTRAINTS.drawer.maxHeight}").`);
        }
        
        // Position check
        if (drawer.startY < doorStartY) {
            warnings.push(`⚠️ Drawer ${index + 1}: Starts below toekick area.`);
        }
        
        if (drawer.startY + drawer.height > cabinet.height) {
            warnings.push(`⚠️ Drawer ${index + 1}: Extends beyond cabinet height.`);
        }
    });
    
    // Check for overlaps
    const sortedDrawers = [...cabinet.drawers].sort((a, b) => a.startY - b.startY);
    for (let i = 0; i < sortedDrawers.length - 1; i++) {
        const current = sortedDrawers[i];
        const next = sortedDrawers[i + 1];
        const gap = next.startY - (current.startY + current.height);
        
        if (gap < 0) {
            warnings.push(`⚠️ Drawers ${i + 1} and ${i + 2} overlap by ${Math.abs(gap).toFixed(2)}".`);
        } else if (gap < DIMENSION_CONSTRAINTS.drawer.minGap) {
            warnings.push(`⚠️ Gap between drawers ${i + 1} and ${i + 2} (${gap.toFixed(3)}") is too small. Minimum: ${DIMENSION_CONSTRAINTS.drawer.minGap}".`);
        }
    }
    
    // Total drawer height check
    const totalDrawerHeight = cabinet.drawers.reduce((sum, d) => sum + d.height, 0);
    const totalGaps = (cabinet.drawers.length + 1) * DIMENSION_CONSTRAINTS.drawer.minGap;
    
    if (totalDrawerHeight + totalGaps > availableHeight) {
        warnings.push(`⚠️ Total drawer height (${totalDrawerHeight.toFixed(1)}") plus gaps exceeds available space (${availableHeight.toFixed(1)}").`);
    }
    
    const isValid = warnings.length === 0;
    return { isValid, warnings, suggestions };
}

/**
 * validateDoorDrawerConflict - Checks for conflicts between doors and drawers
 * 
 * @param {Object} cabinet - The cabinet object
 * @returns {Object} - { isValid, warnings, suggestions }
 */
function validateDoorDrawerConflict(cabinet) {
    const warnings = [];
    const suggestions = [];
    
    const doorStartY = cabinet.toekick ? cabinet.toekickHeight : 0;
    
    // If both doors and drawers exist, check for space conflicts
    if (cabinet.doors > 0 && cabinet.drawers && cabinet.drawers.length > 0) {
        const highestDrawer = Math.max(...cabinet.drawers.map(d => d.startY + d.height));
        const availableSpaceForDoor = cabinet.height - highestDrawer;
        
        if (availableSpaceForDoor < DIMENSION_CONSTRAINTS.door.minHeight) {
            warnings.push(`⚠️ Not enough space for door (${availableSpaceForDoor.toFixed(1)}"). Minimum door height: ${DIMENSION_CONSTRAINTS.door.minHeight}".`);
            suggestions.push('💡 Consider reducing drawer heights or removing a drawer.');
        }
    }
    
    // Check door width vs cabinet width
    if (cabinet.doors > 0) {
        const doorWidth = cabinet.width / cabinet.doors;
        
        if (doorWidth < DIMENSION_CONSTRAINTS.door.minWidth) {
            warnings.push(`⚠️ Each door would be ${doorWidth.toFixed(1)}" wide. Minimum: ${DIMENSION_CONSTRAINTS.door.minWidth}".`);
            suggestions.push('💡 Reduce number of doors or increase cabinet width.');
        }
        
        if (doorWidth > DIMENSION_CONSTRAINTS.door.maxWidth && cabinet.doors === 1) {
            suggestions.push(`💡 Door width (${doorWidth.toFixed(1)}") is wide. Consider using double doors.`);
        }
    }
    
    const isValid = warnings.length === 0;
    return { isValid, warnings, suggestions };
}

/**
 * validateCabinet - Main validation function that runs all checks
 * 
 * @param {Object} cabinet - The cabinet object to validate
 * @returns {Object} - { isValid, warnings, suggestions, errors }
 */
function validateCabinet(cabinet) {
    const dimensionCheck = validateCabinetDimensions(cabinet);
    const drawerCheck = validateDrawerConfiguration(cabinet);
    const conflictCheck = validateDoorDrawerConflict(cabinet);
    
    const allWarnings = [
        ...dimensionCheck.warnings,
        ...drawerCheck.warnings,
        ...conflictCheck.warnings
    ];
    
    const allSuggestions = [
        ...dimensionCheck.suggestions,
        ...drawerCheck.suggestions,
        ...conflictCheck.suggestions
    ];
    
    // Remove duplicates
    const uniqueWarnings = [...new Set(allWarnings)];
    const uniqueSuggestions = [...new Set(allSuggestions)];
    
    // Separate errors (critical) from warnings
    const errors = uniqueWarnings.filter(w => w.includes('extends beyond') || w.includes('overlap'));
    const warnings = uniqueWarnings.filter(w => !errors.includes(w));
    
    const isValid = errors.length === 0;
    
    return {
        isValid,
        errors,
        warnings,
        suggestions: uniqueSuggestions
    };
}

/**
 * getValidationSummary - Gets a text summary of validation results
 * 
 * @param {Object} validationResult - Result from validateCabinet()
 * @returns {string} - Formatted summary text
 */
function getValidationSummary(validationResult) {
    const parts = [];
    
    if (validationResult.errors.length > 0) {
        parts.push('ERRORS:\n' + validationResult.errors.join('\n'));
    }
    
    if (validationResult.warnings.length > 0) {
        parts.push('WARNINGS:\n' + validationResult.warnings.join('\n'));
    }
    
    if (validationResult.suggestions.length > 0) {
        parts.push('SUGGESTIONS:\n' + validationResult.suggestions.join('\n'));
    }
    
    if (parts.length === 0) {
        return '✅ All validations passed!';
    }
    
    return parts.join('\n\n');
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DIMENSION_CONSTRAINTS,
        validateDimension,
        validateCabinetDimensions,
        validateDrawerConfiguration,
        validateDoorDrawerConflict,
        validateCabinet,
        getValidationSummary
    };
}
