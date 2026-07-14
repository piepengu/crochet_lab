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
 * Whether a color still has stash remaining
 * @param {Record<string, number>|null|undefined} quantityConstraints - max squares per color
 * @param {Record<string, number>} usage - current counts
 * @param {string} color
 */
export function hasStashRemaining(quantityConstraints, usage, color) {
  if (!quantityConstraints || quantityConstraints[color] == null) return true
  const max = quantityConstraints[color]
  return (usage[color] || 0) < max
}

/**
 * Check whether stash totals can cover the grid (null/undefined = unlimited for that color)
 * @param {number} cellCount
 * @param {Array<string>} colors
 * @param {Record<string, number>|null|undefined} quantityConstraints
 */
export function isStashFeasible(cellCount, colors, quantityConstraints) {
  if (!quantityConstraints) return true
  let hasUnlimited = false
  let capped = 0
  for (const color of colors) {
    const max = quantityConstraints[color]
    if (max == null) {
      hasUnlimited = true
    } else {
      capped += Math.max(0, max)
    }
  }
  if (hasUnlimited) return true
  return capped >= cellCount
}

/**
 * Sort colors preferring those with more remaining stash (then random among ties)
 */
function orderColorsByStash(colors, quantityConstraints, usage) {
  const shuffled = shuffleArray(colors)
  if (!quantityConstraints) return shuffled

  return shuffled.sort((a, b) => {
    const limA = quantityConstraints[a]
    const limB = quantityConstraints[b]
    const remA = limA == null ? Infinity : limA - (usage[a] || 0)
    const remB = limB == null ? Infinity : limB - (usage[b] || 0)
    return remB - remA
  })
}

/**
 * Generate a valid pattern using random assignment with retries
 *
 * @param {number} gridSize - Size of the grid (assumes square grid)
 * @param {Array<string>} colors - Array of available colors
 * @param {number} maxAttempts - Maximum number of attempts before giving up
 * @param {Record<string, number>|null} [quantityConstraints] - max squares per color (Stash Buster)
 * @returns {{grid: Array<Array<string|null>>, attempts: number, success: boolean}}
 */
export function generateValidPattern(
  gridSize,
  colors,
  maxAttempts = 1000,
  quantityConstraints = null
) {
  const cellCount = gridSize * gridSize
  if (!isStashFeasible(cellCount, colors, quantityConstraints)) {
    return {
      grid: initializeGrid(gridSize, gridSize),
      attempts: 0,
      success: false,
    }
  }

  const grid = initializeGrid(gridSize, gridSize)
  let attempts = 0

  const positions = []
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      positions.push({ row, col })
    }
  }

  while (attempts < maxAttempts) {
    attempts++

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = null
      }
    }

    const usage = {}
    const shuffledPositions = shuffleArray(positions)
    let valid = true

    for (const { row, col } of shuffledPositions) {
      const candidates = orderColorsByStash(colors, quantityConstraints, usage)
      let assigned = false

      for (const color of candidates) {
        if (!hasStashRemaining(quantityConstraints, usage, color)) continue
        if (isValidColoring(grid, row, col, color)) {
          grid[row][col] = color
          usage[color] = (usage[color] || 0) + 1
          assigned = true
          break
        }
      }

      if (!assigned) {
        valid = false
        break
      }
    }

    if (valid && isGridValid(grid)) {
      return { grid, attempts, success: true }
    }
  }

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
