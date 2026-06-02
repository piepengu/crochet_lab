import { countColorDistribution } from './graphColoring'

/** Approximate yarn per granny square (grams) — rough planning estimate */
const GRAMS_PER_SQUARE = 8

/**
 * Map palette colors to letter labels (A, B, C, …)
 */
export function buildColorLabels(colors) {
  return colors.map((color, index) => ({
    color,
    label: String.fromCharCode(65 + index),
  }))
}

/**
 * Build row instructions and yarn estimates for PDF export
 */
export function buildPatternExportData(grid, colors, gridSize) {
  const labelEntries = buildColorLabels(colors)
  const colorToLabel = Object.fromEntries(
    labelEntries.map(({ color, label }) => [color, label])
  )

  const rows = grid.map((row, rowIndex) => ({
    rowNumber: rowIndex + 1,
    cells: row.map((c) => colorToLabel[c] || '?'),
    instruction: row.map((c) => colorToLabel[c] || '?').join(', '),
  }))

  const distribution = countColorDistribution(grid)
  const totalSquares = gridSize * gridSize
  const yarnEstimates = labelEntries
    .filter(({ color }) => distribution[color])
    .map(({ color, label }) => {
      const squares = distribution[color] || 0
      return {
        label,
        color,
        squares,
        grams: squares * GRAMS_PER_SQUARE,
        percent: Math.round((squares / totalSquares) * 100),
      }
    })

  const totalGrams = yarnEstimates.reduce((sum, y) => sum + y.grams, 0)

  return {
    grid,
    colors,
    gridSize,
    rows,
    yarnEstimates,
    colorToLabel,
    labelEntries,
    totalSquares,
    totalGrams,
    generatedAt: new Date().toLocaleString(),
  }
}
