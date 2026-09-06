import { Sparkles, X } from 'lucide-react'

/**
 * Compact Demo Mode notice — only shown where it matters (Texture Recognition)
 * so other modules stay screenshot/video clean.
 */
export default function DemoModeBanner({ enabled, onDisable }) {
  if (!enabled) return null

  return (
    <div
      role="status"
      className="relative z-[60] flex items-center justify-between gap-3 px-3 py-1.5 border-b border-yarn-blue/20 bg-yarn-blue/[0.07] text-charcoal text-xs sm:text-sm"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles size={14} className="shrink-0 text-yarn-blue" aria-hidden />
        <p className="leading-snug text-charcoal/75">
          <span className="font-semibold text-charcoal">Demo Mode</span>
          <span className="hidden sm:inline"> — mock Texture results for reliable demos</span>
        </p>
      </div>
      <button
        type="button"
        onClick={onDisable}
        className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-charcoal/10 bg-white/80 hover:bg-white text-[11px] font-medium text-charcoal/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue"
        aria-label="Turn off Demo Mode"
      >
        <X size={12} />
        Off
      </button>
    </div>
  )
}
