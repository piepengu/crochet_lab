import { Sparkles, X } from 'lucide-react'

/**
 * Persistent banner when Demo Mode is active (CAC / presentation reliability)
 */
export default function DemoModeBanner({ enabled, onDisable }) {
  if (!enabled) return null

  return (
    <div
      role="status"
      className="relative z-[60] flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-yarn-blue text-white text-sm"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles size={16} className="shrink-0 opacity-90" aria-hidden />
        <p className="leading-snug">
          <strong className="font-semibold">Demo Mode</strong>
          <span className="opacity-90">
            {' '}
            — Texture Recognition uses fast mock results for reliable presentations. Live MobileNet
            stays available when you turn this off.
          </span>
        </p>
      </div>
      <button
        type="button"
        onClick={onDisable}
        className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Turn off Demo Mode"
      >
        <X size={14} />
        Turn off
      </button>
    </div>
  )
}
