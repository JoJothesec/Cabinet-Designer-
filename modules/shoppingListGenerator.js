/*
 * ========================================
 * SHOPPING LIST GENERATOR MODULE
 * ========================================
 * 
 * PURPOSE:
 * This module generates comprehensive shopping lists from cabinet designs,
 * consolidating all materials, hardware, and supplies needed for the project.
 * It optimizes sheet material usage and provides practical purchasing guidance.
 * 
 * FEATURES:
 * - Consolidated hardware list (hinges, slides, pulls)
 * - Sheet material optimization (4x8, 5x5 sheets)
 * - Lumber dimension calculations
 * - Finish materials and supplies
 * - Edgebanding calculations
 * - Standard hardware quantities
 */

// Standard sheet sizes in square feet
const SHEET_SIZES = {
    '4x8': { width: 48, height: 96, area: 32 }, // 32 sq ft
    '5x5': { width: 60, height: 60, area: 25 }, // 25 sq ft
    '4x4': { width: 48, height: 48, area: 16 }  // 16 sq ft
};

// Hardware specifications and pricing estimates
const HARDWARE_SPECS = {
    hinges: {
        'Concealed (Blum)': { priceEach: 3.50, perDoor: 2 },
        'Concealed (Grass)': { priceEach: 3.00, perDoor: 2 },
        'European': { priceEach: 2.50, perDoor: 2 },
        'Butt Hinge': { priceEach: 1.50, perDoor: 2 }
    },
    slides: {
        'Undermount (Blum)': { pricePerPair: 45.00 },
        'Side Mount': { pricePerPair: 15.00 },
        'Center Mount': { pricePerPair: 12.00 },
        'Soft-Close': { pricePerPair: 35.00 }
    },
    pulls: {
        'Bar Pull': { priceEach: 4.50 },
        'Cup Pull': { priceEach: 5.00 },
        'Knob': { priceEach: 3.00 },
        'Edge Pull': { priceEach: 6.50 },
        'Recessed': { priceEach: 8.00 }
    }
};

// Finish materials estimation (per cabinet)
const FINISH_MATERIALS = {
    primer: { coveragePerGallon: 350, pricePerGallon: 35 },
    paint: { coveragePerGallon: 400, pricePerGallon: 45 },
    stain: { coveragePerGallon: 200, pricePerGallon: 30 },
    polyurethane: { coveragePerGallon: 400, pricePerGallon: 40 },
    lacquer: { coveragePerGallon: 350, pricePerGallon: 50 }
};

// Edgebanding specifications (200' rolls)
const EDGEBANDING_SPECS = {
    rollLength: 200, // feet
    pricePerRoll: 25,
    thicknesses: [0.5, 0.75, 1.0]
};

// Miscellaneous supplies
const MISC_SUPPLIES = {
    'Wood Glue (16oz)': { priceEach: 8.00, estimatedQuantity: 1 },
    'Sandpaper Assortment': { priceEach: 15.00, estimatedQuantity: 1 },
    'Wood Filler': { priceEach: 6.00, estimatedQuantity: 1 },
    'Finishing Cloth (pkg)': { priceEach: 10.00, estimatedQuantity: 1 },
    'Masking Tape': { priceEach: 5.00, estimatedQuantity: 1 }
};

/**
 * Calculate total surface area for a cabinet
 * Used for finish material estimation
 */
function calculateCabinetSurfaceArea(cabinet) {
    let totalArea = 0;
    
    // Box exterior surfaces
    // Sides (2)
    totalArea += 2 * (cabinet.depth * cabinet.height);
    // Top and bottom
    totalArea += 2 * (cabinet.width * cabinet.depth);
    // Face frame or front edge
    totalArea += (cabinet.width * cabinet.height);
    
    // Doors
    if (cabinet.door) {
        const doorArea = cabinet.door.width * cabinet.door.height;
        totalArea += doorArea * 2; // Both sides of door
    }
    
    // Drawers
    if (cabinet.drawers && cabinet.drawers.length > 0) {
        cabinet.drawers.forEach(drawer => {
            const drawerFrontArea = (cabinet.width - 2) * drawer.height;
            totalArea += drawerFrontArea * 2; // Both sides
        });
    }
    
    return totalArea / 144; // Convert to square feet
}

