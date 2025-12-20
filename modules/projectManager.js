/*
 * ========================================
 * PROJECT MANAGER MODULE
 * ========================================
 * 
 * PURPOSE:
 * This file handles saving and loading your cabinet projects. Think of it like
 * the filing system in your shop - it lets you save your work, come back to it
 * later, and manage multiple projects.
 * 
 * HOW IT SAVES:
 * Uses "localStorage" - a storage area in your web browser. It's like a filing
 * cabinet built into your browser that saves data even after you close the page.
 * 
 * WHAT IT SAVES:
 * - Project name
 * - Date saved
 * - All your cabinets with their dimensions
 * - Material costs
 * - Labor rates
 * 
 * IMPORTANT NOTE:
 * This data is stored in YOUR BROWSER on YOUR COMPUTER. It won't sync between
 * different computers or browsers. If you clear your browser data, the projects
 * will be deleted. For permanent backups, export your projects to files.
 * 
 * DEPENDENCIES (what this file needs):
 * - None! Works independently with the browser's built-in storage
 * 
 * USED BY (what files need this one):
 * - CabinetDesigner.js (calls these functions to save/load projects)
 */

/**
 * saveProjectToStorage - Saves a project to browser storage
 * 
 * WHAT IT DOES:
 * Takes all your project information and stores it in the browser so you
 * can come back to it later. Like saving a Word document - you give it a
 * name and it stores all the information.
 * 
 * HOW IT WORKS:
 * 1. Checks that you gave the project a name (can't save without a name)
 * 2. Bundles up all your project data (cabinets, costs, etc.)
 * 3. Adds the current date so you know when you saved it
 * 4. Checks if a project with this name already exists
 * 5. If it exists, asks if you want to overwrite it
 * 6. Saves it to localStorage (the browser's storage area)
 * 
 * PARAMETERS:
 * @param {string} projectName - The name for this project
 * @param {Array} cabinets - List of all cabinets in the project
 * @param {Object} materialCosts - Cost per sheet/board for each material type
 * @param {number} laborRate - Your hourly labor rate in dollars
 * 
 * RETURNS:
 * true if the save was successful, false if cancelled or failed
 * 
 * EXAMPLE:
 * saveProjectToStorage('Kitchen Remodel', myCabinets, costs, 50);
 */
const saveProjectToStorage = (projectName, cabinets, materialCosts, laborRate) => {
    // CHECK IF NAME IS VALID
    // .trim() removes spaces from the beginning and end
    // If the name is empty or only spaces, alert the user
    if (!projectName.trim()) {
        alert('Please enter a project name!');
        return false;  // Return false means "save failed"
    }
    
    // CREATE THE PROJECT DATA PACKAGE
    // This bundles everything together in one object
    const projectData = {
        name: projectName,
        date: new Date().toISOString(),  // Current date/time in standard format
        cabinets: cabinets,              // All your cabinet data
        materialCosts: materialCosts,    // Cost information
        laborRate: laborRate             // Your hourly rate
    };
    
    // GET EXISTING PROJECTS
    // localStorage.getItem() retrieves data from browser storage
    // '[]' is the default if there are no saved projects yet
    // JSON.parse() converts the stored text back into a usable list
    let savedProjects = JSON.parse(localStorage.getItem('cabinetProjects') || '[]');
    
    // CHECK IF PROJECT NAME ALREADY EXISTS
    // .findIndex() searches through all saved projects
    // It looks for a project with the same name
    const existingIndex = savedProjects.findIndex(p => p.name === projectName);
    
    if (existingIndex >= 0) {
        // Found a project with this name - ask user if they want to overwrite
        if (confirm(`A project named "${projectName}" already exists. Do you want to overwrite it?`)) {
            // User clicked OK - replace the old project with the new one
            savedProjects[existingIndex] = projectData;
        } else {
            // User clicked Cancel - don't save
            return false;
        }
    } else {
        // No existing project with this name - add it to the end of the list
        savedProjects.push(projectData);
    }
    
    // SAVE TO BROWSER STORAGE
    // JSON.stringify() converts the list into text that can be stored
    // localStorage.setItem() saves it to the browser
    // 'cabinetProjects' is the name of the storage location (like a file name)
    localStorage.setItem('cabinetProjects', JSON.stringify(savedProjects));
    
    // Return true to indicate success
    return true;
};

