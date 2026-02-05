/**
 * Graph Coloring Algorithm for Granny Square Pattern Generation
 * 
 * Implements constraint satisfaction for crochet granny square patterns
 * where no two adjacent squares (horizontal/vertical) can have the same color.
 */

/**
 * Check if a color assignment is valid for a given position
 * Valid means no adjacent squares (top, bottom, left, right) have the same color
 * 
 * @param {Array<Array<string|null>>} grid - 2D array representing the grid
 * @param {number} row - Row index of the position to check
 * @param {number} col - Column index of the position to check
 * @param {string} color - Color to check
 * @returns {boolean} True if the color assignment is valid
 */
export function isValidColoring(grid, row, col, color) {
  const rows = grid.length
  const cols = grid[0]?.length || 0

  // Check top neighbor
  if (row > 0 && grid[row - 1][col] === color) {
    return false
  }

  // Check bottom neighbor
  if (row < rows - 1 && grid[row + 1][col] === color) {
    return false
  }

  // Check left neighbor
  if (col > 0 && grid[row][col - 1] === color) {
    return false
  }

  // Check right neighbor
  if (col < cols - 1 && grid[row][col + 1] === color) {
    return false
  }

  return true
}

/**
 * Check if the entire grid has a valid coloring
 * 
 * @param {Array<Array<string|null>>} grid - 2D array representing the grid
 * @returns {boolean} True if all squares have valid colorings
 */
export function isGridValid(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const color = grid[row][col]
      if (color && !isValidColoring(grid, row, col, color)) {
        return false
      }
    }
  }
  return true
}

/**
 * Initialize an empty grid
 * 
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {Array<Array<null>>} Empty grid filled with null
 */
export function initializeGrid(rows, cols) {
  return Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null))
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * 
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate a valid pattern using random assignment with retries
 * Uses a simple approach: randomly assign colors and check validity
 * 
 * @param {number} gridSize - Size of the grid (assumes square grid)
 * @param {Array<string>} colors - Array of available colors
 * @param {number} maxAttempts - Maximum number of attempts before giving up
 * @returns {{grid: Array<Array<string|null>>, attempts: number, success: boolean}}
 */
export function generateValidPattern(gridSize, colors, maxAttempts = 1000) {
  const grid = initializeGrid(gridSize, gridSize)
  let attempts = 0

  // Create a flat array of all positions
  const positions = []
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      positions.push({ row, col })
    }
  }

  while (attempts < maxAttempts) {
    attempts++
    
    // Reset grid
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = null
      }
    }

    // Shuffle positions for random order
    const shuffledPositions = shuffleArray(positions)
    let valid = true

    // Try to assign colors to each position
    for (const { row, col } of shuffledPositions) {
      // Shuffle colors for this position
      const shuffledColors = shuffleArray(colors)
      let assigned = false

      // Try each color until we find a valid one
      for (const color of shuffledColors) {
        if (isValidColoring(grid, row, col, color)) {
          grid[row][col] = color
          assigned = true
          break
        }
      }

      // If we couldn't assign a valid color, this attempt failed
      if (!assigned) {
        valid = false
        break
      }
    }

    // If we successfully assigned all colors, return success
    if (valid && isGridValid(grid)) {
      return { grid, attempts, success: true }
    }
  }

  // If we exhausted all attempts, return failure
  return { grid, attempts, success: false }
}

/**
 * Count color distribution in the grid
 * 
 * @param {Array<Array<string|null>>} grid - 2D array representing the grid
 * @returns {Object} Object with color counts
 */
export function countColorDistribution(grid) {
  const distribution = {}
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const color = grid[row][col]
      if (color) {
        distribution[color] = (distribution[color] || 0) + 1
      }
    }
  }
  
  return distribution
}

/**
 * Find invalid squares in the grid (adjacent squares with same color)
 * 
 * @param {Array<Array<string|null>>} grid - 2D array representing the grid
 * @returns {Array<{row: number, col: number}>} Array of invalid square positions
 */
export function findInvalidSquares(grid) {
  const invalid = []
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const color = grid[row][col]
      if (color && !isValidColoring(grid, row, col, color)) {
        invalid.push({ row, col })
      }
    }
  }
  
  return invalid
}