/**
 * Calculate edgebanding needed for a cabinet
 * Returns linear feet of edgebanding
 */
function calculateEdgebanding(cabinet) {
    let linearFeet = 0;
    
    // Shelves - all four edges
    if (cabinet.shelves > 0) {
        const shelfWidth = cabinet.width - (cabinet.thickness * 2);
        const shelfDepth = cabinet.depth - 1;
        const perimeterPerShelf = 2 * (shelfWidth + shelfDepth);
        linearFeet += perimeterPerShelf * cabinet.shelves;
    }
    
    // Drawer fronts - top and bottom edges
    if (cabinet.drawers && cabinet.drawers.length > 0) {
        cabinet.drawers.forEach(drawer => {
            const frontWidth = cabinet.width - 2;
            linearFeet += frontWidth * 2; // Top and bottom
        });
    }
    
    // Door edges - all four sides
    if (cabinet.door) {
        const doorPerimeter = 2 * (cabinet.door.width + cabinet.door.height);
        linearFeet += doorPerimeter;
    }
    
    return linearFeet / 12; // Convert inches to feet
}

/**
 * Optimize sheet material purchases
 * Uses a simple bin-packing approach to minimize waste
 */
function optimizeSheetMaterial(totalSquareFeet, sheetType = '4x8') {
    const sheet = SHEET_SIZES[sheetType];
    const sheetsNeeded = Math.ceil(totalSquareFeet / sheet.area);
    const wastePercent = ((sheetsNeeded * sheet.area - totalSquareFeet) / (sheetsNeeded * sheet.area) * 100).toFixed(1);
    
    return {
        sheetSize: sheetType,
        sheetsNeeded,
        totalArea: sheetsNeeded * sheet.area,
        usedArea: totalSquareFeet,
        wasteArea: sheetsNeeded * sheet.area - totalSquareFeet,
        wastePercent
    };
}

/**
 * Main function: Generate comprehensive shopping list
 */
