/**
 * Mathematical functions for Radial Topology (Doily) visualization
 * 
 * These functions calculate stitch counts for different growth patterns
 * in crochet doilies, demonstrating the mathematics behind flat vs. ruffled patterns.
 */

/**
 * Linear growth function - represents a flat plane
 * Each row adds a constant number of stitches
 * 
 * @param {number} row - The row number (1-indexed)
 * @param {number} baseStitches - Base number of stitches per row (default: 6)
 * @returns {number} Total stitches at the given row
 */
export function linearGrowth(row, baseStitches = 6) {
  return baseStitches * row
}

/**
 * Exponential growth function - represents a hyperbolic ruffle
 * Each row multiplies stitches by a factor, creating exponential growth
 * 
 * @param {number} row - The row number (1-indexed)
 * @param {number} multiplier - Growth multiplier per row (default: 1.2)
 * @param {number} baseStitches - Starting number of stitches (default: 6)
 * @returns {number} Total stitches at the given row
 */
export function exponentialGrowth(row, multiplier = 1.2, baseStitches = 6) {
  return baseStitches * Math.pow(multiplier, row - 1)
}

/**
 * Generate data points for chart visualization
 * Creates an array of data points comparing linear, exponential, and adjusted growth patterns
 * 
 * @param {number} maxRows - Maximum number of rows to generate (default: 20)
 * @param {number} multiplier - Growth multiplier for exponential/adjusted calculations (default: 1.0)
 * @param {number} baseStitches - Base number of stitches (default: 6)
 * @returns {Array<{row: number, linear: number, exponential: number, adjusted: number}>}
 *   Array of data points with row number and stitch counts for each growth pattern
 */
export function generateDoilyData(maxRows = 20, multiplier = 1.0, baseStitches = 6) {
  const data = []
  
  for (let row = 1; row <= maxRows; row++) {
    const linear = linearGrowth(row, baseStitches)
    const exponential = exponentialGrowth(row, multiplier, baseStitches)
    
    // Adjusted growth: blend between linear and exponential based on multiplier
    // When multiplier = 1.0, it's purely linear
    // As multiplier increases, it approaches exponential
    const adjusted = multiplier === 1.0 
      ? linear 
      : linear + (exponential - linear) * Math.min((multiplier - 1.0) / 0.5, 1.0)
    
    data.push({
      row,
      linear: Math.round(linear * 100) / 100, // Round to 2 decimal places
      exponential: Math.round(exponential * 100) / 100,
      adjusted: Math.round(adjusted * 100) / 100,
    })
  }
  
  return data
}

/**
 * Calculate the ruffle threshold
 * Determines when exponential growth becomes significantly different from linear
 * 
 * @param {number} threshold - Percentage difference threshold (default: 0.1 = 10%)
 * @param {number} multiplier - Growth multiplier (default: 1.2)
 * @param {number} baseStitches - Base number of stitches (default: 6)
 * @returns {number} Row number where ruffle becomes noticeable
 */
export function calculateRuffleThreshold(threshold = 0.1, multiplier = 1.2, baseStitches = 6) {
  for (let row = 1; row <= 50; row++) {
    const linear = linearGrowth(row, baseStitches)
    const exponential = exponentialGrowth(row, multiplier, baseStitches)
    const difference = Math.abs(exponential - linear) / linear
    
    if (difference >= threshold) {
      return row
    }
  }
  return null // Threshold never reached
}

/**
 * Adjusted stitch count for a row (matches chart "Adjusted Growth" line)
 */
export function getAdjustedStitches(row, multiplier = 1.0, baseStitches = 6) {
  const linear = linearGrowth(row, baseStitches)
  const exponential = exponentialGrowth(row, multiplier, baseStitches)

  if (multiplier === 1.0) {
    return linear
  }

  const blend = Math.min((multiplier - 1.0) / 0.5, 1.0)
  return linear + (exponential - linear) * blend
}

/** Yarn blue → accent green by excess, nudged by row depth */
function colorForExcess(excess, row, maxRows) {
  const t = Math.min(1, excess * 1.35)
  const depth = row / maxRows
  // #4A90E2 → #2ECC71 with a warm outer lift
  const r = (74 + t * (46 - 74) + depth * 28) / 255
  const g = (144 + t * (204 - 144) - depth * 12) / 255
  const b = (226 + t * (113 - 226) - depth * 40) / 255
  return [r, Math.min(1, Math.max(0, g)), Math.min(1, Math.max(0, b))]
}

/**
 * Ring height from circumference excess (hyperbolic buckle).
 * Flat when excess ≈ 0; strong frills as multiplier grows.
 */
function ruffleHeight(theta, row, maxRows, excess, radius, ruffleScale) {
  if (excess <= 0.002) return 0
  const waves = Math.max(4, Math.round(4 + excess * 10 + row * 0.35))
  const wave =
    Math.sin(theta * waves) +
    0.4 * Math.sin(theta * waves * 2 + row * 0.55) +
    0.15 * Math.sin(theta * (waves / 2) - row)
  const amp =
    excess * ruffleScale * Math.pow(row / maxRows, 0.55) * (0.55 + radius * 1.1)
  return wave * Math.min(amp, 1.45)
}

