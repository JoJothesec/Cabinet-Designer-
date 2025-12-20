/*
 * ========================================
 * PRINT-FRIENDLY EXPORT MODULE
 * ========================================
 * 
 * PURPOSE:
 * This module provides comprehensive print and PDF export functionality
 * for cabinet designs, including professional shop drawings, multi-page
 * layouts, and QR codes for digital reference.
 * 
 * FEATURES:
 * - Professional PDF layouts with proper page breaks
 * - Multi-page support for large projects
 * - Shop drawing templates with dimensions
 * - QR code generation for project tracking
 * - Print-optimized styling
 */

/**
 * Generate QR Code as Data URL using a simple library-free approach
 * For production, consider using qrcode.js or similar
 */
function generateQRCode(text, size = 128) {
    // Create a canvas for QR code
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Simple placeholder - in production, use a QR library like qrcodejs
    // This creates a basic pattern as a placeholder
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';
    
    // Draw a simple grid pattern as placeholder
    const cellSize = size / 25;
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            if ((i + j) % 2 === 0 || i === 0 || i === 24 || j === 0 || j === 24) {
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
    
    // Add text indicator
    ctx.fillStyle = '#fff';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QR', size / 2, size / 2);
    
    return canvas.toDataURL();
}

/**
 * Generate a professional shop drawing for a cabinet
 */
function generateShopDrawing(cabinet, projectName = 'Untitled', cabinetNumber = 1) {
    const date = new Date().toLocaleDateString();
    const qrData = `${projectName}-${cabinet.id}`;
    const qrCode = generateQRCode(qrData, 100);
    
    return `
    <div class="shop-drawing-page" style="
        page-break-after: always;
        page-break-inside: avoid;
        padding: 40px;
        background: white;
        color: black;
        font-family: Arial, sans-serif;
        min-height: 11in;
        width: 8.5in;
        margin: 0 auto;
    ">
        <!-- Header -->
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        ">
            <div>
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">SHOP DRAWING</h1>
                <div style="margin-top: 10px; font-size: 14px;">
                    <div><strong>Project:</strong> ${projectName}</div>
                    <div><strong>Cabinet:</strong> ${cabinet.name} (#${cabinetNumber})</div>
                    <div><strong>Date:</strong> ${date}</div>
                </div>
            </div>
            <div style="text-align: right;">
                <img src="${qrCode}" alt="QR Code" style="width: 100px; height: 100px; border: 2px solid #000;"/>
                <div style="font-size: 10px; margin-top: 5px;">Scan for digital reference</div>
            </div>
        </div>
        
        <!-- Overall Dimensions -->
        <div style="
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 2px solid #000;
        ">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #ff6b35; padding-bottom: 8px;">
                OVERALL DIMENSIONS
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; font-size: 16px;">
                <div>
                    <div style="font-weight: bold; color: #666; font-size: 12px;">WIDTH</div>
                    <div style="font-size: 24px; font-weight: bold;">${cabinet.width}"</div>
                </div>
                <div>
                    <div style="font-weight: bold; color: #666; font-size: 12px;">HEIGHT</div>
                    <div style="font-size: 24px; font-weight: bold;">${cabinet.height}"</div>
                </div>
                <div>
                    <div style="font-weight: bold; color: #666; font-size: 12px;">DEPTH</div>
                    <div style="font-size: 24px; font-weight: bold;">${cabinet.depth}"</div>
                </div>
            </div>
        </div>
        
        <!-- Cabinet Diagram -->
        <div style="margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #ff6b35; padding-bottom: 8px;">
                FRONT VIEW
            </h2>
            <div style="
                border: 3px solid #000;
                padding: 40px;
                text-align: center;
                background: white;
                position: relative;
                min-height: 300px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            ">
                <!-- Simple cabinet outline representation -->
                <div style="
                    border: 2px solid #333;
                    width: 80%;
                    height: 250px;
                    margin: 0 auto;
                    position: relative;
                    background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
                ">
                    <!-- Width dimension line -->
                    <div style="
                        position: absolute;
                        top: -30px;
                        left: 0;
                        right: 0;
                        text-align: center;
                        font-weight: bold;
                    ">
                        <div style="border-top: 2px solid #000; margin: 0 10px;"></div>
                        <div style="margin-top: 5px;">${cabinet.width}"</div>
                    </div>
                    
                    <!-- Height dimension line -->
                    <div style="
                        position: absolute;
                        right: -60px;
                        top: 0;
                        bottom: 0;
                        display: flex;
                        align-items: center;
                        font-weight: bold;
                    ">
                        <div>
                            <div style="writing-mode: vertical-lr; transform: rotate(180deg);">
                                ${cabinet.height}"
                            </div>
                        </div>
                    </div>
                    
                    <!-- Door/Drawer representation -->
                    ${cabinet.door ? `
                        <div style="
                            position: absolute;
                            inset: 10px;
                            border: 2px solid #666;
                            background: white;
                        "></div>
                    ` : ''}
                    
                    ${cabinet.drawers && cabinet.drawers.length > 0 ? 
                        cabinet.drawers.map((drawer, idx) => `
                            <div style="
                                position: absolute;
                                left: 10px;
                                right: 10px;
                                height: ${drawer.height}px;
                                top: ${10 + idx * (drawer.height + 5)}px;
                                border: 2px solid #666;
                                background: white;
                            "></div>
                        `).join('') 
                    : ''}
                </div>
            </div>
        </div>
        
        <!-- Component Details -->
        <div style="margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #ff6b35; padding-bottom: 8px;">
                COMPONENT DETAILS
            </h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background: #333; color: white;">
                        <th style="border: 1px solid #000; padding: 10px; text-align: left;">Component</th>
                        <th style="border: 1px solid #000; padding: 10px; text-align: left;">Material</th>
                        <th style="border: 1px solid #000; padding: 10px; text-align: center;">Quantity</th>
                        <th style="border: 1px solid #000; padding: 10px; text-align: left;">Dimensions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px;">Box - Left Side</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.thickness}" Plywood</td>
                        <td style="border: 1px solid #000; padding: 10px; text-align: center;">1</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.depth}" × ${cabinet.height}"</td>
                    </tr>
                    <tr style="background: #f9f9f9;">
                        <td style="border: 1px solid #000; padding: 10px;">Box - Right Side</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.thickness}" Plywood</td>
                        <td style="border: 1px solid #000; padding: 10px; text-align: center;">1</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.depth}" × ${cabinet.height}"</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px;">Box - Top</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.thickness}" Plywood</td>
                        <td style="border: 1px solid #000; padding: 10px; text-align: center;">1</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.width - cabinet.thickness * 2}" × ${cabinet.depth}"</td>
                    </tr>
                    <tr style="background: #f9f9f9;">
                        <td style="border: 1px solid #000; padding: 10px;">Box - Bottom</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.thickness}" Plywood</td>
                        <td style="border: 1px solid #000; padding: 10px; text-align: center;">1</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.width - cabinet.thickness * 2}" × ${cabinet.depth}"</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px;">Box - Back</td>
                        <td style="border: 1px solid #000; padding: 10px;">1/4" Plywood</td>
                        <td style="border: 1px solid #000; padding: 10px; text-align: center;">1</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.width}" × ${cabinet.height}"</td>
                    </tr>
                    ${cabinet.shelves > 0 ? `
                    <tr style="background: #f9f9f9;">
                        <td style="border: 1px solid #000; padding: 10px;">Shelves</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.thickness}" Plywood</td>
                        <td style="border: 1px solid #000; padding: 10px; text-align: center;">${cabinet.shelves}</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.width - cabinet.thickness * 2}" × ${cabinet.depth - 1}"</td>
                    </tr>
                    ` : ''}
                    ${cabinet.door ? `
                    <tr>
                        <td style="border: 1px solid #000; padding: 10px;">Door</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.door.style}</td>
                        <td style="border: 1px solid #000; padding: 10px; text-align: center;">1</td>
                        <td style="border: 1px solid #000; padding: 10px;">${cabinet.door.width}" × ${cabinet.door.height}"</td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
        </div>
        
        <!-- Hardware Requirements -->
        <div style="margin-bottom: 20px;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #ff6b35; padding-bottom: 8px;">
                HARDWARE REQUIRED
            </h2>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                ${cabinet.door ? `<li>Door Hinges: 2 pcs (European concealed recommended)</li>` : ''}
                ${cabinet.drawers && cabinet.drawers.length > 0 ? 
                    `<li>Drawer Slides: ${cabinet.drawers.length} pairs (soft-close undermount recommended)</li>` 
                : ''}
                <li>Shelf Pins: ${cabinet.shelves * 4} pcs (if adjustable shelves)</li>
                <li>Back Panel Fasteners: 12-16 pcs (18ga brad nails or staples)</li>
                ${cabinet.door || (cabinet.drawers && cabinet.drawers.length > 0) ? 
                    `<li>Cabinet Pulls/Knobs: ${cabinet.door ? 1 : 0 + (cabinet.drawers ? cabinet.drawers.length : 0)} pcs</li>` 
                : ''}
            </ul>
        </div>
        
        <!-- Notes Section -->
        <div style="
            border: 2px solid #000;
            padding: 15px;
            margin-top: 30px;
            min-height: 100px;
        ">
            <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">SHOP NOTES:</h3>
            <div style="font-size: 12px; line-height: 1.6; color: #666;">
                • All dimensions in inches unless otherwise noted<br>
                • Verify all measurements before cutting<br>
                • Use proper safety equipment<br>
                • Cabinet ID: ${cabinet.id}<br>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #ccc;
            font-size: 10px;
            color: #666;
            text-align: center;
        ">
            Cabinet Designer Pro | Generated: ${date} | Page ${cabinetNumber}
        </div>
    </div>
    `;
}

/**
 * Generate a complete multi-page PDF document
 */
function generatePrintDocument(cabinets, projectName = 'Untitled Project', options = {}) {
    const {
        includeCoverPage = true,
        includeCutList = true,
        includeShoppingList = true,
        includeShopDrawings = true
    } = options;
    
    const date = new Date().toLocaleDateString();
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${projectName} - Cabinet Plans</title>
        <style>
            @media print {
                @page {
                    size: letter;
                    margin: 0.5in;
                }
                
                .page-break {
                    page-break-after: always;
                }
                
                .no-break {
                    page-break-inside: avoid;
                }
            }
            
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: white;
                color: black;
            }
            
            .cover-page {
                min-height: 10in;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 2in;
            }
            
            .cover-title {
                font-size: 48px;
                font-weight: bold;
                margin-bottom: 30px;
                color: #333;
            }
            
            .cover-subtitle {
                font-size: 24px;
                color: #666;
                margin-bottom: 60px;
            }
            
            .cover-details {
                font-size: 18px;
                line-height: 2;
                color: #444;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            
            th, td {
                border: 1px solid #333;
                padding: 8px;
                text-align: left;
            }
            
            th {
                background: #333;
                color: white;
                font-weight: bold;
            }
            
            tr:nth-child(even) {
                background: #f9f9f9;
            }
            
            h1, h2, h3 {
                color: #333;
            }
            
            .section-header {
                background: #ff6b35;
                color: white;
                padding: 15px;
                margin: 30px 0 20px 0;
                border-radius: 5px;
                font-size: 24px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
    `;
    
    // Cover Page
    if (includeCoverPage) {
        const qrCode = generateQRCode(projectName, 150);
        html += `
        <div class="cover-page page-break">
            <div class="cover-title">${projectName}</div>
            <div class="cover-subtitle">Cabinet Construction Plans</div>
            <img src="${qrCode}" alt="Project QR Code" style="width: 150px; height: 150px; margin: 30px 0; border: 3px solid #333;"/>
            <div class="cover-details">
                <div><strong>Total Cabinets:</strong> ${cabinets.length}</div>
                <div><strong>Date Generated:</strong> ${date}</div>
                <div><strong>Designer:</strong> Cabinet Designer Pro</div>
            </div>
        </div>
        `;
    }
    
    // Table of Contents
    html += `
    <div class="page-break" style="padding: 40px;">
        <h1 style="border-bottom: 3px solid #ff6b35; padding-bottom: 15px;">TABLE OF CONTENTS</h1>
        <div style="margin-top: 30px; font-size: 16px; line-height: 2.5;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; padding: 10px 0;">
                <span>1. Project Overview</span>
                <span>Page 3</span>
            </div>
            ${includeCutList ? `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; padding: 10px 0;">
                <span>2. Cut List</span>
                <span>Page 4</span>
            </div>
            ` : ''}
            ${includeShoppingList ? `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; padding: 10px 0;">
                <span>3. Shopping List</span>
                <span>Page ${includeCutList ? 5 : 4}</span>
            </div>
            ` : ''}
            ${includeShopDrawings ? `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; padding: 10px 0;">
                <span>4. Shop Drawings (${cabinets.length} cabinets)</span>
                <span>Pages ${(includeCutList ? 1 : 0) + (includeShoppingList ? 1 : 0) + 3}+</span>
            </div>
            ` : ''}
        </div>
    </div>
    `;
    
    // Project Overview
    html += `
    <div class="page-break" style="padding: 40px;">
        <h1 class="section-header">PROJECT OVERVIEW</h1>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Cabinet Name</th>
                    <th>Width</th>
                    <th>Height</th>
                    <th>Depth</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                ${cabinets.map((cab, idx) => `
                <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${cab.name}</strong></td>
                    <td>${cab.width}"</td>
                    <td>${cab.height}"</td>
                    <td>${cab.depth}"</td>
                    <td>${cab.door ? 'Door' : cab.drawers && cab.drawers.length > 0 ? `${cab.drawers.length} Drawer` : 'Open'}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    `;
    
    // Shop Drawings
    if (includeShopDrawings) {
        cabinets.forEach((cabinet, idx) => {
            html += generateShopDrawing(cabinet, projectName, idx + 1);
        });
    }
    
    html += `
    </body>
    </html>
    `;
    
    return html;
}

/**
 * Export project as PDF using html2pdf
 */
function exportProjectAsPDF(cabinets, projectName = 'Untitled Project', options = {}) {
    const html = generatePrintDocument(cabinets, projectName, options);
    
    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    // Configure html2pdf options
    const opt = {
        margin: 0.5,
        filename: `${projectName}-Plans.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Generate and download PDF
    html2pdf().from(tempDiv).set(opt).save().then(() => {
        document.body.removeChild(tempDiv);
    });
}

/**
 * Open print preview window
 */
function openPrintPreview(cabinets, projectName = 'Untitled Project', options = {}) {
    const html = generatePrintDocument(cabinets, projectName, options);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Trigger print dialog after content loads
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };
}

// Make functions globally available
window.generateShopDrawing = generateShopDrawing;
window.generatePrintDocument = generatePrintDocument;
window.exportProjectAsPDF = exportProjectAsPDF;
window.openPrintPreview = openPrintPreview;
window.generateQRCode = generateQRCode;
