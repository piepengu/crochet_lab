import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for image classification using TensorFlow.js and MobileNet
 *
 * @param {{ enabled?: boolean }} [options] - Pass enabled:false to skip model load (Demo/mock mode)
 * @returns {Object} model, loading, error, classifyImage, getActivationHeatmap
 */
export function useImageClassifier({ enabled = true } = {}) {
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)

  // Load MobileNet only when enabled
  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      setError(null)
      return
    }

    let isMounted = true

    const loadModel = async () => {
      try {
        setLoading(true)
        setError(null)

        const tf = await import('@tensorflow/tfjs')

        try {
          await import('@tensorflow/tfjs-backend-webgl')
        } catch (webglError) {
          console.warn('WebGL backend import failed, will use CPU:', webglError)
        }

        try {
          await tf.setBackend('webgl')
        } catch (webglSetError) {
          console.warn('WebGL backend not available, using CPU:', webglSetError)
          await tf.setBackend('cpu')
        }

        await tf.ready()

        const mobilenetModule = await import('@tensorflow-models/mobilenet')
        const mobilenet = mobilenetModule.default || mobilenetModule

        const loadedModel = await mobilenet.load({
          version: 2,
          alpha: 1.0,
        })

        if (isMounted) {
          setModel(loadedModel)
          setLoading(false)
        }
      } catch (err) {
        console.error('Error loading MobileNet model:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load image classification model')
          setLoading(false)
        }
      }
    }

    loadModel()

    return () => {
      isMounted = false
    }
  }, [enabled])

  /**
   * Classify an image element
   * 
   * @param {HTMLImageElement|HTMLCanvasElement} imageElement - The image element to classify
   * @param {number} topK - Number of top predictions to return (default: 3)
   * @returns {Promise<Array>} Array of predictions with className and probability
   */
  const classifyImage = useCallback(
    async (imageElement, topK = 3) => {
      if (!model) {
        throw new Error('Model not loaded yet')
      }

      if (!imageElement) {
        throw new Error('Image element is required')
      }

      try {
        // Classify the image
        const predictions = await model.classify(imageElement, topK)

        // Format predictions for easier use
        return predictions.map((pred) => ({
          className: pred.className,
          probability: pred.probability,
        }))
      } catch (err) {
        console.error('Error classifying image:', err)
        throw new Error(`Classification failed: ${err.message}`)
      }
    },
    [model]
  )

  /**
   * Compute a spatial activation heatmap from an intermediate conv layer.
   * Requires the raw MobileNet instance (has internal graph model).
   */
  const getActivationHeatmap = useCallback(
    async (imageElement) => {
      if (!model) {
        throw new Error('Model not loaded yet')
      }
      if (!imageElement) {
        throw new Error('Image element is required')
      }

      const { computeActivationHeatmap, heatmapToDataUrl } = await import(
        '../utils/activationHeatmap'
      )
      const map = await computeActivationHeatmap(model, imageElement)
      return heatmapToDataUrl(map)
    },
    [model]
  )

  return {
    model,
    loading,
    error,
    classifyImage,
    getActivationHeatmap,
  }
}