function generateShoppingList(cabinets, materialCosts = {}) {
    const shoppingList = {
        sheetMaterials: {},
        hardware: {
            hinges: {},
            slides: {},
            pulls: {}
        },
        edgebanding: {
            totalLinearFeet: 0,
            rollsNeeded: 0,
            totalCost: 0
        },
        finishMaterials: {
            totalSurfaceArea: 0,
            materials: {}
        },
        miscSupplies: {},
        summary: {
            totalCost: 0,
            itemCount: 0
        }
    };
    
    // === PROCESS EACH CABINET ===
    cabinets.forEach(cabinet => {
        // 1. SHEET MATERIALS
        // Calculate area needed for this cabinet
        const cabinetArea = calculateCabinetArea(cabinet);
        
        Object.entries(cabinetArea).forEach(([material, area]) => {
            if (!shoppingList.sheetMaterials[material]) {
                shoppingList.sheetMaterials[material] = {
                    totalArea: 0,
                    sheets: {},
                    cost: materialCosts[material] || 50 // Default $50/sheet
                };
            }
            shoppingList.sheetMaterials[material].totalArea += area;
        });
        
        // 2. HARDWARE - HINGES
        if (cabinet.door) {
            const hingeType = cabinet.door.hinge || 'Concealed (Blum)';
            if (!shoppingList.hardware.hinges[hingeType]) {
                shoppingList.hardware.hinges[hingeType] = {
                    quantity: 0,
                    priceEach: HARDWARE_SPECS.hinges[hingeType]?.priceEach || 3.00,
                    totalCost: 0
                };
            }
            const hingesPerDoor = HARDWARE_SPECS.hinges[hingeType]?.perDoor || 2;
            shoppingList.hardware.hinges[hingeType].quantity += hingesPerDoor;
        }
        
        // 3. HARDWARE - SLIDES
        if (cabinet.drawers && cabinet.drawers.length > 0) {
            cabinet.drawers.forEach(drawer => {
                const slideType = drawer.slide || 'Undermount (Blum)';
                if (!shoppingList.hardware.slides[slideType]) {
                    shoppingList.hardware.slides[slideType] = {
                        pairs: 0,
                        pricePerPair: HARDWARE_SPECS.slides[slideType]?.pricePerPair || 25.00,
                        totalCost: 0
                    };
                }
                shoppingList.hardware.slides[slideType].pairs += 1;
            });
        }
        
        // 4. HARDWARE - PULLS
        const pullCount = (cabinet.door ? 1 : 0) + (cabinet.drawers ? cabinet.drawers.length : 0);
        if (pullCount > 0) {
            // Get pull type from door or first drawer
            const pullType = cabinet.door?.pull || cabinet.drawers?.[0]?.pull || 'Bar Pull';
            if (!shoppingList.hardware.pulls[pullType]) {
                shoppingList.hardware.pulls[pullType] = {
                    quantity: 0,
                    priceEach: HARDWARE_SPECS.pulls[pullType]?.priceEach || 4.00,
                    totalCost: 0
                };
            }
            shoppingList.hardware.pulls[pullType].quantity += pullCount;
        }
        
        // 5. EDGEBANDING
        shoppingList.edgebanding.totalLinearFeet += calculateEdgebanding(cabinet);
        
        // 6. FINISH MATERIALS
        shoppingList.finishMaterials.totalSurfaceArea += calculateCabinetSurfaceArea(cabinet);
    });
    
    // === OPTIMIZE SHEET MATERIALS ===
    Object.keys(shoppingList.sheetMaterials).forEach(material => {
        const data = shoppingList.sheetMaterials[material];
        const optimization = optimizeSheetMaterial(data.totalArea, '4x8');
        data.sheets = optimization;
        data.totalCost = optimization.sheetsNeeded * data.cost;
        shoppingList.summary.totalCost += data.totalCost;
    });
    
    // === CALCULATE HARDWARE TOTALS ===
    // Hinges
    Object.values(shoppingList.hardware.hinges).forEach(hinge => {
        hinge.totalCost = hinge.quantity * hinge.priceEach;
        shoppingList.summary.totalCost += hinge.totalCost;
        shoppingList.summary.itemCount += hinge.quantity;
    });
    
    // Slides
    Object.values(shoppingList.hardware.slides).forEach(slide => {
        slide.totalCost = slide.pairs * slide.pricePerPair;
        shoppingList.summary.totalCost += slide.totalCost;
        shoppingList.summary.itemCount += slide.pairs;
    });
    
    // Pulls
    Object.values(shoppingList.hardware.pulls).forEach(pull => {
        pull.totalCost = pull.quantity * pull.priceEach;
        shoppingList.summary.totalCost += pull.totalCost;
        shoppingList.summary.itemCount += pull.quantity;
    });
    
    // === EDGEBANDING ===
    shoppingList.edgebanding.rollsNeeded = Math.ceil(
        shoppingList.edgebanding.totalLinearFeet / EDGEBANDING_SPECS.rollLength
    );
    shoppingList.edgebanding.totalCost = 
        shoppingList.edgebanding.rollsNeeded * EDGEBANDING_SPECS.pricePerRoll;
    shoppingList.summary.totalCost += shoppingList.edgebanding.totalCost;
    
    // === FINISH MATERIALS ===
    // Estimate finish materials based on total surface area
    const surfaceArea = shoppingList.finishMaterials.totalSurfaceArea;
    
    // Assume typical finishing process: primer + topcoat
    const primerGallons = Math.ceil(surfaceArea / FINISH_MATERIALS.primer.coveragePerGallon);
    const topcoatGallons = Math.ceil(surfaceArea / FINISH_MATERIALS.polyurethane.coveragePerGallon);
    
    shoppingList.finishMaterials.materials = {
        'Primer': {
            gallons: primerGallons,
            pricePerGallon: FINISH_MATERIALS.primer.pricePerGallon,
            totalCost: primerGallons * FINISH_MATERIALS.primer.pricePerGallon
        },
        'Topcoat (Poly/Lacquer)': {
            gallons: topcoatGallons,
            pricePerGallon: FINISH_MATERIALS.polyurethane.pricePerGallon,
            totalCost: topcoatGallons * FINISH_MATERIALS.polyurethane.pricePerGallon
        }
    };
    
    Object.values(shoppingList.finishMaterials.materials).forEach(material => {
        shoppingList.summary.totalCost += material.totalCost;
    });
    
    // === MISCELLANEOUS SUPPLIES ===
    Object.entries(MISC_SUPPLIES).forEach(([item, spec]) => {
        // Scale quantity based on number of cabinets
        const scaledQuantity = Math.max(spec.estimatedQuantity, Math.ceil(cabinets.length / 3));
        shoppingList.miscSupplies[item] = {
            quantity: scaledQuantity,
            priceEach: spec.priceEach,
            totalCost: scaledQuantity * spec.priceEach
        };
        shoppingList.summary.totalCost += shoppingList.miscSupplies[item].totalCost;
    });
    
    return shoppingList;
}

