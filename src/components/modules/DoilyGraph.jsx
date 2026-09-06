import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { RotateCcw, Info } from 'lucide-react'
import StitchDivider from '../shared/StitchDivider'
import YarnSpinner from '../shared/YarnSpinner'
import {
  generateDoilyData,
  calculateRuffleThreshold,
  generateStitchPattern,
  getSurfaceType,
  getGrowthExplanation,
} from '../../utils/doilyMath'

const Doily3D = lazy(() => import('./Doily3D'))

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function DoilyGraph() {
  const [multiplier, setMultiplier] = useState(1.0)
  const debouncedMultiplier = useDebounce(multiplier, 80)
  const [showInfo, setShowInfo] = useState(false)
  const chartContainerRef = useRef(null)

  const maxRows = 16
  const baseStitches = 6
  const patternPreviewRows = 8

  useEffect(() => {
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const surfaceType = useMemo(
    () => getSurfaceType(debouncedMultiplier),
    [debouncedMultiplier]
  )

  const whatChanged = useMemo(
    () => getGrowthExplanation(multiplier),
    [multiplier]
  )

  const stitchPattern = useMemo(
    () => generateStitchPattern(maxRows, debouncedMultiplier, baseStitches),
    [debouncedMultiplier]
  )

  const showHyperbolicLine = Math.abs(debouncedMultiplier - 1.0) > 0.02

  const chartData = useMemo(() => {
    const data = generateDoilyData(maxRows, debouncedMultiplier, baseStitches)
    const datasets = [
      {
        label: 'Ideal Flat Plane (Linear)',
        data: data.map((d) => d.linear),
        borderColor: '#4A90E2',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Current Growth',
        data: data.map((d) => d.adjusted),
        borderColor: '#1A1A1A',
        backgroundColor: 'rgba(26, 26, 26, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ]

    if (showHyperbolicLine) {
      datasets.splice(1, 0, {
        label: 'Hyperbolic Ruffle (Exponential)',
        data: data.map((d) => d.exponential),
        borderColor: '#2ECC71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderDash: [5, 5],
      })
    }

    return {
      labels: data.map((d) => d.row),
      datasets,
    }
  }, [debouncedMultiplier, showHyperbolicLine])

  const ruffleThreshold = useMemo(() => {
    if (!showHyperbolicLine) return null
    return calculateRuffleThreshold(0.1, debouncedMultiplier, baseStitches)
  }, [debouncedMultiplier, showHyperbolicLine])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 0,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: "'Space Mono', 'Courier Prime', monospace",
              size: 12,
            },
            color: '#1A1A1A',
            padding: 15,
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: showHyperbolicLine
            ? 'Stitch Growth: Linear vs Exponential'
            : 'Stitch Growth: Flat (Linear)',
          font: {
            family: "'Space Mono', 'Courier Prime', monospace",
            size: 16,
            weight: 'bold',
          },
          color: '#1A1A1A',
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          titleColor: '#FAFAFA',
          bodyColor: '#FAFAFA',
          borderColor: '#4A90E2',
          borderWidth: 1,
          padding: 12,
          titleFont: {
            family: "'Space Mono', 'Courier Prime', monospace",
            size: 13,
            weight: 'bold',
          },
          bodyFont: {
            family: "'Space Mono', 'Courier Prime', monospace",
            size: 12,
          },
          callbacks: {
            label(context) {
              const label = context.dataset.label || ''
              const value = context.parsed.y.toFixed(2)
              return `${label}: ${value} stitches`
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Row Number',
            font: {
              family: "'Space Mono', 'Courier Prime', monospace",
              size: 12,
              weight: 'bold',
            },
            color: '#1A1A1A',
          },
          ticks: {
            font: {
              family: "'Space Mono', 'Courier Prime', monospace",
              size: 11,
            },
            color: '#1A1A1A',
          },
          grid: {
            color: 'rgba(26, 26, 26, 0.1)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Stitch Count',
            font: {
              family: "'Space Mono', 'Courier Prime', monospace",
              size: 12,
              weight: 'bold',
            },
            color: '#1A1A1A',
          },
          ticks: {
            font: {
              family: "'Space Mono', 'Courier Prime', monospace",
              size: 11,
            },
            color: '#1A1A1A',
          },
          grid: {
            color: 'rgba(26, 26, 26, 0.1)',
          },
          beginAtZero: true,
        },
      },
    }),
    [showHyperbolicLine]
  )

  const handleReset = () => {
    setMultiplier(1.0)
  }

  return (
    <div className="p-3 lg:p-4 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-normal text-charcoal mb-2">
          Radial Topology
        </h2>
        <p className="text-charcoal/60 text-sm max-w-2xl">
          Explore how mathematical growth patterns create flat planes vs. ruffled surfaces
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">
              3D Hyperbolic Surface
            </h3>
            <Suspense
              fallback={
                <div
                  className="flex items-center justify-center rounded-xl border border-charcoal/10 bg-charcoal/5"
                  style={{ minHeight: '280px' }}
                >
                  <div className="flex items-center gap-2 text-yarn-blue text-sm">
                    <YarnSpinner size={22} />
                    Loading 3D view…
                  </div>
                </div>
              }
            >
              <Doily3D
                multiplier={debouncedMultiplier}
                displayMultiplier={multiplier}
                maxRows={maxRows}
                baseStitches={baseStitches}
              />
            </Suspense>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative bg-white/80 border border-charcoal/10 rounded-xl overflow-hidden shadow-sm">
              <img
                src="/images/doily-radial-beige.jpg"
                alt="Radial beige doily pattern"
                className="w-full h-auto object-cover"
                style={{ maxHeight: '120px' }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/images/doily-white-complex.jpg'
                }}
              />
            </div>
            <div className="relative bg-white/80 border border-charcoal/10 rounded-xl overflow-hidden shadow-sm">
              <img
                src="/images/doily-square-mesh.jpg"
                alt="Square mesh doily pattern"
                className="w-full h-auto object-cover"
                style={{ maxHeight: '120px' }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/images/doily-white-complex.jpg'
                }}
              />
            </div>
          </div>

          <div className="text-sm text-charcoal/70 space-y-2">
            <p>
              <strong>Mathematical Insight:</strong> When stitch count grows linearly (multiplier
              = 1.0), the lace stays flat. Raise the multiplier and excess stitches buckle into
              hyperbolic ruffles—rings shift blue→green as “too much yarn for the circle” grows.
            </p>
            {ruffleThreshold && (
              <p className="text-accent-green font-semibold">
                Ruffle becomes noticeable around row {ruffleThreshold} with current multiplier.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white/80 border border-charcoal/10 rounded-xl p-4 shadow-sm">
          <div
            ref={chartContainerRef}
            className="w-full"
            style={{
              minHeight: '300px',
              height: 'clamp(300px, 40vh, 500px)',
              position: 'relative',
            }}
          >
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Controls + live explanation */}
      <div className="bg-white/80 border border-charcoal/10 rounded-xl p-6 shadow-sm mb-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="multiplier-slider"
                className="text-sm font-semibold text-charcoal"
              >
                Growth Multiplier
              </label>
              <span className="text-lg font-bold text-yarn-blue font-mono">
                {multiplier.toFixed(2)}
              </span>
            </div>
            <input
              id="multiplier-slider"
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={multiplier}
              onChange={(e) => setMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 bg-charcoal/10 rounded-lg appearance-none cursor-pointer accent-yarn-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
              aria-label="Growth multiplier: controls flat vs ruffled stitch pattern"
              aria-valuemin={0.8}
              aria-valuemax={1.5}
              aria-valuenow={multiplier}
              aria-valuetext={`${multiplier.toFixed(2)}`}
            />
            <div className="flex justify-between text-xs text-charcoal/50 mt-1">
              <span>0.80 (Flat)</span>
              <span>1.00 (Linear)</span>
              <span>1.50 (Ruffled)</span>
            </div>
            <div
              className="flex flex-wrap gap-2 mt-3"
              role="group"
              aria-label="Growth formula presets"
            >
              {[
                { label: 'Flat', value: 1.0 },
                { label: 'Mild ruffle', value: 1.2 },
                { label: 'Hyperbolic', value: 1.45 },
              ].map((preset) => {
                const active = Math.abs(multiplier - preset.value) < 0.001
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setMultiplier(preset.value)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue ${
                      active
                        ? 'bg-yarn-blue text-white border-yarn-blue'
                        : 'bg-white text-charcoal/80 border-charcoal/15 hover:border-yarn-blue/40'
                    }`}
                    aria-pressed={active}
                  >
                    {preset.label} · {preset.value.toFixed(2)}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal text-canvas-white rounded-lg hover:bg-charcoal/90 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
            aria-label="Reset multiplier to 1.0"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2 px-4 py-2 border border-charcoal/20 text-charcoal rounded-lg hover:bg-charcoal/5 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
            aria-label={showInfo ? 'Hide formulas' : 'Show mathematical formulas'}
            aria-expanded={showInfo}
          >
            <Info size={16} />
            Formulas
          </button>
        </div>

        <p
          className="mt-4 text-sm text-charcoal/80 leading-relaxed border-l-2 border-yarn-blue/40 pl-3"
          aria-live="polite"
        >
          <span className="font-semibold text-charcoal">What changed? </span>
          {whatChanged}
        </p>

        {showInfo && (
          <div className="mt-6 pt-6 space-y-3 text-sm">
            <StitchDivider color="rgba(26,26,26,0.2)" className="mb-6" />
            <div className="bg-charcoal/5 p-4 rounded-lg font-mono text-xs space-y-2">
              <div>
                <strong className="text-yarn-blue">Linear Growth:</strong>{' '}
                <code className="text-charcoal">stitches = baseStitches × row</code>
              </div>
              <div>
                <strong className="text-accent-green">Exponential Growth:</strong>{' '}
                <code className="text-charcoal">
                  stitches = baseStitches × multiplier^(row - 1)
                </code>
              </div>
              <div>
                <strong className="text-charcoal">Current Growth:</strong>{' '}
                <code className="text-charcoal">
                  blends linear and exponential based on multiplier
                </code>
              </div>
            </div>
            <div className="text-charcoal/70 text-xs">
              <p>
                <strong>What happens if...</strong>
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>
                  Multiplier = 1.0: Perfectly flat plane (linear growth matches exponential)
                </li>
                <li>
                  Multiplier &lt; 1.0: Decreasing growth (rare, creates concave shapes)
                </li>
                <li>
                  Multiplier &gt; 1.0: Increasing growth creates ruffles (hyperbolic geometry)
                </li>
                <li>
                  Multiplier &gt; 1.2: Extreme ruffling, exponential growth dominates
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Generated stitch pattern — math → crochet instructions */}
      <div className="bg-white/90 border border-charcoal/10 rounded-xl p-5 lg:p-6 shadow-sm mb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="font-display text-xl text-charcoal">Generated Stitch Pattern</h3>
          <p className="text-xs font-mono text-charcoal/55">
            multiplier {debouncedMultiplier.toFixed(2)} · base {baseStitches}
          </p>
        </div>
        <p className="text-sm text-charcoal/60 mb-4 max-w-2xl">
          Row-by-row stitch counts from the current growth formula—math translated into something
          you could crochet.
        </p>
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <ol className="font-mono text-sm text-charcoal/85 space-y-1.5 bg-charcoal/[0.03] rounded-lg border border-charcoal/8 p-4 max-h-56 overflow-y-auto">
            {stitchPattern.slice(0, patternPreviewRows).map(({ row, stitches }) => (
              <li key={row}>
                Row {row}: {stitches} stitch{stitches === 1 ? '' : 'es'}
              </li>
            ))}
            {stitchPattern.length > patternPreviewRows && (
              <li className="text-charcoal/45 text-xs pt-1">
                … {stitchPattern.length - patternPreviewRows} more rows (see chart for full curve)
              </li>
            )}
          </ol>
          <div className="flex md:flex-col gap-3 md:min-w-[11rem]">
            <div className="flex-1 rounded-lg border border-charcoal/10 bg-white px-4 py-3">
              <div className="text-[10px] uppercase tracking-wide text-charcoal/45 mb-1">
                Surface
              </div>
              <div className="font-semibold text-charcoal text-sm">{surfaceType}</div>
            </div>
            <div className="flex-1 rounded-lg border border-charcoal/10 bg-white px-4 py-3">
              <div className="text-[10px] uppercase tracking-wide text-charcoal/45 mb-1">
                Outer row
              </div>
              <div className="font-mono text-sm text-charcoal">
                {stitchPattern[stitchPattern.length - 1]?.stitches ?? 0} sts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal inspiration — below the interactive core */}
      <section className="rounded-xl border border-charcoal/10 bg-charcoal/[0.03] overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,200px)_1fr]">
          <div className="relative min-h-[140px] md:min-h-full bg-charcoal/5">
            <img
              src="/images/texture-mesh.jpg"
              alt="Crocheted mesh texture from gifts that inspired CrochetLab"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
          <div className="p-5 lg:p-6">
            <h3 className="font-display text-xl text-charcoal mb-2">Inspiration</h3>
            <p className="text-sm text-charcoal/65 leading-relaxed max-w-2xl">
              Inspired by crocheted dolls, scarves, hats, and bags gifted by a friend, CrochetLab
              asks how simple loops can generate complex mathematical forms—and whether code can
              help makers explore those forms before picking up a hook.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
