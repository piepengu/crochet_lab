/**
 * Overlays an activation heatmap on the uploaded image preview
 */
export default function ActivationHeatmapOverlay({
  heatmapUrl,
  opacity = 0.55,
  visible = true,
  zoom = 1,
}) {
  if (!visible || !heatmapUrl) return null

  return (
    <img
      src={heatmapUrl}
      alt=""
      aria-hidden
      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      style={{
        opacity,
        mixBlendMode: 'multiply',
        transform: `scale(${zoom})`,
        transformOrigin: 'center',
      }}
    />
  )
}
