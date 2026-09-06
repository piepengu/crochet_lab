import { motion } from 'framer-motion'
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
  return (
    <div className="relative">
      {/* Full-bleed craft hero — one composition */}
      <section className="relative isolate min-h-[min(92dvh,880px)] w-full overflow-hidden">
        <motion.img
          src="/images/hero-bag-brown.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(250,250,250,0.94) 0%, rgba(250,250,250,0.78) 38%, rgba(250,250,250,0.28) 62%, rgba(26,26,26,0.22) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, transparent 0, transparent 55%, rgba(26,26,26,0.08) 100%)',
          }}
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[min(92dvh,880px)] flex-col justify-end lg:justify-center px-5 sm:px-8 lg:px-12 pb-14 pt-10 lg:pb-20 max-w-7xl mx-auto w-full">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-yarn-blue mb-3">
              Computational Crochet Lab
            </p>
            <h2 className="font-display text-[2.75rem] sm:text-5xl lg:text-6xl text-charcoal leading-[0.95] tracking-tight mb-4">
              <span className="block font-normal">The Algorithmic</span>
              <span className="block italic text-yarn-blue">Loop</span>
            </h2>
            <p className="font-display italic text-charcoal/60 text-lg mb-5">
              Where craft meets computation
            </p>
            <p className="text-charcoal/70 text-base sm:text-lg leading-relaxed mb-2 max-w-md">
              Math you can hold. Code you can crochet.
            </p>
            <p className="text-sm text-charcoal/50 mb-7">
              Created by <span className="font-semibold text-charcoal/70">Jason Zlatinski</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.button
                type="button"
                onClick={() => onNavigate('doily')}
                className="px-6 py-3 rounded-lg bg-yarn-blue text-white font-medium text-sm hover:bg-yarn-blue/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Enter the lab
              </motion.button>
              <button
                type="button"
                onClick={() => onNavigate('squares')}
                className="px-6 py-3 rounded-lg border border-charcoal/20 bg-white/70 backdrop-blur-sm text-charcoal text-sm font-medium hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
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
          <div className="grid gap-4 sm:grid-cols-3">
            {MODULES.map(({ id, title, blurb, image, alt }, index) => (
              <motion.button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className="group text-left overflow-hidden rounded-xl border border-charcoal/10 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -3 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/5">
                  <img
                    src={image}
                    alt={alt}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent opacity-90"
                    aria-hidden
                  />
                  <span className="absolute bottom-3 left-3 right-3 font-display text-lg text-white leading-tight drop-shadow-sm">
                    {title}
                  </span>
                </div>
                <p className="px-4 py-3 text-xs text-charcoal/55 leading-relaxed">{blurb}</p>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="font-display text-2xl text-charcoal mb-2">Who it helps</h3>
          <StitchDivider color="rgba(26,26,26,0.12)" height={14} segmentCount={8} className="mb-6" />
          <div className="grid gap-6 md:grid-cols-3">
            {IMPACT.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-l-2 border-yarn-blue/30 pl-4 py-1">
                <Icon size={20} className="text-yarn-blue mb-2" aria-hidden />
                <h4 className="font-semibold text-charcoal mb-2">{title}</h4>
                <p className="text-sm text-charcoal/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-charcoal/10 bg-charcoal/[0.03] p-5">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl text-charcoal mb-1">Demo Mode</h3>
            <p className="text-sm text-charcoal/60 leading-relaxed">
              Keeps Texture Recognition on fast mock predictions—ideal for presentations. Turn
              it off anytime to run the real on-device MobileNet model.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleDemo(!demoMode)}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-charcoal/15 bg-white text-charcoal text-sm font-medium hover:bg-charcoal/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yarn-blue focus-visible:ring-offset-2"
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
