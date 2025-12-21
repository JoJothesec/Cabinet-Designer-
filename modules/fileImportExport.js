/*
 * ========================================
 * FILE IMPORT/EXPORT MODULE
 * ========================================
 * 
 * PURPOSE:
 * Handles saving projects to downloadable files and loading them back.
 * This is better than browser storage because files can be backed up,
 * shared, and work across different computers.
 * 
 * DEPENDENCIES:
 * - None! Uses browser's built-in File APIs
 * 
 * USED BY:
 * - scripts.js (main app calls these functions)
 */

/**
 * exportProjectToFile - Download project as a .json file
 * 
 * WHAT IT DOES:
 * Takes your project data and creates a downloadable file
 * 
 * PARAMETERS:
 * - projectData: object with {name, cabinets, materialCost, laborRate, etc}
 * - fileName: optional custom name (defaults to project name)
 */
function exportProjectToFile(projectData, fileName = null) {
    try {
        // Create the file name
        const safeName = (fileName || projectData.name || 'cabinet-project')
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase();
        
        const timestamp = new Date().toISOString().split('T')[0];
        const fullFileName = `${safeName}-${timestamp}.json`;
        
        // Add export metadata
        const exportData = {
            ...projectData,
            exportDate: new Date().toISOString(),
            version: '1.0',
            appName: 'Cabinet Designer Pro'
        };
        
        // Convert to JSON string (pretty printed for readability)
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // Create a blob (a file-like object in memory)
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fullFileName;
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        return { success: true, fileName: fullFileName };
        
    } catch (error) {
        console.error('Export error:', error);
        return { 
            success: false, 
            error: 'Failed to export file: ' + error.message 
        };
    }
}

/**
 * importProjectFromFile - Load a project from a .json file
 * 
 * WHAT IT DOES:
 * Opens a file picker, reads the selected file, validates it,
 * and returns the project data
 * 
 * PARAMETERS:
 * - callback: function to call with the project data when loaded
 *   callback will receive: (success, data, errorMessage)
 */
function importProjectFromFile(callback) {
    // Create a hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        
        if (!file) {
            callback(false, null, 'No file selected');
            return;
        }
        
        // Check file extension
        if (!file.name.endsWith('.json')) {
            callback(false, null, 'Please select a .json file');
            return;
        }
        
        try {
            // Read the file
            const text = await file.text();
            const data = JSON.parse(text);
            
            // Validate that it's a cabinet project
            if (!data.cabinets || !Array.isArray(data.cabinets)) {
                callback(false, null, 'Invalid project file: missing cabinets data');
                return;
            }
            
            // Validate each cabinet has required fields
            for (let i = 0; i < data.cabinets.length; i++) {
                const cab = data.cabinets[i];
                if (!cab.width || !cab.height || !cab.depth) {
                    callback(false, null, `Invalid cabinet data at index ${i}`);
                    return;
                }
            }
            
            // Success!
            callback(true, data, null);
            
        } catch (error) {
            if (error instanceof SyntaxError) {
                callback(false, null, 'File is not valid JSON');
            } else {
                callback(false, null, 'Error reading file: ' + error.message);
            }
        }
        
        // Clean up
        document.body.removeChild(input);
    });
    
    // Trigger file picker
    document.body.appendChild(input);
    input.click();
}

/**
 * validateProjectData - Check if project data is valid
 * 
 * WHAT IT DOES:
 * Quick validation check before importing
 * 
 * RETURNS:
 * {valid: true/false, error: 'message if invalid'}
 */
function validateProjectData(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Data is not an object' };
    }
    
    if (!data.cabinets || !Array.isArray(data.cabinets)) {
        return { valid: false, error: 'Missing or invalid cabinets array' };
    }
    
    if (data.cabinets.length === 0) {
        return { valid: false, error: 'Project has no cabinets' };
    }
    
    // Check each cabinet
    for (let i = 0; i < data.cabinets.length; i++) {
        const cab = data.cabinets[i];
        
        if (!cab.width || !cab.height || !cab.depth) {
            return { 
                valid: false, 
                error: `Cabinet ${i + 1} missing dimensions` 
            };
        }
        
        if (cab.width <= 0 || cab.height <= 0 || cab.depth <= 0) {
            return { 
                valid: false, 
                error: `Cabinet ${i + 1} has invalid dimensions` 
            };
        }
    }
    
    return { valid: true };
}
