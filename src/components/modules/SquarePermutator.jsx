import { useState, useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { RefreshCw, Grid3x3, Square, Grid, Download } from 'lucide-react'
import StitchDivider from '../shared/StitchDivider'
import YarnSpinner from '../shared/YarnSpinner'
import {
  initializeGrid,
  generateValidPattern,
  isGridValid,
  isValidColoring,
  countColorDistribution,
  findInvalidSquares,
  isStashFeasible,
} from '../../utils/graphColoring'

const DEFAULT_COLORS = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12']
const COLOR_LABELS = ['A', 'B', 'C', 'D']
const GRID_SIZES = [
  { size: 3, label: '3×3', icon: Grid3x3 },
  { size: 4, label: '4×4', icon: Square },
  { size: 5, label: '5×5', icon: Grid },
]

function defaultStashLimits(colors, cellCount) {
  // Abundant → scarce: first colors get more of the stash
  return colors.map((_, i) => {
    if (i === 0) return cellCount
    if (i === 1) return Math.max(1, Math.ceil(cellCount * 0.45))
    if (i === 2) return Math.max(1, Math.ceil(cellCount * 0.35))
    return Math.max(1, Math.ceil(cellCount * 0.25))
  })
}

export default function SquarePermutator() {
  const [gridSize, setGridSize] = useState(3)
  const [grid, setGrid] = useState(() => initializeGrid(3, 3))
  const [colors, setColors] = useState(DEFAULT_COLORS)
  const [attempts, setAttempts] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState(null)
  const [lastSuccess, setLastSuccess] = useState(true)
  const [stashEnabled, setStashEnabled] = useState(false)
  const [stashLimits, setStashLimits] = useState(() =>
    defaultStashLimits(DEFAULT_COLORS, 9)
  )

  const cellCount = gridSize * gridSize

  const quantityConstraints = useMemo(() => {
    if (!stashEnabled) return null
    const map = {}
    colors.forEach((color, i) => {
      map[color] = stashLimits[i] ?? cellCount
    })
    return map
  }, [stashEnabled, colors, stashLimits, cellCount])

  const stashFeasible = isStashFeasible(cellCount, colors, quantityConstraints)

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    setAttempts(0)

    setTimeout(() => {
      const result = generateValidPattern(gridSize, colors, 5000, quantityConstraints)
      setGrid(result.grid)
      setAttempts(result.attempts)
      setLastSuccess(result.success)
      setIsGenerating(false)
    }, 100)
  }, [gridSize, colors, quantityConstraints])

  const handleSquareClick = (row, col) => {
    const newGrid = grid.map((r) => [...r])
    const currentColor = newGrid[row][col]
    const currentIndex = colors.indexOf(currentColor)
    let nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % colors.length

    for (let tryCount = 0; tryCount < colors.length; tryCount++) {
      const candidate = colors[nextIndex]
      newGrid[row][col] = candidate

      if (!isValidColoring(newGrid, row, col, candidate)) {
        nextIndex = (nextIndex + 1) % colors.length
        continue
      }

      if (stashEnabled && quantityConstraints) {
        const usage = countColorDistribution(newGrid)
        const max = quantityConstraints[candidate]
        if (max != null && (usage[candidate] || 0) > max) {
          nextIndex = (nextIndex + 1) % colors.length
          continue
        }
      }

      setGrid(newGrid)
      return
    }
  }

  const handleSizeChange = (newSize) => {
    setGridSize(newSize)
    setGrid(initializeGrid(newSize, newSize))
    setAttempts(0)
    setLastSuccess(true)
    const cells = newSize * newSize
    setStashLimits((prev) =>
      colors.map((_, i) => Math.min(prev[i] ?? cells, cells) || defaultStashLimits(colors, cells)[i])
    )
  }

  const handleStashToggle = (enabled) => {
    setStashEnabled(enabled)
    if (enabled) {
      setStashLimits(defaultStashLimits(colors, cellCount))
    }
  }

  const handleStashLimitChange = (index, value) => {
    const parsed = Number.parseInt(value, 10)
    const next = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(cellCount, parsed))
    setStashLimits((prev) => {
      const copy = [...prev]
      copy[index] = next
      return copy
    })
  }

  const isValid = isGridValid(grid)
  const invalidSquares = findInvalidSquares(grid)
  const colorDistribution = countColorDistribution(grid)
  const hasPattern = grid.some((row) => row.some((c) => c != null))

  const stashViolations = useMemo(() => {
    if (!stashEnabled || !quantityConstraints) return []
    return colors.filter((color) => {
      const used = colorDistribution[color] || 0
      const max = quantityConstraints[color]
      return max != null && used > max
    })
  }, [stashEnabled, quantityConstraints, colors, colorDistribution])

  const handleDownloadPdf = useCallback(async () => {
    if (!hasPattern) return
    setIsExporting(true)
    setExportMessage(null)
    try {
      const { downloadPatternPdf } = await import('../../utils/downloadPatternPdf')
      await downloadPatternPdf(grid, colors, gridSize, isValid)
      setExportMessage({ type: 'success', text: 'PDF downloaded — check your Downloads folder.' })
    } catch (err) {
      console.error('PDF export failed:', err)
      setExportMessage({
        type: 'error',
        text: 'PDF export failed. Try again or use a desktop browser.',
      })
    } finally {
      setIsExporting(false)
    }
  }, [grid, colors, gridSize, isValid, hasPattern])

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-normal text-charcoal mb-2">
          Modular Permutations
        </h2>
        <p className="text-charcoal/60 text-sm max-w-2xl">
          Generate valid granny square patterns where no two adjacent squares share the same color.
          Optionally limit yarn with Stash Buster.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white/80 border border-charcoal/10 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-charcoal">Pattern Grid</h3>
              <div className="flex items-center gap-2">
                {GRID_SIZES.map(({ size, label, icon: Icon }) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    aria-pressed={gridSize === size}
                    aria-label={`Set grid size to ${label}`}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2',
                      gridSize === size
                        ? 'bg-yarn-blue text-white shadow-md ring-2 ring-yarn-blue/30'
                        : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10 hover:text-charcoal'
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="mx-auto cursor-hook"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: '8px',
                maxWidth: '400px',
                width: '100%',
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
                        cursor-hook rounded-lg transition-all duration-200
                        ${color ? '' : 'bg-charcoal/5 border-2 border-dashed border-charcoal/20'}
                        ${isInvalid ? 'ring-2 ring-red-500 ring-offset-2' : ''}
                        hover:scale-105 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-yarn-blue focus:ring-offset-2
                      `}
                      style={{
                        background: color
                          ? `radial-gradient(circle at 35% 35%, color-mix(in srgb, ${color} 85%, white), ${color})`
                          : undefined,
                        aspectRatio: '1 / 1',
                        width: '100%',
                        minHeight: '60px',
                      }}
                      aria-label={`Square at row ${rowIndex + 1}, column ${colIndex + 1}, color ${color || 'empty'}`}
                    />
                  )
                })
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className={`font-semibold ${
                    isValid && stashViolations.length === 0
                      ? 'text-accent-green'
                      : 'text-red-500'
                  }`}
                >
                  {isValid && stashViolations.length === 0
                    ? '✓ Valid Pattern'
                    : '✗ Invalid Pattern'}
                </span>
                {attempts > 0 && (
                  <span className="text-charcoal/60">
                    Generated in {attempts} attempt{attempts !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {(invalidSquares.length > 0 || stashViolations.length > 0) && (
                <span className="text-red-500 text-xs">
                  {invalidSquares.length > 0 &&
                    `${invalidSquares.length} adjacency conflict${invalidSquares.length !== 1 ? 's' : ''}`}
                  {invalidSquares.length > 0 && stashViolations.length > 0 && ' · '}
                  {stashViolations.length > 0 &&
                    `${stashViolations.length} over stash`}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/80 border border-charcoal/10 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-charcoal mb-4">Controls</h3>
            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (stashEnabled && !stashFeasible)}
                aria-busy={isGenerating}
                aria-label={isGenerating ? 'Generating pattern...' : 'Generate new pattern'}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yarn-blue text-white rounded-lg hover:bg-yarn-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
              >
                {isGenerating ? (
                  <YarnSpinner size={18} className="text-white" />
                ) : (
                  <RefreshCw size={18} />
                )}
                {isGenerating ? 'Generating...' : 'Generate Pattern'}
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={!hasPattern || isExporting}
                aria-busy={isExporting}
                aria-label={
                  isExporting ? 'Generating PDF...' : 'Download pattern as PDF'
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-charcoal/20 text-charcoal rounded-lg hover:bg-charcoal/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
              >
                {isExporting ? (
                  <YarnSpinner size={18} className="text-charcoal" />
                ) : (
                  <Download size={18} />
                )}
                {isExporting ? 'Creating PDF...' : 'Download Pattern PDF'}
              </button>

              {exportMessage && (
                <div
                  role="status"
                  className={clsx(
                    'text-xs p-2 rounded',
                    exportMessage.type === 'success'
                      ? 'text-accent-green bg-green-50'
                      : 'text-red-600 bg-red-50'
                  )}
                >
                  {exportMessage.text}
                </div>
              )}

              {!lastSuccess && (
                <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                  {stashEnabled && !stashFeasible
                    ? 'Stash totals are too low for this grid. Raise a color limit or disable Stash Buster.'
                    : 'Failed to generate a valid pattern within stash limits. Raise scarce-color limits or try again.'}
                </div>
              )}
            </div>
          </div>

          {/* Stash Buster */}
          <div className="bg-white/80 border border-charcoal/10 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-charcoal">Stash Buster</h3>
              <label className="flex items-center gap-2 text-sm text-charcoal/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stashEnabled}
                  onChange={(e) => handleStashToggle(e.target.checked)}
                  className="rounded"
                />
                Limit yarn
              </label>
            </div>
            <p className="text-xs text-charcoal/55 mb-3">
              Cap how many squares each color may use. The generator prefers abundant yarn and
              never exceeds these caps.
            </p>
            {stashEnabled && (
              <div className="space-y-2">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-charcoal/20 shrink-0"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <span className="text-xs font-mono text-charcoal/70 w-6">
                      {COLOR_LABELS[index] || index + 1}
                    </span>
                    <label className="sr-only" htmlFor={`stash-${index}`}>
                      Max squares for color {COLOR_LABELS[index]}
                    </label>
                    <input
                      id={`stash-${index}`}
                      type="number"
                      min={0}
                      max={cellCount}
                      value={stashLimits[index] ?? 0}
                      onChange={(e) => handleStashLimitChange(index, e.target.value)}
                      className="flex-1 min-w-0 h-8 px-2 text-sm border border-charcoal/15 rounded-lg bg-canvas-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue"
                    />
                    <span className="text-xs text-charcoal/45 shrink-0">max sq</span>
                  </div>
                ))}
                {!stashFeasible && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                    Combined stash ({Object.values(quantityConstraints || {}).reduce((a, b) => a + b, 0)}){' '}
                    is less than {cellCount} squares — raise a limit to generate.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white/80 border border-charcoal/10 rounded-xl p-4 shadow-sm">
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
                    className="flex-1 h-8 rounded cursor-hook"
                  />
                </div>
              ))}
            </div>
          </div>

          {Object.keys(colorDistribution).length > 0 && (
            <div className="bg-white/80 border border-charcoal/10 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Color Distribution</h3>
              <div className="space-y-2">
                {Object.entries(colorDistribution).map(([color, count]) => {
                  const max = stashEnabled ? quantityConstraints?.[color] : null
                  const over = max != null && count > max
                  return (
                    <div key={color} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-charcoal/20"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-charcoal/70">
                          {Math.round((count / cellCount) * 100)}%
                        </span>
                      </div>
                      <span
                        className={clsx(
                          'font-mono',
                          over ? 'text-red-600 font-semibold' : 'text-charcoal'
                        )}
                      >
                        {max != null ? `${count}/${max}` : count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/80 border border-charcoal/10 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-charcoal mb-2">How it works</h3>
        <StitchDivider color="rgba(26,26,26,0.15)" height={16} segmentCount={8} className="mb-3" />
        <ul className="text-xs text-charcoal/70 space-y-1 list-disc list-inside">
          <li>
            Click &quot;Generate Pattern&quot; to create a valid pattern using graph coloring
            algorithms
          </li>
          <li>Click any square to manually change its color</li>
          <li>
            The algorithm ensures no two adjacent squares (horizontal/vertical) share the same
            color
          </li>
          <li>
            Enable <strong>Stash Buster</strong> to cap squares per yarn color — scarce colors are
            used sparingly
          </li>
          <li>Invalid patterns are highlighted with red borders</li>
          <li>
            Use &quot;Download Pattern PDF&quot; for a printable grid, row instructions, and yarn
            estimates
          </li>
        </ul>
      </div>
    </div>
  )
}
