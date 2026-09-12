import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
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
  const [patternKey, setPatternKey] = useState(0)

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
      setPatternKey((k) => k + 1)
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
    setPatternKey((k) => k + 1)
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
        <div className="lg:col-span-2">
          <div className="border border-charcoal/12 rounded-md p-5 lg:p-6 bg-canvas-warm/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h3 className="font-display text-2xl text-charcoal">Pattern Grid</h3>
                <p className="text-sm text-charcoal/60 mt-1">
                  Color a modular crochet layout under graph-coloring constraints.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {GRID_SIZES.map(({ size, label, icon: Icon }) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    aria-pressed={gridSize === size}
                    aria-label={`Set grid size to ${label}`}
                    className={clsx(
                      'ui-transition flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2',
                      gridSize === size
                        ? 'bg-yarn-blue text-white'
                        : 'bg-transparent text-charcoal border border-charcoal/12 hover:border-yarn-blue/35'
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <StitchDivider color="rgba(26,26,26,0.1)" height={12} segmentCount={6} className="mb-5" />

            <motion.div
              className="mx-auto cursor-hook"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: '8px',
                maxWidth: '400px',
                width: '100%',
              }}
              animate={
                isGenerating
                  ? { opacity: 0.55, scale: 0.985 }
                  : { opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.25 }}
            >
              {grid.map((row, rowIndex) =>
                row.map((color, colIndex) => {
                  const isInvalid = invalidSquares.some(
                    (sq) => sq.row === rowIndex && sq.col === colIndex
                  )
                  const staggerIndex = rowIndex * gridSize + colIndex

                  return (
                    <motion.button
                      key={`${patternKey}-${rowIndex}-${colIndex}`}
                      type="button"
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      initial={
                        color
                          ? { opacity: 0, scale: 0.72, y: 6 }
                          : { opacity: 0.5, scale: 0.96 }
                      }
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.38,
                        delay: color ? staggerIndex * 0.035 : 0,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={color ? { scale: 1.05 } : undefined}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        cursor-hook rounded-lg
                        ${color ? '' : 'bg-charcoal/5 border-2 border-dashed border-charcoal/20'}
                        ${isInvalid ? 'ring-2 ring-red-500 ring-offset-2' : ''}
                        focus:outline-none focus:ring-2 focus:ring-yarn-blue focus:ring-offset-2
                      `}
                      style={{
                        background: color
                          ? `radial-gradient(circle at 35% 35%, color-mix(in srgb, ${color} 85%, white), ${color})`
                          : undefined,
                        aspectRatio: '1 / 1',
                        width: '100%',
                        minHeight: '60px',
                        boxShadow: color
                          ? `0 4px 14px color-mix(in srgb, ${color} 28%, transparent)`
                          : undefined,
                      }}
                      aria-label={`Square at row ${rowIndex + 1}, column ${colIndex + 1}, color ${color || 'empty'}`}
                    />
                  )
                })
              )}
            </motion.div>

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

        <aside className="space-y-0 border border-charcoal/12 rounded-md bg-canvas-warm/40 divide-y divide-charcoal/10">
          <div className="p-4">
            <h3 className="font-display text-xl text-charcoal mb-3">Controls</h3>
            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (stashEnabled && !stashFeasible)}
                aria-busy={isGenerating}
                aria-label={isGenerating ? 'Generating pattern...' : 'Generate new pattern'}
                className="ui-transition w-full flex items-center justify-center gap-2 px-4 py-2 bg-yarn-blue text-white rounded-md hover:bg-yarn-blue/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
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
                  isExporting ? 'Generating PDF...' : 'Export crochet pattern as PDF'
                }
                className="ui-transition w-full flex items-center justify-center gap-2 px-4 py-2 border border-charcoal/20 text-charcoal rounded-md hover:border-yarn-blue/35 disabled:opacity-50 disabled:cursor-not-allowed font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
              >
                {isExporting ? (
                  <YarnSpinner size={18} className="text-charcoal" />
                ) : (
                  <Download size={18} />
                )}
                {isExporting ? 'Creating PDF...' : 'Export crochet pattern'}
              </button>

              {exportMessage && (
                <div
                  role="status"
                  className={clsx(
                    'text-xs p-2 rounded-md',
                    exportMessage.type === 'success'
                      ? 'text-accent-green bg-green-50'
                      : 'text-red-600 bg-red-50'
                  )}
                >
                  {exportMessage.text}
                </div>
              )}

              {!lastSuccess && (
                <div className="text-xs text-red-500 bg-red-50 p-2 rounded-md">
                  {stashEnabled && !stashFeasible
                    ? 'Stash totals are too low for this grid. Raise a color limit or disable Stash Buster.'
                    : 'Failed to generate a valid pattern within stash limits. Raise scarce-color limits or try again.'}
                </div>
              )}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl text-charcoal">Stash Buster</h3>
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
            <p className="text-sm text-charcoal/60 mb-3">
              Yarn resources for this layout — the generator prefers abundant colors and respects
              these caps.
            </p>
            {stashEnabled && (
              <div className="space-y-2">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-charcoal/20 shrink-0"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <span className="type-meta w-6">
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
                      className="flex-1 min-w-0 h-8 px-2 text-sm font-mono border border-charcoal/15 rounded-md bg-canvas-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue"
                    />
                    <span className="type-meta shrink-0">max sq</span>
                  </div>
                ))}
                {!stashFeasible && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-md">
                    Combined stash ({Object.values(quantityConstraints || {}).reduce((a, b) => a + b, 0)}){' '}
                    is less than {cellCount} squares — raise a limit to generate.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-display text-xl text-charcoal mb-3">Yarn palette</h3>
            <div className="grid grid-cols-2 gap-3">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border border-charcoal/20 shrink-0 shadow-[inset_0_-6px_8px_rgba(0,0,0,0.08)]"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...colors]
                      newColors[index] = e.target.value
                      setColors(newColors)
                    }}
                    className="flex-1 h-8 rounded-md cursor-hook border border-charcoal/10"
                    aria-label={`Yarn color ${COLOR_LABELS[index]}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {Object.keys(colorDistribution).length > 0 && (
            <div className="p-4">
              <h3 className="font-display text-xl text-charcoal mb-3">Color distribution</h3>
              <div className="space-y-2">
                {Object.entries(colorDistribution).map(([color, count]) => {
                  const max = stashEnabled ? quantityConstraints?.[color] : null
                  const over = max != null && count > max
                  return (
                    <div key={color} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-charcoal/20"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-charcoal/70">
                          {Math.round((count / cellCount) * 100)}%
                        </span>
                      </div>
                      <span
                        className={clsx(
                          'font-mono tabular-nums',
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
        </aside>
      </div>

      <section className="border-t border-charcoal/10 pt-6">
        <h3 className="font-display text-xl text-charcoal mb-2">How it works</h3>
        <StitchDivider color="rgba(26,26,26,0.12)" height={14} segmentCount={8} className="mb-4" />
        <ul className="text-sm text-charcoal/65 space-y-2 list-disc list-inside max-w-3xl">
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
            Use &quot;Export crochet pattern&quot; for a printable grid, row instructions, and yarn
            estimates
          </li>
        </ul>
      </section>
    </div>
  )
}
