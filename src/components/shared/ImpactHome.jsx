import { motion } from 'framer-motion'
import { Circle, Grid3x3, Scan, Sparkles, GraduationCap, HeartHandshake, Brain } from 'lucide-react'
import StitchDivider from './StitchDivider'

const IMPACT = [
  {
    icon: GraduationCap,
    title: 'STEM through craft',
    body: 'Hyperbolic geometry and graph theory become tangible when you can twist a doily or color a granny-square grid.',
  },
  {
    icon: HeartHandshake,
    title: 'Tools for makers',
    body: 'Stash-aware pattern generation and printable PDFs turn algorithms into something you can actually crochet.',
  },
  {
    icon: Brain,
    title: 'AI literacy',
    body: 'Explainable heatmaps show where a neural net looks—so “AI” is a skill you can inspect, not a black box.',
  },
]

const MODULES = [
  {
    id: 'doily',
    icon: Circle,
    title: 'Radial Topology',
    blurb: 'Grow stitches, watch a surface ruffle in 3D.',
  },
  {
    id: 'squares',
    icon: Grid3x3,
    title: 'Modular Permutations',
    blurb: 'Graph coloring + Stash Buster + PDF export.',
  },
  {
    id: 'texture',
    icon: Scan,
    title: 'Texture Recognition',
    blurb: 'Classify fabric and see attention hotspots.',
  },
]

/**
 * CAC-facing landing: impact story + clear paths into each module
 */
export default function ImpactHome({ onNavigate, demoMode, onToggleDemo }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 10% 0%, rgba(74,144,226,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(46,204,113,0.08), transparent 50%)',
        }}
        aria-hidden
      />

      <div className="relative p-4 lg:p-8 max-w-5xl mx-auto">
        <motion.header
          className="mb-10 lg:mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-yarn-blue mb-3">
            Congressional App Challenge · STEM × Craft
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-charcoal leading-[1.05] mb-4">
            Math you can hold.
            <span className="block italic text-yarn-blue">Code you can crochet.</span>
          </h2>
          <p className="text-charcoal/65 text-base lg:text-lg max-w-2xl leading-relaxed">
            The Algorithmic Loop is an interactive lab that makes advanced computer science
            visible through fiber craft—so students, makers, and judges can see algorithms,
            geometry, and explainable AI without a textbook gatekeeper.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('doily')}
              className="px-5 py-2.5 rounded-lg bg-yarn-blue text-white font-medium text-sm hover:bg-yarn-blue/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
            >
              Start with 3D geometry
            </button>
            <button
              type="button"
              onClick={() => onToggleDemo(!demoMode)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-charcoal/15 bg-white text-charcoal text-sm font-medium hover:bg-charcoal/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
            >
              <Sparkles size={16} className="text-yarn-blue" />
              {demoMode ? 'Demo Mode on' : 'Enable Demo Mode'}
            </button>
          </div>
          <p className="mt-3 text-xs text-charcoal/50 max-w-xl">
            Demo Mode keeps Texture Recognition on fast mock predictions—ideal for presentations
            and judging. Turn it off anytime to run the real on-device MobileNet model.
          </p>
        </motion.header>

        <section className="mb-12">
          <h3 className="font-display text-2xl text-charcoal mb-2">Who it helps</h3>
          <StitchDivider color="rgba(26,26,26,0.12)" height={14} segmentCount={8} className="mb-6" />
          <div className="grid gap-4 md:grid-cols-3">
            {IMPACT.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-charcoal/10 bg-white/80 p-5 shadow-sm"
              >
                <Icon size={22} className="text-yarn-blue mb-3" aria-hidden />
                <h4 className="font-semibold text-charcoal mb-2">{title}</h4>
                <p className="text-sm text-charcoal/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="font-display text-2xl text-charcoal mb-2">Explore the lab</h3>
          <StitchDivider color="rgba(26,26,26,0.12)" height={14} segmentCount={8} className="mb-6" />
          <div className="grid gap-3 sm:grid-cols-3">
            {MODULES.map(({ id, icon: Icon, title, blurb }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className="text-left rounded-xl border border-charcoal/10 bg-white/90 p-5 hover:border-yarn-blue/40 hover:bg-yarn-blue/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
              >
                <Icon size={20} className="text-yarn-blue mb-2" aria-hidden />
                <div className="font-semibold text-charcoal mb-1">{title}</div>
                <p className="text-xs text-charcoal/55 leading-relaxed">{blurb}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-charcoal/10 bg-charcoal/[0.03] p-5 lg:p-6">
          <h3 className="font-display text-xl text-charcoal mb-2">What you&apos;ll see in a demo</h3>
          <ol className="text-sm text-charcoal/65 space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              <strong className="text-charcoal">Radial Topology</strong> — raise the growth
              multiplier and watch hyperbolic ruffles appear in 3D.
            </li>
            <li>
              <strong className="text-charcoal">Modular Permutations</strong> — generate a valid
              coloring, enable Stash Buster, download a pattern PDF.
            </li>
            <li>
              <strong className="text-charcoal">Texture Recognition</strong> — upload an image,
              read predictions, toggle the attention heatmap.
            </li>
          </ol>
        </section>
      </div>
    </div>
  )
}
