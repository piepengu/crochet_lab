import { useState, useRef, useCallback } from 'react'
import { Upload, Loader2, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { useImageClassifier } from '../../hooks/useImageClassifier'

/**
 * Mock predictions for demo/fallback mode
 */
const mockPredictions = [
  { className: 'Crochet Pattern', probability: 0.85 },
  { className: 'Textured Fabric', probability: 0.12 },
  { className: 'Knit Stitch', probability: 0.03 },
]

export default function TextureScanner() {
  const { model, loading: modelLoading, error: modelError, classifyImage } = useImageClassifier()
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [classifying, setClassifying] = useState(false)
  const [classificationError, setClassificationError] = useState(null)
  const [useMockMode, setUseMockMode] = useState(false)
  const [zoom, setZoom] = useState(1)
  const fileInputRef = useRef(null)
  const imageRef = useRef(null)

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
      setImage(file)
      setPredictions(null)
      setClassificationError(null)
      setZoom(1)

      // Auto-classify if model is loaded
      if (model && !useMockMode) {
        // Wait for image to load
        const img = new Image()
        img.onload = async () => {
          try {
            setClassifying(true)
            const results = await classifyImage(img, 3)
            setPredictions(results)
            setClassifying(false)
          } catch (err) {
            console.error('Classification error:', err)
            setClassificationError(err.message)
            setClassifying(false)
          }
        }
        img.src = url
      } else if (useMockMode) {
        // Use mock predictions
        setClassifying(true)
        setTimeout(() => {
          setPredictions(mockPredictions)
          setClassifying(false)
        }, 500)
      }
    },
    [model, classifyImage, useMockMode]
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
    },
    [handleFileSelect]
  )

  // Re-classify image
  const handleReclassify = useCallback(async () => {
    if (!imageUrl) return

    if (useMockMode) {
      setClassifying(true)
      setTimeout(() => {
        setPredictions(mockPredictions)
        setClassifying(false)
      }, 500)
      return
    }

    if (!model) {
      setClassificationError('Model not loaded')
      return
    }

    try {
      setClassifying(true)
      setClassificationError(null)

      const img = new Image()
      img.onload = async () => {
        try {
          const results = await classifyImage(img, 3)
          setPredictions(results)
          setClassifying(false)
        } catch (err) {
          setClassificationError(err.message)
          setClassifying(false)
        }
      }
      img.src = imageUrl
    } catch (err) {
      setClassificationError(err.message)
      setClassifying(false)
    }
  }, [imageUrl, model, classifyImage, useMockMode])

  // Clear image
  const handleClear = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
    }
    setImage(null)
    setImageUrl(null)
    setPredictions(null)
    setClassificationError(null)
    setZoom(1)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [imageUrl])

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

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-charcoal mb-2">
          Texture Recognition: Computer Vision for Stitch Identification
        </h2>
        <p className="text-charcoal/70 text-sm">
          Upload an image to identify crochet patterns and textures using AI
        </p>
      </div>

      {/* Model Status */}
      {modelLoading && (
        <div className="mb-4 p-4 bg-yarn-blue/10 border border-yarn-blue/20 rounded-lg">
          <div className="flex items-center gap-2 text-yarn-blue">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-medium">Loading AI model...</span>
          </div>
        </div>
      )}

      {modelError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-sm font-medium">Model loading failed: {modelError}</span>
            </div>
            <button
              onClick={() => setUseMockMode(true)}
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Use Mock Mode
            </button>
          </div>
        </div>
      )}

      {/* Mock Mode Toggle */}
      {model && (
        <div className="mb-4 flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-charcoal/70 cursor-pointer">
            <input
              type="checkbox"
              checked={useMockMode}
              onChange={(e) => setUseMockMode(e.target.checked)}
              className="rounded"
            />
            <span>Use mock mode (for faster demos)</span>
          </label>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upload & Image Preview Section */}
        <div className="space-y-4">
          {/* Upload Area */}
          {!imageUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-charcoal/20 rounded-lg p-12 text-center hover:border-yarn-blue/50 transition-colors cursor-pointer bg-canvas-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mx-auto mb-4 text-charcoal/30" />
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                Drag & drop an image here
              </h3>
              <p className="text-sm text-charcoal/60 mb-4">or click to browse</p>
              <p className="text-xs text-charcoal/50">Supports: JPG, PNG, WebP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-4">
              {/* Image Preview with Zoom */}
              <div className="relative overflow-hidden rounded-lg bg-charcoal/5 mb-4" style={{ height: '400px' }}>
                <div className="absolute inset-0 overflow-auto">
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Uploaded crochet texture"
                    className="w-full h-full object-contain transition-transform duration-200"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                  />
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="p-2 rounded-lg border border-charcoal/20 hover:bg-charcoal/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className="p-2 rounded-lg border border-charcoal/20 hover:bg-charcoal/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                    onClick={handleZoomReset}
                    className="p-2 rounded-lg border border-charcoal/20 hover:bg-charcoal/5 transition-colors"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 rounded-lg transition-colors"
                >
                  <X size={16} />
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Classification Status */}
          {classifying && (
            <div className="p-4 bg-yarn-blue/10 border border-yarn-blue/20 rounded-lg">
              <div className="flex items-center gap-2 text-yarn-blue">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm font-medium">Analyzing image...</span>
              </div>
            </div>
          )}

          {classificationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{classificationError}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {predictions ? (
            <div className="bg-charcoal text-accent-green rounded-lg p-6 font-mono">
              <h3 className="text-lg font-bold mb-4 text-accent-green">Classification Results</h3>
              <div className="space-y-4">
                {predictions.map((pred, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-accent-green">{pred.className}</span>
                      <span className="text-accent-green/80">
                        {(pred.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    {/* Probability Bar */}
                    <div className="w-full bg-charcoal/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-accent-green transition-all duration-500"
                        style={{ width: `${pred.probability * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Confidence Indicator */}
              <div className="mt-6 pt-4 border-t border-accent-green/20">
                <div className="flex items-center justify-between text-xs text-accent-green/80">
                  <span>Confidence:</span>
                  <span
                    className={
                      predictions[0].probability > 0.7
                        ? 'text-accent-green font-bold'
                        : predictions[0].probability > 0.4
                          ? 'text-yarn-blue'
                          : 'text-yellow-500'
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
                onClick={handleReclassify}
                disabled={classifying}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-green/20 text-accent-green rounded-lg hover:bg-accent-green/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <RotateCcw size={16} />
                Re-classify
              </button>
            </div>
          ) : (
            <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-12 text-center">
              <p className="text-charcoal/50 text-sm">
                {imageUrl
                  ? 'Classification results will appear here'
                  : 'Upload an image to see classification results'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-canvas-white border border-charcoal/10 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-charcoal mb-2">How it works</h3>
        <ul className="text-xs text-charcoal/70 space-y-1 list-disc list-inside">
          <li>Upload an image of crochet work or textured fabric</li>
          <li>The AI model will automatically analyze and classify the texture</li>
          <li>Results show the top 3 predictions with confidence percentages</li>
          <li>Use zoom controls to examine image details</li>
          <li>Click "Re-classify" to analyze the image again</li>
        </ul>
      </div>
    </div>
  )
}