/**
 * Calculate total sheet material area needed for a cabinet
 * Groups by material type
 */
function calculateCabinetArea(cabinet) {
    const areas = {};
    const material = cabinet.material || 'Oak';
    
    if (!areas[material]) {
        areas[material] = 0;
    }
    
    // Cabinet box
    // Sides (2)
    areas[material] += 2 * ((cabinet.depth * cabinet.height) / 144);
    // Top and bottom (2)
    areas[material] += 2 * ((cabinet.width * cabinet.depth) / 144);
    
    // Back panel (1/4" plywood)
    if (cabinet.backPanel) {
        const backMaterial = 'Plywood (1/4")';
        if (!areas[backMaterial]) {
            areas[backMaterial] = 0;
        }
        areas[backMaterial] += (cabinet.width * cabinet.height) / 144;
    }
    
    // Shelves
    if (cabinet.shelves > 0) {
        const shelfWidth = cabinet.width - (cabinet.thickness * 2);
        const shelfDepth = cabinet.depth - 1;
        areas[material] += cabinet.shelves * ((shelfWidth * shelfDepth) / 144);
    }
    
    // Door
    if (cabinet.door) {
        areas[material] += (cabinet.door.width * cabinet.door.height) / 144;
    }
    
    // Drawer fronts and boxes
    if (cabinet.drawers && cabinet.drawers.length > 0) {
        const drawerBoxMaterial = 'Plywood (1/2")';
        if (!areas[drawerBoxMaterial]) {
            areas[drawerBoxMaterial] = 0;
        }
        
        cabinet.drawers.forEach(drawer => {
            // Drawer front
            const frontWidth = cabinet.width - 2;
            const frontHeight = drawer.height - 0.5;
            areas[material] += (frontWidth * frontHeight) / 144;
            
            // Drawer box (sides, front, back)
            const boxHeight = 4; // Standard 4" drawer box height
            const sideArea = 2 * ((cabinet.depth * boxHeight) / 144);
            const frontBackArea = 2 * (((cabinet.width - 2) * boxHeight) / 144);
            areas[drawerBoxMaterial] += sideArea + frontBackArea;
            
            // Drawer bottom
            const bottomMaterial = 'Plywood (1/4")';
            if (!areas[bottomMaterial]) {
                areas[bottomMaterial] = 0;
            }
            areas[bottomMaterial] += ((cabinet.width - 2) * (cabinet.depth - 2)) / 144;
        });
    }
    
    return areas;
}

/**
 * Export shopping list to CSV format
 */
