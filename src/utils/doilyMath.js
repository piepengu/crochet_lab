/**
 * Mathematical functions for Radial Topology (Doily) visualization
 * 
 * These functions calculate stitch counts for different growth patterns
 * in crochet doilies, demonstrating the mathematics behind flat vs. ruffled patterns.
 */

/**
 * Linear growth function - represents a flat plane
 * Each row adds a constant number of stitches
 * 
 * @param {number} row - The row number (1-indexed)
 * @param {number} baseStitches - Base number of stitches per row (default: 6)
 * @returns {number} Total stitches at the given row
 */
export function linearGrowth(row, baseStitches = 6) {
  return baseStitches * row
}

/**
 * Exponential growth function - represents a hyperbolic ruffle
 * Each row multiplies stitches by a factor, creating exponential growth
 * 
 * @param {number} row - The row number (1-indexed)
 * @param {number} multiplier - Growth multiplier per row (default: 1.2)
 * @param {number} baseStitches - Starting number of stitches (default: 6)
 * @returns {number} Total stitches at the given row
 */
export function exponentialGrowth(row, multiplier = 1.2, baseStitches = 6) {
  return baseStitches * Math.pow(multiplier, row - 1)
}

/**
 * Generate data points for chart visualization
 * Creates an array of data points comparing linear, exponential, and adjusted growth patterns
 * 
 * @param {number} maxRows - Maximum number of rows to generate (default: 20)
 * @param {number} multiplier - Growth multiplier for exponential/adjusted calculations (default: 1.0)
 * @param {number} baseStitches - Base number of stitches (default: 6)
 * @returns {Array<{row: number, linear: number, exponential: number, adjusted: number}>}
 *   Array of data points with row number and stitch counts for each growth pattern
 */
export function generateDoilyData(maxRows = 20, multiplier = 1.0, baseStitches = 6) {
  const data = []
  
  for (let row = 1; row <= maxRows; row++) {
    const linear = linearGrowth(row, baseStitches)
    const exponential = exponentialGrowth(row, multiplier, baseStitches)
    
    // Adjusted growth: blend between linear and exponential based on multiplier
    // When multiplier = 1.0, it's purely linear
    // As multiplier increases, it approaches exponential
    const adjusted = multiplier === 1.0 
      ? linear 
      : linear + (exponential - linear) * Math.min((multiplier - 1.0) / 0.5, 1.0)
    
    data.push({
      row,
      linear: Math.round(linear * 100) / 100, // Round to 2 decimal places
      exponential: Math.round(exponential * 100) / 100,
      adjusted: Math.round(adjusted * 100) / 100,
    })
  }
  
  return data
}

/**
 * Calculate the ruffle threshold
 * Determines when exponential growth becomes significantly different from linear
 * 
 * @param {number} threshold - Percentage difference threshold (default: 0.1 = 10%)
 * @param {number} multiplier - Growth multiplier (default: 1.2)
 * @param {number} baseStitches - Base number of stitches (default: 6)
 * @returns {number} Row number where ruffle becomes noticeable
 */
export function calculateRuffleThreshold(threshold = 0.1, multiplier = 1.2, baseStitches = 6) {
  for (let row = 1; row <= 50; row++) {
    const linear = linearGrowth(row, baseStitches)
    const exponential = exponentialGrowth(row, multiplier, baseStitches)
    const difference = Math.abs(exponential - linear) / linear
    
    if (difference >= threshold) {
      return row
    }
  }
  return null // Threshold never reached
}
