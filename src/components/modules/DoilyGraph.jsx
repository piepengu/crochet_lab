import { useState, useMemo, useEffect, useRef } from 'react'
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
import { generateDoilyData, calculateRuffleThreshold } from '../../utils/doilyMath'

// Register Chart.js components
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
  const [showInfo, setShowInfo] = useState(false)
  const chartContainerRef = useRef(null)

  const maxRows = 20
  const baseStitches = 6

  // Force chart resize on window resize
  useEffect(() => {
    const handleResize = () => {
      // Chart.js will auto-resize, but we can trigger it explicitly if needed
      window.dispatchEvent(new Event('resize'))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Generate chart data based on current multiplier
  const chartData = useMemo(() => {
    const data = generateDoilyData(maxRows, multiplier, baseStitches)
    
    return {
      labels: data.map((d) => d.row),
      datasets: [
        {
          label: 'Ideal Flat Plane (Linear)',
          data: data.map((d) => d.linear),
          borderColor: '#4A90E2', // Yarn Blue
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Hyperbolic Ruffle (Exponential)',
          data: data.map((d) => d.exponential),
          borderColor: '#2ECC71', // Accent Green
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderDash: [5, 5],
        },
        {
          label: 'Adjusted Growth',
          data: data.map((d) => d.adjusted),
          borderColor: '#1A1A1A', // Charcoal
          backgroundColor: 'rgba(26, 26, 26, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }
  }, [multiplier])

  // Calculate ruffle threshold
  const ruffleThreshold = useMemo(() => {
    return calculateRuffleThreshold(0.1, multiplier, baseStitches)
  }, [multiplier])

  const chartOptions = {
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
        text: 'Stitch Growth Patterns: Linear vs Exponential',
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
          label: function (context) {
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
  }

  const handleReset = () => {
    setMultiplier(1.0)
  }

  return (
    <div className="p-3 lg:p-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-lg font-bold text-charcoal mb-0.5">
          Radial Topology: Hyperbolic Geometry in Crochet
        </h2>
        <p className="text-charcoal/70 text-xs">
          Explore how mathematical growth patterns create flat planes vs. ruffled surfaces
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        {/* Image Section */}
        <div className="space-y-1">
          {/* Primary Image */}
          <div className="relative bg-canvas-white border border-charcoal/10 rounded-lg overflow-hidden" style={{ height: 'min(90px, 13vh)', maxHeight: '90px' }}>
            <img
              src="/images/doily-white-complex.jpg"
              alt="Radial doily pattern showing hyperbolic geometry"
              className="w-full h-full object-cover"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
              onError={(e) => {
                // Fallback to other doily images if primary doesn't exist
                e.target.src = '/images/doily-square-mesh.jpg'
              }}
            />
          </div>
          
          {/* Additional Images Grid */}
          <div className="grid grid-cols-2 gap-1">
            <div className="relative bg-canvas-white border border-charcoal/10 rounded-lg overflow-hidden" style={{ height: '42px', maxHeight: '42px' }}>
              <img
                src="/images/doily-radial-beige.jpg"
                alt="Radial beige doily pattern"
                className="w-full h-full object-cover"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={(e) => {
                  e.target.src = '/images/doily-white-complex.jpg'
                }}
              />
            </div>
            <div className="relative bg-canvas-white border border-charcoal/10 rounded-lg overflow-hidden" style={{ height: '42px', maxHeight: '42px' }}>
              <img
                src="/images/doily-square-mesh.jpg"
                alt="Square mesh doily pattern"
                className="w-full h-full object-cover"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={(e) => {
                  e.target.src = '/images/doily-white-complex.jpg'
                }}
              />
            </div>
          </div>
          
          <div className="text-xs text-charcoal/60 space-y-1">
            <p>
              <strong>Mathematical Insight:</strong> When stitch count grows linearly (multiplier = 1.0),
              the crochet remains flat. As the multiplier increases, exponential growth creates hyperbolic
              ruffles—a beautiful demonstration of non-Euclidean geometry in fiber arts.
            </p>
            {ruffleThreshold && (
              <p className="text-accent-green font-semibold">
                Ruffle becomes noticeable around row {ruffleThreshold} with current multiplier.
              </p>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-4">
          <div 
            ref={chartContainerRef}
            className="w-full" 
            style={{ 
              minHeight: '300px', 
              height: 'clamp(300px, 40vh, 500px)',
              position: 'relative'
            }}
          >
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Slider */}
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
              className="w-full h-2 bg-charcoal/10 rounded-lg appearance-none cursor-pointer accent-yarn-blue"
            />
            <div className="flex justify-between text-xs text-charcoal/50 mt-1">
              <span>0.80 (Flat)</span>
              <span>1.00 (Linear)</span>
              <span>1.50 (Ruffled)</span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal text-canvas-white rounded-lg hover:bg-charcoal/90 transition-colors text-sm font-medium"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          {/* Info Toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2 px-4 py-2 border border-charcoal/20 text-charcoal rounded-lg hover:bg-charcoal/5 transition-colors text-sm font-medium"
          >
            <Info size={16} />
            Formulas
          </button>
        </div>

        {/* Mathematical Formulas (Collapsible) */}
        {showInfo && (
          <div className="mt-6 pt-6 border-t border-charcoal/10 space-y-3 text-sm">
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
                <strong className="text-charcoal">Adjusted Growth:</strong>{' '}
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
    </div>
  )
}