function exportShoppingListCSV(shoppingList, projectName) {
    let csv = `Shopping List for ${projectName}\n\n`;
    
    // Sheet Materials
    csv += 'SHEET MATERIALS\n';
    csv += 'Material,Total Sq Ft,Sheets Needed,Sheet Size,Waste %,Cost/Sheet,Total Cost\n';
    Object.entries(shoppingList.sheetMaterials).forEach(([material, data]) => {
        csv += `${material},${data.totalArea.toFixed(2)},${data.sheets.sheetsNeeded},${data.sheets.sheetSize},${data.sheets.wastePercent}%,$${data.cost.toFixed(2)},$${data.totalCost.toFixed(2)}\n`;
    });
    csv += '\n';
    
    // Hardware - Hinges
    csv += 'HINGES\n';
    csv += 'Type,Quantity,Price Each,Total Cost\n';
    Object.entries(shoppingList.hardware.hinges).forEach(([type, data]) => {
        csv += `${type},${data.quantity},$${data.priceEach.toFixed(2)},$${data.totalCost.toFixed(2)}\n`;
    });
    csv += '\n';
    
    // Hardware - Slides
    csv += 'DRAWER SLIDES\n';
    csv += 'Type,Pairs Needed,Price/Pair,Total Cost\n';
    Object.entries(shoppingList.hardware.slides).forEach(([type, data]) => {
        csv += `${type},${data.pairs},$${data.pricePerPair.toFixed(2)},$${data.totalCost.toFixed(2)}\n`;
    });
    csv += '\n';
    
    // Hardware - Pulls
    csv += 'PULLS & KNOBS\n';
    csv += 'Type,Quantity,Price Each,Total Cost\n';
    Object.entries(shoppingList.hardware.pulls).forEach(([type, data]) => {
        csv += `${type},${data.quantity},$${data.priceEach.toFixed(2)},$${data.totalCost.toFixed(2)}\n`;
    });
    csv += '\n';
    
    // Edgebanding
    csv += 'EDGEBANDING\n';
    csv += 'Linear Feet,Rolls Needed,Price/Roll,Total Cost\n';
    csv += `${shoppingList.edgebanding.totalLinearFeet.toFixed(1)},${shoppingList.edgebanding.rollsNeeded},$${EDGEBANDING_SPECS.pricePerRoll.toFixed(2)},$${shoppingList.edgebanding.totalCost.toFixed(2)}\n`;
    csv += '\n';
    
    // Finish Materials
    csv += 'FINISH MATERIALS\n';
    csv += 'Material,Gallons,Price/Gallon,Total Cost\n';
    Object.entries(shoppingList.finishMaterials.materials).forEach(([material, data]) => {
        csv += `${material},${data.gallons},$${data.pricePerGallon.toFixed(2)},$${data.totalCost.toFixed(2)}\n`;
    });
    csv += '\n';
    
    // Miscellaneous Supplies
    csv += 'MISCELLANEOUS SUPPLIES\n';
    csv += 'Item,Quantity,Price Each,Total Cost\n';
    Object.entries(shoppingList.miscSupplies).forEach(([item, data]) => {
        csv += `${item},${data.quantity},$${data.priceEach.toFixed(2)},$${data.totalCost.toFixed(2)}\n`;
    });
    csv += '\n';
    
    // Summary
    csv += 'SUMMARY\n';
    csv += `Total Estimated Cost:,$${shoppingList.summary.totalCost.toFixed(2)}\n`;
    csv += `Note: Prices are estimates. Actual costs may vary by supplier and location.\n`;
    
    return csv;
}

/**
 * Export shopping list to printable HTML format
 */
