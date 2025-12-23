/*
 * ========================================
 * MEASUREMENTS MODULE
 * ========================================
 * 
 * PURPOSE:
 * This file handles all measurement conversions for the cabinet designer.
 * In carpentry, we often work with fractions (like 1 1/2" or 3/4"), but 
 * computers prefer decimal numbers (like 1.5 or 0.75). This file converts 
 * between these two formats so you can input measurements naturally and 
 * the program can calculate with them accurately.
 * 
 * WHAT IT DOES:
 * - Converts fractions to decimals (3/4" becomes 0.75)
 * - Converts decimals back to fractions (0.75 becomes 3/4")
 * - Handles mixed numbers (1 1/2" becomes 1.5)
 * - Formats measurements nicely for display
 * 
 * DEPENDENCIES (what this file needs):
 * - None! This file works completely on its own
 * 
 * USED BY (what files need this one):
 * - cabinetClasses.js (for cabinet dimensions)
 * - CabinetDesigner.js (for displaying measurements to you)
 * 
 */

/**
 * parseFraction - Converts user input into a decimal number
 * 
 * WHAT IT DOES:
 * Takes any measurement input (like "3/4", "1 1/2", or "36.5") and converts 
 * it to a decimal number that the computer can use for calculations.
 * 
 * HOW IT WORKS:
 * 1. First checks if it's already a number - if so, just returns it
 * 2. Removes any quote marks (") that might be in the input
 * 3. Tries to match different patterns:
 *    - Mixed fractions like "1 1/2" (a whole number + a fraction)
 *    - Simple fractions like "3/4"
 *    - Decimal numbers like "36.5"
 * 4. Does the math to convert fractions to decimals
 * 
 * EXAMPLE:
 * Input: "1 1/2"  → Output: 1.5
 * Input: "3/4"    → Output: 0.75
 * Input: "36.5"   → Output: 36.5
 * Input: ""       → Output: 0
 */
function parseFraction(input) {
    // If it's already a number, we're done - just return it
    if (typeof input === 'number') return input;
    
    // Convert to text and remove extra spaces at the beginning/end
    input = String(input).trim();
    
    // Remove any double quote marks (") that carpenters often use
    // Example: '3/4"' becomes '3/4'
    input = input.replace(/"/g, '').trim();
    
    // If the user entered nothing, return zero
    if (input === '') return 0;
    
    // If it's already a decimal number (like "36.5"), convert and return it
    // isNaN means "is Not a Number" - so !isNaN means "IS a number"
    if (!isNaN(input)) return parseFloat(input);
    
    // Try to match mixed fractions like "1 1/2" or "36 3/8"
    // This pattern looks for: [number] [space] [number]/[number]
    // The parentheses () capture each part so we can use them
    const mixedMatch = input.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
        // mixedMatch[1] is the whole number part (like the "1" in "1 1/2")
        const whole = parseInt(mixedMatch[1]);
        // mixedMatch[2] is the top of the fraction (numerator - like the "1" in "1/2")
        const num = parseInt(mixedMatch[2]);
        // mixedMatch[3] is the bottom of the fraction (denominator - like the "2" in "1/2")
        const den = parseInt(mixedMatch[3]);
        // Add the whole number to the fraction result
        // Example: 1 + (1/2) = 1 + 0.5 = 1.5
        return whole + (num / den);
    }
    
    // Try to match simple fractions like "3/4" or "1/2"
    // This pattern looks for: [number]/[number]
    const fracMatch = input.match(/^(\d+)\/(\d+)$/);
    if (fracMatch) {
        // fracMatch[1] is the top number (numerator)
        const num = parseInt(fracMatch[1]);
        // fracMatch[2] is the bottom number (denominator)
        const den = parseInt(fracMatch[2]);
        // Divide to get the decimal
        // Example: 3/4 = 3 ÷ 4 = 0.75
        return num / den;
    }
    
    // If nothing matched, try one more time to parse as a decimal
    // If that fails too, return 0
    return parseFloat(input) || 0;
}

