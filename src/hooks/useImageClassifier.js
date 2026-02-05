import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for image classification using TensorFlow.js and MobileNet
 * 
 * Loads the MobileNet model on mount and provides a function to classify images.
 * Handles loading states, errors, and cleanup.
 * 
 * @returns {Object} Object containing:
 *   - model: The loaded MobileNet model (null if not loaded)
 *   - loading: Boolean indicating if model is loading
 *   - error: Error message if model loading failed
 *   - classifyImage: Function to classify an image element
 */
export function useImageClassifier() {
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load MobileNet model on mount
  useEffect(() => {
    let isMounted = true

    const loadModel = async () => {
      try {
        setLoading(true)
        setError(null)

        // Dynamically import TensorFlow.js core first
        const tf = await import('@tensorflow/tfjs')
        
        // Import WebGL backend (most performant) - importing registers it automatically
        // The backend must be imported before calling tf.ready() or setBackend()
        try {
          await import('@tensorflow/tfjs-backend-webgl')
          console.log('WebGL backend imported')
        } catch (webglError) {
          console.warn('WebGL backend import failed, will use CPU:', webglError)
        }
        
        // Set backend (try WebGL first, fallback to CPU)
        try {
          await tf.setBackend('webgl')
          console.log('WebGL backend set')
        } catch (webglSetError) {
          console.warn('WebGL backend not available, using CPU:', webglSetError)
          await tf.setBackend('cpu')
          console.log('CPU backend set')
        }
        
        // Initialize TensorFlow.js - this initializes the selected backend
        await tf.ready()
        console.log('TensorFlow.js initialized with backend:', tf.getBackend())

        // Dynamically import MobileNet model
        const mobilenetModule = await import('@tensorflow-models/mobilenet')
        const mobilenet = mobilenetModule.default || mobilenetModule

        // Load MobileNet v2 model (lighter and faster than v1)
        // version: 2 = MobileNetV2, alpha: 1.0 = full width
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

    // Cleanup function
    return () => {
      isMounted = false
      // Note: TensorFlow.js models are automatically cleaned up when component unmounts
    }
  }, []) // Empty dependency array - only run on mount

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

  return {
    model,
    loading,
    error,
    classifyImage,
  }
}