function exportShoppingListHTML(shoppingList, projectName) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Shopping List - ${projectName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; }
                h2 { color: #333; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th { background: #ff6b35; color: white; padding: 10px; text-align: left; }
                td { border: 1px solid #ddd; padding: 8px; }
                tr:nth-child(even) { background: #f9f9f9; }
                .summary { background: #ffe8df; padding: 15px; border-radius: 5px; margin-top: 30px; }
                .summary h2 { margin-top: 0; }
                .cost { font-weight: bold; color: #ff6b35; }
                .note { font-style: italic; color: #666; margin-top: 20px; }
                @media print {
                    body { margin: 20px; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Shopping List for ${projectName}</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            
            <h2>Sheet Materials</h2>
            <table>
                <tr>
                    <th>Material</th>
                    <th>Total Sq Ft</th>
                    <th>Sheets Needed</th>
                    <th>Sheet Size</th>
                    <th>Waste %</th>
                    <th>Cost/Sheet</th>
                    <th>Total Cost</th>
                </tr>
                ${Object.entries(shoppingList.sheetMaterials).map(([material, data]) => `
                    <tr>
                        <td>${material}</td>
                        <td>${data.totalArea.toFixed(2)}</td>
                        <td>${data.sheets.sheetsNeeded}</td>
                        <td>${data.sheets.sheetSize}</td>
                        <td>${data.sheets.wastePercent}%</td>
                        <td class="cost">$${data.cost.toFixed(2)}</td>
                        <td class="cost">$${data.totalCost.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </table>
            
            <h2>Hinges</h2>
            <table>
                <tr>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Price Each</th>
                    <th>Total Cost</th>
                </tr>
                ${Object.entries(shoppingList.hardware.hinges).map(([type, data]) => `
                    <tr>
                        <td>${type}</td>
                        <td>${data.quantity}</td>
                        <td class="cost">$${data.priceEach.toFixed(2)}</td>
                        <td class="cost">$${data.totalCost.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </table>
            
            <h2>Drawer Slides</h2>
            <table>
                <tr>
                    <th>Type</th>
                    <th>Pairs Needed</th>
                    <th>Price/Pair</th>
                    <th>Total Cost</th>
                </tr>
                ${Object.entries(shoppingList.hardware.slides).map(([type, data]) => `
                    <tr>
                        <td>${type}</td>
                        <td>${data.pairs}</td>
                        <td class="cost">$${data.pricePerPair.toFixed(2)}</td>
                        <td class="cost">$${data.totalCost.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </table>
            
            <h2>Pulls & Knobs</h2>
            <table>
                <tr>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Price Each</th>
                    <th>Total Cost</th>
                </tr>
                ${Object.entries(shoppingList.hardware.pulls).map(([type, data]) => `
                    <tr>
                        <td>${type}</td>
                        <td>${data.quantity}</td>
                        <td class="cost">$${data.priceEach.toFixed(2)}</td>
                        <td class="cost">$${data.totalCost.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </table>
            
            <h2>Edgebanding</h2>
            <table>
                <tr>
                    <th>Linear Feet</th>
                    <th>Rolls Needed</th>
                    <th>Price/Roll</th>
                    <th>Total Cost</th>
                </tr>
                <tr>
                    <td>${shoppingList.edgebanding.totalLinearFeet.toFixed(1)}</td>
                    <td>${shoppingList.edgebanding.rollsNeeded}</td>
                    <td class="cost">$${EDGEBANDING_SPECS.pricePerRoll.toFixed(2)}</td>
                    <td class="cost">$${shoppingList.edgebanding.totalCost.toFixed(2)}</td>
                </tr>
            </table>
            
            <h2>Finish Materials</h2>
            <table>
                <tr>
                    <th>Material</th>
                    <th>Gallons</th>
                    <th>Price/Gallon</th>
                    <th>Total Cost</th>
                </tr>
                ${Object.entries(shoppingList.finishMaterials.materials).map(([material, data]) => `
                    <tr>
                        <td>${material}</td>
                        <td>${data.gallons}</td>
                        <td class="cost">$${data.pricePerGallon.toFixed(2)}</td>
                        <td class="cost">$${data.totalCost.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </table>
            
            <h2>Miscellaneous Supplies</h2>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price Each</th>
                    <th>Total Cost</th>
                </tr>
                ${Object.entries(shoppingList.miscSupplies).map(([item, data]) => `
                    <tr>
                        <td>${item}</td>
                        <td>${data.quantity}</td>
                        <td class="cost">$${data.priceEach.toFixed(2)}</td>
                        <td class="cost">$${data.totalCost.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </table>
            
            <div class="summary">
                <h2>Summary</h2>
                <p style="font-size: 1.2em;"><strong>Total Estimated Cost: <span class="cost" style="font-size: 1.3em;">$${shoppingList.summary.totalCost.toFixed(2)}</span></strong></p>
                <p>Surface Area to Finish: ${shoppingList.finishMaterials.totalSurfaceArea.toFixed(1)} sq ft</p>
            </div>
            
            <p class="note">
                <strong>Note:</strong> Prices are estimates based on typical retail costs. 
                Actual prices may vary by supplier, location, and current market conditions. 
                Always verify current pricing before purchasing.
            </p>
            
            <button class="no-print" onclick="window.print()" style="
                background: #ff6b35; 
                color: white; 
                border: none; 
                padding: 12px 24px; 
                font-size: 16px; 
                border-radius: 5px; 
                cursor: pointer;
                margin-top: 20px;
            ">Print Shopping List</button>
        </body>
        </html>
    `;
}