/**
 * Procedural doily: translucent lace surface + ring/spoke line lace.
 * Rings expand radially; excess circumference buckles on Y (hyperbolic ruffle).
 *
 * @returns {{
 *   positions: Float32Array,
 *   indices: Uint16Array,
 *   colors: Float32Array,
 *   lacePositions: Float32Array,
 *   laceColors: Float32Array,
 * }}
 */
export function generateDoilyMeshGeometry({
  maxRows = 16,
  multiplier = 1.0,
  baseStitches = 6,
  ringStep = 0.135,
  stitchArc = 0.085,
  ruffleScale = 0.58,
  segmentsPerRing = 64,
  spokeEvery = 4,
} = {}) {
  const positions = []
  const colors = []
  const indices = []
  const lacePositions = []
  const laceColors = []

  const pushLaceSegment = (ax, ay, az, ac, bx, by, bz, bc) => {
    lacePositions.push(ax, ay, az, bx, by, bz)
    laceColors.push(ac[0], ac[1], ac[2], bc[0], bc[1], bc[2])
  }

  // Center vertex (ring 0)
  const centerColor = colorForExcess(0, 0, maxRows)
  positions.push(0, 0, 0)
  colors.push(...centerColor)

  const ringMeta = []

  for (let row = 1; row <= maxRows; row++) {
    const radius = row * ringStep
    const stitches = getAdjustedStitches(row, multiplier, baseStitches)
    const flatCircumference = 2 * Math.PI * radius
    const actualCircumference = stitches * stitchArc
    const excess =
      flatCircumference > 0
        ? Math.max(0, (actualCircumference - flatCircumference) / flatCircumference)
        : 0
    const color = colorForExcess(excess, row, maxRows)
    ringMeta.push({ excess, color, radius })

    for (let i = 0; i < segmentsPerRing; i++) {
      const theta = (i / segmentsPerRing) * Math.PI * 2
      const y = ruffleHeight(theta, row, maxRows, excess, radius, ruffleScale)
      positions.push(radius * Math.cos(theta), y, radius * Math.sin(theta))
      colors.push(...color)
    }
  }

  const centerIndex = 0
  const firstRingOffset = 1

  // Fan — open center “eye” of the doily (skip every other triangle for lace holes)
  for (let i = 0; i < segmentsPerRing; i++) {
    if (i % 2 === 1) continue
    const next = (i + 1) % segmentsPerRing
    indices.push(centerIndex, firstRingOffset + i, firstRingOffset + next)
  }

  // Quads between rings — skip alternating panels for openwork lace
  for (let row = 1; row < maxRows; row++) {
    const innerOffset = firstRingOffset + (row - 1) * segmentsPerRing
    const outerOffset = firstRingOffset + row * segmentsPerRing
    const panelSkip = row % 2 === 0 ? 1 : 2

    for (let i = 0; i < segmentsPerRing; i++) {
      if (i % panelSkip === 0) continue
      const next = (i + 1) % segmentsPerRing
      const a = innerOffset + i
      const b = outerOffset + i
      const c = outerOffset + next
      const d = innerOffset + next
      indices.push(a, b, c)
      indices.push(a, c, d)
    }
  }

  // Concentric ring lace lines
  for (let row = 1; row <= maxRows; row++) {
    const offset = firstRingOffset + (row - 1) * segmentsPerRing
    const { color } = ringMeta[row - 1]
    for (let i = 0; i < segmentsPerRing; i++) {
      const next = (i + 1) % segmentsPerRing
      const ai = offset + i
      const bi = offset + next
      pushLaceSegment(
        positions[ai * 3],
        positions[ai * 3 + 1],
        positions[ai * 3 + 2],
        color,
        positions[bi * 3],
        positions[bi * 3 + 1],
        positions[bi * 3 + 2],
        color
      )
    }
  }

  // Radial spokes (plus center → first ring)
  for (let i = 0; i < segmentsPerRing; i += spokeEvery) {
    const first = firstRingOffset + i
    pushLaceSegment(
      0,
      0,
      0,
      centerColor,
      positions[first * 3],
      positions[first * 3 + 1],
      positions[first * 3 + 2],
      ringMeta[0].color
    )

    for (let row = 1; row < maxRows; row++) {
      const inner = firstRingOffset + (row - 1) * segmentsPerRing + i
      const outer = firstRingOffset + row * segmentsPerRing + i
      pushLaceSegment(
        positions[inner * 3],
        positions[inner * 3 + 1],
        positions[inner * 3 + 2],
        ringMeta[row - 1].color,
        positions[outer * 3],
        positions[outer * 3 + 1],
        positions[outer * 3 + 2],
        ringMeta[row].color
      )
    }
  }

  return {
    positions: new Float32Array(positions),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    lacePositions: new Float32Array(lacePositions),
    laceColors: new Float32Array(laceColors),
  }
}
