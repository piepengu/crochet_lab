import { useState, useCallback } from 'react'
import { RefreshCw, Download, Grid3x3, Square, Grid } from 'lucide-react'
import {
  initializeGrid,
  generateValidPattern,
  isGridValid,
  isValidColoring,
  countColorDistribution,
  findInvalidSquares,
} from '../../utils/graphColoring'

const DEFAULT_COLORS = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12']
const GRID_SIZES = [
  { size: 3, label: '3×3', icon: Grid3x3 },
  { size: 4, label: '4×4', icon: Square },
  { size: 5, label: '5×5', icon: Grid },
]

export default function SquarePermutator() {
  const [gridSize, setGridSize] = useState(3)
  const [grid, setGrid] = useState(() => initializeGrid(3, 3))
  const [colors, setColors] = useState(DEFAULT_COLORS)
  const [attempts, setAttempts] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastSuccess, setLastSuccess] = useState(true)

  // Generate a new pattern
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setAttempts(0)

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const result = generateValidPattern(gridSize, colors, 5000)
      setGrid(result.grid)
      setAttempts(result.attempts)
      setLastSuccess(result.success)
      setIsGenerating(false)
    }, 100)
  }, [gridSize, colors])

  // Handle manual color change
  const handleSquareClick = (row, col) => {
    const newGrid = grid.map((r) => [...r])
    const currentColor = newGrid[row][col]
    const currentIndex = colors.indexOf(currentColor)
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % colors.length
    newGrid[row][col] = colors[nextIndex]

    // Validate the new color
    if (!isValidColoring(newGrid, row, col, colors[nextIndex])) {
      // If invalid, cycle to next color
      const nextNextIndex = (nextIndex + 1) % colors.length
      newGrid[row][col] = colors[nextNextIndex]
    }

    setGrid(newGrid)
  }

  // Handle grid size change
  const handleSizeChange = (newSize) => {
    setGridSize(newSize)
    setGrid(initializeGrid(newSize, newSize))
    setAttempts(0)
    setLastSuccess(true)
  }

  const isValid = isGridValid(grid)
  const invalidSquares = findInvalidSquares(grid)
  const colorDistribution = countColorDistribution(grid)

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-charcoal mb-2">
          Modular Permutations: Graph Coloring Algorithms
        </h2>
        <p className="text-charcoal/70 text-sm">
          Generate valid granny square patterns where no two adjacent squares share the same color
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Grid Display */}
        <div className="lg:col-span-2">
          <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-charcoal">Pattern Grid</h3>
              <div className="flex items-center gap-2">
                {GRID_SIZES.map(({ size, label, icon: Icon }) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      gridSize === size
                        ? 'bg-yarn-blue text-white'
                        : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div
              className="grid gap-2 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                maxWidth: '500px',
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((color, colIndex) => {
                  const isInvalid = invalidSquares.some(
                    (sq) => sq.row === rowIndex && sq.col === colIndex
                  )

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      className={`
                        aspect-square rounded-lg transition-all duration-200
                        ${color ? '' : 'bg-charcoal/5 border-2 border-dashed border-charcoal/20'}
                        ${isInvalid ? 'ring-2 ring-red-500 ring-offset-2' : ''}
                        hover:scale-105 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-yarn-blue focus:ring-offset-2
                      `}
                      style={{
                        backgroundColor: color || undefined,
                      }}
                      aria-label={`Square at row ${rowIndex + 1}, column ${colIndex + 1}, color ${color || 'empty'}`}
                    />
                  )
                })
              )}
            </div>

            {/* Status */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold ${
                    isValid ? 'text-accent-green' : 'text-red-500'
                  }`}
                >
                  {isValid ? '✓ Valid Pattern' : '✗ Invalid Pattern'}
                </span>
                {attempts > 0 && (
                  <span className="text-charcoal/60">
                    Generated in {attempts} attempt{attempts !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {invalidSquares.length > 0 && (
                <span className="text-red-500 text-xs">
                  {invalidSquares.length} conflict{invalidSquares.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Controls & Info */}
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-charcoal mb-4">Controls</h3>
            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yarn-blue text-white rounded-lg hover:bg-yarn-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
                {isGenerating ? 'Generating...' : 'Generate Pattern'}
              </button>

              {!lastSuccess && (
                <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                  Failed to generate valid pattern. Try with fewer colors or smaller grid.
                </div>
              )}
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-charcoal mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-charcoal/20"
                    style={{ backgroundColor: color }}
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...colors]
                      newColors[index] = e.target.value
                      setColors(newColors)
                    }}
                    className="flex-1 h-8 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          {Object.keys(colorDistribution).length > 0 && (
            <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Color Distribution</h3>
              <div className="space-y-2">
                {Object.entries(colorDistribution).map(([color, count]) => (
                  <div key={color} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-charcoal/20"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-charcoal/70">
                        {Math.round((count / (gridSize * gridSize)) * 100)}%
                      </span>
                    </div>
                    <span className="font-mono text-charcoal">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-charcoal mb-2">How it works</h3>
        <ul className="text-xs text-charcoal/70 space-y-1 list-disc list-inside">
          <li>
            Click "Generate Pattern" to create a valid pattern using graph coloring algorithms
          </li>
          <li>Click any square to manually change its color</li>
          <li>
            The algorithm ensures no two adjacent squares (horizontal/vertical) share the same
            color
          </li>
          <li>Invalid patterns are highlighted with red borders</li>
        </ul>
      </div>
    </div>
  )
}
