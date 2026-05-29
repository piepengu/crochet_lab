/**
 * StitchDivider - SVG divider mimicking a crochet chain stitch (O-O-O-O)
 * Replaces plain <hr /> with a craft-themed visual element
 */
export default function StitchDivider({
  className = '',
  color = 'currentColor',
  strokeWidth = 1.5,
  height = 20,
  segmentCount = 10,
}) {
  const width = 200
  const loopWidth = width / segmentCount
  const loopHeight = height * 0.4
  const cy = height / 2

  // Draw linked oval loops - crochet chain symbol
  const loops = Array.from({ length: segmentCount }, (_, i) => {
    const cx = loopWidth * i + loopWidth / 2
    return { cx, cy, rx: loopWidth / 2.5, ry: loopHeight }
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ width: '100%', height: `${height}px`, display: 'block' }}
      aria-hidden="true"
    >
      {loops.map(({ cx, cy, rx, ry }, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      ))}
    </svg>
  )
}
