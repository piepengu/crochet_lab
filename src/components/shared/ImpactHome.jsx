import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, GraduationCap, HeartHandshake, Brain } from 'lucide-react'
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
    title: 'Radial Topology',
    blurb: 'Grow stitches, watch a surface ruffle in 3D.',
    image: '/images/doily-radial-beige.jpg',
    alt: 'Radial crochet doily',
  },
  {
    id: 'squares',
    title: 'Modular Permutations',
    blurb: 'Graph coloring + Stash Buster + PDF export.',
    image: '/images/granny-squares-source.jpg',
    alt: 'Colorful granny square crochet',
  },
  {
    id: 'texture',
    title: 'Texture Recognition',
    blurb: 'Classify fabric and see attention hotspots.',
    image: '/images/texture-mesh.jpg',
    alt: 'Crochet mesh texture close-up',
  },
]

/**
 * Visual landing: craft hero + photo paths into each module
 */
export default function ImpactHome({ onNavigate, demoMode, onToggleDemo }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative">
      {/* Full-bleed craft hero — localized text scrim, tactile photo */}
      <section className="relative isolate min-h-[min(92dvh,880px)] w-full overflow-hidden bg-[#f3f1ed]">
        <motion.img
          src="/images/hero-bag-brown.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[68%_28%] sm:object-[center_30%]"
          initial={reduceMotion ? false : { scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 1.35, ease: [0.22, 1, 0.36, 1] }
          }
        />
        {/* Left-weighted readability; center/right crochet stays visible */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(250,250,248,0.97) 0%,
                rgba(250,250,248,0.9) 18%,
                rgba(250,250,248,0.55) 36%,
                rgba(250,250,248,0.18) 52%,
                rgba(250,250,248,0.04) 68%,
                transparent 82%
              ),
              linear-gradient(
                180deg,
                transparent 0%,
                transparent 55%,
                rgba(250,250,248,0.35) 82%,
                rgba(250,250,248,0.62) 100%
              )
            `,
          }}
          aria-hidden
        />
        {/* Soft vignette only — no white haze */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 80% at 85% 40%, transparent 40%, rgba(26,26,26,0.12) 100%)',
          }}
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[min(92dvh,880px)] flex-col justify-end lg:justify-center px-5 sm:px-8 lg:px-12 pb-14 pt-10 lg:pb-20 max-w-7xl mx-auto w-full">
          <motion.div
            className="max-w-lg lg:max-w-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <p className="type-label text-yarn-blue mb-4">Computational Crochet Lab</p>
            <h2 className="font-display text-[2.85rem] sm:text-5xl lg:text-[3.75rem] text-charcoal leading-[0.94] tracking-tight mb-3">
              <span className="block font-normal">The Algorithmic</span>
              <span className="block italic text-yarn-blue">Loop</span>
            </h2>
            <p className="font-display italic text-charcoal/65 text-xl sm:text-2xl mb-5 leading-snug">
              Where craft meets computation
            </p>
            <p className="font-sans text-charcoal/75 text-base sm:text-lg leading-relaxed mb-2 max-w-md">
              Math you can hold. Code you can crochet.
            </p>
            <p className="type-meta mb-8">
              Created by <span className="text-charcoal/80 font-semibold">Jason Zlatinski</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.button
                type="button"
                onClick={() => onNavigate('doily')}
                className="ui-transition px-6 py-3 rounded-md bg-yarn-blue text-white font-semibold text-sm hover:bg-yarn-blue/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Enter the lab
              </motion.button>
              <button
                type="button"
                onClick={() => onNavigate('squares')}
                className="ui-transition px-6 py-3 rounded-md border border-charcoal/20 bg-canvas-warm/80 text-charcoal text-sm font-semibold hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
              >
                See patterns
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative p-4 lg:p-8 max-w-5xl mx-auto">
        {/* Photo module covers */}
        <section className="mb-14 -mt-2 lg:mt-4">
          <motion.h3
            className="font-display text-2xl sm:text-3xl text-charcoal mb-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45 }}
          >
            Explore the lab
          </motion.h3>
          <StitchDivider color="rgba(26,26,26,0.12)" height={14} segmentCount={8} className="mb-6" />
          <div className="grid gap-6 sm:grid-cols-3">
            {MODULES.map(({ id, title, blurb, image, alt }, index) => (
              <motion.button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2 rounded-sm"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/5 mb-3">
                  <img
                    src={image}
                    alt={alt}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <h4 className="font-display text-xl text-charcoal leading-tight mb-1 group-hover:text-yarn-blue ui-transition">
                  {title}
                </h4>
                <p className="text-sm text-charcoal/60 leading-relaxed">{blurb}</p>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="font-display text-2xl text-charcoal mb-2">Who it helps</h3>
          <StitchDivider color="rgba(26,26,26,0.12)" height={14} segmentCount={8} className="mb-6" />
          <div className="grid gap-8 md:grid-cols-3">
            {IMPACT.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-l border-yarn-blue/35 pl-4">
                <Icon size={18} className="text-yarn-blue mb-2" aria-hidden />
                <h4 className="font-display text-lg text-charcoal mb-2">{title}</h4>
                <p className="text-sm text-charcoal/65 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 border-t border-charcoal/10 pt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl text-charcoal mb-1">Demo Mode</h3>
            <p className="text-sm text-charcoal/65 leading-relaxed max-w-xl">
              Keeps Texture Recognition on fast mock predictions—ideal for presentations. Turn
              it off anytime to run the real on-device MobileNet model.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleDemo(!demoMode)}
            className="ui-transition shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-charcoal/15 bg-transparent text-charcoal text-sm font-semibold hover:border-yarn-blue/40 hover:text-yarn-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
          >
            <Sparkles size={16} className="text-yarn-blue" />
            {demoMode ? 'Demo Mode on' : 'Enable Demo Mode'}
          </button>
        </section>

        <footer className="border-t border-charcoal/10 pt-6 pb-2 text-sm text-charcoal/55">
          <p>
            <span className="font-semibold text-charcoal">Jason Zlatinski</span>
            {' · '}
            The Algorithmic Loop
          </p>
          <p className="mt-1 text-xs text-charcoal/40">
            <a
              href="https://github.com/piepengu/crochet_lab"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yarn-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue rounded"
            >
              github.com/piepengu/crochet_lab
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