/**
 * decimalToFraction - Converts a decimal number back to a fraction
 * 
 * WHAT IT DOES:
 * Takes a decimal number (like 1.5 or 0.75) and converts it back to
 * a fraction format that carpenters are familiar with (like 1 1/2" or 3/4").
 * 
 * HOW IT WORKS:
 * 1. Separates the whole inches from the fractional part
 *    Example: 1.5 → whole=1, fraction=0.5
 * 2. Converts the fraction to 32nds (because cabinets use down to 1/32")
 *    Example: 0.5 × 32 = 16, so we have 16/32
 * 3. Simplifies the fraction by finding common divisors
 *    Example: 16/32 simplifies to 1/2
 * 4. Formats it nicely with the inch symbol (")
 * 
 * WHY 32NDS?
 * Cabinet work typically uses measurements down to 1/32 of an inch.
 * This is precise enough for woodworking without being overly complicated.
 * 
 * EXAMPLE:
 * Input: 1.5    → Output: 1 1/2"
 * Input: 0.75   → Output: 3/4"
 * Input: 2.375  → Output: 2 3/8"
 * Input: 5      → Output: 5"
 */
function decimalToFraction(decimal) {
    // Get the whole number of inches by rounding down
    // Example: 1.75 → wholeInches = 1
    const wholeInches = Math.floor(decimal);
    
    // Get just the fractional part (the part after the decimal point)
    // Example: 1.75 - 1 = 0.75
    const fraction = decimal - wholeInches;
    
    // Convert the fraction to 32nds by multiplying by 32 and rounding
    // Example: 0.75 × 32 = 24, so we have 24/32
    const thirtySeconds = Math.round(fraction * 32);
    
    // Start with the fraction as 32nds
    let num = thirtySeconds;  // numerator (top number)
    let den = 32;             // denominator (bottom number)
    
    // If there's no fractional part
    if (num === 0) {
        // If we have whole inches, show them
        if (wholeInches > 0) return `${wholeInches}"`;
        // Otherwise just show zero
        return '0"';
    }
    
    // SIMPLIFY THE FRACTION
    // This finds the "Greatest Common Divisor" - the largest number that 
    // divides evenly into both the top and bottom of the fraction
    // Example: for 16/32, the GCD is 16, so 16÷16=1 and 32÷16=2, giving us 1/2
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(num, den);
    num = num / divisor;
    den = den / divisor;
    
    // BUILD THE RESULT STRING
    let result = '';
    
    // If we have whole inches, add them first
    if (wholeInches > 0) result += `${wholeInches}`;
    
    // If we have a fractional part
    if (num > 0) {
        // Add a space if we already have whole inches
        if (wholeInches > 0) result += ` ${num}/${den}"`;
        // Otherwise just add the fraction
        else result += `${num}/${den}"`;
    } else {
        // Just whole inches, add the inch symbol
        result += '"';
    }
    
    // Remove any extra spaces and return
    return result.trim();
}

/**
 * formatMeasurement - Formats a measurement for display
 * 
 * WHAT IT DOES:
 * Takes a decimal measurement and shows it in both fractional and decimal
 * format so you can see it the way you're comfortable with.
 * 
 * WHY BOTH FORMATS?
 * - Fractions are easier to measure with a tape measure
 * - Decimals are useful when working with design software or doing math
 * 
 * EXAMPLE:
 * Input: 1.5   → Output: "1 1/2" (1.500")"
 * Input: 0.75  → Output: "3/4" (0.750")"
 */
function formatMeasurement(decimal) {
    // If the measurement is zero or negative, just return zero
    if (decimal <= 0) return '0"';
    
    // Convert the decimal to a fraction
    const fraction = decimalToFraction(decimal);
    
    // Return both formats: fraction (decimal)
    // The .toFixed(3) shows exactly 3 decimal places
    return `${fraction} (${decimal.toFixed(3)}")`;
}

// These functions are now globally available when this script loads
// Other scripts loaded after this one can use: parseFraction, decimalToFraction, formatMeasurement
