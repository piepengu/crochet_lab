const IMAGE_SIZE = 224

/** Conv layers to try for spatial activation maps (MobileNet V2 / V1) */
const LAYER_CANDIDATES = {
  '2.00': [
    'module_apply_default/MobilenetV2/Conv_1/Relu6',
    'module_apply_default/MobilenetV2/expanded_conv_16/project/BatchNorm/FusedBatchNorm',
    'module_apply_default/MobilenetV2/expanded_conv_16/depthwise/Relu6',
  ],
  '1.00': [
    'module_apply_default/MobilenetV1/Conv2d_13_pointwise/Relu6',
    'module_apply_default/MobilenetV1/Conv2d_1_pointwise/Relu6',
  ],
}

function getGraphNodeNames(graphModel) {
  const rawNodes = graphModel.executor?.graph?.nodes
  if (!rawNodes) return []
  const nodeList =
    rawNodes instanceof Map
      ? [...rawNodes.values()]
      : Array.isArray(rawNodes)
        ? rawNodes
        : Object.values(rawNodes)
  return nodeList.map((n) => n.name ?? n.key).filter(Boolean)
}

function preprocessImage(tf, imageElement, inputMin, inputMax) {
  const normalizationConstant = (inputMax - inputMin) / 255
  return tf.tidy(() => {
    const pixels = tf.browser.fromPixels(imageElement)
    const normalized = tf.add(
      tf.mul(tf.cast(pixels, 'float32'), normalizationConstant),
      inputMin
    )
    const w = imageElement.naturalWidth || imageElement.width
    const h = imageElement.naturalHeight || imageElement.height
    const resized =
      w !== IMAGE_SIZE || h !== IMAGE_SIZE
        ? tf.image.resizeBilinear(normalized, [IMAGE_SIZE, IMAGE_SIZE], true)
        : normalized
    return tf.reshape(resized, [-1, IMAGE_SIZE, IMAGE_SIZE, 3])
  })
}

/**
 * Mean activation across channels → normalized 2D heatmap (0–1)
 */
export async function computeActivationHeatmap(mobilenetModel, imageElement) {
  const tf = await import('@tensorflow/tfjs')
  const version = mobilenetModel.version ?? '2.00'
  const candidates = LAYER_CANDIDATES[version] ?? LAYER_CANDIDATES['2.00']
  const graphModel = mobilenetModel.model

  const input = preprocessImage(
    tf,
    imageElement,
    mobilenetModel.inputMin,
    mobilenetModel.inputMax
  )

  const tryLayer = (layer) => {
    try {
      const out = graphModel.execute(input, layer)
      const [, h, w] = out.shape
      if (out.shape.length === 4 && h > 1 && w > 1) {
        return out
      }
      out.dispose()
    } catch {
      // try next layer name
    }
    return null
  }

  let activation = null
  for (const layer of candidates) {
    activation = tryLayer(layer)
    if (activation) break
  }

  if (!activation) {
    const nodeNames = getGraphNodeNames(graphModel)
      .filter(
        (name) =>
          name.includes('module_apply_default') &&
          (name.includes('Relu6') || name.includes('FusedBatchNorm')) &&
          !name.includes('Logits')
      )
      .reverse()

    for (const layer of nodeNames) {
      activation = tryLayer(layer)
      if (activation) break
    }
  }

  input.dispose()

  if (!activation) {
    throw new Error('Could not read activation map from MobileNet layers')
  }

  const targetH = imageElement.naturalHeight || imageElement.height || IMAGE_SIZE
  const targetW = imageElement.naturalWidth || imageElement.width || IMAGE_SIZE

  const values = tf.tidy(() => {
    const mean = tf.mean(activation, 3)
    const map2d = tf.squeeze(mean, [0])
    const min = tf.min(map2d)
    const max = tf.max(map2d)
    const norm = tf.div(tf.sub(map2d, min), tf.add(tf.sub(max, min), 1e-7))
    const resized = tf.image.resizeBilinear(
      tf.expandDims(norm, 2),
      [targetH, targetW],
      true
    )
    return resized.dataSync()
  })

  activation.dispose()

  return { values, width: targetW, height: targetH }
}

/**
 * Mock heatmap from image luminance edges (demo mode without TF layers)
 */
export function computeMockHeatmap(imageElement) {
  const w = imageElement.naturalWidth || imageElement.width || 224
  const h = imageElement.naturalHeight || imageElement.height || 224
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imageElement, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)
  const values = new Float32Array(w * h)
  const gray = new Float32Array(w * h)

  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    gray[i] = (data[o] + data[o + 1] + data[o + 2]) / 3
  }

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x
      const gx = Math.abs(gray[i + 1] - gray[i - 1])
      const gy = Math.abs(gray[i + w] - gray[i - w])
      values[i] = Math.min(1, (gx + gy) / 120)
    }
  }

  return { values, width: w, height: h }
}

/**
 * Build a semi-transparent heatmap PNG data URL
 */
export function heatmapToDataUrl({ values, width, height }) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(width, height)

  for (let i = 0; i < values.length; i++) {
    const t = values[i]
    const idx = i * 4
    // Blue → cyan → yellow → red
    imageData.data[idx] = Math.round(Math.min(255, t * 320))
    imageData.data[idx + 1] = Math.round(Math.min(255, t * 200))
    imageData.data[idx + 2] = Math.round(Math.max(0, 255 - t * 220))
    imageData.data[idx + 3] = Math.round(90 + t * 140)
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/png')
}
