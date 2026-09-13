import { useState, useRef, useCallback, useEffect, useId } from 'react'
import { Upload, X, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react'
import StitchDivider from '../shared/StitchDivider'
import YarnSpinner from '../shared/YarnSpinner'
import ActivationHeatmapOverlay from './ActivationHeatmapOverlay'
import { useImageClassifier } from '../../hooks/useImageClassifier'

/**
 * Mock predictions for demo/fallback mode
 */
const mockPredictions = [
  { className: 'Crochet Pattern', probability: 0.85 },
  { className: 'Textured Fabric', probability: 0.12 },
  { className: 'Knit Stitch', probability: 0.03 },
]

/** On-brand sample for empty-state demos */
const SAMPLE_TEXTURE_URL = '/images/texture-mesh.jpg'

/**
 * ImageNet / mock labels that suggest fiber, fabric, or craft surfaces.
 * Used only for a soft UX note — not for filtering predictions.
 */
const CRAFT_HINT_PATTERN =
  /crochet|knit|fabric|textile|yarn|wool|lace|velvet|silk|linen|cotton|sweater|cardigan|jersey|scarf|stole|shawl|quilt|blanket|towel|rug|doormat|mat|pillow|cushion|handkerchief|cloth|gauze|poncho|abaya|kimono|sari|sarong|apron|bib|curtain|screen|canvas|denim|fur|leather|suede|knitwear|stitch|doily/i

function predictionsLookOffDomain(predictions) {
  if (!predictions?.length) return false
  const joined = predictions.map((p) => p.className || '').join(' ')
  return !CRAFT_HINT_PATTERN.test(joined)
}

export default function TextureScanner({ demoMode = false }) {
  const [useMockMode, setUseMockMode] = useState(demoMode)
  const {
    model,
    loading: modelLoading,
    error: modelError,
    classifyImage,
    getActivationHeatmap,
  } = useImageClassifier({ enabled: !useMockMode })
  const [imageUrl, setImageUrl] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [classifying, setClassifying] = useState(false)
  const [classificationError, setClassificationError] = useState(null)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [heatmapUrl, setHeatmapUrl] = useState(null)
  const [heatmapError, setHeatmapError] = useState(null)
  const [zoom, setZoom] = useState(1)
  const fileInputRef = useRef(null)
  const imageRef = useRef(null)
  const fileInputId = useId()

  // Stay in sync when App Demo Mode is toggled
  useEffect(() => {
    setUseMockMode(demoMode)
  }, [demoMode])

  const buildHeatmap = useCallback(
    async (img) => {
      if (!showHeatmap) {
        setHeatmapUrl(null)
        setHeatmapError(null)
        return
      }

      try {
        setHeatmapError(null)
        if (useMockMode) {
          const { computeMockHeatmap, heatmapToDataUrl } = await import(
            '../../utils/activationHeatmap'
          )
          const map = computeMockHeatmap(img)
          setHeatmapUrl(heatmapToDataUrl(map))
        } else if (model && getActivationHeatmap) {
          const url = await getActivationHeatmap(img)
          setHeatmapUrl(url)
        }
      } catch (err) {
        console.warn('Heatmap generation failed:', err)
        setHeatmapError(err.message || 'Could not generate attention map')
        setHeatmapUrl(null)
      }
    },
    [showHeatmap, useMockMode, model, getActivationHeatmap]
  )

  const analyzeImage = useCallback(
    async (img) => {
      setClassifying(true)
      setClassificationError(null)

      try {
        if (useMockMode) {
          await new Promise((r) => setTimeout(r, 400))
          setPredictions(mockPredictions)
        } else {
          const results = await classifyImage(img, 3)
          setPredictions(results)
        }
        await buildHeatmap(img)
      } catch (err) {
        console.error('Classification error:', err)
        setClassificationError(err.message)
        setPredictions(null)
        setHeatmapUrl(null)
      } finally {
        setClassifying(false)
      }
    },
    [useMockMode, classifyImage, buildHeatmap]
  )

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file) => {
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setClassificationError('Please select an image file')
        return
      }

      // Create object URL for preview
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setPredictions(null)
      setHeatmapUrl(null)
      setHeatmapError(null)
      setClassificationError(null)
      setZoom(1)

      const img = new Image()
      img.onload = () => {
        if (useMockMode || model) {
          analyzeImage(img)
        }
      }
      img.src = url
    },
    [model, useMockMode, analyzeImage]
  )

  // Handle drag and drop
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  // Handle file input change
  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
      // Allow re-selecting the same file and avoid stale change events
      e.target.value = ''
    },
    [handleFileSelect]
  )

  // If user picked a file before MobileNet finished loading, classify once ready
  useEffect(() => {
    if (!imageUrl || useMockMode || !model || predictions || classifying) return

    const img = new Image()
    img.onload = () => analyzeImage(img)
    img.src = imageUrl

    return () => {
      img.onload = null
    }
  }, [imageUrl, useMockMode, model, predictions, classifying, analyzeImage])

  // Re-classify image
  const handleReclassify = useCallback(async () => {
    if (!imageUrl) return
    if (!useMockMode && !model) {
      setClassificationError('Model not loaded')
      return
    }

    const img = new Image()
    img.onload = () => analyzeImage(img)
    img.src = imageUrl
  }, [imageUrl, model, useMockMode, analyzeImage])

  // Clear image
  const handleClear = useCallback(() => {
    if (imageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    setImageUrl(null)
    setPredictions(null)
    setHeatmapUrl(null)
    setHeatmapError(null)
    setClassificationError(null)
    setZoom(1)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [imageUrl])

  const handleLoadSample = useCallback(() => {
    if (imageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }

    setImageUrl(SAMPLE_TEXTURE_URL)
    setPredictions(null)
    setHeatmapUrl(null)
    setHeatmapError(null)
    setClassificationError(null)
    setZoom(1)

    const img = new Image()
    img.onload = () => {
      if (useMockMode || model) {
        analyzeImage(img)
      }
    }
    img.onerror = () => {
      setClassificationError('Could not load the sample texture image')
    }
    img.src = SAMPLE_TEXTURE_URL
  }, [imageUrl, useMockMode, model, analyzeImage])

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }, [])

  const handleZoomReset = useCallback(() => {
    setZoom(1)
  }, [])

  const offDomainNote =
    !useMockMode && predictionsLookOffDomain(predictions)
      ? 'These ImageNet labels describe the whole scene more than yarn or fabric. Try a close-up of crochet, knit, or woven texture to inspect craft surfaces.'
      : null

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-3xl font-normal text-charcoal mb-2">
          Texture Recognition
        </h2>
        <p className="text-charcoal/60 text-sm max-w-2xl">
          Inspect craft photos with a browser-side ImageNet classifier (MobileNet). Best on
          close-ups of crochet, knit, or woven texture—then read the attention map to see where
          the network looks.
        </p>
      </div>

      {/* Instrument status */}
      {modelLoading && !useMockMode && (
        <div className="mb-4 py-3 border-y border-yarn-blue/20">
          <div className="flex items-center gap-2 text-yarn-blue">
            <YarnSpinner size={22} />
            <span className="text-sm font-semibold">Calibrating image model…</span>
          </div>
        </div>
      )}

      {modelError && (
        <div className="mb-4 p-4 bg-red-50 border-l-2 border-red-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-sm font-medium">Model loading failed: {modelError}</span>
            </div>
            <button
              type="button"
              onClick={() => setUseMockMode(true)}
              className="ui-transition text-xs px-2 py-1 text-red-700 border border-red-200 rounded-md hover:bg-red-100"
            >
              Use Mock Mode
            </button>
          </div>
        </div>
      )}

      {/* Mock Mode Toggle */}
      <div className="mb-5 flex items-center gap-2 border-b border-charcoal/10 pb-4">
        <label className="flex items-center gap-2 text-sm text-charcoal/70 cursor-pointer">
          <input
            type="checkbox"
            checked={useMockMode}
            onChange={(e) => {
              setUseMockMode(e.target.checked)
              // Auto-classify if switching to mock mode with an image already loaded
              if (e.target.checked && imageUrl) {
                const img = new Image()
                img.onload = () => analyzeImage(img)
                img.src = imageUrl
              }
            }}
            className="rounded"
          />
          <span className="text-sm">
            {demoMode
              ? 'Mock mode (Demo Mode — recommended for presentations)'
              : 'Use mock mode (for faster demos)'}
          </span>
        </label>
      </div>

      {/* Main Content Grid - stacks on mobile, 2 columns on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Upload & Image Preview Section */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Upload Area */}
          {!imageUrl ? (
            <div className="space-y-3">
              <input
                id={fileInputId}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="sr-only"
              />
              <label
                htmlFor={fileInputId}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="ui-transition border border-dashed border-charcoal/25 rounded-md p-10 sm:p-12 text-center hover:border-yarn-blue/60 cursor-pointer bg-canvas-warm/40 block"
              >
                <Upload size={42} className="mx-auto mb-4 text-yarn-blue/65" />
                <p className="type-label mb-2">Image specimen</p>
                <h3 className="font-display text-2xl text-charcoal mb-2">
                  Drag & drop a craft photo here
                </h3>
                <p className="text-sm text-charcoal/60 mb-4">
                  Prefer a close-up of crochet, knit, or fabric — or click to browse
                </p>
                <p className="type-meta">JPG · PNG · WebP</p>
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="ui-transition w-full px-4 py-2.5 rounded-md border border-charcoal/20 bg-canvas-warm/80 text-charcoal text-sm font-semibold hover:border-yarn-blue/40 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
              >
                Try sample crochet texture
              </button>
            </div>
          ) : (
            <div className="border border-charcoal/12 rounded-md p-4 bg-canvas-warm/40">
              {/* Image Preview with Zoom */}
              <div className="relative overflow-hidden rounded-sm bg-charcoal/[0.04] mb-4 h-[300px] max-h-[300px]">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Uploaded image for texture analysis"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center',
                  }}
                />
                <ActivationHeatmapOverlay
                  heatmapUrl={heatmapUrl}
                  visible={showHeatmap && !!heatmapUrl}
                  zoom={zoom}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-2">
                <button
                  type="button"
                  onClick={async () => {
                    const next = !showHeatmap
                    setShowHeatmap(next)
                    if (next && imageUrl && !heatmapUrl && imageRef.current) {
                      await buildHeatmap(imageRef.current)
                    }
                  }}
                  className="ui-transition flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-charcoal/20 hover:border-yarn-blue/40 hover:text-yarn-blue"
                  aria-pressed={showHeatmap}
                >
                  {showHeatmap ? <Eye size={14} /> : <EyeOff size={14} />}
                  {showHeatmap ? 'Hide attention map' : 'Show attention map'}
                </button>
                {heatmapUrl && showHeatmap && (
                  <span className="text-xs text-charcoal/50">
                    Warmer colors = stronger neural activation
                  </span>
                )}
              </div>
              {heatmapError && (
                <p className="text-xs text-amber-700 mb-2">{heatmapError}</p>
              )}

              {/* Zoom Controls */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="ui-transition p-2 rounded-md border border-charcoal/20 hover:border-yarn-blue/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <span className="text-xs text-charcoal/60 font-mono min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="ui-transition p-2 rounded-md border border-charcoal/20 hover:border-yarn-blue/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                    onClick={handleZoomReset}
                    className="ui-transition p-2 rounded-md border border-charcoal/20 hover:border-yarn-blue/40"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
                <button
                  onClick={handleClear}
                  className="ui-transition flex items-center gap-2 px-3 py-2 text-sm text-charcoal/70 hover:text-charcoal rounded-md"
                >
                  <X size={16} />
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Classification Status */}
          {classifying && (
            <div className="p-4 bg-yarn-blue/[0.06] border-l-2 border-yarn-blue">
              <div className="flex items-center gap-2 text-yarn-blue">
                <YarnSpinner size={22} />
                <span className="text-sm font-medium">Analyzing image...</span>
              </div>
            </div>
          )}

          {classificationError && (
            <div className="p-4 bg-red-50 border-l-2 border-red-400">
              <p className="text-sm text-red-600">{classificationError}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-4 min-w-0">
          {predictions ? (
            <section className="border border-charcoal/15 rounded-md bg-[#f1f3f3] overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-charcoal/10 bg-[#e8ecec]">
                <div>
                  <p className="type-label mb-1">Scientific instrument · ImageNet classifier</p>
                  <h3 className="font-display text-2xl text-charcoal">Classification results</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 type-meta text-charcoal/65">
                  <span className="w-2 h-2 rounded-full bg-accent-green" aria-hidden />
                  Analysis complete
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {offDomainNote && (
                  <p className="text-sm text-amber-900/90 bg-amber-50 border border-amber-200/80 rounded-md px-3 py-2.5 leading-relaxed">
                    {offDomainNote}
                  </p>
                )}

                {predictions.map((pred, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex items-baseline gap-3 min-w-0">
                        <span className="type-meta text-charcoal/45">
                          0{index + 1}
                        </span>
                        <span className={index === 0 ? 'font-semibold text-charcoal' : 'text-charcoal/70'}>
                          {pred.className}
                        </span>
                      </div>
                      <span className="font-mono text-sm tabular-nums text-charcoal">
                        {(pred.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    {/* Probability Bar */}
                    <div
                      className="w-full bg-charcoal/[0.08] h-2 overflow-hidden"
                      role="progressbar"
                      aria-label={`${pred.className} confidence`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(pred.probability * 100)}
                    >
                      <div
                        className={`h-full ui-transition ${
                          index === 0 ? 'bg-yarn-blue' : 'bg-yarn-blue/45'
                        }`}
                        style={{ width: `${pred.probability * 100}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Confidence Indicator */}
                <div className="pt-4 border-t border-charcoal/10">
                  <div className="flex items-center justify-between type-meta">
                    <span>Overall confidence</span>
                  <span
                    className={
                      predictions[0].probability > 0.7
                          ? 'text-accent-green font-bold'
                        : predictions[0].probability > 0.4
                          ? 'text-yarn-blue'
                          : 'text-amber-700'
                    }
                  >
                    {predictions[0].probability > 0.7
                      ? 'High'
                      : predictions[0].probability > 0.4
                        ? 'Medium'
                        : 'Low'}
                  </span>
                  </div>
                </div>

                {/* Re-classify Button */}
                <button
                  type="button"
                  onClick={handleReclassify}
                  disabled={classifying}
                  className="ui-transition w-full flex items-center justify-center gap-2 px-4 py-2 bg-yarn-blue text-white rounded-md hover:bg-yarn-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  <RotateCcw size={16} />
                  Analyze again
                </button>
              </div>
            </section>
          ) : (
            <div className="min-h-[300px] border border-charcoal/12 rounded-md bg-[#f1f3f3] p-10 flex flex-col items-center justify-center text-center">
              <p className="type-label mb-3">Classification output</p>
              <p className="text-sm text-charcoal/60 mb-5 max-w-xs">
                {imageUrl
                  ? 'Classification results will appear here'
                  : 'Upload a craft close-up—or try the sample—to see ImageNet labels and an attention map'}
              </p>
              {!imageUrl && (
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="ui-transition px-5 py-2.5 mb-3 border border-charcoal/20 bg-white text-charcoal rounded-md hover:border-yarn-blue/40 font-semibold text-sm"
                >
                  Try sample crochet texture
                </button>
              )}
              {imageUrl && !classifying && (
                <button
                  type="button"
                  onClick={handleReclassify}
                  className="ui-transition px-5 py-2.5 bg-yarn-blue text-white rounded-md hover:bg-yarn-blue/90 font-semibold"
                >
                  Analyze image
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Open editorial instructions */}
      <section className="border-t border-charcoal/10 pt-6">
        <h3 className="font-display text-xl text-charcoal mb-2">How it works</h3>
        <StitchDivider color="rgba(26,26,26,0.15)" height={16} segmentCount={8} className="mb-3" />
        <ul className="text-sm text-charcoal/65 space-y-2 list-disc list-inside max-w-3xl">
          <li>
            Upload a close-up of crochet, knit, or fabric—or use &quot;Try sample crochet
            texture&quot;
          </li>
          <li>
            MobileNet (ImageNet) classifies the photo in the browser; mock mode uses craft-themed
            demo labels for presentations
          </li>
          <li>Results show the top 3 predictions with confidence percentages</li>
          <li>Use zoom controls to examine image details</li>
          <li>Click &quot;Analyze again&quot; to re-run the classifier</li>
          <li>
            The attention heatmap highlights regions the model focuses on (texture, edges,
            patterns)
          </li>
        </ul>
      </section>
    </div>
  )
}
