import { useState, useCallback, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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
  return colors.map((_, i) => {
    if (i === 0) return cellCount
    if (i === 1) return Math.max(1, Math.ceil(cellCount * 0.45))
    if (i === 2) return Math.max(1, Math.ceil(cellCount * 0.35))
    return Math.max(1, Math.ceil(cellCount * 0.25))
  })
}

function yarnCellBackground(color) {
  return `
    radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 72%, white), ${color} 58%),
    repeating-linear-gradient(
      125deg,
      transparent 0 2px,
      color-mix(in srgb, ${color} 82%, #1a1a1a) 2px 3px
    )
  `
}

export default function SquarePermutator() {
  const reduceMotion = useReducedMotion()
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
          Assign yarn colors to modular crochet squares under graph-coloring constraints—no two
          neighbors share a color. Optionally limit yarn with Stash Buster.
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
                gap: '10px',
                maxWidth: '420px',
                width: '100%',
              }}
              animate={isGenerating ? { opacity: 0.62 } : { opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              {grid.map((row, rowIndex) =>
                row.map((color, colIndex) => {
                  const isInvalid = invalidSquares.some(
                    (sq) => sq.row === rowIndex && sq.col === colIndex
                  )
                  const staggerIndex = rowIndex * gridSize + colIndex
                  const label = color ? COLOR_LABELS[colors.indexOf(color)] || '' : ''

                  return (
                    <motion.button
                      key={`${patternKey}-${rowIndex}-${colIndex}`}
                      type="button"
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      initial={
                        reduceMotion
                          ? false
                          : color
                            ? { opacity: 0.35, scale: 0.94 }
                            : { opacity: 0.6, scale: 0.98 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.2,
                        delay:
                          reduceMotion || !color
                            ? 0
                            : Math.min(staggerIndex * 0.02, 0.18),
                        ease: 'easeOut',
                      }}
                      whileHover={
                        reduceMotion || !color ? undefined : { scale: 1.03 }
                      }
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      className={clsx(
                        'cursor-hook rounded-md inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2',
                        color && 'yarn-square',
                        !color &&
                          'bg-charcoal/[0.04] border border-dashed border-charcoal/20',
                        isInvalid && 'ring-2 ring-red-500 ring-offset-2'
                      )}
                      style={{
                        background: color ? yarnCellBackground(color) : undefined,
                        aspectRatio: '1 / 1',
                        width: '100%',
                        minHeight: '58px',
                        boxShadow: color
                          ? `0 2px 8px color-mix(in srgb, ${color} 22%, transparent)`
                          : undefined,
                      }}
                      aria-label={`Square at row ${rowIndex + 1}, column ${colIndex + 1}, color ${color || 'empty'}${label ? ` (${label})` : ''}`}
                    >
                      {label && (
                        <span className="relative z-[3] font-mono text-[10px] font-bold text-white/90 drop-shadow-sm">
                          {label}
                        </span>
                      )}
                    </motion.button>
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
                  <span className="type-meta">
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-xl text-charcoal">Yarn resources</h3>
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
            <p className="text-sm text-charcoal/60 mb-4">
              These swatches feed the pattern grid. With Stash Buster on, thread length shows how
              much of each yarn you allow.
            </p>

            <div className="space-y-4">
              {colors.map((color, index) => {
                const used = colorDistribution[color] || 0
                const max = stashEnabled ? stashLimits[index] ?? 0 : cellCount
                const threadPct = Math.max(
                  8,
                  Math.round(((stashEnabled ? max : used || max) / cellCount) * 100)
                )
                const usedPct = Math.round((used / cellCount) * 100)
                const over = stashEnabled && used > max

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="yarn-swatch w-9 h-9 shrink-0"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="type-meta">Yarn {COLOR_LABELS[index]}</span>
                          <span
                            className={clsx(
                              'type-meta',
                              over && 'text-red-600 font-semibold'
                            )}
                          >
                            {hasPattern ? `${used} used` : 'unused'}
                            {stashEnabled ? ` · max ${max}` : ''}
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full bg-charcoal/[0.07] overflow-hidden"
                          aria-hidden
                        >
                          <div
                            className="h-full max-w-full rounded-full ui-transition"
                            style={{
                              width: `${stashEnabled ? threadPct : Math.max(usedPct, 12)}%`,
                              background: color,
                            }}
                          />
                        </div>
                      </div>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...colors]
                          newColors[index] = e.target.value
                          setColors(newColors)
                        }}
                        className="w-9 h-9 rounded-md cursor-hook border border-charcoal/10 shrink-0"
                        aria-label={`Pick yarn color ${COLOR_LABELS[index]}`}
                      />
                    </div>

                    {stashEnabled && (
                      <div className="flex items-center gap-2 pl-12">
                        <label className="sr-only" htmlFor={`stash-${index}`}>
                          Max squares for yarn {COLOR_LABELS[index]}
                        </label>
                        <input
                          id={`stash-${index}`}
                          type="number"
                          min={0}
                          max={cellCount}
                          value={stashLimits[index] ?? 0}
                          onChange={(e) => handleStashLimitChange(index, e.target.value)}
                          className="w-20 h-8 px-2 text-sm font-mono border border-charcoal/15 rounded-md bg-canvas-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue"
                        />
                        <span className="type-meta">max squares</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {stashEnabled && !stashFeasible && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-md mt-3">
                Combined stash ({Object.values(quantityConstraints || {}).reduce((a, b) => a + b, 0)}){' '}
                is less than {cellCount} squares — raise a limit to generate.
              </p>
            )}
          </div>
        </aside>
      </div>

      <section className="border-t border-charcoal/10 pt-6">
        <h3 className="font-display text-xl text-charcoal mb-2">How it works</h3>
        <StitchDivider color="rgba(26,26,26,0.12)" height={14} segmentCount={8} className="mb-4" />
        <ul className="text-sm text-charcoal/65 space-y-2 list-disc list-inside max-w-3xl">
          <li>
            Click &quot;Generate Pattern&quot; to assign yarn colors with a graph-coloring
            algorithm
          </li>
          <li>Click any square to cycle its yarn color</li>
          <li>No two adjacent squares (horizontal/vertical) may share the same color</li>
          <li>
            Enable <strong>Limit yarn</strong> to cap squares per yarn — scarce colors are used
            sparingly
          </li>
          <li>Invalid squares are highlighted with red rings</li>
          <li>
            Use &quot;Export crochet pattern&quot; for a printable grid, row instructions, and yarn
            estimates
          </li>
        </ul>
      </section>
    </div>
  )
}