/**
 * loadProjectFromStorage - Loads a project from browser storage
 * 
 * WHAT IT DOES:
 * Retrieves a saved project by its name. Like opening a file from your
 * computer - you specify which one you want and it loads all the data.
 * 
 * HOW IT WORKS:
 * 1. Gets the list of all saved projects from localStorage
 * 2. Searches for the project with the matching name
 * 3. Returns that project's data
 * 
 * PARAMETERS:
 * @param {string} projectName - The name of the project you want to load
 * 
 * RETURNS:
 * The project data object if found, or undefined if not found
 * 
 * WHAT YOU GET BACK:
 * {
 *   name: "Kitchen Remodel",
 *   date: "2025-12-20T10:30:00.000Z",
 *   cabinets: [...],
 *   materialCosts: {...},
 *   laborRate: 50
 * }
 * 
 * EXAMPLE:
 * let myProject = loadProjectFromStorage('Kitchen Remodel');
 * if (myProject) {
 *   // Project found, load it into the app
 * } else {
 *   // Project not found
 * }
 */
const loadProjectFromStorage = (projectName) => {
    // Get all saved projects from browser storage
    const savedProjects = JSON.parse(localStorage.getItem('cabinetProjects') || '[]');
    
    // Search for the project with the matching name
    // .find() returns the first project where the name matches
    // If no match is found, it returns undefined
    return savedProjects.find(p => p.name === projectName);
};

/**
 * getAllSavedProjects - Gets a list of all saved projects
 * 
 * WHAT IT DOES:
 * Retrieves the entire list of saved projects. Use this to show the user
 * a list of all their projects so they can choose which one to load.
 * 
 * HOW IT WORKS:
 * Simply retrieves the full list from localStorage and returns it.
 * 
 * RETURNS:
 * An array (list) of all project objects
 * 
 * EXAMPLE RETURN:
 * [
 *   { name: "Kitchen Remodel", date: "2025-12-20...", cabinets: [...], ... },
 *   { name: "Bathroom Vanity", date: "2025-12-18...", cabinets: [...], ... },
 *   { name: "Living Room Built-ins", date: "2025-12-15...", cabinets: [...], ... }
 * ]
 * 
 * EXAMPLE USE:
 * let allProjects = getAllSavedProjects();
 * allProjects.forEach(project => {
 *   console.log(project.name);  // Display each project name
 * });
 */
const getAllSavedProjects = () => {
    // Get and return the full list of projects
    return JSON.parse(localStorage.getItem('cabinetProjects') || '[]');
};

/**
 * deleteProjectFromStorage - Deletes a project from browser storage
 * 
 * WHAT IT DOES:
 * Permanently removes a project from storage. Like deleting a file - once
 * it's gone, you can't get it back unless you have a backup.
 * 
 * HOW IT WORKS:
 * 1. Gets all saved projects
 * 2. Filters out (removes) the project with the specified name
 * 3. Saves the updated list back to storage
 * 
 * PARAMETERS:
 * @param {string} projectName - The name of the project to delete
 * 
 * EXAMPLE:
 * deleteProjectFromStorage('Old Kitchen Design');
 * 
 * SAFETY NOTE:
 * This function doesn't ask for confirmation - that should be done
 * by the code that calls this function. Always confirm with the user
 * before deleting their work!
 */
const deleteProjectFromStorage = (projectName) => {
    // Get all saved projects
    let savedProjects = JSON.parse(localStorage.getItem('cabinetProjects') || '[]');
    
    // Filter out the project to delete
    // .filter() keeps only projects where the name does NOT match
    // The !== means "is not equal to"
    savedProjects = savedProjects.filter(p => p.name !== projectName);
    
    // Save the updated list back to storage
    localStorage.setItem('cabinetProjects', JSON.stringify(savedProjects));
};

// These functions are now globally available when this script loads
// Other scripts loaded after this one can use:
// saveProjectToStorage, loadProjectFromStorage, getAllSavedProjects, deleteProjectFromStorage
